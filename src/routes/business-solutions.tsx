import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  { q: "What business solutions does The Oriented Hub provide?", a: "Institutional procurement, bulk supply contracts, office and school stationery, professional supplies, equipment sourcing and after-sales support for organisations across Nigeria." },
  { q: "Do you supply organisations on invoice or purchase order?", a: "Yes. Hospitals, schools, universities, laboratories, NGOs and companies can order on official quotation, purchase order or invoice terms." },
  { q: "Can you source products that are not listed on the website?", a: "Yes. Send us your procurement list on WhatsApp or email and we will source, quote and deliver the items, including imported products." },
  { q: "Do you deliver nationwide?", a: "Yes. The Oriented Hub delivers nationwide across Nigeria, and ships internationally on request." },
];

const sections = [
  {
    title: "Institutional procurement and bulk supply",
    body: "We act as a single procurement partner for hospitals, clinics, laboratories, schools, universities, NGOs and companies. Send one consolidated list and receive one quotation, one invoice and one delivery — covering books, medical equipment, laboratory equipment, hospital consumables and educational materials.",
  },
  {
    title: "Sourcing and import services",
    body: "If an item is not in our catalogue, we source it. Our supplier network covers local manufacturers and international publishers and equipment makers, so specialised laboratory instruments, accreditation textbooks and clinical equipment can be imported to order.",
  },
  {
    title: "Professional and office supplies",
    body: "Office stationery, filing and record-keeping materials, hospital stationeries, printing consumables and everyday professional supplies for organisations that need a reliable, repeatable supply schedule.",
  },
  {
    title: "Accreditation and project support",
    body: "We support NUC, NUFHS and professional-board accreditation exercises with the exact textbook titles, laboratory instruments and teaching models required, delivered ahead of inspection deadlines.",
  },
];

export const Route = createFileRoute("/business-solutions")({
  head: () => ({
    meta: pageMeta({
      title: "Business Solutions & Institutional Procurement | The Oriented Hub",
      description:
        "Business solutions from The Oriented Hub: institutional procurement, bulk supply, sourcing and imports, professional supplies and accreditation support for organisations across Nigeria.",
      path: "/business-solutions",
    }),
    links: canonicalLink("/business-solutions"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Business Solutions", path: "/business-solutions" },
          ]),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: BusinessSolutionsPage,
});

function BusinessSolutionsPage() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-12 md:py-16">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "Business Solutions", path: "/business-solutions" },
            ]}
          />
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Business Solutions</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
            The Oriented Hub is a Nigerian supplier and procurement partner for hospitals, laboratories, schools,
            universities, businesses and professionals — combining books, medical equipment, laboratory equipment,
            hospital consumables and educational materials into one managed supply service with nationwide delivery.
          </p>
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <div className="max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="container-page pb-12">
        <h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-5xl">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="font-display text-xl font-semibold">Explore our categories</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/books" className="rounded-md border border-border px-4 py-2 hover:text-primary">Academic Books</Link>
          <Link to="/medical-equipment" className="rounded-md border border-border px-4 py-2 hover:text-primary">Medical Equipment</Link>
          <Link to="/laboratory-equipment" className="rounded-md border border-border px-4 py-2 hover:text-primary">Laboratory Equipment</Link>
          <Link to="/hospital-consumables" className="rounded-md border border-border px-4 py-2 hover:text-primary">Hospital Consumables</Link>
          <Link to="/educational-materials" className="rounded-md border border-border px-4 py-2 hover:text-primary">Educational Materials</Link>
          <Link to="/contact" className="rounded-md border border-border px-4 py-2 hover:text-primary">Request a quotation</Link>
        </div>
      </section>
    </>
  );
}
