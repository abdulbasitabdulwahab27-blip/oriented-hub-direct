import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Save, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { products, categories, formatPrice, productSlugAliases } from "@/lib/products";
import { fetchPriceMap } from "@/lib/product-prices";

export const Route = createFileRoute("/_authenticated/admin/pricing")({
  component: AdminPricing,
});

const CURRENCIES = ["NGN", "USD", "GBP", "EUR", "GHS", "KES", "ZAR"];

type Draft = { price: string; currency: string; dirty: boolean };

function AdminPricing() {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const map = await fetchPriceMap();
      const init: Record<string, Draft> = {};
      for (const p of products) {
        const row = [p.slug, ...(productSlugAliases[p.slug] ?? [])]
          .map((slug) => map[slug])
          .find(Boolean);
        init[p.slug] = {
          price: row ? String(row.price) : "",
          currency: row?.currency ?? "NGN",
          dirty: false,
        };
      }
      setDrafts(init);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!needle) return true;
      return p.name.toLowerCase().includes(needle) || p.slug.toLowerCase().includes(needle);
    });
  }, [q, cat]);

  const dirtyCount = Object.values(drafts).filter((d) => d.dirty).length;

  const update = (slug: string, patch: Partial<Draft>) => {
    setDrafts((prev) => ({ ...prev, [slug]: { ...prev[slug], ...patch, dirty: true } }));
  };

  const saveOne = async (slug: string) => {
    const d = drafts[slug];
    if (!d) return;
    const price = Number(d.price) || 0;
    const { error } = await supabase
      .from("product_prices")
      .upsert({ slug, price, currency: d.currency }, { onConflict: "slug" });
    if (error) {
      toast.error(error.message);
      return;
    }
    setDrafts((prev) => ({ ...prev, [slug]: { ...prev[slug], dirty: false } }));
    toast.success("Price saved.");
  };

  const saveAll = async () => {
    const rows = Object.entries(drafts)
      .filter(([, d]) => d.dirty)
      .map(([slug, d]) => ({ slug, price: Number(d.price) || 0, currency: d.currency }));
    if (rows.length === 0) {
      toast.info("No changes to save.");
      return;
    }
    setSavingAll(true);
    const { error } = await supabase.from("product_prices").upsert(rows, { onConflict: "slug" });
    setSavingAll(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDrafts((prev) => {
      const next = { ...prev };
      for (const r of rows) next[r.slug] = { ...next[r.slug], dirty: false };
      return next;
    });
    toast.success(`Saved ${rows.length} price${rows.length === 1 ? "" : "s"}.`);
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading catalog…</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Bulk Pricing</h2>
          <p className="text-sm text-muted-foreground">Set a price for any catalog product. Leave blank or 0 to keep it as "Price on Request".</p>
        </div>
        <button
          onClick={saveAll}
          disabled={savingAll || dirtyCount === 0}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {savingAll ? "Saving…" : dirtyCount > 0 ? `Save all (${dirtyCount})` : "Save all"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_240px] mb-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or slug…"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm"
          />
        </label>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2.5 text-sm">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const d = drafts[p.slug] ?? { price: "", currency: "NGN", dirty: false };
          const num = Number(d.price) || 0;
          const symbol = d.currency === "NGN" ? "₦" : d.currency === "USD" ? "$" : d.currency === "GBP" ? "£" : d.currency === "EUR" ? "€" : "";
          return (
            <div key={p.slug} className={`rounded-xl border border-border bg-card p-4 shadow-card ${d.dirty ? "ring-2 ring-amber-400" : ""}`}>
              <div className="flex items-start gap-3">
                <img src={p.image} alt="" className="h-16 w-16 shrink-0 rounded-md object-contain bg-white border border-border" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-base leading-snug">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{categories.find((c) => c.slug === p.category)?.name ?? p.category}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</span>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-primary">{symbol}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={d.price}
                      onChange={(e) => update(p.slug, { price: e.target.value })}
                      placeholder="0.00"
                      className="w-full rounded-lg border-2 border-input bg-background pl-10 pr-3 py-3 text-2xl font-bold focus:border-primary focus:outline-none"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Currency</span>
                  <select
                    value={d.currency}
                    onChange={(e) => update(p.slug, { currency: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-input bg-background px-3 py-3 text-base font-semibold"
                  >
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Preview: </span>
                  {num > 0
                    ? <span className="text-primary font-bold">{formatPrice(num, d.currency)}</span>
                    : <span className="text-muted-foreground italic">Price on Request</span>}
                </div>
                <button
                  onClick={() => saveOne(p.slug)}
                  disabled={!d.dirty}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft disabled:opacity-40"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No products match your filter.
          </div>
        )}
      </div>

    </div>
  );
}
