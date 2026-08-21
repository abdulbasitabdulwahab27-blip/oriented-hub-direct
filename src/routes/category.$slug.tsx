import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getCategory, products as staticProducts } from "@/lib/products";
import { CategoryView } from "@/components/CategoryView";
import { breadcrumbSchema, canonicalLink, categoryUrl, pageMeta, productListSchema } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Category not found — The Oriented Hub" }, { name: "robots", content: "noindex" }] };
    const { cat } = loaderData;
    const url = categoryUrl(params.slug);
    return {
      meta: pageMeta({
        title: `${cat.name} in Nigeria | The Oriented Hub`,
        description: `Shop ${cat.name.toLowerCase()} at The Oriented Hub. ${cat.tagline}. Nationwide delivery across Nigeria.`,
        path: url,
      }),
      // Canonical points at the keyword-friendly URL for this category.
      links: canonicalLink(url),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            productListSchema(cat.name, url, staticProducts.filter((p) => p.category === params.slug), cat.name),
          ),
        },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: cat.name, path: url }])) },
      ],
    };
  },
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
  return <CategoryView slug={cat.slug} heading={cat.name} summary={cat.tagline} />;
}
