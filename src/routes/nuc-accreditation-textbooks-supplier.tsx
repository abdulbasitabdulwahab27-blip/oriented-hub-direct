import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/nuc-accreditation-textbooks-supplier")({
  head: () => ({
    meta: [
      { title: "NUC Accreditation Textbooks Supplier in Nigeria | The Oriented Hub" },
      { name: "description", content: "Leading supplier of NUC approved accreditation textbooks for Nigerian universities, colleges of health and polytechnics. Full BMAS compliance, bulk supply, nationwide delivery. Call 08136548965." },
      { name: "keywords", content: "NUC accreditation textbooks, NUC BMAS books, Nigerian university accreditation books, college of health accreditation, polytechnic accreditation textbooks, textbook supplier Nigeria, Osogbo textbook supplier" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "NUC Accreditation Textbooks Supplier in Nigeria | The Oriented Hub" },
      { property: "og:description", content: "NUC approved accreditation textbooks for Nigerian universities, colleges and polytechnics. Full BMAS compliance, nationwide delivery." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.theorientedhub.com/nuc-accreditation-textbooks-supplier" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.theorientedhub.com/nuc-accreditation-textbooks-supplier" }],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoInfoPage
      eyebrow="NUC accreditation textbooks Nigeria"
      title="NUC Accreditation Textbooks Supplier in Nigeria"
      intro="The Oriented Hub is a leading supplier of NUC Approved Accreditation Textbooks for Nigerian Universities, Colleges of Health, and Polytechnics. Based in Osogbo, Osun State, we provide comprehensive textbook solutions to meet NUC BMAS requirements across all faculties with reliable nationwide delivery."
      paragraphs={[
        "The Oriented Hub is a leading supplier of NUC Approved Accreditation Textbooks for Nigerian Universities, Colleges of Health, and Polytechnics. Based in Osogbo, Osun State, we provide comprehensive textbook solutions to meet NUC BMAS requirements across all faculties with reliable nationwide delivery.",
        "Programs covered: Health Sciences — Medicine & Surgery, Nursing Science, Pharmacy, Medical Laboratory Science, Public Health; Engineering — Civil, Mechanical, Electrical/Electronics, Chemical, Computer Engineering; Natural Sciences — Biology, Chemistry, Physics, Biochemistry, Microbiology; Management & Social Sciences — Accounting, Business Administration, Economics, Mass Communication, Political Science.",
        "Why institutions choose us: full compliance — all textbooks meet current NUC BMAS standards; bulk supply — trusted for university accreditation and resource verification; competitive pricing — institutional and student discounts available; nationwide logistics — fast delivery to all 36 states and FCT; expert support — dedicated assistance for procurement officers.",
        "Serving universities and colleges across Osogbo, Osun State and Nigeria. Contact our procurement team: Phone 08136548965, 09064007879; Email Orientedbanque@outlook.com; Address 5, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Osun State; Website www.theorientedhub.com.",
      ]}
    />
  );
}
