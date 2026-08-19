import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Package, Truck, Store } from "lucide-react";
import { waLink, EMAIL, ADDRESS } from "@/lib/whatsapp";
import { emailOrder } from "@/lib/order-email.functions";
import { canonicalLink, pageMeta } from "@/lib/seo";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid WhatsApp number")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "WhatsApp number can only contain digits, spaces, +, - and ()"),
  address: z.string().trim().min(5, "Enter your delivery or pickup details").max(300),
  order: z.string().trim().min(3, "Tell us what you want to order").max(1500),
  notes: z.string().trim().max(500).optional(),
});

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: pageMeta({
      title: "Place an Order | The Oriented Hub",
      description:
        "Submit your order for books, medical equipment, laboratory equipment or hospital consumables. Share your WhatsApp number and delivery or pickup address and our team will confirm pricing and dispatch.",
      path: "/order",
    }),
    links: canonicalLink("/order"),
  }),
  component: OrderPage,
});

type Fulfilment = "delivery" | "pickup";

function makeTrackingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return "OH-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function OrderPage() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", order: "", notes: "" });
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);
  const [emailFallback, setEmailFallback] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    const data = parsed.data;
    setSubmitting(true);
    const code = makeTrackingCode();

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: u } = await supabase.auth.getUser();
      await supabase.from("orders").insert({
        customer_name: data.name,
        customer_phone: data.phone,
        customer_address: `${fulfilment === "pickup" ? "PICKUP" : "DELIVERY"} — ${data.address}`,
        notes: data.notes || null,
        items: [{ name: data.order, category: "custom-order", quantity: 1 }],
        user_id: u.user?.id ?? null,
        tracking_code: code,
      });
    } catch (err) {
      console.error("Order save failed");
    }

    const message = [
      "Hello Oriented Hub,",
      "I would like to place an order.",
      "",
      `Tracking code: ${code}`,
      "",
      "Order details:",
      data.order,
      "",
      `Name: ${data.name}`,
      `WhatsApp: ${data.phone}`,
      fulfilment === "pickup" ? `Pickup details: ${data.address}` : `Shipping address: ${data.address}`,
      data.notes ? `Notes: ${data.notes}` : "",
      "",
      "Please confirm pricing, availability and dispatch. Thank you.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(message), "_blank");

    // Email a copy of the order to the shop inbox (never blocks the customer).
    emailOrder({
      data: {
        trackingCode: code,
        name: data.name,
        phone: data.phone,
        address: data.address,
        fulfilment: fulfilment === "pickup" ? "Pickup in Osogbo" : "Delivery / shipping",
        order: data.order,
        notes: data.notes || null,
        source: "order page",
      },
    }).catch(() => {});

    setEmailFallback(
      `mailto:${EMAIL}?subject=${encodeURIComponent(`New order ${code} — ${data.name}`)}&body=${encodeURIComponent(message)}`,
    );
    setTracking(code);
    toast.success("Order submitted — we'll confirm on WhatsApp shortly.");
    setForm({ name: "", phone: "", address: "", order: "", notes: "" });
    setSubmitting(false);
  };


  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Place an Order</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us what you need, share your WhatsApp number and your shipping or pickup address. Our team confirms
          pricing, availability and dispatch — nationwide delivery and worldwide shipping available.
        </p>
      </div>

      {tracking && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-semibold">Your tracking code</p>
          <p className="mt-1 font-display text-2xl tracking-wide">{tracking}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Save this code. Check your order status any time on the{" "}
            <Link to="/track" className="font-semibold text-primary underline">
              order tracking page
            </Link>{" "}
            using this code and your WhatsApp number.
          </p>
          {emailFallback && (
            <a
              href={emailFallback}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/40 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
            >
              Also email this order to {EMAIL}
            </a>
          )}
        </div>
      )}



      <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-card">
          <label className="block">
            <span className="text-sm font-semibold">
              What would you like to order?<span className="text-destructive"> *</span>
            </span>
            <textarea
              required
              rows={6}
              maxLength={1500}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              placeholder={"e.g.\n2 × Robbins Basic Pathology (11th Edition)\n1 × Digital BP Monitor\n5 packs × Nitrile gloves (medium)"}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="mt-1 block text-xs text-muted-foreground">{form.order.length}/1500 characters</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">
                Full Name<span className="text-destructive"> *</span>
              </span>
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">
                WhatsApp Number<span className="text-destructive"> *</span>
              </span>
              <input
                required
                type="tel"
                maxLength={20}
                placeholder="+234 813 654 8965"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">How would you like to receive it?</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { key: "delivery" as const, icon: Truck, title: "Ship to me", text: "Nationwide & worldwide" },
                  { key: "pickup" as const, icon: Store, title: "Pickup in Osogbo", text: "15 Oke-Fia Street" },
                ]
              ).map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setFulfilment(opt.key)}
                  className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
                    fulfilment === opt.key ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                >
                  <opt.icon className="mt-0.5 h-5 w-5 text-primary" />
                  <span>
                    <span className="block text-sm font-semibold">{opt.title}</span>
                    <span className="block text-xs text-muted-foreground">{opt.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-semibold">
              {fulfilment === "pickup" ? "Pickup details (preferred date & contact person)" : "Shipping address"}
              <span className="text-destructive"> *</span>
            </span>
            <textarea
              required
              rows={3}
              maxLength={300}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder={
                fulfilment === "pickup"
                  ? "e.g. I will pick up on Friday afternoon, contact: Tunde"
                  : "Street, city, state, country and nearest landmark"
              }
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Additional notes (optional)</span>
            <textarea
              rows={2}
              maxLength={500}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 shadow-card h-fit">
          <h2 className="font-display text-lg font-semibold">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> Submit your order and contact details.</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> We confirm pricing and availability on WhatsApp.</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> Pay, then we ship or prepare your pickup.</li>
          </ol>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95 disabled:opacity-60"
          >
            <Package className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Order"}
          </button>

          <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground space-y-1">
            <p>Pickup: {ADDRESS}</p>
            <p>Email: <a className="text-primary" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            <p>
              Shopping the catalogue instead?{" "}
              <Link to="/shop" className="text-primary font-semibold">Browse the shop</Link>
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
