import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Award, Users, Phone, Mail, MapPin, Star, CheckCircle2, Sparkles, FileText, ClipboardList } from "lucide-react";
import { categories, bestSellers, products } from "@/lib/products";
import { useAllProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";

import { ADDRESS, EMAIL, WHATSAPP_PRIMARY, waLink, quoteMessage } from "@/lib/whatsapp";
import { useState } from "react";
import { toast } from "sonner";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "The Oriented Hub | Books, Medical Equipment & Laboratory Supplies in Nigeria",
      description:
        "The Oriented Hub supplies academic books, medical equipment, laboratory equipment, hospital consumables and educational materials across Nigeria with reliable nationwide delivery.",
      path: "/",
    }),
    links: canonicalLink("/"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema(homeFaqs)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }])),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <WelcomeIntro />
      <AboutAnswers />
      <FeaturedCategories />
      <FeaturedProducts />
      
      
      <WhyChooseUs />
      <Procurement />
      <QuotationListBanner />
      <Testimonials />
      <SalesRepBanner />
      <DeliveryBanner />
      <WhatsAppSection />
      <HomeFaq />
      <Newsletter />
    </>
  );
}

const aiAnswers = [
  {
    q: "What is The Oriented Hub?",
    a: "The Oriented Hub is a Nigerian supplier of academic books, medical equipment, laboratory equipment, hospital consumables and educational materials. We serve students, schools, universities, hospitals, clinics and procurement officers, with a head office at 5 Oke-Fia Street, Opposite Zenith Bank, Osogbo.",
  },
  {
    q: "Does The Oriented Hub deliver across Nigeria?",
    a: "Yes. The Oriented Hub delivers across Nigeria — all 36 states and the FCT — and also ships worldwide on request to the USA, Canada, UK, Europe, Africa and Asia.",
  },
  {
    q: "What products does The Oriented Hub sell?",
    a: "WAEC textbooks, JAMB textbooks, university textbooks, medical books, nursing books, science, management and social science books, plus laboratory equipment, medical equipment, hospital consumables and educational materials. All products are real physical items.",
  },
  {
    q: "Does The Oriented Hub sell PDF books?",
    a: "No. The Oriented Hub sells physical books only. We do not sell PDFs, ebooks or scanned copies.",
  },
];

function AboutAnswers() {
  return (
    <section className="container-page pb-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">About The Oriented Hub — quick answers</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {aiAnswers.map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold">{item.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link to="/books" className="rounded-md border border-border px-4 py-2 hover:text-primary">Academic Books</Link>
          <Link to="/medical-equipment" className="rounded-md border border-border px-4 py-2 hover:text-primary">Medical Equipment</Link>
          <Link to="/laboratory-equipment" className="rounded-md border border-border px-4 py-2 hover:text-primary">Laboratory Equipment</Link>
          <Link to="/hospital-consumables" className="rounded-md border border-border px-4 py-2 hover:text-primary">Hospital Consumables</Link>
          <Link to="/educational-materials" className="rounded-md border border-border px-4 py-2 hover:text-primary">Educational Materials</Link>
          <Link to="/delivery-information" className="rounded-md border border-border px-4 py-2 hover:text-primary">Delivery Information</Link>
          <Link to="/blog" className="rounded-md border border-border px-4 py-2 hover:text-primary">Blog</Link>
        </div>
      </div>
    </section>
  );
}


function WelcomeIntro() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-card max-w-4xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">
          Welcome to The Oriented Hub — Your One Stop Solution for Knowledge &amp; Healthcare Needs.
        </h2>
        <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We are global suppliers of Medical Equipment, Laboratory Equipment, Hospital Consumables, Medical Textbooks, and NUC Accreditation Textbooks.
          </p>
          <p>
            We ship WORLDWIDE. To USA, Canada, UK, Europe, Africa, Asia and everywhere.<br />
            PLACE YOUR ORDER. INTERNATIONAL DELIVERY AVAILABLE.<br />
            <span className="font-semibold text-primary">Fast. Reliable. Trusted Quality Delivered.</span>
          </p>
          <p className="text-sm">
            Head Office: 5, Oke-Fia Street, Opposite Zenith Bank, Osogbo<br />
            Call/WhatsApp: +234 813 654 8965 | +234 906 400 7879 | +44 7587 869499
          </p>
        </div>
      </div>
    </section>
  );
}

