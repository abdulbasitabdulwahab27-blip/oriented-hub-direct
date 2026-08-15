import { createFileRoute } from "@tanstack/react-router";
import { SeoInfoPage } from "@/components/SeoInfoPage";

export const Route = createFileRoute("/laboratory-equipment-supplier")({
  head: () => ({
    meta: [
      { title: "Laboratory Equipment Supplier | The Oriented Hub | Worldwide Shipping" },
      { name: "description", content: "Global laboratory equipment supplier — microscopes, centrifuges, incubators, reagents and glassware for hospitals, schools and research labs. Worldwide shipping. Call +234 813 654 8965." },
      { property: "og:title", content: "Laboratory Equipment Supplier | The Oriented Hub" },
      { property: "og:description", content: "Microscopes, centrifuges, analysers, glassware and reagents shipped worldwide." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.theorientedhub.com/laboratory-equipment-supplier" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.theorientedhub.com/laboratory-equipment-supplier" }],
  }),
  component: Page,
});

function Page() {
  return (
    <SeoInfoPage
      eyebrow="Laboratory equipment"
      title="Laboratory Equipment Supplier"
      intro="Complete laboratory fit-outs and consumables for medical laboratories, universities, secondary schools and research institutions."
      paragraphs={[
        "The Oriented Hub supplies laboratory equipment for medical laboratories, university science departments, secondary school science labs, research centres and industrial quality-control units. Our range includes binocular and digital microscopes, centrifuges, incubators, hot air ovens, autoclaves, water baths, hotplates, magnetic stirrers, colorimeters, spectrophotometers, haematology and chemistry analysers, weighing balances and pH meters.",
        "We also supply the day-to-day essentials that keep a laboratory running: borosilicate glassware, pipettes and tips, petri dishes, test tubes and racks, slides and cover slips, sample containers, staining kits, diagnostic reagents, rapid test kits and safety wear such as lab coats, goggles and gloves. Items are sourced from reputable manufacturers and delivered with the certificates and documentation your accreditation body expects.",
        "Our procurement team works with laboratory scientists and school administrators to build equipment lists that satisfy accreditation and curriculum requirements within budget. From a single microscope to a full laboratory installation, we quote transparently, deliver on schedule and remain available for support after delivery.",
      ]}
    />
  );
}
