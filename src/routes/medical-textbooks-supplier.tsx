import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/medical-textbooks-supplier")({
  head: () => ({
    meta: [
      { title: "Medical Textbooks Supplier | Medicine, Nursing, Pharmacy, Dentistry | The Oriented Hub" },
      { name: "description", content: "Supplier of Medicine, Nursing, Pharmacy and Dentistry textbooks — original editions for students, lecturers and libraries. Worldwide shipping. Call +234 813 654 8965." },
      { property: "og:title", content: "Medical Textbooks Supplier | The Oriented Hub" },
      { property: "og:description", content: "Original Medicine, Nursing, Pharmacy and Dentistry textbooks shipped worldwide." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.theorientedhub.com/medical-textbooks-supplier" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.theorientedhub.com/medical-textbooks-supplier" }],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoInfoPage
      eyebrow="Medical textbooks"
      title="Medical Textbooks Supplier"
      intro="Original, current-edition textbooks for Medicine, Nursing, Pharmacy, Dentistry and the allied health sciences."
      paragraphs={[
        "The Oriented Hub supplies medical textbooks for students, house officers, lecturers, hospital libraries and university departments. Our Medicine list covers anatomy, physiology, biochemistry, pathology, pharmacology, microbiology, internal medicine, surgery, obstetrics and gynaecology, paediatrics, community medicine and clinical methods — including widely prescribed titles such as Gray's and BD Chaurasia's Anatomy, Guyton and Sembulingam Physiology, Robbins Pathology, Hutchison's Clinical Methods, Macleod's Clinical Diagnosis and Obstetrics and Gynaecology by Ten Teachers.",
        "For Nursing and Midwifery we stock fundamentals of nursing, medical-surgical nursing, clinical nursing procedures, anatomy and physiology for nurses, comprehensive midwifery, community health nursing and psychiatric nursing texts. Pharmacy students will find pharmacology, pharmaceutics, pharmaceutical chemistry, pharmacognosy and clinical pharmacy titles, while our Dentistry range covers oral anatomy, oral pathology, operative dentistry, prosthodontics and oral surgery.",
        "Every book we sell is an original copy in the edition stated — no photocopies and no misleading listings. We fulfil single-copy orders for students and large multi-copy orders for schools of nursing, colleges of health technology and university libraries, and we can source any title not currently listed in our shop on request.",
      ]}
    />
  );
}
