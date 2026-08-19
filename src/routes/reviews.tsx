import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Quote } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema, canonical, canonicalLink, pageMeta } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: pageMeta({
      title: "Customer Reviews & Testimonials | The Oriented Hub",
      description:
        "Read verified customer reviews and testimonials about books, medical equipment, laboratory equipment and hospital consumables supplied by The Oriented Hub, Osogbo, Nigeria — and leave your own review.",
      path: "/reviews",
    }),
    links: canonicalLink("/reviews"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews & Testimonials", path: "/reviews" },
          ]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Customer Reviews & Testimonials",
          url: canonical("/reviews"),
          about: { "@type": "Organization", name: "The Oriented Hub", url: canonical("/") },
        }),
      },
    ],
  }),
  component: ReviewsPage,
});

type Review = {
  id: string;
  customer_name: string;
  city: string | null;
  product: string | null;
  rating: number;
  body: string;
  created_at: string;
};

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const cls = `h-5 w-5 ${filled ? "fill-primary text-primary" : "text-muted-foreground"}`;
        return onChange ? (
          <button key={n} type="button" aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange(n)}>
            <Star className={cls} />
          </button>
        ) : (
          <Star key={n} className={cls} />
        );
      })}
    </div>
  );
}

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id, customer_name, city, product, rating, body, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(60);
      setReviews((data ?? []) as Review[]);
      setLoading(false);
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || body.trim().length < 10) {
      toast.error("Please add your name and a review of at least 10 characters.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      customer_name: name.trim(),
      city: city.trim() || null,
      product: product.trim() || null,
      rating,
      body: body.trim(),
      approved: false,
    });
    setSaving(false);
    if (error) {
      toast.error("We couldn't submit your review. Please try again.");
      return;
    }
    toast.success("Thank you! Your review was submitted and will appear once approved.");
    setName("");
    setCity("");
    setProduct("");
    setRating(5);
    setBody("");
  };

  const average = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Reviews & Testimonials", path: "/reviews" }]} />
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Customer Reviews &amp; Testimonials</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Students, hospitals, laboratories and institutions across Nigeria share their experience buying books,
            medical equipment, laboratory equipment and hospital consumables from The Oriented Hub.
          </p>
          {average && (
            <div className="mt-5 flex items-center gap-3">
              <Stars value={Math.round(Number(average))} />
              <span className="text-sm text-muted-foreground">
                {average} average from {reviews.length} published review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-12 md:py-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold">What customers say</h2>
          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No published reviews yet. Be the first to share your experience.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {reviews.map((r) => (
                <article key={r.id} className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <Quote className="h-5 w-5 text-primary" />
                  <Stars value={r.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  <div className="mt-4 text-sm font-semibold">{r.customer_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {[r.product, r.city].filter(Boolean).join(" · ") || "Verified customer"}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div>
          <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Leave a review</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell others about the product you bought and how the delivery went. Reviews appear after approval.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-semibold">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="e.g. Adebayo O."
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">City / institution</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Osogbo, Osun State"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">Product reviewed</span>
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="e.g. Ross &amp; Wilson 14th Ed"
                />
              </label>
            </div>

            <div className="mt-4">
              <span className="text-sm font-semibold">Rating</span>
              <div className="mt-1">
                <Stars value={rating} onChange={setRating} />
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold">Your review</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Share what you ordered, the quality and the delivery experience."
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Submitting…" : "Submit review"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
