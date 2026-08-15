import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/hospital-consumables-and-stationeries")({
  head: () => ({
    meta: [
      { title: "Hospital Consumables and Stationeries | The Oriented Hub | Worldwide Shipping" },
      { name: "description", content: "Hospital consumables and medical stationeries — gloves, syringes, dressings, PPE, case notes and ward registers. Worldwide shipping. Call +234 813 654 8965." },
      { property: "og:title", content: "Hospital Consumables and Stationeries | The Oriented Hub" },
      { property: "og:description", content: "Bulk hospital consumables, PPE and medical stationeries delivered worldwide." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.theorientedhub.com/hospital-consumables-and-stationeries" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.theorientedhub.com/hospital-consumables-and-stationeries" }],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoInfoPage
      eyebrow="Consumables & stationeries"
      title="Hospital Consumables and Stationeries"
      intro="Reliable, continuous supply of the consumables and record-keeping materials every hospital, clinic and health centre depends on."
      paragraphs={[
        "The Oriented Hub supplies hospital consumables in retail and bulk quantities: examination and surgical gloves, disposable syringes and needles, IV cannulae and giving sets, cotton wool, gauze, conforming and crepe bandages, plasters, sutures, urine bags, catheters, specimen bottles, sterile dressing packs and disinfectants. Our personal protective equipment range covers surgical face masks, bouffant caps, aprons, shoe covers and disposable surgical gowns.",
        "Alongside clinical consumables we provide the medical stationeries that keep clinical records accurate and audit-ready — patient case notes and folders, admission and discharge registers, ward and theatre registers, nursing kardex sheets, observation and vital-signs charts, drug administration charts, laboratory request and result forms, referral letters, receipt books and customised printed forms bearing your facility's name and logo.",
        "Because consumables are recurring purchases, we offer scheduled supply arrangements, standing quotations and institutional discounts so your store never runs dry. Orders are packed by department for easy check-in and dispatched promptly to hospitals, clinics, NGOs and health programmes.",
      ]}
    />
  );
}
