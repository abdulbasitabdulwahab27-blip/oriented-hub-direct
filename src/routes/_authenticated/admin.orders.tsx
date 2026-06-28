import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Phone, MapPin, Inbox, Package, FileText, Truck, CheckCircle2, XCircle, Search, X, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

type OrderItem = { id?: string; name: string; category?: string; quantity: number; price?: number; fee?: number };
type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  items: OrderItem[];
  status: string;
  created_at: string;
  received_at: string | null;
  preparing_at: string | null;
  quoted_at: string | null;
  delivered_at: string | null;
};

type StatusKey = "new" | "received" | "preparing" | "quoted" | "delivered" | "cancelled";

const workflow: { key: StatusKey; label: string; stampField: keyof Order | null; icon: typeof Inbox }[] = [
  { key: "new", label: "New", stampField: "created_at", icon: Inbox },
  { key: "received", label: "Received", stampField: "received_at", icon: CheckCircle2 },
  { key: "preparing", label: "Preparing", stampField: "preparing_at", icon: Package },
  { key: "quoted", label: "Quoted", stampField: "quoted_at", icon: FileText },
  { key: "delivered", label: "Delivered", stampField: "delivered_at", icon: Truck },
];

const allStatuses: StatusKey[] = ["new", "received", "preparing", "quoted", "delivered", "cancelled"];

const badge: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-300",
  received: "bg-sky-100 text-sky-700 border-sky-300",
  preparing: "bg-amber-100 text-amber-700 border-amber-300",
  quoted: "bg-purple-100 text-purple-700 border-purple-300",
  delivered: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

