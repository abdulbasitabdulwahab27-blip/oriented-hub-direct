import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { canonicalLink, pageMeta } from "@/lib/seo";
import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, waLink } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: "Contact The Oriented Hub | Osogbo, Nigeria",
      description: "Contact The Oriented Hub via WhatsApp +234 813 654 8965, email or visit 15 Oke-Fia Street, Opposite Zenith Bank, Osogbo. Bulk and institutional orders welcome.",
      path: "/contact",
    }),
    links: canonicalLink("/contact"),
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Please check your details."); return; }
    const msg = `Hello Oriented Hub,\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(waLink(msg), "_blank");
    toast.success("Message ready in WhatsApp.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Contact</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold">We'd love to hear from you.</h1>
          <p className="mt-5 text-lg text-muted-foreground">Send us your enquiry and we'll get back to you within hours.</p>
        </div>
      </section>

      <section className="container-page py-14 md:py-20 grid gap-10 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-2xl font-semibold">Send a message</h2>
          <label className="block">
            <span className="text-sm font-semibold">Full Name *</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Email *</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Message *</span>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <button type="submit" className="w-full rounded-md bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">Send via WhatsApp</button>
        </form>
        <div className="space-y-4">
          <InfoCard icon={Phone} title="WhatsApp" lines={[`+${WHATSAPP_PRIMARY}`, `Alt: +${WHATSAPP_ALT}`]} href={waLink("Hello Oriented Hub")} />
          <InfoCard icon={Mail} title="Email" lines={[EMAIL]} href={`mailto:${EMAIL}`} />
          <InfoCard icon={MapPin} title="Office" lines={[ADDRESS]} />
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, lines, href }: { icon: typeof Mail; title: string; lines: string[]; href?: string }) {
  const inner = (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        {lines.map((l) => <div key={l} className="font-semibold">{l}</div>)}
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : inner;
}
