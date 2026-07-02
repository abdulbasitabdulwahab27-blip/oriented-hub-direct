import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { dedupeProducts, productSlugAliases, products as codeProducts, type Product } from "@/lib/products";

type DBProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  best_seller: boolean;
  price: number | null;
  currency: string | null;
  stock: number | null;
  track_stock: boolean | null;
};

function mapRow(r: DBProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    image: r.image,
    description: r.description,
    features: r.features ?? [],
    bestSeller: r.best_seller,
    price: r.price ?? 0,
    currency: r.currency ?? "NGN",
    stock: r.stock ?? 0,
    trackStock: r.track_stock ?? false,
  };
}

/**
 * Returns code-bundled products merged with admin-managed products from the database.
 */
export function useAllProducts() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, { price: number; currency: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [prodRes, priceRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, slug, name, category, image, description, features, best_seller, price, currency, stock, track_stock")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase.from("product_prices").select("slug, price, currency"),
      ]);
      if (cancelled) return;
      if (prodRes.error) {
        console.error("Failed to load DB products", prodRes.error);
        setDbProducts([]);
      } else {
        setDbProducts((prodRes.data ?? []).map((r) => mapRow(r as DBProductRow)));
      }
      const map: Record<string, { price: number; currency: string }> = {};
      for (const row of priceRes.data ?? []) {
        map[row.slug] = { price: Number(row.price) || 0, currency: row.currency || "NGN" };
      }
      setPriceMap(map);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const merged = dedupeProducts([...dbProducts, ...codeProducts].map((p) => {
    const override = [p.slug, ...(productSlugAliases[p.slug] ?? [])]
      .map((slug) => priceMap[slug])
      .find(Boolean);
    return override ? { ...p, price: override.price, currency: override.currency } : p;
  }));

  return { products: merged, loading };
}
