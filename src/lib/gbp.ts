import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, WHATSAPP_UK } from "./whatsapp";
import { GOOGLE_MAPS_PLACE_URL } from "./local-seo";
import { SITE_URL } from "./seo";

/**
 * Google Business Profile optimisation source of truth.
 * The same data powers the on-site "Services & products" blocks, the
 * Service/OfferCatalog schema on landing pages and the GBP setup checklist.
 */

export const GBP_BUSINESS = {
  name: "The Oriented Hub",
  alternateName: "Oriented Book Banque",
  address: ADDRESS,
  addressLines: {
    street: "15, Oke-Fia Street, Opposite Zenith Bank",
    city: "Osogbo",
    region: "Osun State",
    postalCode: "230001",
    country: "Nigeria",
  },
  phonePrimary: "+234 813 654 8965",
  phoneAlt: "+234 906 400 7879",
  phoneUk: "+44 7587 869499",
  whatsapp: { primary: WHATSAPP_PRIMARY, alt: WHATSAPP_ALT, uk: WHATSAPP_UK },
  email: EMAIL,
  website: SITE_URL,
  mapsUrl: GOOGLE_MAPS_PLACE_URL,
  hours: "Monday – Saturday, 8:00am – 6:00pm (closed Sunday)",
  serviceArea: "Osogbo, Ile-Ife, Ilesa, Iwo, Ede, Ikirun and the whole of Osun State, with nationwide delivery across Nigeria and worldwide shipping on request.",
};

export const GBP_CATEGORIES = {
  primary: "Medical equipment supplier",
  secondary: [
    "Book store",
    "Laboratory equipment supplier",
    "Medical supply store",
    "School supply store",
    "Office supply store",
    "Wholesaler",
  ],
};

export const GBP_ATTRIBUTES = [
  "In-store shopping",
  "In-store pickup",
  "Delivery",
  "Wheelchair accessible entrance",
  "Accepts bank transfer",
  "Onsite services",
  "Quotations for institutions",
];

export type GbpPageProfile = {
  /** Landing page path this profile belongs to. */
  path: string;
  /** GBP service group label. */
  label: string;
  /** Short GBP service description (max ~300 chars in GBP). */
  description: string;
  /** Services to add under this group in the GBP "Services" tab. */
  services: string[];
  /** Products to add in the GBP "Products" tab for this group. */
  products: { name: string; priceNote: string }[];
};

