import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, BadgePercent, FileSpreadsheet, Truck, ShieldCheck, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { waLink, EMAIL, ADDRESS, WHATSAPP_PRIMARY, WHATSAPP_ALT } from "@/lib/whatsapp";
import { canonicalLink, pageMeta } from "@/lib/seo";
import { emailOrder } from "@/lib/order-email.functions";
import { useAllProducts } from "@/lib/use-products";
import { recommendProcurementProducts } from "@/lib/procurement-matcher.functions";

const schema = z.object({
  institution: z.string().trim().min(2, "Enter the institution name").max(200),
  contactName: z.string().trim().min(2, "Enter the contact person's name").max(120),
  role: z.string().trim().max(120).optional(),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid WhatsApp number")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "WhatsApp number can only contain digits, spaces, +, - and ()"),
  email: z.string().trim().email("Enter a valid email address").max(160).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Enter the delivery address").max(300),
  category: z.string().trim().min(2).max(120),
  items: z.string().trim().min(3, "List the items or attach your requirement list").max(3000),
  budget: z.string().trim().max(120).optional(),
  deadline: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(800).optional(),
});

const CATEGORIES = [
  "NUC accreditation textbooks",
  "Medical & nursing textbooks",
  "Laboratory equipment & reagents",
  "Medical equipment & simulators",
  "Hospital consumables",
  "Educational materials & stationery",
  "Mixed / full accreditation list",
];

const TIERS = [
  { range: "₦500,000 – ₦2,000,000", discount: "5% – 8%", note: "Departmental orders and small accreditation lists." },
  { range: "₦2,000,000 – ₦10,000,000", discount: "8% – 12%", note: "Faculty-wide supply, resource verification lists." },
  { range: "Above ₦10,000,000", discount: "12% – 18%", note: "Full institutional accreditation and multi-campus supply." },
];

function makeTrackingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return "OH-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const Route = createFileRoute("/procurement")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "Institutional Procurement & Bulk Orders | The Oriented Hub",
        description:
          "Bulk supply of NUC accreditation textbooks, laboratory equipment, medical equipment and hospital consumables for Nigerian universities, colleges of health and polytechnics. Request a formal quotation, proforma invoice and institutional discounts.",
        path: "/procurement",
      }),
      {
        name: "keywords",
        content:
          "institutional procurement Nigeria, bulk textbook supply, university bulk order, NUC accreditation supplier, college of health procurement, laboratory equipment tender Nigeria, proforma invoice textbooks",
      },
    ],
    links: canonicalLink("/procurement"),
  }),
  component: ProcurementPage,
});

