import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MOBILE_BUDGETS, type VitalMetric } from "@/lib/vitals";

export const Route = createFileRoute("/_authenticated/admin/vitals")({
  head: () => ({ meta: [{ title: "Speed — Admin | Oriented Hub" }, { name: "robots", content: "noindex" }] }),
  component: VitalsPage,
});

type Row = { path: string; metric: string; value: number; device: string; created_at: string };

const METRICS: VitalMetric[] = ["LCP", "INP", "CLS", "TTFB", "FCP"];

function p75(values: number[]) {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * 0.75))];
}

function fmt(metric: string, v: number | null) {
  if (v === null) return "—";
  return metric === "CLS" ? v.toFixed(3) : `${Math.round(v)} ms`;
}

function VitalsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - 28 * 864e5).toISOString();
      const { data } = await supabase
        .from("web_vitals")
        .select("path, metric, value, device, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const byPath = useMemo(() => {
    const map = new Map<string, Record<string, number[]>>();
    for (const r of rows) {
      if (r.device !== device) continue;
      const entry = map.get(r.path) ?? {};
      (entry[r.metric] ??= []).push(r.value);
      map.set(r.path, entry);
    }
    return [...map.entries()].sort((a, b) => {
      const count = (x: Record<string, number[]>) => Object.values(x).reduce((n, v) => n + v.length, 0);
      return count(b[1]) - count(a[1]);
    });
  }, [rows, device]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Core Web Vitals (last 28 days)</h2>
          <p className="text-sm text-muted-foreground mt-1">
            p75 from real visitors. Green = within the tighter mobile budget, amber = close, red = over budget.
          </p>
        </div>
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
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((m) => (
          <div key={m} className="rounded-lg border border-border bg-card p-3 text-xs">
            <div className="font-semibold">{m} budget</div>
            <div className="text-muted-foreground">
              good ≤ {fmt(m, MOBILE_BUDGETS[m].good)} · poor &gt; {fmt(m, MOBILE_BUDGETS[m].poor)}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading samples…</p>
      ) : byPath.length === 0 ? (
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
                      return (
                        <td key={m} className={`p-3 font-semibold ${tone}`}>{fmt(m, v)}</td>
                      );
                    })}
                    <td className="p-3 text-muted-foreground">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
