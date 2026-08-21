#!/usr/bin/env node
/**
 * Automated SEO validation.
 *
 * Crawls the running site (default http://localhost:8080) and validates
 * robots.txt, sitemap.xml, canonical URLs, Open Graph, Twitter Card tags
 * and every JSON-LD schema block on each page.
 *
 * Usage: node scripts/seo-validate.mjs [baseUrl] [--all]
 */

const BASE = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:8080";
const CHECK_ALL = process.argv.includes("--all");
const SITE = "https://www.theorientedhub.com";

const problems = [];
const notes = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers: { "user-agent": "seo-validate/1.0" } });
  return { status: res.status, body: await res.text(), headers: res.headers };
};

const metas = (html) => {
  const out = [];
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    const name = /(?:name|property)=["']([^"']+)["']/i.exec(tag)?.[1];
    const content = /content=["']([^"']*)["']/i.exec(tag)?.[1];
    if (name) out.push({ name: name.toLowerCase(), content: content ?? "" });
  }
  return out;
};
const metaOf = (html, name) => metas(html).find((m) => m.name === name)?.content;
const titleOf = (html) => /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
const canonicalsOf = (html) =>
  [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map(
    (m) => /href=["']([^"']+)["']/i.exec(m[0])?.[1] ?? "",
  );
const jsonLdOf = (html) =>
  [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
const h1sOf = (html) => [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());

function validateSchema(page, raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    fail(page, "JSON-LD block is not valid JSON");
    return;
  }
  const flatten = (d) => {
    const list = Array.isArray(d) ? d : [d];
    return list.flatMap((n) => (n && n["@graph"] ? flatten(n["@graph"]) : [n]));
  };
  const nodes = flatten(data);
  for (const node of nodes) {
    if (!node["@context"]) fail(page, `JSON-LD ${node["@type"] ?? "node"} missing @context`);
    if (!node["@type"]) fail(page, "JSON-LD node missing @type");
    const type = node["@type"];
    if (type === "Product") {
      for (const req of ["name", "image", "offers"]) if (!node[req]) fail(page, `Product schema missing ${req}`);
      const offer = node.offers ?? {};
      if (!offer.priceCurrency) fail(page, "Product offer missing priceCurrency");
      if (!offer.availability) fail(page, "Product offer missing availability");
      if (offer.price !== undefined && !offer.priceValidUntil) fail(page, "Product offer has price but no priceValidUntil");
      if (node.image && [].concat(node.image).some((i) => !String(i).startsWith("http")))
        fail(page, "Product image is not an absolute URL");
      if (node.aggregateRating && !node.review) fail(page, "aggregateRating present without review data");
    }
    if (type === "FAQPage") {
      const q = node.mainEntity ?? [];
      if (!q.length) fail(page, "FAQPage has no questions");
      for (const item of q) if (!item.acceptedAnswer?.text) fail(page, "FAQ question missing acceptedAnswer text");
    }
    if (type === "BreadcrumbList") {
      const items = node.itemListElement ?? [];
      if (!items.length) fail(page, "BreadcrumbList is empty");
      for (const it of items) if (!it.name || !it.item) fail(page, "Breadcrumb item missing name or item URL");
    }
    if (type === "ItemList") {
      if (!(node.itemListElement ?? []).length) fail(page, "ItemList is empty");
    }
  }
}

async function validatePage(path) {
  const { status, body } = await get(path);
  const page = path;
  if (status !== 200) return fail(page, `HTTP ${status}`);

  const title = titleOf(body);
  if (!title) fail(page, "missing <title>");
  else if (title.length > 65) notes.push(`${page}: title is ${title.length} chars (>65)`);
  if (/lovable/i.test(title ?? "")) fail(page, "default Lovable title");

  const desc = metaOf(body, "description");
  if (!desc) fail(page, "missing meta description");
  else if (desc.length > 165) notes.push(`${page}: meta description is ${desc.length} chars (>165)`);

  const cans = canonicalsOf(body);
  const robots = metaOf(body, "robots") ?? "";
  if (cans.length === 0) fail(page, "missing canonical link");
  if (cans.length > 1) fail(page, `${cans.length} canonical links (must be exactly 1)`);
  if (cans[0]) {
    if (!cans[0].startsWith("http")) fail(page, "canonical is not absolute");
    const expected = `${SITE}${path === "/" ? "/" : path}`;
    if (cans[0].replace(/\/$/, "") !== expected.replace(/\/$/, "")) fail(page, `canonical ${cans[0]} does not self-reference ${expected}`);
  }

  for (const p of ["og:title", "og:description", "og:type", "og:url"]) {
    if (!metaOf(body, p)) fail(page, `missing ${p}`);
  }
  const ogUrl = metaOf(body, "og:url");
  if (ogUrl && cans[0] && ogUrl.replace(/\/$/, "") !== cans[0].replace(/\/$/, ""))
    fail(page, "og:url does not match canonical");
  const ogImage = metaOf(body, "og:image");
  if (ogImage && !ogImage.startsWith("http")) fail(page, "og:image is not an absolute URL");

  const tw = metaOf(body, "twitter:card");
  if (!tw) fail(page, "missing twitter:card");
  if (!metaOf(body, "twitter:title")) fail(page, "missing twitter:title");
  if (!metaOf(body, "twitter:description")) fail(page, "missing twitter:description");
  if (ogImage && !metaOf(body, "twitter:image")) fail(page, "og:image without twitter:image");

  const h1s = h1sOf(body);
  if (h1s.length === 0) fail(page, "no <h1>");
  if (h1s.length > 1) fail(page, `${h1s.length} <h1> elements`);

  const blocks = jsonLdOf(body);
  if (blocks.length === 0 && !robots.includes("noindex")) notes.push(`${page}: no JSON-LD schema`);
  blocks.forEach((b) => validateSchema(page, b));

  for (const img of body.matchAll(/<img\b[^>]*>/gi)) {
    if (!/alt=/.test(img[0])) fail(page, "image without alt attribute");
  }
}

async function main() {
  console.log(`SEO validation against ${BASE}\n`);

  // robots.txt
  const robots = await get("/robots.txt");
  if (robots.status !== 200) fail("/robots.txt", `HTTP ${robots.status}`);
  else {
    if (/^\s*Disallow:\s*\/\s*$/m.test(robots.body) && /User-agent:\s*\*/i.test(robots.body))
      fail("/robots.txt", "wildcard Disallow: / blocks the whole site");
    if (!/Sitemap:\s*https?:\/\//i.test(robots.body)) fail("/robots.txt", "missing Sitemap directive");
  }

  // sitemap
  const sitemap = await get("/sitemap.xml");
  let urls = [];
  if (sitemap.status !== 200) fail("/sitemap.xml", `HTTP ${sitemap.status}`);
  else {
    if (!/^<\?xml/.test(sitemap.body.trim())) fail("/sitemap.xml", "missing XML declaration");
    urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (!urls.length) fail("/sitemap.xml", "no <loc> entries");
    const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
    if (dupes.length) fail("/sitemap.xml", `${dupes.length} duplicate URLs (e.g. ${dupes[0]})`);
    const bad = urls.filter((u) => !u.startsWith(SITE));
    if (bad.length) fail("/sitemap.xml", `${bad.length} URLs not on ${SITE}`);
    if (/<lastmod>/.test(sitemap.body) && !/\d{4}-\d{2}-\d{2}/.test(sitemap.body))
      fail("/sitemap.xml", "malformed lastmod values");
  }

  const paths = urls.map((u) => u.replace(SITE, "") || "/");
  const core = [
    "/",
    "/shop",
    "/books",
    "/medical-equipment",
    "/laboratory-equipment",
    "/hospital-consumables",
    "/educational-materials",
    "/nuc-accreditation-books",
    "/surgical-instruments",
    "/scientific-instruments",
    "/reviews",
    "/osogbo",
    "/faq",
    "/contact",
    "/about",
  ];
  const productSample = paths.filter((p) => p.startsWith("/product/")).slice(0, CHECK_ALL ? 9999 : 5);
  const blogSample = paths.filter((p) => p.startsWith("/blog/")).slice(0, CHECK_ALL ? 9999 : 3);
  const targets = [...new Set([...core, ...productSample, ...blogSample])];

  for (const p of targets) {
    try {
      await validatePage(p);
    } catch (err) {
      fail(p, `crawl error: ${err.message}`);
    }
  }

  console.log(`Checked ${targets.length} pages + robots.txt + sitemap.xml\n`);
  if (notes.length) {
    console.log("Warnings (non-blocking):");
    notes.forEach((n) => console.log("  - " + n));
    console.log("");
  }
  if (problems.length) {
    console.log(`FAILURES (${problems.length}):`);
    problems.forEach((p) => console.log("  ✗ " + p));
    process.exitCode = 1;
  } else {
    console.log("✓ No SEO errors detected.");
  }
}

main();