function ProcurementPage() {
  const { products: catalogProducts, loading: catalogLoading } = useAllProducts();
  const [form, setForm] = useState({
    institution: "",
    contactName: "",
    role: "",
    phone: "",
    email: "",
    address: "",
    category: CATEGORIES[0],
    items: "",
    budget: "",
    deadline: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [clarification, setClarification] = useState("");
  const [recommendations, setRecommendations] = useState<Array<{ productId: string; quantity: number; reason: string; selected: boolean }>>([]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const findMatches = async () => {
    if (form.items.trim().length < 3) {
      toast.error("Describe the items you need first.");
      return;
    }
    if (catalogLoading || catalogProducts.length === 0) {
      setMatchError("The catalog is still loading. Please try again in a moment.");
      return;
    }

    const categorySlug = form.category === "Medical & nursing textbooks" || form.category === "NUC accreditation textbooks"
      ? "books"
      : form.category === "Laboratory equipment & reagents"
        ? "laboratory"
        : form.category === "Medical equipment & simulators"
          ? "medical-equipment"
          : form.category === "Hospital consumables"
            ? "consumables"
            : form.category === "Educational materials & stationery"
              ? "educational"
              : null;
    const candidates = catalogProducts
      .filter((product) => !categorySlug || product.category === categorySlug)
      .slice(0, 100)
      .map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name.slice(0, 180),
        category: product.category.slice(0, 100),
        description: product.description.slice(0, 450),
        features: product.features.slice(0, 8).map((feature) => feature.slice(0, 120)),
      }));

    setMatching(true);
    setMatchError("");
    setClarification("");
    setRecommendations([]);
    try {
      const result = await recommendProcurementProducts({ data: { need: form.items.trim(), candidates } });
      if (!result.ok) {
        setMatchError(result.error);
        return;
      }
      setRecommendations(result.recommendations.map((item) => ({ ...item, selected: true })));
      setClarification(result.clarification);
      if (result.recommendations.length === 0) {
        setMatchError(result.clarification || "No clear catalog match was found. Keep your requirement text and submit it for manual review.");
      }
    } catch (error) {
      setMatchError(error instanceof Error ? error.message : "Recommendations are unavailable. Enter your requirements manually.");
    } finally {
      setMatching(false);
    }
  };

  const addMatchesToRequest = () => {
    const lines = recommendations
      .filter((item) => item.selected)
      .map((item) => {
        const product = catalogProducts.find((candidate) => candidate.id === item.productId);
        return product ? `${item.quantity} × ${product.name}` : null;
      })
      .filter((line): line is string => line !== null);
    if (lines.length === 0) {
      toast.error("Select at least one product to add.");
      return;
    }
    const existing = form.items.trim();
    setForm({ ...form, items: [existing, ...lines].filter(Boolean).join("\n") });
    toast.success("Selected products added to your requirement list. Review and edit it before submitting.");
  };

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
      `Institution: ${d.institution}`,
      `Contact: ${d.contactName}${d.role ? ` (${d.role})` : ""}`,
      d.email ? `Email: ${d.email}` : "",
      `Category: ${d.category}`,
      d.budget ? `Indicative budget: ${d.budget}` : "",
      d.deadline ? `Required by: ${d.deadline}` : "",
      "",
      "Requirement list:",
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
        customer_address: `PROCUREMENT — ${d.address}`,
        notes: [d.notes, d.email ? `Email: ${d.email}` : "", d.budget ? `Budget: ${d.budget}` : "", d.deadline ? `Deadline: ${d.deadline}` : ""]
          .filter(Boolean)
          .join(" | ") || null,
        items: [{ name: d.items, category: d.category, quantity: 1 }],
        user_id: u.user?.id ?? null,
        tracking_code: code,
      });
    } catch {
      console.error("Procurement request save failed");
    }

    const message = [
      "Hello Oriented Hub,",
      "We would like to request an institutional quotation.",
      "",
      `Reference: ${code}`,
      "",
      summary,
      "",
      `WhatsApp: ${d.phone}`,
      `Delivery address: ${d.address}`,
      d.notes ? `Notes: ${d.notes}` : "",
      "",
      "Please send a proforma invoice with institutional discount and lead time. Thank you.",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(message), "_blank");

    emailOrder({
      data: {
        trackingCode: code,
        name: `${d.institution} — ${d.contactName}`,
        phone: d.phone,
        address: d.address,
        fulfilment: "Institutional procurement",
        order: summary,
        notes: d.notes || null,
        source: "procurement page",
      },
    }).catch(() => {});

    setTracking(code);
    toast.success("Request submitted — our procurement desk will respond with a quotation.");
    setSubmitting(false);
  };

  const inputCls =
    "mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">For universities & colleges</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">Institutional Procurement & Bulk Orders</h1>
        <p className="mt-3 text-muted-foreground">
          The Oriented Hub supplies Nigerian universities, colleges of health technology, schools of nursing and
          polytechnics with NUC-compliant accreditation textbooks, laboratory equipment, medical equipment and hospital
          consumables. Submit your requirement list below and our procurement desk returns a formal quotation and
          proforma invoice with your institutional discount applied.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FileSpreadsheet, title: "Formal quotations", text: "Proforma invoice, TIN and full company details for your bursary." },
          { icon: BadgePercent, title: "Institutional discounts", text: "Tiered pricing that scales with the order value." },
          { icon: Truck, title: "Nationwide delivery", text: "Delivery to all 36 states and the FCT, with campus offloading." },
          { icon: ShieldCheck, title: "Accreditation ready", text: "Titles and editions matched to current NUC BMAS requirements." },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <f.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 text-sm font-semibold">{f.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Bulk pricing & institutional discounts</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Discounts are applied on the quoted order value. Final pricing depends on titles, editions, quantities and
          delivery location, and is confirmed on your proforma invoice.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.range} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Order value</p>
              <p className="mt-1 font-semibold">{t.range}</p>
              <p className="mt-3 font-display text-2xl text-primary">{t.discount}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t.note}</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• Payment by bank transfer to our corporate account, or on approved institutional purchase order.</li>
          <li>• Part-payment plans available for accreditation and resource-verification deadlines.</li>
          <li>• Free delivery on qualifying bulk orders; logistics quoted separately for equipment.</li>
          <li>• Dedicated account officer for procurement officers, HODs and bursary staff.</li>
        </ul>
      </section>

      {tracking && (
        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-semibold">Request received — reference {tracking}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Keep this reference. You can check progress on the{" "}
            <Link to="/track" className="font-semibold text-primary underline">
              order tracking page
            </Link>{" "}
            using this reference and the WhatsApp number you supplied.
          </p>
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Request a bulk quotation</h2>
        <form onSubmit={onSubmit} className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Institution name<span className="text-destructive"> *</span></span>
                <input required maxLength={200} value={form.institution} onChange={set("institution")} className={inputCls} placeholder="e.g. Osun State University" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Contact person<span className="text-destructive"> *</span></span>
                <input required maxLength={120} value={form.contactName} onChange={set("contactName")} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Role / department</span>
                <input maxLength={120} value={form.role} onChange={set("role")} className={inputCls} placeholder="Procurement Officer, HOD Nursing…" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">WhatsApp number<span className="text-destructive"> *</span></span>
                <input required type="tel" maxLength={20} value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+234 813 654 8965" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Official email</span>
                <input type="email" maxLength={160} value={form.email} onChange={set("email")} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Supply category<span className="text-destructive"> *</span></span>
                <select value={form.category} onChange={set("category")} className={inputCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">Delivery address<span className="text-destructive"> *</span></span>
              <input required maxLength={300} value={form.address} onChange={set("address")} className={inputCls} placeholder="Campus, faculty/department, city, state" />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Requirement list<span className="text-destructive"> *</span></span>
              <textarea
                required
                rows={8}
                maxLength={3000}
                value={form.items}
                onChange={set("items")}
                className={inputCls}
                placeholder={"Paste your accreditation or requisition list, e.g.\n30 × Brunner & Suddarth's Textbook of Medical-Surgical Nursing (16th Ed)\n20 × Robbins Basic Pathology (11th Ed)\n5 × Binocular microscope\n10 packs × Nitrile gloves (medium)"}
              />
              <span className="mt-1 block text-xs text-muted-foreground">{form.items.length}/3000 characters</span>
            </label>

            <section aria-labelledby="procurement-match-heading" className="rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <h3 id="procurement-match-heading" className="font-semibold">Find matching catalog products</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get suggestions from your requirement list. Confirm editions and specifications with our procurement team before purchase.
                  </p>
                  <button
                    type="button"
                    onClick={findMatches}
                    disabled={matching || catalogLoading || form.items.trim().length < 3}
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {matching ? "Finding matches…" : catalogLoading ? "Loading catalog…" : "Suggest matching products"}
                  </button>
                </div>
              </div>

              {matchError && <p role="status" className="mt-4 text-sm text-muted-foreground">{matchError}</p>}
              {clarification && recommendations.length > 0 && (
                <p role="status" className="mt-4 text-sm text-muted-foreground">{clarification}</p>
              )}
              {recommendations.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-semibold">Review suggested products</p>
                  <ul className="mt-3 divide-y divide-border">
                    {recommendations.map((item) => {
                      const product = catalogProducts.find((candidate) => candidate.id === item.productId);
                      if (!product) return null;
                      return (
                        <li key={item.productId} className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_110px] sm:items-start">
                          <label className="flex min-w-0 items-start gap-3">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={(event) => setRecommendations((current) => current.map((suggestion) =>
                                suggestion.productId === item.productId ? { ...suggestion, selected: event.target.checked } : suggestion,
                              ))}
                              className="mt-1 h-4 w-4 shrink-0 accent-primary"
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold">{product.name}</span>
                              <span className="mt-1 block text-xs text-muted-foreground">{item.reason}</span>
                            </span>
                          </label>
                          <label className="flex items-center gap-2 pl-7 text-sm sm:pl-0">
                            <span className="text-muted-foreground">Qty</span>
                            <input
                              type="number"
                              min={1}
                              max={1000}
                              step={1}
                              inputMode="numeric"
                              aria-label={`Quantity for ${product.name}`}
                              value={item.quantity}
                              onChange={(event) => {
                                const quantity = Number(event.target.value);
                                setRecommendations((current) => current.map((suggestion) =>
                                  suggestion.productId === item.productId
                                    ? { ...suggestion, quantity: Number.isInteger(quantity) ? Math.max(1, Math.min(1000, quantity)) : 1 }
                                    : suggestion,
                                ));
                              }}
                              className="w-20 rounded-md border border-input bg-background px-2 py-2 text-sm"
                            />
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={addMatchesToRequest}
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    Add selected to requirement list
                  </button>
                  <p className="mt-2 text-xs text-muted-foreground">Suggestions are not a final quote or confirmation of stock. Your original request stays in the list for review.</p>
                </div>
              )}
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">Indicative budget</span>
                <input maxLength={120} value={form.budget} onChange={set("budget")} className={inputCls} placeholder="e.g. ₦4,000,000" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Required by</span>
                <input maxLength={60} value={form.deadline} onChange={set("deadline")} className={inputCls} placeholder="e.g. Before accreditation on 12 Oct" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold">Additional notes</span>
              <textarea rows={3} maxLength={800} value={form.notes} onChange={set("notes")} className={inputCls} placeholder="Purchase order number, bursary requirements, invoice details…" />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit bulk order request"}
            </button>
            <p className="text-xs text-muted-foreground">
              Your request is saved to our procurement desk, emailed to our office inbox and opened in WhatsApp so you
              can send it instantly.
            </p>
          </div>

          <aside className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4 text-primary" /> Procurement desk</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <span>
                  <a className="hover:text-primary" href={waLink("Hello Oriented Hub, I am contacting you about an institutional bulk order.", WHATSAPP_PRIMARY)}>08136548965</a>
                  {" · "}
                  <a className="hover:text-primary" href={waLink("Hello Oriented Hub, I am contacting you about an institutional bulk order.", WHATSAPP_ALT)}>09064007879</a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <a className="hover:text-primary break-all" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{ADDRESS}</span>
              </li>
            </ul>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
              Need the titles first? Browse the{" "}
              <Link to="/nuc-accreditation-textbooks-supplier" className="font-semibold text-primary hover:underline">
                NUC accreditation textbook list
              </Link>{" "}
              or the full{" "}
              <Link to="/shop" className="font-semibold text-primary hover:underline">shop</Link>.
            </div>
          </aside>
        </form>
      </section>
    </div>
  );
}
