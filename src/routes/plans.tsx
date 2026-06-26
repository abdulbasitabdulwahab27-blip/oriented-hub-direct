import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Coins, Sparkles, Crown, Building2 } from "lucide-react";
import { WHATSAPP_PRIMARY } from "@/lib/whatsapp";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Plans & Credits — Oriented Hub" },
      { name: "description", content: "View Oriented Hub procurement plans, membership tiers and your current credit balance." },
      { property: "og:title", content: "Plans & Credits — Oriented Hub" },
      { property: "og:description", content: "Choose a procurement tier and track your Oriented Hub credit balance." },
    ],
  }),
  component: PlansPage,
});

type Plan = {
  name: string;
  price: string;
  cadence: string;
  credits: string;
  icon: typeof Sparkles;
  highlight?: boolean;
  features: string[];
  cta: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "₦0",
    cadence: "Free forever",
    credits: "10 credits / month",
    icon: Sparkles,
    features: [
      "Browse full catalogue",
      "Request quotations via WhatsApp",
      "Standard delivery rates",
      "Email support",
    ],
    cta: "Get started",
  },
  {
    name: "Professional",
    price: "₦25,000",
    cadence: "per month",
    credits: "200 credits / month",
    icon: Crown,
    highlight: true,
    features: [
      "Priority quotation turnaround",
      "5% loyalty discount on orders",
      "Dedicated account officer",
      "Bulk pricing on consumables",
      "Free delivery within Osogbo",
    ],
    cta: "Upgrade to Professional",
  },
  {
    name: "Institutional",
    price: "Custom",
    cadence: "Annual contract",
    credits: "Unlimited credits",
    icon: Building2,
    features: [
      "Tailored procurement framework",
      "Net-30 payment terms",
      "On-site installation & training",
      "Quarterly stock review",
      "24/7 priority support",
    ],
    cta: "Talk to sales",
  },
];

function PlansPage() {
  // Placeholder balance — wire to backend when accounts are enabled
  const balance = 10;
  const monthly = 10;
  const used = 0;

  return (
    <div className="container-page py-12">
      <header className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-4">
          <Coins className="h-3.5 w-3.5" /> Membership & credits
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold">Plans & Credits</h1>
        <p className="mt-3 text-muted-foreground">
          Choose a procurement tier that fits your institution. Credits unlock priority quotations,
          discounted delivery and bulk pricing across our catalogue.
        </p>
      </header>

      {/* Credit balance card */}
      <section className="mb-12 rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-background p-6 md:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Current balance</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold">{balance}</span>
              <span className="text-muted-foreground">credits</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {used} of {monthly} monthly credits used · Renews on the 1st
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${encodeURIComponent("Hello Oriented Hub, I'd like to top up my credits.")}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Top up credits
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-md border border-input px-5 py-2.5 text-sm font-medium hover:bg-accent">
              View history
            </Link>
          </div>
        </div>
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-gradient-primary" style={{ width: `${(used / monthly) * 100}%` }} />
        </div>
      </section>

      {/* Plans grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                p.highlight ? "border-primary shadow-soft bg-card" : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.credits}</div>
                </div>
              </div>
              <div className="mt-5">
                <span className="font-display text-3xl font-semibold">{p.price}</span>
                <span className="text-sm text-muted-foreground ml-1">{p.cadence}</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${encodeURIComponent(`Hello Oriented Hub, I'd like to subscribe to the ${p.name} plan.`)}`}
                target="_blank" rel="noreferrer"
                className={`mt-6 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input hover:bg-accent"
                }`}
              >
                {p.cta}
              </a>
            </div>
          );
        })}
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">How credits work</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
          1 credit = 1 priority quotation request. Credits also unlock free delivery slots, bulk
          discounts and access to limited-stock inventory. Unused credits roll over for 30 days.
        </p>
      </section>
    </div>
  );
}
