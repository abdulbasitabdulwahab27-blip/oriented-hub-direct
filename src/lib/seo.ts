export const SITE_URL = "https://www.theorientedhub.com";
export const SITE_NAME = "The Oriented Hub";

export const canonical = (path: string) => `${SITE_URL}${path}`;

/** Pretty, keyword-friendly URL for each product category slug. */
export const CATEGORY_URLS: Record<string, string> = {
  books: "/books",
  "medical-equipment": "/medical-equipment",
  laboratory: "/laboratory-equipment",
  consumables: "/hospital-consumables",
  educational: "/educational-materials",
};

export const categoryUrl = (slug: string) => CATEGORY_URLS[slug] ?? `/category/${slug}`;

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Standard meta bundle for a page: title, description, OG and Twitter tags. */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
}) {
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: canonical(path) },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image && image.startsWith("http")) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  return meta;
}

export const canonicalLink = (path: string) => [{ rel: "canonical", href: canonical(path) }];
