import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";

const faqs = [
  { q: "What educational materials do you supply?", a: "Stationery, teaching aids, learning charts, classroom resources and school supplies for schools, colleges and universities." },
  { q: "Do you supply schools in bulk?", a: "Yes. Schools can request bulk pricing on educational materials and stationery." },
  { q: "Do you deliver nationwide?", a: "Yes. The Oriented Hub delivers educational materials across Nigeria." },
];

export const Route = createFileRoute("/educational-materials")({
  head: () => ({
    meta: pageMeta({
      title: "Educational Materials Supplier in Nigeria | The Oriented Hub",
      description:
        "Educational materials supplier in Nigeria: stationery, teaching aids, learning charts and classroom resources for schools, colleges and universities. Nationwide delivery.",
      path: "/educational-materials",
    }),
    links: canonicalLink("/educational-materials"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: "Educational Materials", path: "/educational-materials" }])) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
    ],
  }),
  component: EducationalMaterialsPage,
});

function EducationalMaterialsPage() {
  return (
    <CategoryView
      slug="educational"
      heading="Educational Materials"
      summary="The Oriented Hub supplies educational materials to schools, colleges and universities across Nigeria — stationery, teaching aids, learning charts and classroom resources."
      sections={[
        { title: "Classroom and teaching aids", body: "Learning charts, demonstration models, teaching aids and classroom resources that support practical teaching." },
        { title: "Stationery and school supplies", body: "Everyday stationery and school supplies for classrooms, administrative offices and examination periods." },
        { title: "Supplying schools", body: "Schools ordering for a full term or session can send a consolidated list for a bulk quotation and scheduled delivery." },
      ]}
      faqs={faqs}
    />
  );
}
