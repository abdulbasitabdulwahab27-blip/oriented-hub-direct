import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Package, ShoppingBag, LayoutDashboard, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Oriented Hub" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { navigate({ to: "/auth" }); return; }
      setEmail(u.user.email ?? "");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!data);
      setChecking(false);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
    navigate({ to: "/auth", replace: true });
  };

  if (checking) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading admin…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">Your account ({email}) does not have admin access.</p>
        <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="container-page py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Signed in as {email}</p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8 border-b border-border">
        <AdminTab to="/admin" icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" exact />
        <AdminTab to="/admin/products" icon={<Package className="h-4 w-4" />} label="Products" />
        <AdminTab to="/admin/orders" icon={<ShoppingBag className="h-4 w-4" />} label="Orders" />
      </nav>

      <Outlet />
    </div>
  );
}

function AdminTab({ to, icon, label, exact }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      activeProps={{ className: "border-primary text-primary" }}
      inactiveProps={{ className: "border-transparent text-muted-foreground hover:text-foreground" }}
      className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px"
    >
      {icon} {label}
    </Link>
  );
}
