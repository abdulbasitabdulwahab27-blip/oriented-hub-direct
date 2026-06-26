import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getCategory } from "@/lib/products";
import { useAllProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.cat.name} — Oriented Hub` },
      { name: "description", content: `Shop ${loaderData.cat.name.toLowerCase()} at Oriented Hub. ${loaderData.cat.tagline}.` },
      { property: "og:title", content: `${loaderData.cat.name} — Oriented Hub` },
      { property: "og:description", content: loaderData.cat.tagline },
      { property: "og:image", content: loaderData.cat.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Category not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary font-semibold">Back to shop →</Link>
    </div>
  ),
  errorComponent: () => <div className="container-page py-20 text-center text-muted-foreground">Failed to load category.</div>,
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const { products } = useAllProducts();
  const items = products.filter((p) => p.category === cat.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-page py-12 md:py-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <Link to="/shop" className="text-xs uppercase tracking-widest text-primary font-semibold">← All categories</Link>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">{cat.name}</h1>
            <p className="mt-2 text-muted-foreground max-w-md">{cat.tagline}</p>
          </div>
          <img src={cat.image} alt={cat.name} loading="lazy" width={800} height={800} className="rounded-2xl shadow-elevated object-cover aspect-[4/3]" />
        </div>
      </section>
      <div className="container-page py-10 md:py-14">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No items yet — please <Link to="/contact" className="text-primary font-semibold">contact us</Link> for procurement.</p>
        ) : (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </div>
    </>
  );
}
