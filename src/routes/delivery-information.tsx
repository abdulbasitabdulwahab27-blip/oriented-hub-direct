import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";
import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, WHATSAPP_UK, waLink } from "@/lib/whatsapp";

const faqs = [
  { q: "Do you deliver nationwide?", a: "Yes. The Oriented Hub delivers across Nigeria — all 36 states and the FCT." },
  { q: "Do you ship internationally?", a: "Yes. We ship worldwide to the USA, Canada, UK, Europe, Africa and Asia on request." },
  { q: "How long does delivery take?", a: "Delivery within Nigeria typically takes 2–5 working days depending on your location and the size of the order. International shipping timelines are confirmed at the point of order." },
  { q: "How much does delivery cost?", a: "Delivery fees depend on your location, the weight of the order and the delivery method. Your fee is confirmed in writing before you pay." },
];

export const Route = createFileRoute("/delivery-information")({
  head: () => ({
    meta: pageMeta({
      title: "Delivery Information | Nationwide Delivery Across Nigeria",
      description:
        "How The Oriented Hub delivers books, medical equipment, laboratory equipment and hospital consumables across Nigeria, with worldwide shipping available. Timelines, fees and order steps.",
      path: "/delivery-information",
    }),
    links: canonicalLink("/delivery-information"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Delivery Information", path: "/delivery-information" }])) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Delivery Information", path: "/delivery-information" }]} />
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Delivery Information</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The Oriented Hub delivers across Nigeria — all 36 states and the FCT — and ships worldwide on request. Orders are confirmed in writing before payment, and delivery within Nigeria typically takes 2–5 working days.
          </p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16 max-w-3xl space-y-8">
        <div>
          <h2 className="font-display text-xl font-semibold">Where we deliver</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            We deliver to homes, schools, hospitals, clinics, universities and procurement offices in every state of Nigeria. International orders are shipped to the USA, Canada, UK, Europe, Africa and Asia.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Delivery timelines</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Within Lagos, Osogbo and major cities, delivery is usually 2–3 working days. Other locations in Nigeria typically take 3–5 working days. Large equipment orders and international shipments are quoted with their own timeline.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Delivery fees</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Fees depend on destination, weight and delivery method. You receive the exact fee in writing before payment — there are no hidden charges added afterwards.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">How to place an order</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Add items to your cart and check out on this website, or send your list on WhatsApp. Institutions can request a written quotation and invoice for procurement approval.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={waLink("Hello Oriented Hub, I would like to ask about delivery.")} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">Ask about delivery</a>
            <Link to="/shop" className="inline-flex rounded-md border border-primary/20 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5">Browse the shop</Link>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 text-sm shadow-card">
          <h2 className="font-display text-base font-semibold">Contact us</h2>
          <p className="mt-2 text-muted-foreground">Call / WhatsApp: +{WHATSAPP_PRIMARY} · +{WHATSAPP_ALT} · UK: +{WHATSAPP_UK}</p>
          <p className="text-muted-foreground">Email: <a className="hover:text-primary" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <p className="text-muted-foreground">Head office: {ADDRESS}</p>
        </div>
      </section>
    </>
  );
}
