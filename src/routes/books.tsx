import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  { q: "Do you sell PDF books?", a: "No. The Oriented Hub sells physical printed books only. We do not sell PDFs or ebooks." },
  { q: "Do you deliver books nationwide?", a: "Yes. The Oriented Hub delivers academic books across Nigeria, and ships worldwide on request." },
  { q: "Do you supply WAEC and JAMB textbooks?", a: "Yes. We supply WAEC textbooks, JAMB textbooks, university textbooks, medical books, nursing books, science, management and social science titles." },
  { q: "Can schools order in bulk?", a: "Yes. Schools, universities, bookshops and libraries can request institutional pricing for bulk book orders." },
];

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: pageMeta({
      title: "Academic Books in Nigeria | WAEC, JAMB, Medical & Nursing Textbooks",
      description:
        "Buy authentic physical academic books in Nigeria — WAEC and JAMB textbooks, university, medical, nursing, science, management and social science books. Nationwide delivery.",
      path: "/books",
    }),
    links: canonicalLink("/books"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: "Books", path: "/books" }])) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  return (
    <CategoryView
      slug="books"
      heading="Academic Books in Nigeria"
      summary="The Oriented Hub supplies authentic physical academic books across Nigeria: WAEC textbooks, JAMB textbooks, university textbooks, medical books, nursing books, science, management and social science titles. We sell printed books only — no PDFs."
      sections={[
        { title: "What books do we supply?", body: "Our catalogue covers secondary school and exam preparation (WAEC, JAMB), university and professional programmes, medicine, nursing and midwifery, law, engineering, sciences, management and social sciences." },
        { title: "Physical books only", body: "Every title listed is a printed physical copy sourced from authorised distributors and publishers. The Oriented Hub does not sell PDFs, ebooks or scanned copies." },
        { title: "Bulk and institutional orders", body: "Schools, universities, schools of nursing, bookshops and libraries can send a title list for a written institutional quotation, including NUC accreditation textbook lists." },
      ]}
      faqs={faqs}
    />
  );
}
