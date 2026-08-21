import { createFileRoute } from "@tanstack/react-router";
import { products as staticProducts } from "@/lib/products";
import { gbpProfileFor } from "@/lib/gbp";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta, productListSchema, serviceSchema } from "@/lib/seo";

const faqs = [
  { q: "What hospital consumables do you supply?", a: "Gloves, syringes and needles, dressings, cotton wool, antiseptics, IV sets, sample containers, PPE, sharps disposal and hospital stationeries." },
  { q: "Do you supply consumables in bulk?", a: "Yes. Hospitals, clinics and health centres can order hospital consumables in bulk with institutional pricing." },
  { q: "Do you deliver across Nigeria?", a: "Yes. The Oriented Hub delivers hospital consumables nationwide across Nigeria." },
];

export const Route = createFileRoute("/hospital-consumables")({
  head: () => ({
    meta: pageMeta({
      title: "Hospital Consumables Supplier in Nigeria | The Oriented Hub",
      description:
        "Hospital consumables supplier in Nigeria: gloves, syringes, dressings, antiseptics, IV sets, PPE and hospital stationeries in bulk, with nationwide delivery.",
      path: "/hospital-consumables",
    }),
    links: canonicalLink("/hospital-consumables"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          productListSchema("Hospital Consumables", "/hospital-consumables", staticProducts.filter((p) => p.category === "consumables"), "Hospital Consumables"),
        ),
      },
      ...(gbpProfileFor("/hospital-consumables")
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                serviceSchema({
                  name: gbpProfileFor("/hospital-consumables")!.label,
                  description: gbpProfileFor("/hospital-consumables")!.description,
                  path: "/hospital-consumables",
                  services: gbpProfileFor("/hospital-consumables")!.services,
                }),
              ),
            },
          ]
        : []),
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: "Hospital Consumables", path: "/hospital-consumables" }])) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: HospitalConsumablesPage,
});

function HospitalConsumablesPage() {
  return (
    <CategoryView
      slug="consumables"
      heading="Hospital Consumables"
      summary="The Oriented Hub supplies hospital consumables and stationeries to hospitals, clinics and health centres across Nigeria — PPE, gloves, syringes, dressings, antiseptics, IV sets and record-keeping stationery."
      sections={[
        { title: "Daily-use clinical consumables", body: "Examination and surgical gloves, syringes and needles, cotton wool, gauze, bandages, plasters, antiseptic solutions and alcohol swabs." },
        { title: "Procedure and diagnostic supplies", body: "IV giving sets and cannulae, catheters, sample bottles, specimen containers, test strips, sharps containers and disposal bags." },
        { title: "Hospital stationeries", body: "Case note folders, patient record cards, registers, request forms and labels for reliable clinical documentation." },
      ]}
      faqs={faqs}
    />
  );
}
