import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const faqs = [
  { q: "Why are prices shown as 'Price on Request'?", a: "Our prices depend on availability, supplier costs and procurement conditions. To give you the most accurate, up-to-date quote, we confirm pricing at the point of enquiry via WhatsApp or email." },
  { q: "Are your books physical or digital?", a: "All books on Oriented Hub are physical printed books. We do not sell PDFs or ebooks." },
  { q: "Do you deliver nationwide?", a: "Yes — we deliver to all 36 states and the FCT, and we also ship worldwide on request. Delivery timelines and fees are confirmed at checkout based on your location and order." },
  { q: "Can I place a bulk or institutional order?", a: "Absolutely. Hospitals, schools, universities and procurement officers are welcome. Send your list via WhatsApp or our contact form for a tailored quotation." },
  { q: "How do I place an order?", a: "Add items to your cart and proceed to checkout, or click 'Order on WhatsApp' on any product page. Our team will confirm pricing, availability and delivery." },
  { q: "What if a product I want isn't listed?", a: "Use our procurement service on the homepage or the contact page. Tell us what you need and we'll source it for you." },
  { q: "Are products authentic?", a: "Yes — we only source from authorised distributors and verified suppliers." },
  { q: "Do you sell PDF books?", a: "No. We sell physical books only." },
  { q: "What products do you sell?", a: "Academic books, medical equipment, laboratory equipment, hospital consumables and educational materials." },
  { q: "What is The Oriented Hub?", a: "The Oriented Hub is a Nigerian supplier of academic books, medical equipment, laboratory equipment, hospital consumables and educational materials, delivering across Nigeria." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: pageMeta({
      title: "FAQ | The Oriented Hub — Delivery, Orders & Products",
      description: "Answers to common questions about The Oriented Hub: nationwide delivery in Nigeria, physical books only, bulk orders, pricing and how to order.",
      path: "/faq",
    }),
    links: canonicalLink("/faq"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])) },
    ],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold">Frequently asked questions</h1>
        </div>
      </section>
      <section className="container-page py-12 md:py-16 max-w-3xl">
        <div className="space-y-3">
          {faqs.map((f, i) => (<Item key={i} q={f.q} a={f.a} />))}
        </div>
      </section>
    </>
  );
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold">
        <span>{q}</span>
        <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}
