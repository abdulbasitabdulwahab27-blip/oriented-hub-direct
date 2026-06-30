import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Users, Search, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomers,
});

type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  created_at: string;
  status: string;
  items: Array<{ name?: string; qty?: number; quantity?: number; price?: number; fee?: number }>;
};

type Customer = {
  name: string;
  phone: string;
  addresses: Set<string>;
  orderCount: number;
  lastOrder: string;
  totalItems: number;
  totalRevenue: number;
};

function AdminCustomers() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, customer_phone, customer_address, created_at, status, items")
        .order("created_at", { ascending: false });
      if (!error) setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    })();
  }, []);

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    for (const o of orders) {
      const key = (o.customer_phone || o.customer_name || "").trim().toLowerCase();
      if (!key) continue;
      const existing = map.get(key);
      const items = Array.isArray(o.items) ? o.items : [];
      const qty = items.reduce((s, it) => s + Number(it.qty ?? it.quantity ?? 1), 0);
      const revenue = items.reduce((s, it) => s + Number(it.price ?? 0) * Number(it.qty ?? it.quantity ?? 1) + Number(it.fee ?? 0), 0);
      if (existing) {
        existing.orderCount += 1;
        existing.totalItems += qty;
        existing.totalRevenue += revenue;
        if (o.customer_address) existing.addresses.add(o.customer_address);
        if (new Date(o.created_at) > new Date(existing.lastOrder)) existing.lastOrder = o.created_at;
      } else {
        map.set(key, {
          name: o.customer_name,
          phone: o.customer_phone,
          addresses: new Set(o.customer_address ? [o.customer_address] : []),
          orderCount: 1,
          lastOrder: o.created_at,
          totalItems: qty,
          totalRevenue: revenue,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime());
  }, [orders]);

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Customers</h2>
          <p className="text-sm text-muted-foreground">Built automatically from your orders.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading customers…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card/50">
          <Users className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No customers yet. They will appear here after the first order.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold text-right">Orders</th>
                <th className="px-4 py-3 font-semibold text-right">Items</th>
                <th className="px-4 py-3 font-semibold text-right">Revenue</th>
                <th className="px-4 py-3 font-semibold">Last order</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.phone || c.name} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3"><a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-primary hover:underline"><Phone className="h-3.5 w-3.5" />{c.phone}</a></td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs">
                    {Array.from(c.addresses).slice(0, 2).map((a, i) => (
                      <div key={i} className="flex gap-1 items-start"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /><span className="line-clamp-2">{a}</span></div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{c.orderCount}</td>
                  <td className="px-4 py-3 text-right">{c.totalItems}</td>
                  <td className="px-4 py-3 text-right">{c.totalRevenue > 0 ? `NGN ${c.totalRevenue.toLocaleString()}` : <span className="text-muted-foreground">On request</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.lastOrder).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
