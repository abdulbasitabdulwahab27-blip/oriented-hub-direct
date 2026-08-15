import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/medical-equipment-supplier")({
  head: () => ({
    meta: [
      { title: "Medical Equipment Supplier | The Oriented Hub | Worldwide Shipping" },
      { name: "description", content: "The Oriented Hub is a global medical equipment supplier — diagnostic devices, hospital equipment and clinical instruments shipped worldwide. Call +234 813 654 8965." },
      { property: "og:title", content: "Medical Equipment Supplier | The Oriented Hub" },
      { property: "og:description", content: "Global supplier of medical equipment with worldwide shipping to USA, Canada, UK, Europe, Africa and Asia." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.theorientedhub.com/medical-equipment-supplier" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.theorientedhub.com/medical-equipment-supplier" }],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoInfoPage
      eyebrow="Medical equipment"
      title="Medical Equipment Supplier"
      intro="The Oriented Hub supplies authentic, institution-grade medical equipment to hospitals, clinics, universities and private practitioners worldwide."
      paragraphs={[
        "The Oriented Hub is a trusted medical equipment supplier serving hospitals, teaching hospitals, primary health centres, clinics, nursing schools and private practitioners. Our catalogue covers diagnostic equipment such as stethoscopes, sphygmomanometers, pulse oximeters, thermometers, glucometers, ECG machines, patient monitors and ultrasound accessories, alongside ward and theatre equipment including examination couches, delivery beds, infant incubators, phototherapy units, suction machines, oxygen concentrators, nebulisers and surgical instrument sets.",
        "Every item we supply is sourced from authorised distributors and verified manufacturers, so you receive genuine products with proper documentation. We support both small retail purchases and large institutional procurement — including tender documentation, itemised quotations, installation guidance and after-sales support. Our procurement desk can also source specialised equipment on request when an item is not listed in our online shop.",
        "Whether you are equipping a new facility, replacing ageing devices, preparing for accreditation or restocking a department, our team will help you specify the right equipment at the right budget. Bulk and institutional discounts are available, and we provide careful export packaging so sensitive instruments arrive in perfect condition.",
      ]}
    />
  );
}
