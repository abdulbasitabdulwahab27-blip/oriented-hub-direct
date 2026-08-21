import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/** Links any SEO/category page to the homepage product catalog and bulk order form. */
export function CatalogCta({
  title = "See the full product catalog with photos and prices",
  text = "Browse current products and prices, then send your bulk list for a formal quotation.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-page pb-14 md:pb-20">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            hash="catalog"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
          >
            View catalog <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            hash="bulk-order"
            className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-background px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            Bulk order form
          </Link>
        </div>
      </div>
    </section>
  );
}
