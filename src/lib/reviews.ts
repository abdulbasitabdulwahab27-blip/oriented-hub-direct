import { supabase } from "@/integrations/supabase/client";

export type PublicReview = {
  id: string;
  customer_name: string;
  city: string | null;
  product: string | null;
  product_slug: string | null;
  verified: boolean;
  rating: number;
  body: string;
  created_at: string;
};

const COLUMNS = "id, customer_name, city, product, product_slug, verified, rating, body, created_at";

/** Approved reviews, optionally scoped to a single product slug. */
export async function fetchApprovedReviews(opts: { productSlug?: string; limit?: number } = {}) {
  let q = supabase
    .from("reviews")
    .select(COLUMNS)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 60);
  if (opts.productSlug) q = q.eq("product_slug", opts.productSlug);
  const { data, error } = await q;
  if (error) return [] as PublicReview[];
  return (data ?? []) as PublicReview[];
}

export function averageRating(reviews: { rating: number }[]) {
  if (!reviews.length) return null;
  return Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1));
}

/** Link to the review form pre-filled from a completed order. */
export function reviewRequestPath(args: { orderCode?: string; product?: string; productSlug?: string }) {
  const p = new URLSearchParams();
  if (args.orderCode) p.set("order", args.orderCode);
  if (args.product) p.set("product", args.product);
  if (args.productSlug) p.set("slug", args.productSlug);
  const qs = p.toString();
  return `/reviews${qs ? `?${qs}` : ""}`;
}

/** WhatsApp message the shop sends to a customer to request a review. */
export function reviewRequestMessage(args: { customerName?: string; orderCode?: string; siteUrl: string }) {
  return [
    `Hello ${args.customerName || "there"},`,
    "",
    "Thank you for your order from The Oriented Hub.",
    "Would you kindly leave us a short review? It takes less than a minute:",
    `${args.siteUrl}/reviews${args.orderCode ? `?order=${args.orderCode}` : ""}`,
    "",
    "We appreciate your feedback.",
  ].join("\n");
}
