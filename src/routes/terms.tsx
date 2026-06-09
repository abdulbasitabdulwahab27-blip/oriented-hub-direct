import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Oriented Hub" }, { name: "description", content: "The terms governing the use of Oriented Hub services." }] }),
  component: () => (
    <article className="container-page py-12 md:py-16 max-w-3xl">
      <h1 className="font-display text-4xl font-semibold">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().getFullYear()}</p>
      <div className="mt-8 space-y-5 text-foreground/90 leading-relaxed">
        <p>By using the Oriented Hub website, you agree to the following terms.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Pricing</h2>
        <p>All prices are shown as "Price on Request". Final prices are confirmed at the point of enquiry and may vary based on availability, supplier costs and procurement conditions.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Orders</h2>
        <p>Submitting an order via cart, WhatsApp or contact form constitutes an enquiry. An order is only confirmed when our team has agreed pricing and delivery details with you.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Delivery</h2>
        <p>We offer nationwide delivery across Nigeria. Delivery timelines and fees depend on location, item availability and logistics conditions.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Books</h2>
        <p>All books supplied are physical printed books. We do not offer digital books or PDFs.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Returns</h2>
        <p>Returns are accepted for damaged or incorrectly supplied items, reported within 48 hours of delivery, in original packaging.</p>
        <h2 className="font-display text-2xl font-semibold mt-8">Contact</h2>
        <p>For questions about these terms, contact us at Orientedbanque@outlook.com.</p>
      </div>
    </article>
  ),
});
