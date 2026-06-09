import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);
  return (
    <Link
      to="/product/$id"
      params={{ id: product.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={400} height={400} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.bestSeller && (
          <span className="absolute top-3 left-3 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground shadow-soft">Best Seller</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{cat?.name}</div>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-primary">Price on Request</div>
            <div className="text-[10px] text-muted-foreground">Tap to enquire</div>
          </div>
          <span className="inline-flex h-8 items-center rounded-md bg-primary/10 px-3 text-xs font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">View</span>
        </div>
      </div>
    </Link>
  );
}
