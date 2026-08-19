import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  { q: "What medical equipment do you supply in Osun State?", a: "Hospital beds, patient trolleys, examination couches, IV stands, microscopes, centrifuges, autoclaves, incubators, BP monitors, stethoscopes, ECG machines, theatre tables, surgical lights and instrument sets." },
  { q: "Do you deliver medical equipment across Nigeria?", a: "Yes. The Oriented Hub delivers medical equipment to hospitals, clinics, laboratories and health centers across all 36 states and the FCT, with worldwide shipping available." },
  { q: "Can hospitals and institutions request a bulk quotation?", a: "Yes. We issue written quotations for hospital setup, NUC accreditation and institutional procurement, with competitive pricing and lead times." },
];

export const Route = createFileRoute("/medical-equipment")({
  head: () => ({
    meta: pageMeta({
      title: "Medical Equipment Supplier in Osun State, Nigeria | The Oriented Hub",
      description:
        "The Oriented Hub supplies quality medical equipment, hospital furniture and surgical instruments in Osun State, Nigeria. Nationwide delivery to hospitals, clinics and laboratories.",
      path: "/medical-equipment",
    }),
    links: canonicalLink("/medical-equipment"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: "Medical Equipment", path: "/medical-equipment" }])) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: MedicalEquipmentPage,
});

function MedicalEquipmentPage() {
  return (
    <CategoryView
      slug="medical-equipment"
      heading="Medical Equipment Supplier in Osun State, Nigeria"
      summary="The Oriented Hub is a trusted supplier of quality medical equipment and hospital furniture across Nigeria. Based in Osogbo, Osun State, we provide hospitals, clinics, laboratories, and health centers with durable, NUC-compliant medical equipment with nationwide delivery."
      sections={[
        { title: "Hospital Furniture", body: "Hospital beds, patient trolleys, examination couches, IV stands and other essential furniture for wards, clinics and emergency rooms." },
        { title: "Laboratory Equipment", body: "Microscopes, centrifuges, autoclaves, incubators and analytical instruments for hospital, school and research laboratories." },
        { title: "Diagnostic Equipment", body: "BP monitors, stethoscopes, ECG machines and other diagnostic tools for accurate patient assessment in any healthcare setting." },
        { title: "Surgical Instruments", body: "Theatre tables, surgical lights, instrument sets and operating-room accessories for hospitals and surgical centers." },
        { title: "Why healthcare facilities choose us", body: "Quality assurance: all equipment meets Nigerian healthcare standards. Bulk institutional supply: trusted for hospital setup and accreditation. Nationwide delivery: fast shipping to all 36 states and FCT. Competitive pricing: best rates for schools and hospitals." },
        { title: "Teaching and simulation equipment", body: "Anatomical charts and models, skeletons, nursing patient simulators and demonstration models for schools of nursing, medical schools and accreditation exercises." },
        { title: "Procurement support", body: "We supply against tender lists and accreditation requirements, issue written quotations, and deliver nationwide with international shipping on request." },
      ]}
      faqs={faqs}
    />
  );
}
