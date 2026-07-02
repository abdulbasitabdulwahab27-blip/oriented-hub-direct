import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products, type Product } from "@/lib/products";

export type PriceRow = { slug: string; price: number; currency: string };

export async function fetchPriceMap(): Promise<Record<string, PriceRow>> {
  const { data, error } = await supabase.from("product_prices").select("slug, price, currency");
  if (error) return {};
  const map: Record<string, PriceRow> = {};
  for (const row of data ?? []) {
    map[row.slug] = { slug: row.slug, price: Number(row.price) || 0, currency: row.currency || "NGN" };
  }
  return map;
}

export function applyPrices(list: Product[], prices: Record<string, PriceRow>): Product[] {
  return list.map((p) => {
    const override = prices[p.slug];
    if (!override) return p;
    return { ...p, price: override.price, currency: override.currency };
  });
}

export function usePricedProducts(source: Product[] = products): Product[] {
  const [priced, setPriced] = useState<Product[]>(source);
  useEffect(() => {
    let cancelled = false;
    fetchPriceMap().then((map) => {
      if (!cancelled) setPriced(applyPrices(source, map));
    });
    return () => { cancelled = true; };
  }, [source]);
  return priced;
}
