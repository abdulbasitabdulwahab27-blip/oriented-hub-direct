import { SITE_URL } from "./seo";

/** Google Business Profile (Google Maps) listing for the Osogbo store. */
export const GOOGLE_MAPS_PLACE_URL = "https://maps.app.goo.gl/hUapWsFdGWzvoAPc8";
export const GOOGLE_MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Oriented+Book+Banque,+Oke+Fia+Road,+Osogbo,+Osun+State,+Nigeria";

export const GEO = { latitude: 7.77104, longitude: 4.55698 };

export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "15, Oke-Fia Street, Opposite Zenith Bank",
  addressLocality: "Osogbo",
  addressRegion: "Osun State",
  addressCountry: "NG",
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "The Oriented Hub",
  alternateName: ["Oriented Book Banque", "Oriented Hub", "Oriented Hub Osogbo"],
  description:
    "Bookshop and medical supplies store in Osogbo, Osun State supplying academic and medical textbooks, medical equipment, laboratory equipment, hospital consumables and educational materials across Nigeria and worldwide.",
  url: SITE_URL,
  image: `${SITE_URL}/favicon.ico`,
  email: "Orientedbanque@outlook.com",
  telephone: "+2348136548965",
  priceRange: "$$",
  currenciesAccepted: "NGN",
  address: POSTAL_ADDRESS,
  geo: { "@type": "GeoCoordinates", latitude: GEO.latitude, longitude: GEO.longitude },
  hasMap: GOOGLE_MAPS_PLACE_URL,
  sameAs: [GOOGLE_MAPS_PLACE_URL],
  areaServed: [
    { "@type": "City", name: "Osogbo" },
    { "@type": "AdministrativeArea", name: "Osun State" },
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Place", name: "Worldwide" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
};
