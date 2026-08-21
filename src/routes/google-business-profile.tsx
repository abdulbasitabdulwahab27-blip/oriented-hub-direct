import { createFileRoute } from "@tanstack/react-router";
import { canonicalLink, canonical, SITE_URL } from "@/lib/seo";
import { GBP_ATTRIBUTES, GBP_BUSINESS, GBP_CATEGORIES, GBP_FAQS, GBP_PAGE_PROFILES } from "@/lib/gbp";

export const Route = createFileRoute("/google-business-profile")({
  head: () => ({
    meta: [
      { title: "Google Business Profile Setup | The Oriented Hub" },
      {
        name: "description",
        content:
          "Internal reference sheet for optimising The Oriented Hub's Google Business Profile: categories, services, products, attributes and Q&A.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Google Business Profile Setup | The Oriented Hub" },
      { property: "og:description", content: "Categories, services, products and Q&A for the Google Business Profile." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/google-business-profile") },
      { name: "twitter:card", content: "summary" },
    ],
    links: canonicalLink("/google-business-profile"),
  }),
  component: GbpPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-[200px_1fr]">
      <dt className="text-sm font-semibold">{label}</dt>
      <dd className="text-sm text-muted-foreground break-words">{value}</dd>
    </div>
  );
}

function GbpPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Google Business Profile optimisation sheet</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Copy each field below into your Google Business Profile at business.google.com. Everything here matches the
        website content and schema exactly, which is what Google uses to confirm your business is consistent and
        trustworthy.
      </p>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold">1. Business information</h2>
        <dl className="mt-4">
          <Row label="Business name" value={GBP_BUSINESS.name} />
          <Row label="Also known as" value={GBP_BUSINESS.alternateName} />
          <Row
            label="Address"
            value={`${GBP_BUSINESS.addressLines.street}, ${GBP_BUSINESS.addressLines.city}, ${GBP_BUSINESS.addressLines.region} ${GBP_BUSINESS.addressLines.postalCode}, ${GBP_BUSINESS.addressLines.country}`}
          />
          <Row label="Primary phone" value={`${GBP_BUSINESS.phonePrimary} (WhatsApp)`} />
          <Row label="Additional phone" value={`${GBP_BUSINESS.phoneAlt} (WhatsApp)`} />
          <Row label="International phone" value={GBP_BUSINESS.phoneUk} />
          <Row label="Email" value={GBP_BUSINESS.email} />
          <Row label="Website" value={GBP_BUSINESS.website} />
          <Row label="Opening hours" value={GBP_BUSINESS.hours} />
          <Row label="Service area" value={GBP_BUSINESS.serviceArea} />
        </dl>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold">2. Categories</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Primary category: <strong>{GBP_CATEGORIES.primary}</strong>
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {GBP_CATEGORIES.secondary.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold">3. Attributes to switch on</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {GBP_ATTRIBUTES.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">4. Services &amp; products per landing page</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Create one service group per row, then add the products under the Products tab. Set each product's "Learn
          more" link to the matching page URL so Google connects the listing to the right landing page.
        </p>
        <div className="mt-6 space-y-6">
          {GBP_PAGE_PROFILES.map((p) => (
            <div key={p.path} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold">{p.label}</h3>
              <p className="mt-1 text-xs font-semibold text-primary break-all">
                {SITE_URL}
                {p.path}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold">Services</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {p.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Products</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {p.products.map((pr) => (
                      <li key={pr.name}>
                        {pr.name} — <span className="font-semibold text-primary">{pr.priceNote}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold">5. Questions &amp; answers to post</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Post these in the Q&amp;A tab of your profile (ask the question from another Google account, then answer it as
          the business owner).
        </p>
        <dl className="mt-4 space-y-5">
          {GBP_FAQS.map((f) => (
            <div key={f.q} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold">6. Ongoing routine</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Post a weekly update (new stock, accreditation supply, price offers) with a photo and a link to the matching page.</li>
          <li>Upload at least 10 real photos: shopfront and signage, shelves, medical equipment, books, delivery packaging.</li>
          <li>Ask every completed customer for a review using the "Ask for review" button in the admin orders list.</li>
          <li>Reply to every Google review within 48 hours — Google rewards response rate.</li>
          <li>Keep the phone numbers, address and hours identical everywhere online (website, WhatsApp, directories).</li>
        </ul>
      </section>
    </div>
  );
}
