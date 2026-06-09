import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Oriented Hub" }, { name: "description", content: "How Oriented Hub handles your data and privacy." }] }),
  component: () => (
    <article className="container-page py-12 md:py-16 max-w-3xl prose-style">
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().getFullYear()}</p>
      <div className="mt-8 space-y-5 text-foreground/90 leading-relaxed">
        <p>Oriented Hub ("we", "us") respects your privacy. This policy describes what information we collect, how we use it, and your rights.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Information we collect</h2>
        <p>We collect contact information you provide (name, phone, email, delivery address) when you enquire, place an order, or contact us via WhatsApp, email or our website forms.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">How we use it</h2>
        <p>To respond to your enquiries, confirm orders, arrange delivery, and provide customer support. We do not sell your data to third parties.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Communication</h2>
        <p>By contacting us, you consent to receive responses via WhatsApp, email or phone relating to your enquiry or order.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Your rights</h2>
        <p>You may request access, correction or deletion of your personal data by contacting us at Orientedbanque@outlook.com.</p>
      </div>
    </article>
  ),
});
