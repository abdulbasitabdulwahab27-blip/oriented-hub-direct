import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { getProduct, categories, productsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { productOrderMessage, waLink } from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    const cat = categories.find((c) => c.slug === product.category)!;
    const related = productsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);
    return { product, cat, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — Oriented Hub` },
      { name: "description", content: loaderData.product.description },
      { property: "og:title", content: loaderData.product.name },
      { property: "og:description", content: loaderData.product.description },
      { property: "og:image", content: loaderData.product.image },
      { property: "og:type", content: "product" },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary font-semibold">Back to shop →</Link>
    </div>
  ),
  errorComponent: () => <div className="container-page py-20 text-center text-muted-foreground">Failed to load product.</div>,
  component: ProductPage,
});

function ProductPage() {
  const { product, cat, related } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  return (
    <div className="container-page py-8 md:py-12">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link> / <Link to="/category/$slug" params={{ slug: cat.slug }} className="hover:text-primary">{cat.name}</Link>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <img src={product.image} alt={product.name} width={800} height={800} className="w-full aspect-square object-cover" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{cat.name}</div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">{product.name}</h1>
          <div className="mt-4 rounded-xl border border-gold/40 bg-gold/10 p-4">
            <div className="text-2xl font-display font-bold text-primary">Price on Request</div>
            <p className="mt-1 text-xs text-muted-foreground">Prices vary based on availability, supplier costs, and procurement conditions.</p>
          </div>
          <p className="mt-5 text-foreground/85 leading-relaxed">{product.description}</p>
          <ul className="mt-5 space-y-2">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success shrink-0" /><span>{f}</span></li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-input">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-muted" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2.5 hover:bg-muted" aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => { add(product, qty); toast.success(`Added ${qty} × ${product.name} to cart`); }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
          </div>
          <a
            href={waLink(productOrderMessage({ name: product.name, category: cat.name, quantity: qty }))}
            target="_blank" rel="noopener noreferrer"
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95"
          >
            Order on WhatsApp
          </a>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Verified supplier</div>
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Nationwide delivery</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Related products</h2>
          <div className="mt-6 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p: typeof related[number]) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  );
}
