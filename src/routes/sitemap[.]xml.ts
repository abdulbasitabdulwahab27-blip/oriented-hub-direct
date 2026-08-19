import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";

const BASE_URL = "https://www.theorientedhub.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/shop", "/order", "/track", "/procurement", "/about", "/contact", "/faq", "/privacy", "/terms", "/sales-rep", "/books", "/medical-equipment", "/laboratory-equipment", "/hospital-consumables", "/educational-materials", "/business-solutions", "/osogbo", "/delivery-information", "/blog", "/medical-equipment-supplier", "/laboratory-equipment-supplier", "/hospital-consumables-and-stationeries", "/medical-textbooks-supplier", "/nuc-accreditation-textbooks-supplier", "/international-book-seller"];
        const catPaths = blogPosts.map((b) => `/blog/${b.slug}`);
        const productPaths = products.map((p) => `/product/${p.slug}`);
        const all = [...staticPaths, ...catPaths, ...productPaths];
        const urls = all.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
