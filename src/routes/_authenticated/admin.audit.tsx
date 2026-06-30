import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { History, Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  head: () => ({ meta: [{ title: "Audit Log — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AuditPage,
});

type AuditRow = {
  id: string;
  table_name: string;
  record_id: string | null;
  action: "created" | "updated" | "deleted";
  actor_id: string | null;
  actor_email: string | null;
  summary: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
};

const TABLES = ["all", "products", "orders", "user_roles"] as const;
const ACTIONS = ["all", "created", "updated", "deleted"] as const;

function fmt(ts: string) {
  return new Date(ts).toLocaleString();
}

function ActionBadge({ action }: { action: AuditRow["action"] }) {
  const map = {
    created: { cls: "bg-green-100 text-green-800", Icon: Plus },
    updated: { cls: "bg-blue-100 text-blue-800", Icon: Pencil },
    deleted: { cls: "bg-red-100 text-red-800", Icon: Trash2 },
  } as const;
  const { cls, Icon } = map[action];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      <Icon className="h-3 w-3" /> {action}
    </span>
  );
}

function diffKeys(oldData: any, newData: any) {
  if (!oldData || !newData) return [];
  const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  const changed: { key: string; from: any; to: any }[] = [];
  for (const k of keys) {
    if (k === "updated_at") continue;
    const a = JSON.stringify(oldData[k] ?? null);
    const b = JSON.stringify(newData[k] ?? null);
    if (a !== b) changed.push({ key: k, from: oldData[k], to: newData[k] });
  }
  return changed;
}

function AuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<(typeof TABLES)[number]>("all");
  const [action, setAction] = useState<(typeof ACTIONS)[number]>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error && data) setRows(data as AuditRow[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (table !== "all" && r.table_name !== table) return false;
      if (action !== "all" && r.action !== action) return false;
      if (q && !(r.summary ?? "").toLowerCase().includes(q) && !(r.actor_email ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, table, action, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Audit Log</h2>
        <span className="ml-2 text-xs text-muted-foreground">{filtered.length} of {rows.length} entries</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <select value={table} onChange={(e) => setTable(e.target.value as any)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          {TABLES.map((t) => <option key={t} value={t}>{t === "all" ? "All tables" : t}</option>)}
        </select>
        <select value={action} onChange={(e) => setAction(e.target.value as any)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          {ACTIONS.map((a) => <option key={a} value={a}>{a === "all" ? "All actions" : a}</option>)}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search summary or actor email…" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No audit entries yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Table</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Summary</th>
                <th className="px-3 py-2">Actor</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const open = expanded === r.id;
                const changes = r.action === "updated" ? diffKeys(r.old_data, r.new_data) : [];
                return (
                  <>
                    <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{fmt(r.created_at)}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.table_name}</td>
                      <td className="px-3 py-2"><ActionBadge action={r.action} /></td>
                      <td className="px-3 py-2">{r.summary || <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground">{r.actor_email || <span className="italic">system / guest</span>}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => setExpanded(open ? null : r.id)} className="text-xs font-semibold text-primary hover:underline">
                          {open ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {open && (
                      <tr key={r.id + "-d"} className="border-t border-border bg-muted/20">
                        <td colSpan={6} className="px-3 py-3">
                          {r.action === "updated" && changes.length > 0 ? (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-muted-foreground">Changed fields</p>
                              <ul className="space-y-1 text-xs">
                                {changes.map((c) => (
                                  <li key={c.key} className="font-mono">
                                    <span className="font-semibold">{c.key}:</span>{" "}
                                    <span className="text-red-700">{JSON.stringify(c.from)}</span>{" → "}
                                    <span className="text-green-700">{JSON.stringify(c.to)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <pre className="overflow-x-auto rounded bg-background p-2 text-xs">
{JSON.stringify(r.new_data ?? r.old_data, null, 2)}
                            </pre>
                          )}
                          {r.record_id && <p className="mt-2 text-xs text-muted-foreground">Record ID: <span className="font-mono">{r.record_id}</span></p>}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
