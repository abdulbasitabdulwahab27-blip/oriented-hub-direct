/**
 * Server-only Core Web Vitals alerting.
 *
 * Evaluates p75 LCP / INP / CLS per page + device from the `web_vitals` table,
 * records an alert row for anything over budget, and emails the shop inbox.
 * Also accepts Lighthouse budget violations from scripts/lighthouse-mobile.mjs.
 */
import process from "node:process";
import { MOBILE_BUDGETS, type VitalMetric } from "@/lib/vitals";

export type AlertInput = {
  source: "field" | "lighthouse";
  path: string;
  metric: string;
  device: string;
  build_version?: string | null;
  value: number;
  threshold: number;
  samples?: number;
  severity?: "warning" | "critical";
  message?: string;
};

/** Metrics we alert on, with the minimum sample count required to trust p75. */
const ALERT_METRICS: VitalMetric[] = ["LCP", "INP", "CLS"];
const MIN_SAMPLES = 8;
/** Do not re-alert on the same page/metric/device within this window. */
const DEDUPE_HOURS = 12;

function p75(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * 0.75))]!;
}

function fmt(metric: string, v: number) {
  return metric === "CLS" ? v.toFixed(3) : `${Math.round(v)} ms`;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Scans the last `hours` of field data and returns every budget breach. */
export async function evaluateFieldVitals(hours = 24): Promise<AlertInput[]> {
  const db = await admin();
  const since = new Date(Date.now() - hours * 3600_000).toISOString();
  const { data, error } = await db
    .from("web_vitals")
    .select("path, metric, value, device, build_version")
    .gte("created_at", since)
    .limit(20000);
  if (error) throw new Error(error.message);

  const groups = new Map<string, { path: string; metric: string; device: string; build: string | null; values: number[] }>();
  for (const r of data ?? []) {
    if (!ALERT_METRICS.includes(r.metric as VitalMetric)) continue;
    const key = `${r.path}|${r.metric}|${r.device}`;
    const g = groups.get(key) ?? { path: r.path, metric: r.metric, device: r.device, build: r.build_version ?? null, values: [] };
    g.values.push(r.value);
    groups.set(key, g);
  }

  const alerts: AlertInput[] = [];
  for (const g of groups.values()) {
    if (g.values.length < MIN_SAMPLES) continue;
    const value = p75(g.values)!;
    const budget = MOBILE_BUDGETS[g.metric as VitalMetric];
    if (value <= budget.good) continue;
    alerts.push({
      source: "field",
      path: g.path,
      metric: g.metric,
      device: g.device,
      build_version: g.build,
      value,
      threshold: budget.good,
      samples: g.values.length,
      severity: value > budget.poor ? "critical" : "warning",
      message: `p75 ${g.metric} on ${g.path} (${g.device}) is ${fmt(g.metric, value)} — budget ${fmt(g.metric, budget.good)}.`,
    });
  }
  return alerts;
}

/** Inserts alerts, skipping duplicates raised recently. Returns the new rows. */
export async function recordAlerts(alerts: AlertInput[]) {
  if (!alerts.length) return [];
  const db = await admin();
  const since = new Date(Date.now() - DEDUPE_HOURS * 3600_000).toISOString();
  const { data: recent } = await db
    .from("vitals_alerts")
    .select("path, metric, device, source")
    .gte("created_at", since);
  const seen = new Set((recent ?? []).map((r) => `${r.source}|${r.path}|${r.metric}|${r.device}`));

  const fresh = alerts.filter((a) => !seen.has(`${a.source}|${a.path}|${a.metric}|${a.device}`));
  if (!fresh.length) return [];

  const { data, error } = await db
    .from("vitals_alerts")
    .insert(
      fresh.map((a) => ({
        source: a.source,
        path: a.path,
        metric: a.metric,
        device: a.device,
        build_version: a.build_version ?? null,
        value: a.value,
        threshold: a.threshold,
        samples: a.samples ?? 0,
        severity: a.severity ?? "warning",
        message: a.message ?? null,
      })),
    )
    .select("id, path, metric, device, value, threshold, severity, source, samples, build_version");
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Emails a digest of new alerts. Never throws — mail outages must not break the check. */
export async function emailAlerts(rows: Awaited<ReturnType<typeof recordAlerts>>) {
  if (!rows.length) return { sent: false as const, reason: "no_alerts" };
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["ORDER_NOTIFY_EMAIL"] ?? "Orientedbanque@outlook.com";
  const from = process.env["ORDER_NOTIFY_FROM"] ?? "The Oriented Hub <orders@theorientedhub.com>";
  if (!apiKey) return { sent: false as const, reason: "email_not_configured" };

  const list = rows
    .map(
      (r) =>
        `<tr><td style="padding:6px 12px 6px 0">${r.severity === "critical" ? "🔴" : "🟠"} ${r.metric}</td><td style="padding:6px 12px 6px 0">${r.path}</td><td style="padding:6px 12px 6px 0">${r.device}</td><td style="padding:6px 12px 6px 0"><b>${fmt(r.metric, r.value)}</b> (budget ${fmt(r.metric, r.threshold)})</td><td style="padding:6px 0;color:#666">${r.source}${r.samples ? ` · ${r.samples} samples` : ""}</td></tr>`,
    )
    .join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Site speed alert — ${rows.length} page${rows.length > 1 ? "s" : ""} over budget`,
        html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:720px">
  <h2 style="margin:0 0 12px">Core Web Vitals budget alert</h2>
  <table style="border-collapse:collapse;font-size:14px">${list}</table>
  <p style="margin:18px 0 0;font-size:13px;color:#666">Open the admin Speed dashboard for trends and to acknowledge these alerts.</p>
</div>`,
      }),
    });
    if (!res.ok) return { sent: false as const, reason: `provider_error_${res.status}` };
    const ids = rows.map((r) => r.id);
    const db = await admin();
    await db.from("vitals_alerts").update({ notified: true }).in("id", ids);
    return { sent: true as const };
  } catch {
    return { sent: false as const, reason: "network_error" };
  }
}

/** Full field check: evaluate → record → email. */
export async function runFieldAlertCheck(hours = 24) {
  const breaches = await evaluateFieldVitals(hours);
  const created = await recordAlerts(breaches);
  const mail = await emailAlerts(created);
  return { breaches: breaches.length, created: created.length, emailed: mail.sent, reason: "reason" in mail ? mail.reason : null };
}