export const GBP_PAGE_PROFILES: GbpPageProfile[] = [
  {
    path: "/medical-equipment",
    label: "Medical equipment supply",
    description:
      "Supply and delivery of hospital and clinic medical equipment in Osogbo, Osun State and nationwide across Nigeria, with installation guidance and institutional quotations.",
    services: [
      "Hospital medical equipment supply",
      "Clinic and health centre equipment supply",
      "Nursing school skills-lab equipment",
      "Patient monitoring and diagnostic equipment",
      "Delivery and installation guidance",
      "Institutional quotation and procurement",
    ],
    products: [
      { name: "Patient monitors and vital-signs monitors", priceNote: "Quote on request" },
      { name: "Infant incubators and phototherapy units", priceNote: "Quote on request" },
      { name: "CPR manikins and nursing simulators", priceNote: "From ₦150,000" },
      { name: "Anatomical models and charts", priceNote: "From ₦15,000" },
      { name: "Suction machines and nebulisers", priceNote: "Quote on request" },
      { name: "Examination couches and hospital beds", priceNote: "Quote on request" },
    ],
  },
  {
    path: "/laboratory-equipment",
    label: "Laboratory equipment supply",
    description:
      "Laboratory equipment, glassware, reagents and consumables for hospitals, universities, polytechnics and private labs in Osun State and across Nigeria.",
    services: [
      "Hospital and diagnostic laboratory equipment supply",
      "University and polytechnic teaching-lab set-up",
      "Laboratory glassware and reagents supply",
      "NUC / NBTE accreditation laboratory lists",
      "Bulk laboratory consumables supply",
    ],
    products: [
      { name: "Binocular and LCD microscopes", priceNote: "From ₦250,000" },
      { name: "Centrifuges", priceNote: "From ₦180,000" },
      { name: "Electrophoresis machines", priceNote: "Quote on request" },
      { name: "Laboratory glassware sets", priceNote: "From ₦20,000" },
      { name: "Reagents and stains", priceNote: "Quote on request" },
    ],
  },
  {
    path: "/books",
    label: "Academic and medical books",
    description:
      "Authentic printed academic, medical, nursing and law textbooks for students and institutions — WAEC, JAMB, university and professional titles. No PDFs.",
    services: [
      "Medical and nursing textbook supply",
      "Law and social science textbook supply",
      "WAEC and JAMB textbook supply",
      "Library and bookshop bulk supply",
      "Book sourcing and importation",
    ],
    products: [
      { name: "Ross & Wilson Anatomy and Physiology", priceNote: "Quote on request" },
      { name: "Brunner & Suddarth's Medical-Surgical Nursing", priceNote: "Quote on request" },
      { name: "BD Chaurasia's Human Anatomy", priceNote: "Quote on request" },
      { name: "Robbins Pathologic Basis of Disease", priceNote: "Quote on request" },
      { name: "Nigerian Legal System / Constitutional Law", priceNote: "₦14,000" },
    ],
  },
  {
    path: "/nuc-accreditation-books",
    label: "NUC accreditation textbooks",
    description:
      "Complete NUC and NBTE accreditation textbook lists supplied to universities, colleges of health and schools of nursing, with invoices and delivery documentation.",
    services: [
      "NUC accreditation textbook list supply",
      "NBTE and NMCN accreditation book supply",
      "Departmental library stocking",
      "Accreditation documentation and invoicing",
      "Bulk delivery to campuses nationwide",
    ],
    products: [
      { name: "Full NUC accreditation textbook list (per programme)", priceNote: "Quote on request" },
      { name: "Nursing accreditation book bundle", priceNote: "Quote on request" },
      { name: "Medicine and surgery accreditation bundle", priceNote: "Quote on request" },
    ],
  },
  {
    path: "/hospital-consumables",
    label: "Hospital consumables and stationery",
    description:
      "Hospital consumables, disposables and medical stationery supplied in bulk to hospitals, clinics, laboratories and schools in Osogbo and nationwide.",
    services: [
      "Hospital consumables bulk supply",
      "Disposables and PPE supply",
      "Medical records and stationery supply",
      "Monthly restocking contracts",
    ],
    products: [
      { name: "Gloves, syringes and needles", priceNote: "Quote on request" },
      { name: "Cotton wool, gauze and bandages", priceNote: "Quote on request" },
      { name: "Case notes, folders and hospital stationery", priceNote: "Quote on request" },
    ],
  },
  {
    path: "/surgical-instruments",
    label: "Surgical instruments supply",
    description:
      "Stainless-steel surgical instruments and theatre sets for hospitals, teaching hospitals and schools of nursing across Nigeria.",
    services: [
      "Surgical instrument supply",
      "Theatre set assembly",
      "Dissecting and minor-surgery sets for schools",
      "Sterilisation equipment supply",
    ],
    products: [
      { name: "Minor surgery sets", priceNote: "Quote on request" },
      { name: "Dissecting sets", priceNote: "From ₦25,000" },
      { name: "Autoclaves and sterilisers", priceNote: "Quote on request" },
    ],
  },
  {
    path: "/scientific-instruments",
    label: "Scientific instruments supply",
    description:
      "Scientific and teaching instruments for secondary schools, colleges and universities — physics, chemistry and biology laboratory equipment.",
    services: [
      "School science laboratory set-up",
      "Physics, chemistry and biology apparatus supply",
      "Teaching aids and models supply",
      "Bulk supply to state education boards",
    ],
    products: [
      { name: "Physics apparatus kits", priceNote: "Quote on request" },
      { name: "Chemistry glassware and reagents", priceNote: "Quote on request" },
      { name: "Biology models and charts", priceNote: "From ₦15,000" },
    ],
  },
];

export const gbpProfileFor = (path: string) => GBP_PAGE_PROFILES.find((p) => p.path === path);

/** FAQ block reused on GBP (Q&A tab) and on-site FAQ sections. */
export const GBP_FAQS = [
  {
    q: "Where is The Oriented Hub located?",
    a: `The Oriented Hub is at ${GBP_BUSINESS.addressLines.street}, ${GBP_BUSINESS.addressLines.city}, ${GBP_BUSINESS.addressLines.region}, Nigeria. We are open ${GBP_BUSINESS.hours}.`,
  },
  {
    q: "What phone number can I call or WhatsApp?",
    a: `Call or WhatsApp ${GBP_BUSINESS.phonePrimary} or ${GBP_BUSINESS.phoneAlt}. International customers can reach us on ${GBP_BUSINESS.phoneUk}, or email ${GBP_BUSINESS.email}.`,
  },
  {
    q: "What does The Oriented Hub sell?",
    a: "Medical equipment, laboratory equipment, surgical and scientific instruments, hospital consumables and stationery, and authentic printed academic, medical, nursing and law textbooks including full NUC accreditation lists.",
  },
  {
    q: "Do you deliver outside Osogbo?",
    a: GBP_BUSINESS.serviceArea,
  },
  {
    q: "Can hospitals and universities get an official quotation and invoice?",
    a: "Yes. Send your item list or accreditation list on WhatsApp or email and we issue a formal quotation and invoice suitable for procurement, accreditation and audit purposes.",
  },
  {
    q: "Do you offer bulk or institutional discounts?",
    a: "Yes. Hospitals, universities, colleges of health, schools of nursing, laboratories and bookshops receive tiered institutional pricing on bulk orders.",
  },
  {
    q: "Do you sell PDFs or ebooks?",
    a: "No. We supply authentic physical printed books only, sourced from authorised distributors and publishers.",
  },
];
