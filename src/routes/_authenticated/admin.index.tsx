import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ShoppingBag, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, newOrders: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: p }, { count: o }, { count: n }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({ products: p ?? 0, orders: o ?? 0, newOrders: n ?? 0 });
    })();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Custom products" value={stats.products} icon={<Package className="h-5 w-5" />} to="/admin/products" />
      <StatCard label="Total orders" value={stats.orders} icon={<ShoppingBag className="h-5 w-5" />} to="/admin/orders" />
      <StatCard label="New (unprocessed)" value={stats.newOrders} icon={<Clock className="h-5 w-5" />} to="/admin/orders" accent />
    </div>
  );
}

function StatCard({ label, value, icon, to, accent }: { label: string; value: number; icon: React.ReactNode; to: string; accent?: boolean }) {
  return (
    <Link to={to} className={`rounded-xl border p-6 shadow-card transition hover:shadow-md ${accent ? "border-primary bg-gradient-primary text-primary-foreground" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </Link>
  );
}
