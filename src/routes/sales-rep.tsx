import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, CheckCircle2, TrendingUp, Users, Wallet, Award, GraduationCap, HeartHandshake } from "lucide-react";
import { waLink, salesRepMessage } from "@/lib/whatsapp";

export const Route = createFileRoute("/sales-rep")({
  head: () => ({
    meta: [
      { title: "Become a Sales Representative — Oriented Hub" },
      { name: "description", content: "Join the Oriented Hub sales team. Earn attractive commissions promoting books, medical equipment, lab equipment and educational materials across Nigeria." },
      { property: "og:title", content: "Become a Sales Representative — Oriented Hub" },
      { property: "og:description", content: "Partner with Oriented Hub and earn commissions on every successful order. Apply in minutes via WhatsApp." },
    ],
  }),
  component: SalesRepPage,
});

function SalesRepPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    occupation: "",
    experience: "",
    why: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) {
      toast.error("Please fill in your name, phone and location.");
      return;
    }
    window.open(waLink(salesRepMessage(form)), "_blank");
    toast.success("Opening WhatsApp to send your application...");
  }

  const benefits = [
    { icon: Wallet, title: "Attractive commissions", text: "Earn a generous percentage on every successful sale you bring in." },
    { icon: TrendingUp, title: "Unlimited earnings", text: "No earnings cap — the more you sell, the more you earn." },
    { icon: Users, title: "Wide product range", text: "Sell books, medical equipment, lab equipment, consumables and education materials." },
    { icon: Award, title: "Marketing support", text: "We provide product info, pricing guides and branded materials." },
    { icon: GraduationCap, title: "Training included", text: "Free onboarding and product training to help you close more deals." },
    { icon: HeartHandshake, title: "Flexible & remote", text: "Work from anywhere in Nigeria, full-time or part-time." },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container-page py-14 md:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-primary">
              <Briefcase className="h-3.5 w-3.5" /> Partner Program
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Become an <span className="text-primary">Oriented Hub</span> Sales Representative
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Join our nationwide network of representatives selling premium books, medical and laboratory products to schools, hospitals and individuals — and earn attractive commissions on every sale.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Earn commission on every successful order", "Work part-time or full-time, from anywhere", "Get free training and marketing support"].map((x) => (
                <li key={x} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> {x}</li>
              ))}
            </ul>
            <a href="#apply" className="mt-7 inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-soft hover:opacity-95">
              Apply Now
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <h2 className="font-display text-xl font-semibold">Who we're looking for</h2>
            <ul className="mt-4 space-y-3 text-sm text-foreground/90">
              {[
                "Students, teachers, healthcare workers, marketers",
                "Anyone with a network of schools, hospitals or institutions",
                "Self-motivated individuals with strong communication skills",
                "Resellers and distributors looking to expand their catalogue",
              ].map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" /> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Why join us</div>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Benefits of becoming a Sales Rep</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="bg-secondary/40 py-14 md:py-20 scroll-mt-20">
        <div className="container-page grid gap-10 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">Application</div>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Apply in minutes</h2>
            <p className="mt-3 text-muted-foreground">
              Fill in the form and we'll receive your application instantly via WhatsApp. Our team will respond with next steps, commission structure and onboarding details.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span> Submit your details</li>
              <li className="flex gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span> Quick interview on WhatsApp</li>
              <li className="flex gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span> Onboarding & start earning</li>
            </ul>
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" value={form.name} onChange={(v) => update("name", v)} placeholder="John Doe" />
              <Field label="Phone / WhatsApp *" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+234 800 000 0000" type="tel" />
              <Field label="Email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@email.com" type="email" />
              <Field label="Location (City, State) *" value={form.location} onChange={(v) => update("location", v)} placeholder="Osogbo, Osun" />
              <Field label="Occupation / Profession" value={form.occupation} onChange={(v) => update("occupation", v)} placeholder="Student, Teacher, Nurse..." />
              <Field label="Sales experience" value={form.experience} onChange={(v) => update("experience", v)} placeholder="e.g. 2 years retail sales" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Why do you want to join Oriented Hub?</label>
              <textarea
                value={form.why}
                onChange={(e) => update("why", e.target.value)}
                rows={4}
                maxLength={800}
                placeholder="Tell us briefly about your network and motivation..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95">
              Submit Application via WhatsApp
            </button>
            <p className="text-xs text-muted-foreground text-center">By submitting you agree to be contacted by Oriented Hub regarding the Sales Rep program.</p>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