const fmt = (s: string | null) => (s ? new Date(s).toLocaleString() : null);

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StatusKey>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Marked as ${status}.`); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted."); load(); }
  };

  const q = query.trim().toLowerCase();
  const fromTs = fromDate ? new Date(fromDate + "T00:00:00").getTime() : null;
  const toTs = toDate ? new Date(toDate + "T23:59:59").getTime() : null;

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    const placed = new Date(o.created_at).getTime();
    if (fromTs !== null && placed < fromTs) return false;
    if (toTs !== null && placed > toTs) return false;
    if (q) {
      const hay = `${o.customer_name} ${o.customer_phone}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const hasFilters = q || statusFilter !== "all" || fromDate || toDate;
  const clearAll = () => { setQuery(""); setStatusFilter("all"); setFromDate(""); setToDate(""); };

  const exportCsv = () => {
    if (filtered.length === 0) { toast.error("No orders to export."); return; }
    const esc = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const money = (n: number) => (n > 0 ? n.toFixed(2) : "");
    const headers = ["Order ID","Customer","Phone","Address","Status","Placed","Received","Preparing","Quoted","Delivered","Line Items","Total Quantity","Subtotal","Fees","Total","Items","Notes"];
    const rows = filtered.map((o) => {
      const lineItems = o.items.length;
      const totalQty = o.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
      const subtotal = o.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
      const fees = o.items.reduce((s, it) => s + (Number(it.fee) || 0), 0);
      const total = subtotal + fees;
      return [
        o.id, o.customer_name, o.customer_phone, o.customer_address, o.status,
        fmt(o.created_at) ?? "", fmt(o.received_at) ?? "", fmt(o.preparing_at) ?? "",
        fmt(o.quoted_at) ?? "", fmt(o.delivered_at) ?? "",
        lineItems, totalQty, money(subtotal), money(fees), money(total),
        o.items.map((it) => `${it.quantity}× ${it.name}${it.category ? ` (${it.category})` : ""}`).join("; "),
        o.notes ?? "",
      ].map(esc).join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `orders-${stamp}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} order${filtered.length === 1 ? "" : "s"}.`);
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-1">Orders</h2>
      <p className="text-sm text-muted-foreground mb-6">Track every order through Received → Preparing → Quoted → Delivered. Timestamps are recorded automatically.</p>

      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or phone…"
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | StatusKey)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="text-xs text-muted-foreground inline-flex items-center gap-2">
            From
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </label>
          <label className="text-xs text-muted-foreground inline-flex items-center gap-2">
            To
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          </label>
          {hasFilters && (
            <button onClick={clearAll} className="inline-flex items-center justify-center gap-1 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted">
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            Showing <b>{filtered.length}</b> of {orders.length} order{orders.length === 1 ? "" : "s"}.
          </div>
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground">
          {orders.length === 0 ? "No orders yet." : "No orders match your filters."}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => {
            const currentIdx = workflow.findIndex((w) => w.key === o.status);
            const isCancelled = o.status === "cancelled";
            return (
              <div key={o.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{o.customer_name}</h3>
                      <span className={`text-xs uppercase tracking-wide rounded-full border px-2 py-0.5 ${badge[o.status] ?? badge.new}`}>{o.status}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{o.customer_phone}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{o.customer_address}</span>
                      <span>Placed: {fmt(o.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="rounded border border-border bg-background px-2 py-1 text-xs">
                      {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => remove(o.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete order"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Workflow timeline */}
                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3">
                  {isCancelled ? (
                    <div className="flex items-center gap-2 text-sm text-destructive"><XCircle className="h-4 w-4" /> Order cancelled</div>
                  ) : (
                    <ol className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {workflow.map((step, i) => {
                        const Icon = step.icon;
                        const stamp = step.stampField ? (o[step.stampField] as string | null) : null;
                        const reached = i <= currentIdx;
                        const isCurrent = i === currentIdx;
                        return (
                          <li key={step.key} className="flex flex-col items-start gap-1">
                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${reached ? "text-primary" : "text-muted-foreground"}`}>
                              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${reached ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background"} ${isCurrent ? "ring-2 ring-primary/30" : ""}`}>
                                <Icon className="h-3 w-3" />
                              </span>
                              {step.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground pl-7">
                              {stamp ? fmt(stamp) : "—"}
                            </div>
                            {reached && step.key !== "new" && !stamp && (
                              <button onClick={() => updateStatus(o.id, step.key)} className="ml-7 text-[10px] text-primary hover:underline">Stamp now</button>
                            )}
                            {!reached && (
                              <button onClick={() => updateStatus(o.id, step.key)} className="ml-7 text-[10px] text-primary hover:underline">Mark</button>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>

                {o.notes && <p className="mt-3 text-sm text-muted-foreground"><b>Notes:</b> {o.notes}</p>}

                {(() => {
                  const lineItems = o.items.length;
                  const totalQty = o.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
                  const subtotal = o.items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
                  const fees = o.items.reduce((s, it) => s + (Number(it.fee) || 0), 0);
                  const total = subtotal + fees;
                  const fmtMoney = (n: number) => n > 0 ? `₦${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";
                  return (
                    <>
                      <div className="mt-3 overflow-x-auto border-t border-border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="py-2 pr-3 font-medium">Item</th>
                              <th className="py-2 px-3 font-medium text-right">Qty</th>
                              <th className="py-2 px-3 font-medium text-right">Price</th>
                              <th className="py-2 px-3 font-medium text-right">Fee</th>
                              <th className="py-2 pl-3 font-medium text-right">Line Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {o.items.map((it, i) => {
                              const lineTotal = (Number(it.price) || 0) * (Number(it.quantity) || 0) + (Number(it.fee) || 0);
                              return (
                                <tr key={i}>
                                  <td className="py-2 pr-3">{it.name}{it.category && <span className="text-muted-foreground"> · {it.category}</span>}</td>
                                  <td className="py-2 px-3 text-right">{it.quantity}</td>
                                  <td className="py-2 px-3 text-right">{Number(it.price) > 0 ? fmtMoney(Number(it.price)) : "—"}</td>
                                  <td className="py-2 px-3 text-right">{Number(it.fee) > 0 ? fmtMoney(Number(it.fee)) : "—"}</td>
                                  <td className="py-2 pl-3 text-right font-medium">{lineTotal > 0 ? fmtMoney(lineTotal) : "—"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                        <div><div className="text-xs text-muted-foreground">Items</div><div className="font-semibold">{lineItems} ({totalQty} qty)</div></div>
                        <div><div className="text-xs text-muted-foreground">Subtotal</div><div className="font-semibold">{fmtMoney(subtotal)}</div></div>
                        <div><div className="text-xs text-muted-foreground">Fees</div><div className="font-semibold">{fmtMoney(fees)}</div></div>
                        <div><div className="text-xs text-muted-foreground">Total</div><div className="font-semibold text-primary">{fmtMoney(total)}</div></div>
                      </div>
                    </>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
