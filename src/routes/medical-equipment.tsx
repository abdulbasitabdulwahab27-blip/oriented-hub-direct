import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  { q: "What medical equipment do you supply?", a: "Diagnostic instruments, patient monitoring devices, hospital furniture, anatomical models, clinical simulators, mobility aids and first aid equipment." },
  { q: "Do you deliver medical equipment across Nigeria?", a: "Yes. The Oriented Hub delivers medical equipment to hospitals, clinics and schools across Nigeria, with worldwide shipping available." },
  { q: "Can hospitals request an institutional quotation?", a: "Yes. Send your equipment list and we will issue a written quotation with lead times and bulk pricing." },
];

export const Route = createFileRoute("/medical-equipment")({
  head: () => ({
    meta: pageMeta({
      title: "Medical Equipment Supplier in Nigeria | The Oriented Hub",
      description:
        "The Oriented Hub supplies medical equipment in Nigeria — diagnostic instruments, patient monitors, hospital furniture, anatomical models and clinical simulators. Nationwide delivery.",
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
      heading="Medical Equipment"
      summary="The Oriented Hub is a medical equipment supplier serving hospitals, clinics, schools of nursing and universities across Nigeria. We supply diagnostic tools, patient monitoring devices, hospital furniture, anatomical models and clinical simulators."
      sections={[
        { title: "Equipment for hospitals and clinics", body: "Diagnostic instruments, patient monitoring devices, sterilisation equipment, examination couches, hospital beds, wheelchairs and mobility aids, and first aid equipment." },
        { title: "Teaching and simulation equipment", body: "Anatomical charts and models, skeletons, nursing patient simulators and demonstration models for schools of nursing, medical schools and accreditation exercises." },
        { title: "Procurement support", body: "We supply against tender lists and accreditation requirements, issue written quotations, and deliver nationwide with international shipping on request." },
      ]}
      faqs={faqs}
    />
  );
}
