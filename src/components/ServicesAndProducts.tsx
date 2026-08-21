import { Check, Package } from "lucide-react";
import { gbpProfileFor, GBP_BUSINESS } from "@/lib/gbp";
import { waLink } from "@/lib/whatsapp";

/**
 * On-page "Services & products" block mirroring the Google Business Profile
 * service groups for this landing page. Keeps GBP and website content aligned.
 */
export function ServicesAndProducts({ path }: { path: string }) {
  const profile = gbpProfileFor(path);
  if (!profile) return null;

  return (
    <section className="container-page pb-14">
      <h2 className="font-display text-2xl font-semibold">{profile.label} — services &amp; products</h2>
      <p className="mt-2 max-w-3xl text-muted-foreground leading-relaxed">{profile.description}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold">Services we provide</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {profile.services.map((s) => (
              <li key={s} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-semibold">Popular products</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {profile.products.map((p) => (
              <li key={p.name} className="flex items-start justify-between gap-3">
                <span className="flex gap-2">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {p.name}
                </span>
                <span className="shrink-0 text-xs font-semibold text-primary">{p.priceNote}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        Visit us at {GBP_BUSINESS.address} — {GBP_BUSINESS.hours}. Call or WhatsApp{" "}
        <a className="font-semibold text-primary" href={waLink(`Hello Oriented Hub, I need a quote for ${profile.label}.`)}>
          {GBP_BUSINESS.phonePrimary}
        </a>{" "}
        or {GBP_BUSINESS.phoneAlt}.
      </p>
    </section>
  );
}
