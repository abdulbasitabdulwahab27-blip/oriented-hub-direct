import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products, categories } from "@/lib/products";

const BASE_URL = "https://www.theorientedhub.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = ["/", "/shop", "/about", "/contact", "/faq", "/cart", "/checkout", "/privacy", "/terms", "/medical-equipment-supplier", "/laboratory-equipment-supplier", "/hospital-consumables-and-stationeries", "/medical-textbooks-supplier", "/nuc-accreditation-textbooks-supplier", "/international-book-seller"];
        const catPaths = categories.map((c) => `/category/${c.slug}`);
        const productPaths = products.map((p) => `/product/${p.slug}`);
        const all = [...staticPaths, ...catPaths, ...productPaths];
        const urls = all.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
