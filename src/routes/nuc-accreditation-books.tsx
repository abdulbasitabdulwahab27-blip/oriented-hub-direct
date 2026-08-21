import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/SeoLandingPage";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  {
    q: "Where can I buy NUC accreditation books in Nigeria?",
    a: "The Oriented Hub supplies NUC accreditation books nationwide from Osogbo, Osun State. Send your departmental booklist by WhatsApp (+234 813 654 8965) or email and you receive a written quotation with availability and delivery timelines.",
  },
  {
    q: "Do you supply books for polytechnic (NBTE) and College of Education (NCCE) accreditation?",
    a: "Yes. Alongside NUC BMAS lists, we supply booklists for polytechnic NBTE accreditation and College of Education NCCE accreditation, plus nursing and health-college resource verification lists.",
  },
  {
    q: "Can you supply against a full departmental booklist?",
    a: "Yes. Send the list as it appears in your accreditation document. We quote title by title, flag out-of-print titles with acceptable current editions, and supply in one consolidated delivery.",
  },
  {
    q: "How long does supply take before an accreditation visit?",
    a: "In-stock titles ship within a few working days. Imported or reprint titles depend on lead time, so we advise sending your list as early as possible before the panel visit date.",
  },
  {
    q: "Are the books physical copies?",
    a: "Yes. We supply authentic printed physical books sourced from authorised distributors and publishers. We do not sell PDFs or scanned copies.",
  },
];

export const Route = createFileRoute("/nuc-accreditation-books")({
  head: () => ({
    meta: pageMeta({
      title: "Where to Buy NUC Accreditation Books in Nigeria | The Oriented Hub",
      description:
        "Buy NUC accreditation books in Nigeria. The Oriented Hub supplies BMAS-compliant university, polytechnic and college accreditation textbooks in bulk, with nationwide delivery. Call 08136548965.",
      path: "/nuc-accreditation-books",
    }),
    links: canonicalLink("/nuc-accreditation-books"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "NUC Accreditation Books", path: "/nuc-accreditation-books" },
          ]),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoLandingPage
      breadcrumb={[
        { name: "Home", path: "/" },
        { name: "NUC Accreditation Books", path: "/nuc-accreditation-books" },
      ]}
      eyebrow="Accreditation supply"
      h1="Where to Buy NUC Accreditation Books in Nigeria"
      answer="The Oriented Hub is a trusted supplier of NUC accreditation books in Nigeria. From our base at 15, Oke-Fia Street, Osogbo, Osun State, we supply BMAS-compliant departmental booklists to universities, polytechnics, colleges of education and colleges of health across all 36 states and the FCT, with worldwide shipping available."
      sections={[
        {
          title: "Who we supply accreditation books to",
          body: "We work directly with heads of department, faculty librarians, accreditation committees and procurement officers preparing for resource verification.",
          bullets: [
            "Universities preparing for NUC programme accreditation and resource verification",
            "Polytechnics preparing for NBTE accreditation",
            "Colleges of education preparing for NCCE accreditation",
            "Schools of nursing, midwifery and health technology",
            "University and faculty libraries restocking core reading lists",
          ],
        },
        {
          title: "Programmes and faculties covered",
          body: "Our accreditation booklists span health sciences, engineering, natural sciences, management and social sciences.",
          bullets: [
            "Medicine and Surgery, Nursing Science, Pharmacy, Medical Laboratory Science, Public Health, Physiotherapy",
            "Civil, Mechanical, Electrical/Electronics, Chemical, Computer and Agricultural Engineering",
            "Biology, Chemistry, Physics, Biochemistry, Microbiology, Mathematics, Computer Science",
            "Accounting, Business Administration, Economics, Mass Communication, Political Science, Law",
          ],
        },
        {
          title: "How the process works",
          body: "Send your booklist exactly as written in the accreditation document. We check availability title by title, confirm the current edition where a listed edition is out of print, issue a written quotation with unit and total pricing, then deliver in one consolidated shipment with an invoice suitable for institutional records.",
        },
        {
          title: "Why institutions choose The Oriented Hub",
          body: "We are a physical bookshop and supply house, not a drop-shipper. Titles are sourced from authorised distributors and publishers, quoted in writing, and delivered nationwide against accreditation deadlines.",
          bullets: [
            "Authentic printed copies only — never PDFs or scanned reprints",
            "Institutional pricing on bulk and departmental orders",
            "Written quotations and invoices for procurement records",
            "Nationwide delivery to all 36 states and the FCT",
          ],
        },
        {
          title: "Request your accreditation quotation",
          body: "Call or WhatsApp 08136548965 or 09064007879, email Orientedbanque@outlook.com, or visit 15, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Osun State. Attach your booklist and we respond with a full quotation.",
        },
      ]}
      faqs={faqs}
      related={[
        { name: "Academic Books", path: "/books" },
        { name: "NUC Textbooks", path: "/nuc-textbooks" },
        { name: "Medical Textbooks Supplier", path: "/medical-textbooks-supplier" },
        { name: "Laboratory Equipment", path: "/laboratory-equipment" },
        { name: "Institutional Procurement", path: "/procurement" },
      ]}
    />
  );
}
