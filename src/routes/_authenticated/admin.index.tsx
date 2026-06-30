import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ShoppingBag, Clock, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

type OrderItem = { qty?: number; quantity?: number; price?: number; fee?: number };

function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, newOrders: 0, customers: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: p }, { count: o }, { count: n }, { data: rows }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("orders").select("customer_phone, items"),
      ]);
      const phones = new Set<string>();
      let revenue = 0;
      for (const r of rows ?? []) {
        if (r.customer_phone) phones.add(r.customer_phone.trim().toLowerCase());
        const items = (r.items as OrderItem[]) ?? [];
        for (const it of items) {
          revenue += Number(it.price ?? 0) * Number(it.qty ?? it.quantity ?? 1) + Number(it.fee ?? 0);
        }
      }
      setStats({ products: p ?? 0, orders: o ?? 0, newOrders: n ?? 0, customers: phones.size, revenue });
    })();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Custom products" value={String(stats.products)} icon={<Package className="h-5 w-5" />} to="/admin/products" />
      <StatCard label="Total orders" value={String(stats.orders)} icon={<ShoppingBag className="h-5 w-5" />} to="/admin/orders" />
      <StatCard label="New (unprocessed)" value={String(stats.newOrders)} icon={<Clock className="h-5 w-5" />} to="/admin/orders" accent />
      <StatCard label="Customers" value={String(stats.customers)} icon={<Users className="h-5 w-5" />} to="/admin/customers" />
      <StatCard label="Revenue (priced)" value={stats.revenue > 0 ? `NGN ${stats.revenue.toLocaleString()}` : "—"} icon={<TrendingUp className="h-5 w-5" />} to="/admin/orders" />
    </div>
  );
}

function StatCard({ label, value, icon, to, accent }: { label: string; value: string; icon: React.ReactNode; to: string; accent?: boolean }) {
  return (
    <Link to={to} className={`rounded-xl border p-6 shadow-card transition hover:shadow-md ${accent ? "border-primary bg-gradient-primary text-primary-foreground" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </Link>
  );
}
