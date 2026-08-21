import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { categories, formatPrice, products as staticProducts } from "@/lib/products";
import { useAllProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCart } from "@/lib/cart";
import { productOrderMessage, waLink } from "@/lib/whatsapp";
import { fetchApprovedReviews, type PublicReview } from "@/lib/reviews";
import { breadcrumbSchema, canonicalLink, categoryUrl, pageMeta, productSchema, SITE_NAME } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const product = staticProducts.find((p) => p.id === params.id || p.slug === params.id);
    const reviews = product ? await fetchApprovedReviews({ productSlug: product.slug, limit: 20 }) : [];
    return { reviews };
  },
  head: ({ params, loaderData }) => {
    const product = staticProducts.find((p) => p.id === params.id || p.slug === params.id);
    if (!product) return { meta: [{ title: "Product — The Oriented Hub" }, { name: "robots", content: "noindex" }] };
    const cat = categories.find((c) => c.slug === product.category);
    const path = `/product/${product.slug}`;
    const description = `${product.name} — supplied by The Oriented Hub. ${product.description}`.slice(0, 158);
    const reviews = (loaderData?.reviews ?? []) as PublicReview[];
    return {
      meta: pageMeta({
        title: `${product.name} | ${SITE_NAME}`,
        description,
        path,
        type: "product",
        image: product.image,
      }),
      links: canonicalLink(path),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            productSchema(product, {
              categoryName: cat?.name ?? product.category,
              reviews: reviews.map((r) => ({
                author: r.customer_name,
                rating: r.rating,
                body: r.body,
                date: r.created_at,
              })),
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: cat?.name ?? product.category, path: categoryUrl(product.category) },
              { name: product.name, path },
            ]),
          ),
        },
      ],
    };
  },
  errorComponent: () => <div className="container-page py-20 text-center text-muted-foreground">Failed to load product.</div>,
  component: ProductPage,
});



function ProductPage() {
  const { id } = Route.useParams();
  const { products, loading } = useAllProducts();
  const { reviews } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  // Code-bundled products render immediately (server-side too) so crawlers and
  // first paint get real content; only unknown slugs wait for the DB fetch.
  const product = products.find((p) => p.id === id || p.slug === id);

  if (!product && loading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary font-semibold">Back to shop →</Link>
      </div>
    );
  }


  const cat = categories.find((c) => c.slug === product.category) ?? { slug: product.category, name: product.category };
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: cat.name, path: categoryUrl(cat.slug) },
          { name: product.name, path: `/product/${product.slug}` },
        ]}
      />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card p-4 sm:p-6">
          <img src={product.image} alt={product.name} fetchPriority="high" width={1600} height={1600} sizes="(min-width: 1024px) 50vw, 100vw" decoding="async" className="w-full aspect-square object-contain [image-rendering:auto]" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{cat.name}</div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">{product.name}</h1>
          <div className="mt-4 rounded-xl border border-gold/40 bg-gold/10 p-4">
            <div className="text-2xl font-display font-bold text-primary">
              {(product.price ?? 0) > 0 ? formatPrice(product.price!, product.currency) : "Price on Request"}
            </div>
            {product.trackStock && (
              <div className={`mt-1 text-xs font-semibold ${(product.stock ?? 0) <= 0 ? "text-destructive" : (product.stock ?? 0) <= 5 ? "text-amber-600" : "text-emerald-700"}`}>
                {(product.stock ?? 0) <= 0 ? "Out of stock" : `${product.stock} in stock`}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{(product.price ?? 0) > 0 ? "Bulk pricing available — contact us for institutional rates." : "Prices vary based on availability, supplier costs, and procurement conditions."}</p>
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
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Nationwide & worldwide delivery</div>
          </div>
        </div>
      </div>

      <ProductReviews reviews={reviews} productName={product.name} productSlug={product.slug} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Related products</h2>
          <div className="mt-6 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  );
}
