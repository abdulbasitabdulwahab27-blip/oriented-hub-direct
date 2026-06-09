import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, ShieldCheck, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Us — Oriented Hub" },
    { name: "description", content: "Oriented Hub is a procurement-based platform supplying quality books, medical equipment, lab instruments and educational materials across Nigeria." },
    { property: "og:title", content: "About Oriented Hub" },
    { property: "og:description", content: "Quality Products. Better Care. Total Solutions." },
  ] }),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container-page py-14 md:py-20 max-w-3xl">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">About Oriented Hub</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold">Procurement built around quality, care and trust.</h1>
          <p className="mt-5 text-lg text-muted-foreground">We exist to make sourcing reliable products simple — for hospitals, schools, laboratories, institutions and individuals across Nigeria.</p>
        </div>
      </section>

      <section className="container-page py-14 md:py-20 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-semibold">Our story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">Oriented Hub was founded to close a gap in Nigeria's procurement ecosystem: institutions and individuals struggled to source authentic books, medical devices and lab supplies under one trusted roof. Today we supply healthcare facilities, schools, universities and private buyers — combining verified suppliers, transparent communication and reliable nationwide logistics.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: ShieldCheck, title: "Authenticity", text: "Only verified, authorised suppliers." },
            { icon: Award, title: "Quality", text: "Institutional-grade products end-to-end." },
            { icon: Heart, title: "Care", text: "Built for hospitals, schools and learners." },
            { icon: Target, title: "Delivery", text: "Nationwide coverage, on-time fulfilment." },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground"><v.icon className="h-5 w-5" /></div>
              <div className="mt-3 font-display font-semibold">{v.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-14">
        <div className="container-page text-center max-w-2xl">
          <h2 className="font-display text-3xl font-semibold">Ready to source with us?</h2>
          <p className="mt-3 text-muted-foreground">Browse our catalogue or send your procurement list — we'll handle the rest.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/shop" className="rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">Browse Shop</Link>
            <Link to="/contact" className="rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