const homeFaqs = [
  {
    q: "Do you ship medical equipment internationally?",
    a: "Yes. The Oriented Hub offers worldwide shipping of medical equipment and laboratory equipment to USA, Canada, UK, Europe, Africa, Asia and globally.",
  },
  {
    q: "Are you an international book seller for NUC textbooks?",
    a: "Yes. The Oriented Hub is a global supplier of NUC accreditation textbooks and medical textbooks. We ship worldwide to institutions and individuals.",
  },
  {
    q: "Where is The Oriented Hub located?",
    a: "Our head office is at 5 Oke-Fia Street, Osogbo. We serve customers worldwide with international shipping available.",
  },
  {
    q: "How do I place an international order?",
    a: "Contact us via WhatsApp +234 813 654 8965. We process orders and ship worldwide. Trusted Quality Delivered.",
  },
];

function HomeFaq() {
  return (
    <section className="container-page pb-6">
      <SectionHeading eyebrow="Answers" title="Frequently Asked Questions" center />
      <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-5xl mx-auto">
        {homeFaqs.map((f) => (
          <div key={f.q} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold">{f.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Trusted procurement partner since day one
          </div>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Quality Products.<br />
            <span className="text-primary">Better Care.</span> Total Solutions.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Oriented Hub supplies authentic books, medical equipment, laboratory equipment, hospital consumables and educational materials — delivered to institutions and individuals nationwide.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition">
              Browse Shop <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={waLink("Hello Oriented Hub, I'd like to request a quotation.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-background px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition">
              Request a Quote
            </a>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "500+", v: "Products" },
              { k: "36", v: "States Served" },
              { k: "24/7", v: "WhatsApp Support" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-primary">{s.k}</dt>
                <dd className="text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-gold opacity-10 blur-3xl" aria-hidden />
          <img src={heroImg} alt="Books, medical and laboratory products from Oriented Hub" width={1600} height={1100} className="relative rounded-2xl shadow-elevated object-cover w-full aspect-[4/3]" />
          <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 rounded-xl bg-background p-3 pr-5 shadow-elevated border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success"><CheckCircle2 className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Verified Suppliers</div>
              <div className="text-sm font-semibold">100% Authentic</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCategories() {
  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="Shop by category" title="What we supply" subtitle="From a single textbook to a full hospital fit-out — we source it." />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card hover:shadow-elevated transition-all">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img src={c.image} alt={c.name} loading="lazy" width={600} height={750} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="bg-gradient-primary p-4 text-primary-foreground">
              <h3 className="font-display text-lg font-semibold leading-tight">{c.name}</h3>
              <p className="mt-1 text-[11px] leading-snug text-primary-foreground/90">{c.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


function FeaturedProducts() {
  const { products: all } = useAllProducts();
  const featured = all.length ? all : products;
  return (
    <section className="bg-secondary/40 py-14 md:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Our catalogue" title="Featured products" subtitle="A glimpse of what we supply — books, medical and lab essentials." />
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {featured.slice(0, 12).map((p) => (<ProductCard key={p.id} product={p} />))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { icon: ShieldCheck, title: "Authentic & verified", text: "Every product is sourced from authorised distributors and verified suppliers." },
    { icon: Truck, title: "Nationwide & worldwide delivery", text: "Door-to-door across all 36 states and the FCT, plus international shipping on request." },
    { icon: Award, title: "Institutional grade", text: "Trusted by hospitals, universities, schools and procurement officers." },
    { icon: Users, title: "Bulk & retail", text: "Single units to large institutional orders — same care, same quality." },
  ];
  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="Why Oriented Hub" title="Built on quality and trust" subtitle="Procurement done right — transparent, accountable and on time." center />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
              <i.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{i.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{i.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Procurement() {
  const [text, setText] = useState("");
  return (
    <section className="bg-gradient-primary text-primary-foreground py-14 md:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold">Procurement service</div>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Can't find your product?</h2>
          <p className="mt-3 text-primary-foreground/85 max-w-lg">Tell us what you need — books, lab kits, medical devices, classroom packs, bulk consumables. We source it, quote it, and deliver it.</p>
          <ul className="mt-5 space-y-2 text-sm text-primary-foreground/90">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" /> Submit a product request</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" /> Request a quotation</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold" /> Institutional procurement support</li>
          </ul>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) { toast.error("Please describe what you need."); return; }
            window.open(waLink(quoteMessage(text)), "_blank");
          }}
          className="rounded-2xl bg-background/10 backdrop-blur p-5 sm:p-6 border border-primary-foreground/20"
        >
          <label className="block text-sm font-semibold">Describe what you need</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="e.g. 100 nitrile gloves, 5 Littmann stethoscopes, Gray's Anatomy (latest edition)..."
            className="mt-2 w-full rounded-lg bg-background text-foreground px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button type="submit" className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold px-5 py-3 text-sm font-semibold text-gold-foreground shadow-soft hover:opacity-95">
            Send Request on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { name: "Dr. Adewale O.", role: "Medical Officer, Osun", text: "I've ordered Littmann stethoscopes and BP monitors — authentic, well packed and fast delivery. Oriented Hub is now my go-to." },
    { name: "Mrs. Folake A.", role: "School Administrator", text: "We sourced exercise books and lab consumables for the whole term. Smooth process and great communication." },
    { name: "Mr. Ibrahim K.", role: "Hospital Procurement", text: "Their quotation turnaround is excellent. We rely on them for consumables and equipment refresh." },
  ];
  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="Testimonials" title="Trusted by professionals" center />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {t.map((x) => (
          <figure key={x.name} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}</div>
            <blockquote className="mt-3 text-sm text-foreground/90 leading-relaxed">"{x.text}"</blockquote>
            <figcaption className="mt-4">
              <div className="font-semibold text-sm">{x.name}</div>
              <div className="text-xs text-muted-foreground">{x.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function QuotationListBanner() {
  const msg = "Hello Oriented Hub, I have a list of items I would like a quotation for. I will share the list now.";
  return (
    <section className="container-page py-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-elevated">
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative grid gap-6 sm:grid-cols-[auto,1fr,auto] sm:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
            <ClipboardList className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">Bulk & institutional orders</div>
            <h3 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Have you got a list? Kindly request a quotation.</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Send us your full procurement list — books, equipment, consumables — and we'll respond with itemised pricing, availability and delivery details.</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Itemised pricing</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Institutional discounts</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Fast turnaround</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95 whitespace-nowrap">
              <FileText className="h-4 w-4" /> Send Your List on WhatsApp
            </a>
            <a href={`mailto:${EMAIL}?subject=Quotation%20Request%20-%20Item%20List`} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted whitespace-nowrap">
              <Mail className="h-4 w-4" /> Email Your List
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SalesRepBanner() {
  return (
    <section className="container-page py-6">
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-primary via-primary-deep to-primary p-6 sm:p-10 shadow-elevated">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-primary-foreground">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-gold-foreground shadow-soft">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-gold">Earn with us</div>
              <div className="font-display text-2xl font-semibold sm:text-3xl">Would you like to become a Sales Representative?</div>
              <p className="mt-2 text-sm text-primary-foreground/85 max-w-2xl">Join our nationwide partner program and earn attractive commissions selling books, medical and lab products to your network.</p>
            </div>
          </div>
          <Link to="/sales-rep" className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-soft hover:opacity-95 whitespace-nowrap">
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DeliveryBanner() {
  return (
    <section className="container-page">
      <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background/20">
            <Truck className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Worldwide delivery</div>
            <div className="font-display text-2xl font-semibold">We deliver nationwide across Nigeria — and worldwide.</div>
          </div>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-semibold text-primary hover:bg-background/90">Start Shopping <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

function WhatsAppSection() {
  return (
    <section className="container-page py-14 md:py-20">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Talk to us</div>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Order in seconds on WhatsApp</h2>
          <p className="text-muted-foreground">Send us the item, quantity and your location — we'll confirm price, availability and delivery details in minutes.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={waLink("Hello Oriented Hub, I'd like to enquire about a product.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:opacity-95">Chat on WhatsApp</a>
            <a href={`tel:+${WHATSAPP_PRIMARY}`} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted">Call us</a>
          </div>
        </div>
        <div className="grid gap-3">
          <InfoRow icon={Phone} title="WhatsApp" lines={[`+${WHATSAPP_PRIMARY}`]} />
          <InfoRow icon={Mail} title="Email" lines={[EMAIL]} />
          <InfoRow icon={MapPin} title="Office" lines={[ADDRESS]} />
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="container-page pb-14 md:pb-20">
      <div className="rounded-2xl border border-border bg-secondary/50 p-6 sm:p-10 text-center">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold">Stay in the loop</h3>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Get new arrivals, restocks and procurement updates straight to your inbox.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (!email.includes("@")) { toast.error("Enter a valid email."); return; } toast.success("Subscribed — thank you!"); setEmail(""); }} className="mt-5 mx-auto flex max-w-md flex-col sm:flex-row gap-2">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" className="rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <div className="text-xs uppercase tracking-widest text-primary font-semibold">{eyebrow}</div>}
      <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function InfoRow({ icon: Icon, title, lines }: { icon: typeof Phone; title: string; lines: string[] }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        {lines.map((l) => (<div key={l} className="font-semibold">{l}</div>))}
      </div>
    </div>
  );
}
