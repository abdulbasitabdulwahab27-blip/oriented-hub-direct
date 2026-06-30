import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { categories, formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);
  const hasPrice = (product.price ?? 0) > 0;
  const outOfStock = !!product.trackStock && (product.stock ?? 0) <= 0;
  const lowStock = !!product.trackStock && !outOfStock && (product.stock ?? 0) <= 5;
  return (
    <Link
      to="/product/$id"
      params={{ id: product.slug }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={300} height={300} className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "opacity-60" : ""}`} />
        {outOfStock && (
          <span className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive-foreground shadow-soft">Out of stock</span>
        )}
        {lowStock && (
          <span className="absolute top-2 right-2 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-soft">Only {product.stock} left</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground line-clamp-1">{cat?.name}</div>
        <h3 className="mt-0.5 font-display text-[13px] font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-primary truncate">
              {hasPrice ? formatPrice(product.price!, product.currency) : "Price on Request"}
            </div>
          </div>
          <span className="shrink-0 inline-flex h-6 items-center rounded bg-primary/10 px-2 text-[10px] font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">View</span>
        </div>
      </div>
    </Link>
  );
}
