import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { cartOrderMessage, waLink } from "@/lib/whatsapp";
import { categories } from "@/lib/products";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  address: z.string().trim().min(5, "Enter your delivery address").max(300),
  notes: z.string().max(500).optional(),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Oriented Hub" }, { name: "description", content: "Submit your order details and confirm via WhatsApp." }] }),
  component: Checkout,
});

function Checkout() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary font-semibold">Go to shop →</Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check your details."); return; }

    const lines = items.map((it) => ({
      id: it.id,
      name: it.name,
      category: categories.find((c) => c.slug === it.category)?.name ?? it.category,
      quantity: it.quantity,
    }));

    // Save to database (best-effort; do not block WhatsApp handoff on failure)
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("orders").insert({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        notes: form.notes || null,
        items: lines,
      });
    } catch (err) {
      console.error("Order save failed", err);
    }

    const msg = cartOrderMessage(lines, { name: form.name, phone: form.phone, address: form.address + (form.notes ? `\nNotes: ${form.notes}` : "") });
    window.open(waLink(msg), "_blank");
    toast.success("Order sent to WhatsApp — we'll confirm shortly.");
    clear();
    setTimeout(() => navigate({ to: "/" }), 800);
  };

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">Checkout</h1>
      <p className="mt-1 text-muted-foreground">Fill in your details — we'll confirm everything on WhatsApp.</p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <Field label="Full Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Phone Number" required type="tel" placeholder="+234..." value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Delivery Address" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} textarea />
          <Field label="Order Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />
        </div>
        <aside className="rounded-xl border border-border bg-card p-6 shadow-card h-fit">
          <h2 className="font-display text-lg font-semibold">Your order</h2>
          <ul className="mt-4 divide-y divide-border">
            {items.map((it) => (
              <li key={it.id} className="py-3 flex justify-between gap-3 text-sm">
                <span className="line-clamp-2">{it.name}</span>
                <span className="shrink-0 text-muted-foreground">× {it.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-sm border-t border-border pt-3">
            <span className="text-muted-foreground">Pricing</span>
            <span className="font-semibold text-primary">On Request</span>
          </div>
          <button type="submit" className="mt-5 w-full inline-flex items-center justify-center rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95">Submit Order via WhatsApp</button>
          <p className="mt-3 text-xs text-muted-foreground text-center">Your order will be confirmed by our team with pricing and delivery details.</p>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, type, placeholder, textarea }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}{required && <span className="text-destructive"> *</span>}</span>
      {textarea ? (
        <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      ) : (
        <input required={required} type={type ?? "text"} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      )}
    </label>
  );
}
