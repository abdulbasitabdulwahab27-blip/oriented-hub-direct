import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  {
    q: "Who supplies scientific instruments in Nigeria?",
    a: "The Oriented Hub supplies scientific instruments across Nigeria from Osogbo, Osun State — microscopes, balances, meters, centrifuges, hotplates, glassware and measuring instruments for schools, universities, research institutes and industry.",
  },
  {
    q: "Do you supply complete school and university laboratories?",
    a: "Yes. We supply full laboratory setups against a specification or accreditation list, including instruments, glassware, reagents, furniture and safety equipment.",
  },
  {
    q: "Can I get a written quotation for a tender?",
    a: "Yes. Send your specification or tender list and we return a written, itemised quotation with brands, models, lead times and delivery terms.",
  },
  {
    q: "Do you deliver scientific instruments nationwide?",
    a: "Yes, to all 36 states and the FCT, with worldwide shipping available on request.",
  },
];

export const Route = createFileRoute("/scientific-instruments")({
  head: () => ({
    meta: pageMeta({
      title: "Scientific Instruments Supplier in Nigeria | The Oriented Hub",
      description:
        "Where to buy scientific instruments in Nigeria. The Oriented Hub supplies microscopes, balances, meters, centrifuges and measuring instruments to schools, universities and research labs nationwide.",
      path: "/scientific-instruments",
    }),
    links: canonicalLink("/scientific-instruments"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Scientific Instruments", path: "/scientific-instruments" },
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
        { name: "Scientific Instruments", path: "/scientific-instruments" },
      ]}
      eyebrow="Science & research supply"
      h1="Scientific Instruments Supplier in Nigeria"
      answer="The Oriented Hub is a trusted supplier of scientific instruments in Nigeria. Based at 15, Oke-Fia Street, Osogbo, Osun State, we supply measuring, analytical and teaching instruments to secondary schools, colleges, universities, research institutes, quality-control labs and industry across Nigeria, with worldwide shipping on request."
      sections={[
        {
          title: "Instruments we supply",
          body: "Our range covers everyday teaching instruments through to analytical laboratory equipment.",
          bullets: [
            "Microscopes: monocular, binocular, digital and stereo models",
            "Weighing and measurement: analytical and top-loading balances, thermometers, calipers, measuring cylinders",
            "Analytical and test instruments: pH meters, conductivity meters, spectrophotometers, colorimeters",
            "Sample handling: centrifuges, hotplates, magnetic stirrers, water baths, incubators, ovens, autoclaves",
            "Physics and chemistry teaching kits, optics sets, electricity kits and demonstration apparatus",
            "Laboratory glassware, plasticware, consumables and safety equipment",
          ],
        },
        {
          title: "Who we serve",
          body: "Secondary schools and colleges building science laboratories, universities and polytechnics equipping departments for accreditation, research institutes, hospital and diagnostic laboratories, water and food quality-control labs, and industrial process laboratories.",
        },
        {
          title: "Laboratory setup and specification support",
          body: "Send a specification, tender list or accreditation requirement and we return an itemised quotation with model options at different budget levels. For complete laboratory setups we can advise on layout, bench requirements, safety equipment and consumable stock.",
        },
        {
          title: "Why buy scientific instruments from The Oriented Hub",
          body: "We supply from authorised distributors, quote in writing, and stand behind what we deliver.",
          bullets: [
            "Authentic instruments with manufacturer documentation",
            "Institutional and bulk pricing for schools and universities",
            "Nationwide delivery to all 36 states and the FCT",
            "Worldwide shipping to the USA, Canada, UK, Europe, Africa and Asia",
          ],
        },
        {
          title: "Get a quotation",
          body: "Call or WhatsApp 08136548965 / 09064007879, email Orientedbanque@outlook.com, or visit 15, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Osun State.",
        },
      ]}
      faqs={faqs}
      related={[
        { name: "Laboratory Equipment", path: "/laboratory-equipment" },
        { name: "Medical Equipment", path: "/medical-equipment" },
        { name: "Surgical Instruments", path: "/surgical-instruments" },
        { name: "Educational Materials", path: "/educational-materials" },
        { name: "Institutional Procurement", path: "/procurement" },
      ]}
    />
  );
}
