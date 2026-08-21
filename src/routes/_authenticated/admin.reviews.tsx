import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Trash2, XCircle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

type Review = {
  id: string;
  customer_name: string;
  city: string | null;
  product: string | null;
  rating: number;
  body: string;
  approved: boolean;
  verified: boolean | null;
  order_code: string | null;
  product_slug: string | null;
  created_at: string;
};

function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Could not load reviews.");
    setReviews((data ?? []) as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setApproved = async (id: string, approved: boolean) => {
    const row = reviews.find((r) => r.id === id);
    // Reviews submitted from an order-tracking link are published as verified purchases.
    const verified = approved ? Boolean(row?.order_code) : false;
    const { error } = await supabase.from("reviews").update({ approved, verified }).eq("id", id);
    if (error) return toast.error("Update failed.");
    toast.success(approved ? "Review published." : "Review unpublished.");
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved, verified } : r)));
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error("Delete failed.");
    toast.success("Review deleted.");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const shown = reviews.filter((r) =>
    filter === "all" ? true : filter === "pending" ? !r.approved : r.approved,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-sm font-semibold capitalize ${
              filter === f ? "border-primary text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews in this view.</p>
      ) : (
        <div className="grid gap-4">
          {shown.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{r.customer_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {[r.product, r.city].filter(Boolean).join(" · ")} — {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.approved ? (
                  <button
                    onClick={() => setApproved(r.id, false)}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-semibold"
                  >
                    <XCircle className="h-4 w-4" /> Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved(r.id, true)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve &amp; publish
                  </button>
                )}
                <button
                  onClick={() => remove(r.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-1.5 text-sm font-semibold text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
