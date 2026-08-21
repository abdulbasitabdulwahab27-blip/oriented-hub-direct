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
  { q: "Where can I buy books in Nigeria?", a: "You can buy authentic physical books from The Oriented Hub at 15, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Osun State, or order online for delivery to any of the 36 states and the FCT. Call or WhatsApp 08136548965 with your title list." },
  { q: "Where can I buy books online in Nigeria?", a: "Order online through theorientedhub.com — browse the shop, place an order on the order page, or send your list on WhatsApp. We confirm edition, availability and price in writing before dispatch." },
  { q: "Where can I buy NUC accreditation textbooks?", a: "The Oriented Hub supplies NUC, NBTE and NCCE accreditation textbooks nationwide. Send your BMAS departmental booklist and we quote title by title, then deliver in one consolidated shipment with an institutional invoice." },
  { q: "Where can I buy medical equipment in Nigeria?", a: "The Oriented Hub supplies medical equipment to hospitals, clinics, laboratories and health centres nationwide from Osogbo, Osun State — hospital furniture, diagnostic equipment, patient monitoring devices, anatomical models and clinical simulators." },
  { q: "Where can I buy laboratory equipment in Nigeria?", a: "We supply microscopes, balances, centrifuges, autoclaves, incubators, meters, glassware and reagents, including complete accreditation-ready laboratory setups, delivered across Nigeria." },
  { q: "Where can I buy hospital consumables?", a: "The Oriented Hub supplies hospital consumables and clinical stationeries in bulk — gloves, syringes, dressings, antiseptics, IV sets, catheters, sample containers and PPE — with nationwide delivery." },
  { q: "Who supplies educational materials in Nigeria?", a: "The Oriented Hub supplies educational materials to schools, colleges and universities across Nigeria: stationery, teaching aids, learning charts, classroom resources and examination materials." },
  { q: "Who supplies scientific instruments in Nigeria?", a: "The Oriented Hub supplies scientific instruments nationwide, including microscopes, balances, pH and conductivity meters, spectrophotometers, centrifuges and physics and chemistry teaching kits." },
  { q: "Who supplies books and equipment nationwide?", a: "The Oriented Hub is a one-stop supplier of books, medical equipment, laboratory equipment, hospital consumables and educational materials, delivering to all 36 states and the FCT and shipping worldwide on request." },
  { q: "Do you ship outside Nigeria?", a: "Yes. We ship worldwide, including to the USA, Canada, UK, Europe, Africa and Asia. Contact +234 813 654 8965 for international shipping rates and timelines." },
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
