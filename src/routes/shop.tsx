import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories } from "@/lib/products";
import { useAllProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";
import { canonicalLink, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: pageMeta({
      title: "Shop Books, Medical & Laboratory Equipment | The Oriented Hub",
      description: "Browse academic books, medical equipment, laboratory equipment, hospital consumables and educational materials. Nationwide delivery across Nigeria.",
      path: "/shop",
    }),
    links: canonicalLink("/shop"),
  }),
  component: Shop,
});

function Shop() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const { products } = useAllProducts();
  const list = useMemo(() => {
    return products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (q.trim() === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))
    );
  }, [products, q, cat]);

  return (
    <div className="container-page py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Shop</h1>
          <p className="mt-1 text-muted-foreground">All products available for procurement. Prices on request.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
            {categories.map((c) => (
              <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</Chip>
            ))}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">No products match your search.</p>
          <Link to="/contact" className="mt-3 inline-flex text-sm font-semibold text-primary">Request it via procurement →</Link>
        </div>
      ) : cat === "all" ? (
        <div className="mt-10 space-y-14">
          {categories.map((c) => {
            const items = list.filter((p) => p.category === c.slug);
            if (items.length === 0) return null;
            return (
              <section key={c.slug} id={c.slug} className="scroll-mt-24">
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold sm:text-3xl">{c.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                  </div>
                  <button onClick={() => setCat(c.slug)} className="shrink-0 text-xs font-semibold text-primary hover:underline">
                    View all {items.length} →
                  </button>
                </div>
                <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (<ProductCard key={p.id} product={p} />))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      )}
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"}`}>
      {children}
    </button>
  );
}
