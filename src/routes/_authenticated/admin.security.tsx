import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ShieldCheck, Camera, Download, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { capturePolicySnapshot } from "@/lib/security.functions";

export const Route = createFileRoute("/_authenticated/admin/security")({
  head: () => ({ meta: [{ title: "Security — Admin" }, { name: "robots", content: "noindex" }] }),
  component: SecurityPage,
});

type AuditRow = {
  id: string;
  table_name: string;
  record_id: string | null;
  action: "created" | "updated" | "deleted";
  actor_id: string | null;
  actor_email: string | null;
  summary: string | null;
  created_at: string;
};

type PolicyChange = {
  type: "added" | "removed" | "modified";
  key: string;
  table: string;
  policy: string;
  fields?: { field: string; from: unknown; to: unknown }[];
};

type Snapshot = {
  id: string;
  created_at: string;
  captured_by_email: string | null;
  policy_count: number;
  digest: string;
  changes: PolicyChange[];
};

/** Tables whose mutations count as sensitive actions worth reviewing. */
const SENSITIVE_TABLES = ["user_roles", "product_prices", "vitals_alerts", "reviews", "orders"] as const;

const RANGES = [
  { key: "24h", label: "Last 24 hours", hours: 24 },
  { key: "7d", label: "Last 7 days", hours: 24 * 7 },
  { key: "30d", label: "Last 30 days", hours: 24 * 30 },
  { key: "all", label: "All time", hours: 0 },
] as const;

const ACTIONS = ["all", "created", "updated", "deleted"] as const;

function fmt(ts: string) {
  return new Date(ts).toLocaleString();
}

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: AuditRow[]) {
  const head = ["created_at", "table_name", "action", "record_id", "actor_email", "actor_id", "summary"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [head.join(","), ...rows.map((r) => head.map((h) => esc((r as any)[h])).join(","))].join("\n");
}

function SecurityPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [action, setAction] = useState<(typeof ACTIONS)[number]>("all");
  const [actor, setActor] = useState("all");
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("7d");
  const [openSnapshot, setOpenSnapshot] = useState<string | null>(null);

  const capture = useServerFn(capturePolicySnapshot);

  const load = useCallback(async () => {
    setLoading(true);
    const [auditRes, snapRes] = await Promise.all([
      supabase
        .from("audit_log")
        .select("id, table_name, record_id, action, actor_id, actor_email, summary, created_at")
        .in("table_name", SENSITIVE_TABLES as unknown as string[])
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("policy_snapshots")
        .select("id, created_at, captured_by_email, policy_count, digest, changes")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);
    if (auditRes.data) setRows(auditRes.data as AuditRow[]);
    if (snapRes.data) setSnapshots(snapRes.data as unknown as Snapshot[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const actors = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => set.add(r.actor_email ?? "system / guest"));
    return ["all", ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    const hours = RANGES.find((r) => r.key === range)?.hours ?? 0;
    const cutoff = hours ? Date.now() - hours * 3600_000 : 0;
    return rows.filter((r) => {
      if (action !== "all" && r.action !== action) return false;
      if (actor !== "all" && (r.actor_email ?? "system / guest") !== actor) return false;
      if (cutoff && new Date(r.created_at).getTime() < cutoff) return false;
      return true;
    });
  }, [rows, action, actor, range]);

  const onCapture = async () => {
    setCapturing(true);
    try {
      const res = await capture({});
      toast.success(
        res.changeCount === 0 ? "Snapshot captured — no policy changes." : `Snapshot captured — ${res.changeCount} policy change(s).`,
      );
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Could not capture snapshot.");
    } finally {
      setCapturing(false);
    }
  };

  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Security</h2>
        <span className="text-xs text-muted-foreground">{filtered.length} of {rows.length} sensitive actions</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={() => void onCapture()}
            disabled={capturing}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Camera className="h-4 w-4" /> {capturing ? "Capturing…" : "Capture policy snapshot"}
          </button>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sensitive action feed</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <select value={action} onChange={(e) => setAction(e.target.value as any)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {ACTIONS.map((a) => <option key={a} value={a}>{a === "all" ? "All actions" : a}</option>)}
          </select>
          <select value={actor} onChange={(e) => setActor(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {actors.map((a) => <option key={a} value={a}>{a === "all" ? "All actors" : a}</option>)}
          </select>
          <select value={range} onChange={(e) => setRange(e.target.value as any)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {RANGES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => download(`security-audit-${stamp}.csv`, toCsv(filtered), "text/csv")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button
              onClick={() => download(`security-audit-${stamp}.json`, JSON.stringify(filtered, null, 2), "application/json")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              <Download className="h-4 w-4" /> JSON
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sensitive actions in this range.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Table</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Summary</th>
                  <th className="px-3 py-2">Actor</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 300).map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{fmt(r.created_at)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{r.table_name}</td>
                    <td className="px-3 py-2">{r.action}</td>
                    <td className="px-3 py-2">{r.summary || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.actor_email || <span className="italic">system / guest</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Policy snapshot history</h3>
        {snapshots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No snapshots captured yet. Use the button above to record the current RLS policy set.</p>
        ) : (
          <ul className="space-y-2">
            {snapshots.map((s) => {
              const open = openSnapshot === s.id;
              const changes = s.changes ?? [];
              return (
                <li key={s.id} className="rounded-lg border border-border">
                  <button
                    onClick={() => setOpenSnapshot(open ? null : s.id)}
                    className="flex w-full flex-wrap items-center gap-3 px-3 py-3 text-left text-sm hover:bg-muted/30"
                  >
                    <span className="font-medium">{fmt(s.created_at)}</span>
                    <span className="text-muted-foreground">{s.policy_count} policies</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${changes.length ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                      {changes.length ? `${changes.length} change(s)` : "no change"}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{s.digest}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{s.captured_by_email ?? "—"}</span>
                  </button>
                  {open && (
                    <div className="border-t border-border px-3 py-3">
                      {changes.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Identical to the previous snapshot.</p>
                      ) : (
                        <ul className="space-y-2 text-xs">
                          {changes.map((c) => (
                            <li key={c.key} className="font-mono">
                              <span
                                className={
                                  c.type === "added" ? "text-green-700" : c.type === "removed" ? "text-red-700" : "text-blue-700"
                                }
                              >
                                {c.type}
                              </span>{" "}
                              <span className="font-semibold">{c.table}</span> — {c.policy}
                              {c.fields?.length ? (
                                <ul className="ml-4 mt-1 space-y-0.5">
                                  {c.fields.map((f) => (
                                    <li key={f.field}>
                                      {f.field}: <span className="text-red-700">{JSON.stringify(f.from)}</span> → <span className="text-green-700">{JSON.stringify(f.to)}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
