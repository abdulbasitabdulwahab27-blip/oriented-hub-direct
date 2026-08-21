import { Link } from "@tanstack/react-router";
import { Star, Quote, BadgeCheck } from "lucide-react";
import type { PublicReview } from "@/lib/reviews";
import { averageRating, reviewRequestPath } from "@/lib/reviews";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-4 w-4 ${n <= value ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
      ))}
    </div>
  );
}

/** Reviews for a single product, plus a prompt to add one. */
export function ProductReviews({
  reviews,
  productName,
  productSlug,
}: {
  reviews: PublicReview[];
  productName: string;
  productSlug: string;
}) {
  const avg = averageRating(reviews);
  return (
    <section className="mt-14" id="reviews">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Customer reviews</h2>
        <Link
          to={reviewRequestPath({ product: productName, productSlug })}
          className="rounded-md border border-primary/25 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
        >
          Write a review
        </Link>
      </div>

      {avg !== null && (
        <div className="mt-3 flex items-center gap-3">
          <Stars value={Math.round(avg)} />
          <span className="text-sm text-muted-foreground">
            {avg} average from {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No reviews for this item yet. If you have bought it, be the first to share your experience.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <Quote className="h-4 w-4 text-primary" />
              <Stars value={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                {r.customer_name}
                {r.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    <BadgeCheck className="h-3 w-3" /> Verified purchase
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{r.city || "Nigeria"}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/** Compact testimonial strip for landing pages. */
export function TestimonialStrip({ reviews }: { reviews: PublicReview[] }) {
  if (!reviews.length) return null;
  return (
    <section className="container-page pb-14">
      <h2 className="font-display text-2xl font-semibold">What our customers say</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 3).map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <Stars value={r.rating} />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            <div className="mt-3 text-sm font-semibold">{r.customer_name}</div>
            <div className="text-xs text-muted-foreground">{[r.product, r.city].filter(Boolean).join(" · ")}</div>
          </article>
        ))}
      </div>
      <Link to="/reviews" className="mt-5 inline-block text-sm font-semibold text-primary">
        Read all customer reviews →
      </Link>
    </section>
  );
}
