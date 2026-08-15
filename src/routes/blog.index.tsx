import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts } from "@/lib/blog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema, canonical, canonicalLink, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: pageMeta({
      title: "Blog | Books, Medical & Laboratory Supply Guides in Nigeria",
      description:
        "Guides from The Oriented Hub on buying academic books, medical equipment, laboratory equipment and hospital consumables in Nigeria.",
      path: "/blog",
    }),
    links: canonicalLink("/blog"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "The Oriented Hub Blog",
          url: canonical("/blog"),
          blogPost: blogPosts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            url: canonical(`/blog/${p.slug}`),
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-semibold">Guides &amp; Insights</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Practical guides on sourcing academic books, medical equipment, laboratory equipment and hospital consumables in Nigeria.
          </p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{post.readingTime}</div>
              <h2 className="mt-2 font-display text-lg font-semibold">
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">{post.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.description}</p>
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="mt-4 inline-block text-sm font-semibold text-primary">Read article →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
