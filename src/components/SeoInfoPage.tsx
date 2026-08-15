import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, WHATSAPP_UK, waLink } from "@/lib/whatsapp";

export const WORLDWIDE_LINE =
  "We offer worldwide shipping to USA, Canada, UK, Europe, Africa, Asia and globally. Contact +234 813 654 8965 to order.";

export function SeoInfoPage({
  eyebrow,
  title,
  intro,
  paragraphs,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs: string[];
}) {
  return (
    <div>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{eyebrow}</div>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-5xl max-w-3xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={waLink(`Hello Oriented Hub, I would like to enquire about ${title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
            >
              Order on WhatsApp
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-background px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Browse Shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="font-semibold text-primary">{WORLDWIDE_LINE}</p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl text-sm">
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Call / WhatsApp</div>
            <div className="font-semibold">+{WHATSAPP_PRIMARY}</div>
            <div className="text-xs text-muted-foreground">+{WHATSAPP_ALT}</div>
            <div className="text-xs text-muted-foreground">UK: +{WHATSAPP_UK}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
            <a href={`mailto:${EMAIL}`} className="font-semibold hover:text-primary break-all">{EMAIL}</a>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Head Office</div>
            <div className="font-semibold text-sm">{ADDRESS}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
