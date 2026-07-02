import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Save, Search, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { products, categories, formatPrice } from "@/lib/products";
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
        const row = map[p.slug];
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

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-3 font-semibold">Image</th>
              <th className="px-3 py-3 font-semibold">Product</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Price</th>
              <th className="px-3 py-3 font-semibold">Currency</th>
              <th className="px-3 py-3 font-semibold">Preview</th>
              <th className="px-3 py-3 font-semibold text-right">Save</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const d = drafts[p.slug] ?? { price: "", currency: "NGN", dirty: false };
              const num = Number(d.price) || 0;
              return (
                <tr key={p.slug} className={`border-t border-border ${d.dirty ? "bg-amber-50/60" : ""}`}>
                  <td className="px-3 py-2">
                    <img src={p.image} alt="" className="h-10 w-10 rounded object-contain bg-white border border-border" />
                  </td>
                  <td className="px-3 py-2 font-medium max-w-xs">
                    <div className="line-clamp-2">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.slug}</div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground text-xs">{categories.find((c) => c.slug === p.category)?.name ?? p.category}</td>
                  <td className="px-3 py-2">
                    <div className="relative">
                      <DollarSign className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="number"
                        min={0}
                        step="any"
                        value={d.price}
                        onChange={(e) => update(p.slug, { price: e.target.value })}
                        placeholder="0"
                        className="w-28 rounded-md border border-input bg-background pl-7 pr-2 py-1.5 text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={d.currency}
                      onChange={(e) => update(p.slug, { currency: e.target.value })}
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-primary font-semibold whitespace-nowrap">
                    {num > 0 ? formatPrice(num, d.currency) : <span className="text-muted-foreground font-normal">Price on Request</span>}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => saveOne(p.slug)}
                      disabled={!d.dirty}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Save className="h-3.5 w-3.5" /> Save
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-12 text-center text-muted-foreground">No products match your filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
