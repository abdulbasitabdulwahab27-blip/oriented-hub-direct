import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPost, blogPosts } from "@/lib/blog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema, canonical, canonicalLink, pageMeta, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found — The Oriented Hub" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: pageMeta({ title: `${post.title} | ${SITE_NAME}`, description: post.description, path: `/blog/${params.slug}`, type: "article" }),
      links: canonicalLink(`/blog/${params.slug}`),
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${params.slug}` }])) },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: canonical(`/blog/${params.slug}`),
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME, url: canonical("/") },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary font-semibold">Back to blog →</Link>
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold">{post.title}</h1>
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })} · {post.readingTime}
          </p>
        </div>
      </section>

      <article className="container-page py-12 md:py-16 max-w-3xl">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="text-xs uppercase tracking-widest text-primary font-semibold">Quick answer</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{post.summary}</p>
        </div>

        <div className="mt-8 space-y-8">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-semibold">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">Order from The Oriented Hub</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We supply academic books, medical equipment, laboratory equipment, hospital consumables and educational materials with delivery across Nigeria.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/shop" className="rounded-md bg-gradient-primary px-4 py-2 font-semibold text-primary-foreground">Browse the shop</Link>
            <Link to="/contact" className="rounded-md border border-border px-4 py-2 font-semibold text-primary">Contact us</Link>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">More guides</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-primary hover:underline">{p.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
