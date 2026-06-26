import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Oriented Hub Admin" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      }
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
        <h1 className="font-display text-2xl font-semibold text-center">Admin Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">Manage products and orders for Oriented Hub.</p>

        <div className="mt-6 flex rounded-md border border-border p-1">
          <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded py-2 text-sm font-semibold ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign in</button>
          <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded py-2 text-sm font-semibold ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Create account</button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60">
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          The first account created becomes the admin automatically. <Link to="/" className="underline">Back to store</Link>
        </p>
      </div>
    </div>
  );
}
