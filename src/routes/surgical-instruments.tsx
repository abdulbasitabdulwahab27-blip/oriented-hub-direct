import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  {
    q: "Where can I buy surgical instruments in Nigeria?",
    a: "The Oriented Hub supplies surgical instruments across Nigeria from Osogbo, Osun State — instrument sets, theatre equipment, sterilisation equipment and surgical consumables for hospitals, clinics and teaching institutions.",
  },
  {
    q: "Do you supply complete theatre instrument sets?",
    a: "Yes. We supply general surgery, minor surgery, suture, dressing, delivery and dental sets, as well as individual instruments to complete an existing tray.",
  },
  {
    q: "Are the instruments stainless steel?",
    a: "Yes. We supply surgical-grade stainless steel instruments sourced from authorised distributors, with disposable single-use options where those are preferred.",
  },
  {
    q: "Can hospitals order in bulk?",
    a: "Yes. Hospitals, clinics, schools of nursing and teaching hospitals receive institutional pricing and a written quotation for bulk orders and theatre setup.",
  },
];

export const Route = createFileRoute("/surgical-instruments")({
  head: () => ({
    meta: pageMeta({
      title: "Surgical Instruments Supplier in Nigeria | The Oriented Hub",
      description:
        "Where to buy surgical instruments in Nigeria. The Oriented Hub supplies stainless steel instrument sets, theatre equipment and sterilisation supplies to hospitals and clinics nationwide.",
      path: "/surgical-instruments",
    }),
    links: canonicalLink("/surgical-instruments"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Surgical Instruments", path: "/surgical-instruments" },
          ]),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLandingPage
      breadcrumb={[
        { name: "Home", path: "/" },
        { name: "Surgical Instruments", path: "/surgical-instruments" },
      ]}
      eyebrow="Theatre & surgical supply"
      h1="Surgical Instruments Supplier in Nigeria"
      answer="The Oriented Hub is a trusted supplier of surgical instruments in Nigeria. From 15, Oke-Fia Street, Osogbo, Osun State, we supply surgical-grade instrument sets, theatre equipment, sterilisation equipment and surgical consumables to hospitals, clinics, health centres and teaching institutions nationwide."
      sections={[
        {
          title: "Instrument sets and single instruments",
          body: "We supply complete trays and individual replacement instruments.",
          bullets: [
            "General surgery and minor surgery sets",
            "Suture, dressing and wound-care sets",
            "Delivery and midwifery sets",
            "Dental and ENT instruments",
            "Forceps, scissors, scalpel handles, retractors, needle holders, clamps and probes",
          ],
        },
        {
          title: "Theatre equipment and sterilisation",
          body: "Operating tables, theatre lights, instrument trolleys, kidney dishes, drums and trays, plus autoclaves and sterilisers to keep instruments theatre-ready.",
        },
        {
          title: "Surgical consumables",
          body: "Sutures, surgical gloves, drapes, gowns, caps, masks, blades, gauze, bandages and antiseptics — supplied alongside instruments so a theatre can be stocked in one order.",
        },
        {
          title: "Who we supply",
          body: "General and specialist hospitals, private clinics, primary health centres, diagnostic centres, schools of nursing and midwifery, and teaching hospitals equipping skills laboratories.",
        },
        {
          title: "Quality, pricing and delivery",
          body: "Instruments are surgical-grade stainless steel sourced from authorised distributors, quoted in writing with clear lead times, and delivered to all 36 states and the FCT — with worldwide shipping available.",
        },
        {
          title: "Request a quotation",
          body: "Call or WhatsApp 08136548965 / 09064007879, email Orientedbanque@outlook.com, or visit 15, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Osun State.",
        },
      ]}
      faqs={faqs}
      related={[
        { name: "Medical Equipment", path: "/medical-equipment" },
        { name: "Hospital Consumables", path: "/hospital-consumables" },
        { name: "Laboratory Equipment", path: "/laboratory-equipment" },
        { name: "Scientific Instruments", path: "/scientific-instruments" },
        { name: "Institutional Procurement", path: "/procurement" },
      ]}
    />
  );
}
