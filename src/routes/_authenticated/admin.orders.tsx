import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

type OrderItem = { id?: string; name: string; category?: string; quantity: number };
type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  items: OrderItem[];
  status: string;
  created_at: string;
};

const statuses = ["new", "contacted", "fulfilled", "cancelled"] as const;

const badge: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-300",
  contacted: "bg-amber-100 text-amber-700 border-amber-300",
  fulfilled: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data ?? []) as Order[]);
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

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-1">Orders</h2>
      <p className="text-sm text-muted-foreground mb-6">Every checkout submission is captured here.</p>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
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
                    <span>{new Date(o.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="rounded border border-border bg-background px-2 py-1 text-xs">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(o.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete order"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              {o.notes && <p className="mt-3 text-sm text-muted-foreground"><b>Notes:</b> {o.notes}</p>}

              <ul className="mt-3 divide-y divide-border border-t border-border">
                {o.items.map((it, i) => (
                  <li key={i} className="flex justify-between py-2 text-sm">
                    <span>{it.name}{it.category && <span className="text-muted-foreground"> · {it.category}</span>}</span>
                    <span className="font-semibold">× {it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
