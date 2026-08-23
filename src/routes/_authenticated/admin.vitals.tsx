import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { MOBILE_BUDGETS, type VitalMetric } from "@/lib/vitals";
import { runVitalsAlertCheck } from "@/lib/vitals-alerts.functions";

export const Route = createFileRoute("/_authenticated/admin/vitals")({
  head: () => ({ meta: [{ title: "Speed — Admin | Oriented Hub" }, { name: "robots", content: "noindex" }] }),
  component: VitalsPage,
});

type Row = {
  path: string;
  metric: string;
  value: number;
  device: string;
  created_at: string;
  build_version: string | null;
  navigation_type: string | null;
  rating: string;
};

type Alert = {
  id: string;
  created_at: string;
  source: string;
  path: string;
  metric: string;
  device: string;
  value: number;
  threshold: number;
  samples: number;
  severity: string;
  message: string | null;
  acknowledged: boolean;
  build_version: string | null;
};

const METRICS: VitalMetric[] = ["LCP", "INP", "CLS", "TTFB", "FCP"];
const TREND_METRICS: VitalMetric[] = ["LCP", "INP", "CLS"];
const ALL = "__all__";

function p75(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * 0.75))]!;
}

function fmt(metric: string, v: number | null) {
  if (v === null) return "—";
  return metric === "CLS" ? v.toFixed(3) : `${Math.round(v)} ms`;
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Row[]) {
  const cols: (keyof Row)[] = ["created_at", "path", "metric", "value", "rating", "device", "build_version", "navigation_type"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

/** Inline SVG sparkline of daily p75 values against the budget line. */
function TrendChart({ metric, series }: { metric: VitalMetric; series: { day: string; value: number; samples: number }[] }) {
  const budget = MOBILE_BUDGETS[metric].good;
  const w = 520;
  const h = 130;
  const pad = 8;
  const max = Math.max(budget * 1.3, ...series.map((s) => s.value)) || 1;
  const x = (i: number) => (series.length <= 1 ? w / 2 : pad + (i * (w - pad * 2)) / (series.length - 1));
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const line = series.map((s, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(s.value).toFixed(1)}`).join(" ");
  const latest = series.at(-1);
  const first = series[0];
  const delta = latest && first && first.value ? ((latest.value - first.value) / first.value) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{metric} · daily p75</h3>
        <div className="text-sm">
          <span className={latest && latest.value <= budget ? "text-success font-semibold" : "text-destructive font-semibold"}>
            {fmt(metric, latest?.value ?? null)}
          </span>
          {series.length > 1 && (
            <span className="ml-2 text-muted-foreground">
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(0)}% vs start
            </span>
          )}
        </div>
      </div>
      {series.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No samples for this filter yet.</p>
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" role="img" aria-label={`${metric} trend`}>
          <line x1={pad} x2={w - pad} y1={y(budget)} y2={y(budget)} stroke="currentColor" strokeDasharray="4 4" className="text-muted-foreground/50" />
          <path d={line} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
          {series.map((s, i) => (
            <circle key={s.day} cx={x(i)} cy={y(s.value)} r="3" className={s.value <= budget ? "fill-current text-success" : "fill-current text-destructive"}>
              <title>{`${s.day}: ${fmt(metric, s.value)} (${s.samples} samples)`}</title>
            </circle>
          ))}
        </svg>
      )}
      <p className="mt-1 text-xs text-muted-foreground">Dashed line = budget {fmt(metric, budget)}</p>
    </div>
  );
}

function VitalsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [pathFilter, setPathFilter] = useState(ALL);
  const [buildFilter, setBuildFilter] = useState(ALL);
  const [days, setDays] = useState(28);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const runCheck = useServerFn(runVitalsAlertCheck);

  async function load() {
    setLoading(true);
    const since = new Date(Date.now() - days * 864e5).toISOString();
    const [samples, alertRows] = await Promise.all([
      supabase
        .from("web_vitals")
        .select("path, metric, value, device, created_at, build_version, navigation_type, rating")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(20000),
      supabase.from("vitals_alerts").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setRows((samples.data as Row[]) ?? []);
    setAlerts((alertRows.data as Alert[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const paths = useMemo(() => [...new Set(rows.map((r) => r.path))].sort(), [rows]);
  const builds = useMemo(() => [...new Set(rows.map((r) => r.build_version ?? "unknown"))].sort(), [rows]);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.device === device &&
          (pathFilter === ALL || r.path === pathFilter) &&
          (buildFilter === ALL || (r.build_version ?? "unknown") === buildFilter),
      ),
    [rows, device, pathFilter, buildFilter],
  );

  const trends = useMemo(() => {
    const out: Record<string, { day: string; value: number; samples: number }[]> = {};
    for (const metric of TREND_METRICS) {
      const perDay = new Map<string, number[]>();
      for (const r of filtered) {
        if (r.metric !== metric) continue;
        const k = dayKey(r.created_at);
        (perDay.get(k) ?? perDay.set(k, []).get(k)!).push(r.value);
      }
      out[metric] = [...perDay.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([day, values]) => ({ day, value: p75(values)!, samples: values.length }));
    }
    return out;
  }, [filtered]);

  const byPath = useMemo(() => {
    const map = new Map<string, Record<string, number[]>>();
    for (const r of filtered) {
      const entry = map.get(r.path) ?? {};
      (entry[r.metric] ??= []).push(r.value);
      map.set(r.path, entry);
    }
    return [...map.entries()].sort((a, b) => {
      const count = (x: Record<string, number[]>) => Object.values(x).reduce((n, v) => n + v.length, 0);
      return count(b[1]) - count(a[1]);
    });
  }, [filtered]);

  async function onRunCheck() {
    setChecking(true);
    setCheckResult(null);
    try {
      const res = await runCheck({ data: { hours: 24 } });
      setCheckResult(
        res.created > 0
          ? `${res.created} new alert(s) raised${res.emailed ? " and emailed" : ` (email: ${res.reason ?? "not sent"})`}.`
          : res.breaches > 0
            ? "Budget breaches found, but already alerted in the last 12 hours."
            : "All pages within budget.",
      );
      await load();
    } catch (e) {
      setCheckResult(e instanceof Error ? e.message : "Check failed");
    } finally {
      setChecking(false);
    }
  }

  async function acknowledge(id: string) {
    await supabase.from("vitals_alerts").update({ acknowledged: true }).eq("id", id);
    setAlerts((a) => a.map((x) => (x.id === id ? { ...x, acknowledged: true } : x)));
  }

  const openAlerts = alerts.filter((a) => !a.acknowledged);
  const select = "rounded-md border border-border bg-background px-3 py-2 text-sm";

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Core Web Vitals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            p75 from real visitors, with automatic alerts when a page drifts past budget.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onRunCheck}
            disabled={checking}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {checking ? "Checking…" : "Run alert check"}
          </button>
          <button
            onClick={() => download(`web-vitals-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(filtered), "text/csv")}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Export CSV
          </button>
          <button
            onClick={() =>
              download(`web-vitals-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(filtered, null, 2), "application/json")
            }
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Export JSON
          </button>
        </div>
      </div>

      {checkResult && <p className="mt-3 text-sm text-muted-foreground">{checkResult}</p>}

      {openAlerts.length > 0 && (
        <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <h3 className="font-semibold text-destructive">{openAlerts.length} open speed alert(s)</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {openAlerts.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 first:border-0 first:pt-0">
                <span>
                  <b>{a.metric}</b> · {a.path} · {a.device} · {fmt(a.metric, a.value)} (budget {fmt(a.metric, a.threshold)})
                  <span className="text-muted-foreground"> — {a.source}{a.samples ? ` · ${a.samples} samples` : ""} · {new Date(a.created_at).toLocaleString()}</span>
                </span>
                <button onClick={() => acknowledge(a.id)} className="rounded-md border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">
                  Acknowledge
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          {(["mobile", "desktop"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-4 py-2 text-sm font-semibold capitalize ${device === d ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <select className={select} value={pathFilter} onChange={(e) => setPathFilter(e.target.value)} aria-label="Filter by page">
          <option value={ALL}>All pages</option>
          {paths.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select className={select} value={buildFilter} onChange={(e) => setBuildFilter(e.target.value)} aria-label="Filter by build version">
          <option value={ALL}>All builds</option>
          {builds.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className={select} value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Time range">
          {[7, 14, 28, 90].map((d) => (
            <option key={d} value={d}>Last {d} days</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} samples</span>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading samples…</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {TREND_METRICS.map((m) => (
              <TrendChart key={m} metric={m} series={trends[m] ?? []} />
            ))}
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map((m) => (
              <div key={m} className="rounded-lg border border-border bg-card p-3 text-xs">
                <div className="font-semibold">{m} budget</div>
                <div className="text-muted-foreground">
                  good ≤ {fmt(m, MOBILE_BUDGETS[m].good)} · poor &gt; {fmt(m, MOBILE_BUDGETS[m].poor)}
                </div>
              </div>
            ))}
          </div>

          {byPath.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No samples yet. Data appears once visitors browse the published site.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th className="p-3 font-semibold">Page</th>
                    {METRICS.map((m) => (
                      <th key={m} className="p-3 font-semibold">{m}</th>
                    ))}
                    <th className="p-3 font-semibold">Samples</th>
                  </tr>
                </thead>
                <tbody>
                  {byPath.map(([path, metrics]) => {
                    const total = Object.values(metrics).reduce((n, v) => n + v.length, 0);
                    return (
                      <tr key={path} className="border-t border-border">
                        <td className="p-3 font-medium">{path}</td>
                        {METRICS.map((m) => {
                          const v = p75(metrics[m] ?? []);
                          const b = MOBILE_BUDGETS[m];
                          const tone =
                            v === null ? "text-muted-foreground" : v <= b.good ? "text-success" : v <= b.poor ? "text-primary" : "text-destructive";
                          return <td key={m} className={`p-3 font-semibold ${tone}`}>{fmt(m, v)}</td>;
                        })}
                        <td className="p-3 text-muted-foreground">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
