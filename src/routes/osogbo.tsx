import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, waLink } from "@/lib/whatsapp";
import { breadcrumbSchema, canonicalLink, faqSchema, pageMeta } from "@/lib/seo";
import { GEO, GOOGLE_MAPS_PLACE_URL, GOOGLE_MAPS_DIRECTIONS_URL } from "@/lib/local-seo";

const faqs = [
  {
    q: "Where is The Oriented Hub located in Osogbo?",
    a: "The Oriented Hub (Oriented Book Banque) is at 5, Oke-Fia Street, Opposite Zenith Bank, Oke-Fia, Osogbo, Osun State, Nigeria. You can open our Google Maps listing for turn-by-turn directions.",
  },
  {
    q: "What are your opening hours in Osogbo?",
    a: "We are open Monday to Saturday, 8:00am to 6:00pm. You can also order any time on WhatsApp at +234 813 654 8965.",
  },
  {
    q: "Which areas around Osun State do you serve?",
    a: "We serve Osogbo, Ilesa, Ede, Ikirun, Ile-Ife, Iwo, Ejigbo, Ikire, Gbongan, Ila-Orangun and every other town in Osun State, plus nationwide delivery across Nigeria and worldwide shipping on request.",
  },
  {
    q: "Can students and hospitals buy directly from the Osogbo shop?",
    a: "Yes. Students, lecturers, schools, hospitals, clinics, laboratories and procurement officers can walk in to buy books, medical equipment, laboratory equipment and hospital consumables, or request an itemised quotation.",
  },
];

export const Route = createFileRoute("/osogbo")({
  head: () => ({
    meta: [
      ...pageMeta({
        title: "Bookshop & Medical Equipment Supplier in Osogbo, Osun State | The Oriented Hub",
        description:
          "Visit The Oriented Hub (Oriented Book Banque) at 5 Oke-Fia Street, Opposite Zenith Bank, Osogbo, Osun State — books, medical equipment, laboratory equipment and hospital consumables. Call +234 813 654 8965.",
        path: "/osogbo",
      }),
      { name: "geo.region", content: "NG-OS" },
      { name: "geo.placename", content: "Osogbo, Osun State, Nigeria" },
      { name: "geo.position", content: `${GEO.latitude};${GEO.longitude}` },
      { name: "ICBM", content: `${GEO.latitude}, ${GEO.longitude}` },
    ],
    links: canonicalLink("/osogbo"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema(faqs)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Osogbo", path: "/osogbo" },
          ]),
        ),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Osogbo, Osun State</div>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-5xl max-w-3xl">
            Bookshop & Medical Equipment Supplier in Osogbo, Osun State
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            The Oriented Hub — also known on Google Maps as <strong>Oriented Book Banque</strong> — is a bookshop and
            medical supplies store on Oke-Fia Road, Osogbo. We supply academic and medical textbooks, medical equipment,
            laboratory equipment, hospital consumables and educational materials to students, schools, hospitals,
            clinics and laboratories across Osun State and the whole of Nigeria.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
            >
              <Navigation className="h-4 w-4" /> Get directions
            </a>
            <a
              href={waLink("Hello Oriented Hub, I am in Osogbo and I would like to make an enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-background px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Chat on WhatsApp
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-secondary"
            >
              Browse shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5 text-base leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl font-semibold">Visit our Osogbo store</h2>
          <p>
            Our shop sits at 5, Oke-Fia Street, directly opposite Zenith Bank on Oke-Fia Road, one of the busiest
            commercial corridors in Osogbo. Students from Osun State University, Ladoke Akintola University Teaching
            Hospital, the College of Health Sciences, schools of nursing and midwifery, and nearby polytechnics buy
            their required textbooks from us, while hospitals, primary health centres, diagnostic laboratories and
            private clinics restock equipment and consumables here.
          </p>
          <p>
            Walk in to browse physical stock, or send us a list and we will prepare an itemised quotation the same day.
            We handle institutional procurement, NUC and NUC-style accreditation textbook lists, laboratory set-up for
            schools, and bulk consumable supply — with delivery to anywhere in Osun State, nationwide dispatch across
            all 36 states and the FCT, and worldwide shipping on request.
          </p>
          <h2 className="font-display text-2xl font-semibold pt-2">Areas we serve around Osun State</h2>
          <p>
            Osogbo, Oke-Fia, Okefia, Alekuwodo, Igbona, Oke-Baale, Ola-Iya, Testing Ground, Dugbe, Ilesa, Ede, Ikirun,
            Ile-Ife, Iwo, Ejigbo, Ikire, Gbongan, Ila-Orangun, Ipetumodu and surrounding communities. Outside Osun
            State, we deliver to Lagos, Ibadan, Abuja, Port Harcourt, Kano, Enugu, Benin City, Kaduna, Abeokuta,
            Akure and every other city in Nigeria.
          </p>

          <h2 className="font-display text-2xl font-semibold pt-2">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3 text-sm">
            <div className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-semibold">Oriented Book Banque</div>
                <div className="text-muted-foreground">{ADDRESS}</div>
                <a
                  href={GOOGLE_MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div>+{WHATSAPP_PRIMARY}</div>
                <div className="text-muted-foreground">+{WHATSAPP_ALT}</div>
                <a href={`mailto:${EMAIL}`} className="text-primary hover:underline break-all">
                  {EMAIL}
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>Monday – Saturday, 8:00am – 6:00pm</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border shadow-card">
            <iframe
              title="The Oriented Hub location on Google Maps — Oke-Fia, Osogbo"
              src={`https://www.google.com/maps?q=${GEO.latitude},${GEO.longitude}&z=15&output=embed`}
              width="100%"
              height="300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </aside>
      </section>
    </div>
  );
}
