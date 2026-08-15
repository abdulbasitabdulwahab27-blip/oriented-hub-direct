import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  { q: "What laboratory equipment do you supply?", a: "Microscopes, laboratory glassware, measuring instruments, reagents, safety equipment and complete laboratory setups for schools, colleges and universities." },
  { q: "Do you set up school laboratories?", a: "Yes. We supply complete laboratory equipment lists for secondary schools, colleges and universities, including accreditation-ready setups." },
  { q: "Do you deliver laboratory equipment nationwide?", a: "Yes. The Oriented Hub delivers laboratory equipment across Nigeria, with worldwide shipping available." },
];

export const Route = createFileRoute("/laboratory-equipment")({
  head: () => ({
    meta: pageMeta({
      title: "Laboratory Equipment Supplier in Nigeria | The Oriented Hub",
      description:
        "Laboratory equipment supplier in Nigeria: microscopes, glassware, reagents, measuring instruments and complete lab setups for schools, colleges, universities and hospitals.",
      path: "/laboratory-equipment",
    }),
    links: canonicalLink("/laboratory-equipment"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: "Laboratory Equipment", path: "/laboratory-equipment" }])) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: LaboratoryEquipmentPage,
});

function LaboratoryEquipmentPage() {
  return (
    <CategoryView
      slug="laboratory"
      heading="Laboratory Equipment"
      summary="The Oriented Hub supplies laboratory equipment across Nigeria — microscopes, glassware, reagents, measuring instruments and safety equipment for schools, colleges, universities, research labs and hospitals."
      sections={[
        { title: "Core laboratory equipment", body: "Compound microscopes and prepared slides, beakers, flasks, measuring cylinders, pipettes, burettes, test tubes and racks, weighing balances, hot plates, thermometers and pH meters." },
        { title: "Safety and consumables", body: "Lab coats, gloves, goggles, first aid provision, reagent storage and everyday laboratory consumables to keep practical sessions running." },
        { title: "Accreditation-ready laboratories", body: "Departments preparing for NUC or professional accreditation can send their equipment list for a matched quotation, supplied alongside accreditation textbooks." },
      ]}
      faqs={faqs}
    />
  );
}
