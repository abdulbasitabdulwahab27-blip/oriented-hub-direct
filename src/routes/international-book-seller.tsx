import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/international-book-seller")({
  head: () => ({
    meta: [
      { title: "International Book Seller | Engineering & Academic Textbooks | The Oriented Hub" },
      { name: "description", content: "International book seller supplying Engineering and academic textbooks worldwide to students, lecturers, libraries and institutions. Call +234 813 654 8965." },
      { property: "og:title", content: "International Book Seller | The Oriented Hub" },
      { property: "og:description", content: "Engineering and academic textbooks shipped to USA, Canada, UK, Europe, Africa and Asia." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.theorientedhub.com/international-book-seller" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.theorientedhub.com/international-book-seller" }],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoInfoPage
      eyebrow="International books"
      title="International Book Seller"
      intro="Engineering and academic textbooks sourced from international publishers and delivered to readers and institutions across the world."
      paragraphs={[
        "As an international book seller, The Oriented Hub sources titles from leading global publishers and delivers them to students, lecturers, researchers, libraries and corporate training centres. Our Engineering catalogue spans civil, mechanical, electrical and electronic, chemical, petroleum, computer, mechatronics and agricultural engineering, with core texts in engineering mathematics, thermodynamics, fluid mechanics, strength of materials, circuit theory, control systems, structural analysis, surveying and engineering drawing.",
        "Our wider academic range covers computer science and data science, mathematics and statistics, physics, chemistry and biology, economics and econometrics, accounting and finance, business and management, law, education, agriculture and the social sciences. We handle out-of-catalogue requests too: send an ISBN or a full reading list and we will locate the title, confirm the edition and quote you a delivered price.",
        "Orders are packed for safe international transit and shipped through trusted courier partners with tracking provided. We supply single copies to individual readers and bulk consignments to universities, colleges, bookshops and libraries, with institutional pricing on volume orders.",
      ]}
    />
  );
}
