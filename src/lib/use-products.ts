import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products as codeProducts, type Product } from "@/lib/products";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, category, image, description, features, best_seller, price, currency, stock, track_stock")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("Failed to load DB products", error);
        setDbProducts([]);
      } else {
        setDbProducts((data ?? []).map((r) => mapRow(r as DBProductRow)));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const seen = new Set<string>();
  const merged: Product[] = [];
  for (const p of [...dbProducts, ...codeProducts]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    merged.push(p);
  }

  return { products: merged, loading };
}
