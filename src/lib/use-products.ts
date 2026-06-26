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
  };
}

/**
 * Returns code-bundled products merged with admin-managed products from the database.
 * DB products are listed first so newly-added items appear at the top of category lists.
 */
export function useAllProducts() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, category, image, description, features, best_seller")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("Failed to load DB products", error);
        setDbProducts([]);
      } else {
        setDbProducts((data ?? []).map(mapRow));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Dedupe by slug; DB entries take precedence over code entries with the same slug.
  const seen = new Set<string>();
  const merged: Product[] = [];
  for (const p of [...dbProducts, ...codeProducts]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    merged.push(p);
  }

  return { products: merged, loading };
}
