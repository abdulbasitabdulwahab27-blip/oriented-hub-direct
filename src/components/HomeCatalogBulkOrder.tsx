import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { categories, products as codeProducts } from "@/lib/products";
import { useAllProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";
import { waLink } from "@/lib/whatsapp";
import { emailOrder } from "@/lib/order-email.functions";

const BULK_CATEGORIES = [
  "NUC accreditation textbooks",
  "Medical & nursing textbooks",
  "Laboratory equipment & reagents",
  "Medical equipment & simulators",
  "Hospital consumables",
  "Educational materials & stationery",
  "Mixed / full accreditation list",
];

const schema = z.object({
  institution: z.string().trim().min(2, "Enter your institution or organisation name").max(200),
  contactName: z.string().trim().min(2, "Enter the contact person's name").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid WhatsApp number")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "WhatsApp number can only contain digits, spaces, +, - and ()"),
  email: z.string().trim().email("Enter a valid email address").max(160).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Enter the delivery address").max(300),
  category: z.string().trim().min(2).max(120),
  budget: z.string().trim().max(120).optional(),
  items: z.string().trim().min(3, "List the items and quantities you need").max(3000),
});

function makeTrackingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return "OH-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function HomeCatalogBulkOrder() {
  const { products: all } = useAllProducts();
  const list = all.length ? all : codeProducts;
  const [active, setActive] = useState<string>("all");

  const shown = useMemo(() => {
    const filtered = active === "all" ? list : list.filter((p) => p.category === active);
    return filtered.slice(0, 16);
  }, [list, active]);

  return (
    <section id="catalog" className="scroll-mt-24 bg-secondary/30 py-14 md:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Product catalog</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
              Browse products with photos and prices
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Medical equipment, laboratory equipment, hospital consumables and NUC accreditation textbooks — with
              current prices. Need volume? Send a bulk order request below and we return a formal quotation.
            </p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            View full catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${active === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
          >
            All products
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${active === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <BulkOrderForm categories={BULK_CATEGORIES} />
      </div>
    </section>
  );
}

function BulkOrderForm({ categories: cats }: { categories: string[] }) {
  const [form, setForm] = useState({
    institution: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    category: cats[0],
    budget: "",
    items: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const inputCls =
    "mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    const d = parsed.data;
    setSubmitting(true);
    const code = makeTrackingCode();

    const summary = [
      `Institution / organisation: ${d.institution}`,
      `Contact: ${d.contactName}`,
      d.email ? `Email: ${d.email}` : "",
      `Category: ${d.category}`,
      d.budget ? `Indicative budget: ${d.budget}` : "",
      "",
      "Items and quantities:",
      d.items,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: u } = await supabase.auth.getUser();
      await supabase.from("orders").insert({
        customer_name: `${d.institution} — ${d.contactName}`,
        customer_phone: d.phone,
        customer_address: `BULK ORDER — ${d.address}`,
        notes: [d.email ? `Email: ${d.email}` : "", d.budget ? `Budget: ${d.budget}` : ""].filter(Boolean).join(" | ") || null,
        items: [{ name: d.items, category: d.category, quantity: 1 }],
        user_id: u.user?.id ?? null,
        tracking_code: code,
      });
    } catch {
      console.error("Bulk order save failed");
    }

    emailOrder({
      data: {
        trackingCode: code,
        name: `${d.institution} — ${d.contactName}`,
        phone: d.phone,
        address: d.address,
        fulfilment: "Bulk order (homepage)",
        order: summary,
        notes: d.budget ? `Budget: ${d.budget}` : null,
        source: "homepage bulk order form",
      },
    }).catch(() => {});

    const message = [
      "Hello Oriented Hub,",
      "I would like a bulk order quotation.",
      "",
      `Reference: ${code}`,
      "",
      summary,
      "",
      `WhatsApp: ${d.phone}`,
      `Delivery address: ${d.address}`,
    ].join("\n");
    window.open(waLink(message), "_blank");

    setTracking(code);
    toast.success("Bulk order request sent — we'll reply with a quotation.");
    setSubmitting(false);
  };

  return (
    <div id="bulk-order" className="scroll-mt-24 mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="flex items-start gap-3">
        <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <h3 className="font-display text-xl font-semibold">Bulk order request</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Buying in volume for a school, hospital, laboratory or department? Send your list and budget — we reply with
            a formal quotation, proforma invoice and delivery timeline.
          </p>
        </div>
      </div>

      {tracking && (
        <p className="mt-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          Request reference <strong>{tracking}</strong> — keep it for follow-up.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-medium">Institution / organisation</span>
          <input className={inputCls} value={form.institution} onChange={set("institution")} placeholder="e.g. College of Health Technology, Osogbo" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Contact person</span>
          <input className={inputCls} value={form.contactName} onChange={set("contactName")} placeholder="Full name" />
        </label>
        <label className="text-sm">
          <span className="font-medium">WhatsApp number</span>
          <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="e.g. 08012345678" inputMode="tel" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Email (optional)</span>
          <input className={inputCls} value={form.email} onChange={set("email")} placeholder="you@institution.edu.ng" type="email" />
        </label>
        <label className="text-sm">
          <span className="font-medium">Category</span>
          <select className={inputCls} value={form.category} onChange={set("category")}>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium">Indicative budget (optional)</span>
          <input className={inputCls} value={form.budget} onChange={set("budget")} placeholder="e.g. ₦2,500,000" />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Delivery address</span>
          <input className={inputCls} value={form.address} onChange={set("address")} placeholder="Street, city, state" />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="font-medium">Items and quantities</span>
          <textarea className={inputCls} rows={5} value={form.items} onChange={set("items")} placeholder={"e.g.\n20 x Fundamentals of Nursing (10th Ed)\n5 x Binocular microscope\n10 cartons of surgical gloves"} />
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send bulk order request"}
          </button>
          <Link to="/procurement" className="text-sm font-semibold text-primary hover:underline">
            Institutional procurement & discount tiers
          </Link>
        </div>
      </form>
    </div>
  );
}
