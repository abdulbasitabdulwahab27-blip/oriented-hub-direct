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
  const absImage = absUrl(image);
  if (absImage) {
    meta.push({ property: "og:image", content: absImage });
    meta.push({ name: "twitter:image", content: absImage });
    meta.push({ name: "twitter:image:alt", content: title });
  }
  return meta;
}

export const canonicalLink = (path: string) => [{ rel: "canonical", href: canonical(path) }];

/** Absolute URL for any site-relative asset path (required by schema.org & OG). */
export const absUrl = (src?: string) => {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
};

export type SchemaProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  description?: string;
  price?: number;
  currency?: string;
  stock?: number;
  trackStock?: boolean;
};

/** Google Merchant listings only accept InStock / OutOfStock here. */
const availabilityOf = (p: SchemaProduct) =>
  p.trackStock && (p.stock ?? 0) <= 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";

/** Price validity: rolling one year from build so Google never sees a stale offer. */
export const priceValidUntil = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

/** Complete Product schema: SKU, images, price, price validity, availability, shipping. */
export function productSchema(
  p: SchemaProduct,
  opts: {
    categoryName?: string;
    reviews?: { author: string; rating: number; body: string; date: string }[];
  } = {},
) {
  const path = `/product/${p.slug}`;
  const hasPrice = (p.price ?? 0) > 0;
  const reviews = opts.reviews ?? [];
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonical(path)}#product`,
    name: p.name,
    description: p.description,
    sku: p.id,
    mpn: p.slug,
    category: opts.categoryName ?? p.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    url: canonical(path),
    itemCondition: "https://schema.org/NewCondition",
  };
  // Google rejects an Offer without a price — omit the whole block when unpriced.
  if (hasPrice) {
    schema.offers = {
      "@type": "Offer",
      url: canonical(path),
      priceCurrency: p.currency ?? "NGN",
      price: Number(p.price).toFixed(2),
      priceValidUntil: priceValidUntil(),
      availability: availabilityOf(p),
      itemCondition: "https://schema.org/NewCondition",
      areaServed: { "@type": "Country", name: "Nigeria" },
      seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NG",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "NG" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      },
    };
  }
  const img = absUrl(p.image);
  if (img) schema.image = [img];

  if (reviews.length) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
      bestRating: "5",
      worstRating: "1",
    };
    schema.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date.slice(0, 10),
      reviewBody: r.body,
      reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5", worstRating: "1" },
    }));
  }
  return schema;
}

/** ItemList of products for a category/collection page. */
export function productListSchema(name: string, path: string, items: SchemaProduct[], categoryName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: canonical(path),
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(p, { categoryName }),
    })),
  };
}

/** Service offering schema used on supplier landing pages (mirrors GBP services). */
export function serviceSchema(args: { name: string; description: string; path: string; services: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: canonical(args.path),
    serviceType: args.name,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: [
      { "@type": "City", name: "Osogbo" },
      { "@type": "AdministrativeArea", name: "Osun State" },
      { "@type": "Country", name: "Nigeria" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${args.name} — services and products`,
      itemListElement: args.services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };
}
