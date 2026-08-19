import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Package, Search } from "lucide-react";
import { canonicalLink, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: pageMeta({
      title: "Track Your Order | The Oriented Hub",
      description:
        "Check the status of your book, medical equipment or laboratory supply order. Enter your tracking code and WhatsApp number to see whether your order is received, being prepared, quoted or delivered.",
      path: "/track",
    }),
    links: canonicalLink("/track"),
  }),
  component: TrackPage,
});

type TrackedOrder = {
  tracking_code: string;
  customer_name: string;
  status: string;
  created_at: string;
  received_at: string | null;
  preparing_at: string | null;
  quoted_at: string | null;
  delivered_at: string | null;
  items: unknown;
};

const STEPS = [
  { key: "received", label: "Order received", desc: "We have your request and it is in the queue." },
  { key: "preparing", label: "Preparing", desc: "Sourcing and packing your items." },
  { key: "quoted", label: "Quoted / confirmed", desc: "Pricing confirmed with you on WhatsApp." },
  { key: "delivered", label: "Delivered / ready for pickup", desc: "Your order has been dispatched or collected." },
] as const;

function fmt(ts: string | null) {
  if (!ts) return null;
  return new Date(ts).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function TrackPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4 || phone.trim().length < 7) {
      toast.error("Enter your tracking code and the WhatsApp number used for the order.");
      return;
    }
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const { trackOrder } = await import("@/lib/track.functions");
      const res = await trackOrder({ data: { code: code.trim(), phone: phone.trim() } });
      const row = (res?.order ?? null) as TrackedOrder | null;
      if (!row) setNotFound(true);
      else setOrder(row);
    } catch {
      toast.error("We couldn't check that order right now. Please try again.");
    }
    setLoading(false);
  };

  const stamps: Record<string, string | null> = order
    ? {
        received: order.received_at ?? order.created_at,
        preparing: order.preparing_at,
        quoted: order.quoted_at,
        delivered: order.delivered_at,
      }
    : {};

  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Track Your Order</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the tracking code we gave you when you placed your order, plus the WhatsApp number you used. You'll see
          exactly where your order stands.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 max-w-2xl rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Tracking code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="OH-XXXXXXXX"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">WhatsApp number</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Search className="h-4 w-4" />
          {loading ? "Checking…" : "Track order"}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">
          Don't have a code?{" "}
          <Link to="/order" className="font-semibold text-primary underline">
            Place an order
          </Link>{" "}
          or message us on WhatsApp and we'll look it up for you.
        </p>
      </form>

      {notFound && (
        <div className="mt-6 max-w-2xl rounded-xl border border-border bg-muted/40 p-5 text-sm">
          No order matched that code and WhatsApp number. Check for typos, or contact us on WhatsApp and we'll find it.
        </div>
      )}

      {order && (
        <div className="mt-8 max-w-2xl rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tracking code</p>
              <p className="font-display text-2xl">{order.tracking_code}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {order.customer_name} • placed {fmt(order.created_at)}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Package className="h-3.5 w-3.5" />
              {order.status}
            </span>
          </div>

          <ol className="mt-6 space-y-5">
            {STEPS.map((step) => {
              const at = stamps[step.key];
              const done = Boolean(at);
              return (
                <li key={step.key} className="flex gap-3">
                  {done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
                  )}
                  <div>
                    <p className={done ? "text-sm font-semibold" : "text-sm font-semibold text-muted-foreground"}>
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                    {done && <p className="mt-0.5 text-xs text-muted-foreground">{fmt(at)}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
