import { Link } from "@tanstack/react-router";
import { getCategory } from "@/lib/products";
import { useAllProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { categoryUrl } from "@/lib/seo";
import { ServicesAndProducts } from "@/components/ServicesAndProducts";

export function CategoryView({
  slug,
  heading,
  summary,
  sections,
  faqs,
}: {
  slug: string;
  heading: string;
  summary: string;
  sections?: { title: string; body: string }[];
  faqs?: { q: string; a: string }[];
}) {
  const cat = getCategory(slug);
  const { products } = useAllProducts();
  const items = products.filter((p) => p.category === slug);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-page py-12 md:py-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: heading, path: categoryUrl(slug) }]} />
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">{heading}</h1>
            <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">{summary}</p>
          </div>
          {cat?.image && (
            <img src={cat.image} alt={heading} loading="lazy" width={800} height={600} className="rounded-2xl shadow-elevated object-cover aspect-[4/3]" />
          )}
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <h2 className="font-display text-2xl font-semibold">Available {heading.toLowerCase()}</h2>
        {items.length === 0 ? (
          <p className="mt-4 text-muted-foreground">
            No items listed yet — please <Link to="/contact" className="text-primary font-semibold">contact us</Link> for procurement.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        )}
      </div>

      {sections && sections.length > 0 && (
        <section className="container-page pb-12 md:pb-16">
          <div className="max-w-3xl space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-xl font-semibold">{s.title}</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-5xl">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <ServicesAndProducts path={categoryUrl(slug)} />

      <section className="container-page pb-16">
        <h2 className="font-display text-xl font-semibold">Explore other categories</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/books" className="rounded-md border border-border px-4 py-2 hover:text-primary">Academic Books</Link>
          <Link to="/medical-equipment" className="rounded-md border border-border px-4 py-2 hover:text-primary">Medical Equipment</Link>
          <Link to="/laboratory-equipment" className="rounded-md border border-border px-4 py-2 hover:text-primary">Laboratory Equipment</Link>
          <Link to="/hospital-consumables" className="rounded-md border border-border px-4 py-2 hover:text-primary">Hospital Consumables</Link>
          <Link to="/educational-materials" className="rounded-md border border-border px-4 py-2 hover:text-primary">Educational Materials</Link>
          <Link to="/business-solutions" className="rounded-md border border-border px-4 py-2 hover:text-primary">Business Solutions</Link>
          <Link to="/delivery-information" className="rounded-md border border-border px-4 py-2 hover:text-primary">Delivery Information</Link>
        </div>
      </section>
    </>
  );
}
