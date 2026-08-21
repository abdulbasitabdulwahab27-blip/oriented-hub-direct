import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServicesAndProducts } from "@/components/ServicesAndProducts";
import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, WHATSAPP_UK, waLink } from "@/lib/whatsapp";

export interface SeoLandingSection {
  title: string;
  body: string;
  bullets?: string[];
}

/**
 * Long-form SEO / GEO landing page: H1, direct answer block, H2 sections,
 * FAQ block and internal links. Used by the dedicated supplier pages.
 */
export function SeoLandingPage({
  breadcrumb,
  eyebrow,
  h1,
  answer,
  sections,
  faqs,
  related = [],
}: {
  breadcrumb: { name: string; path: string }[];
  eyebrow: string;
  h1: string;
  answer: string;
  sections: SeoLandingSection[];
  faqs: { q: string; a: string }[];
  related?: { name: string; path: string }[];
}) {
  return (
    <div>
      <section className="bg-gradient-hero">
        <div className="container-page py-12 md:py-16">
          <Breadcrumbs items={breadcrumb} />
          <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</div>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight sm:text-5xl">{h1}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{answer}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={waLink(`Hello Oriented Hub, I would like a quotation. Page: ${h1}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
            >
              Request a Quotation
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-background px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Browse Shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ServicesAndProducts path={breadcrumb[breadcrumb.length - 1]?.path ?? ""} />

      <section className="container-page py-12 md:py-16">
        <div className="max-w-3xl space-y-9">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-semibold sm:text-2xl">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">Frequently asked questions</h2>
          <dl className="mt-4 space-y-5">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <dt className="font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 grid max-w-3xl gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Call / WhatsApp</div>
            <div className="font-semibold">+{WHATSAPP_PRIMARY}</div>
            <div className="text-xs text-muted-foreground">+{WHATSAPP_ALT}</div>
            <div className="text-xs text-muted-foreground">UK: +{WHATSAPP_UK}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
            <a href={`mailto:${EMAIL}`} className="font-semibold break-all hover:text-primary">{EMAIL}</a>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Head Office</div>
            <div className="text-sm font-semibold">{ADDRESS}</div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12 max-w-3xl">
            <h2 className="font-display text-xl font-semibold">Explore related supplies</h2>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {related.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path as never}
                    className="inline-block rounded-full border border-primary/20 bg-background px-4 py-2 font-medium text-primary hover:bg-primary/5"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
