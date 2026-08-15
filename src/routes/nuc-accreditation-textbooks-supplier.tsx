import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/nuc-accreditation-textbooks-supplier")({
  head: () => ({
    meta: [
      { title: "NUC Accreditation Textbooks Supplier | The Oriented Hub | Worldwide Shipping" },
      { name: "description", content: "Supplier of NUC accreditation textbooks for all courses — programme-based booklists for universities, polytechnics and colleges. Worldwide shipping. Call +234 813 654 8965." },
      { property: "og:title", content: "NUC Accreditation Textbooks Supplier | The Oriented Hub" },
      { property: "og:description", content: "Complete NUC accreditation booklists supplied to universities and colleges worldwide." },
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
      eyebrow="NUC accreditation"
      title="NUC Accreditation Textbooks Supplier"
      intro="Complete, programme-specific booklists that help universities, polytechnics and colleges meet accreditation library requirements on time."
      paragraphs={[
        "The Oriented Hub supplies NUC accreditation textbooks for all courses and faculties. Accreditation panels expect current-edition, discipline-specific titles in adequate copies, and we help departments meet that standard for Medicine and Surgery, Nursing Science, Pharmacy, Medical Laboratory Science, Physiotherapy, Public Health, Anatomy and Physiology, Law, Education, Engineering, Sciences, Agriculture, Management and the Social Sciences.",
        "Send us your departmental booklist or NUC benchmark document and our team returns an itemised quotation showing title, author, edition, ISBN, quantity, unit price and delivery timeline. Where a listed edition is out of print, we advise on the accepted current edition so your submission is not queried. We can also supply accession-ready copies with invoices and delivery notes formatted for library and bursary records.",
        "We understand accreditation deadlines. Our procurement desk prioritises accreditation orders, tracks each title to delivery and keeps your contact person updated throughout. Institutional discounts apply on multi-copy and multi-department orders, and part-supply schedules can be arranged where budgets are released in tranches.",
      ]}
    />
  );
}
