import catBooks from "@/assets/cat-books.jpg";
import catMedical from "@/assets/cat-medical.jpg";
import catLab from "@/assets/cat-lab.jpg";
import catConsumables from "@/assets/cat-consumables.jpg";
import catEducation from "@/assets/cat-education.jpg";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "books", name: "Books", tagline: "Academic, medical, JAMB & WAEC", image: catBooks },
  { slug: "medical-equipment", name: "Medical Equipment", tagline: "Diagnostic & clinical tools", image: catMedical },
  { slug: "laboratory", name: "Laboratory Instruments", tagline: "Microscopes, glassware, reagents", image: catLab },
  { slug: "consumables", name: "Hospital Consumables", tagline: "PPE, syringes, dressings", image: catConsumables },
  { slug: "educational", name: "Educational Materials", tagline: "Stationery, learning aids", image: catEducation },
];

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  bestSeller?: boolean;
};

export const products: Product[] = [
  // Books
  { id: "b1", slug: "harrisons-principles-of-internal-medicine", name: "Harrison's Principles of Internal Medicine", category: "books", image: catBooks, description: "The definitive global reference in internal medicine for clinicians, residents and medical students.", features: ["Latest edition", "Hardcover, 2-volume set", "Authentic publisher copy"], bestSeller: true },
  { id: "b2", slug: "grays-anatomy-for-students", name: "Gray's Anatomy for Students", category: "books", image: catBooks, description: "Best-selling anatomy textbook with rich clinical correlations and illustrations.", features: ["Full color", "Clinical cases", "Latest edition"], bestSeller: true },
  { id: "b3", slug: "guyton-hall-physiology", name: "Guyton & Hall Textbook of Medical Physiology", category: "books", image: catBooks, description: "World-renowned physiology text trusted by medical schools worldwide.", features: ["Authentic copy", "Updated content"] },
  { id: "b4", slug: "jamb-utme-past-questions", name: "JAMB UTME Past Questions Compendium", category: "books", image: catBooks, description: "Comprehensive collection of past UTME questions with detailed solutions across all subjects.", features: ["All subjects", "Worked solutions", "Latest syllabus"] },
  { id: "b5", slug: "waec-ssce-revision-pack", name: "WAEC SSCE Revision Pack", category: "books", image: catBooks, description: "Subject-by-subject revision pack for WAEC SSCE candidates.", features: ["Core subjects", "Practice questions"] },
  { id: "b6", slug: "principles-of-management", name: "Principles of Management", category: "books", image: catBooks, description: "Foundational management text for undergraduate and MBA programs.", features: ["University-recommended"] },
  { id: "b7", slug: "sociology-themes-perspectives", name: "Sociology: Themes & Perspectives", category: "books", image: catBooks, description: "Comprehensive sociology reference for social science students.", features: ["Latest edition"] },

  // Medical Equipment
  { id: "m1", slug: "littmann-classic-iii-stethoscope", name: "Littmann Classic III Stethoscope", category: "medical-equipment", image: catMedical, description: "Premium dual-head stethoscope for clinicians and medical students.", features: ["Authentic 3M Littmann", "Tunable diaphragm", "5-year warranty"], bestSeller: true },
  { id: "m2", slug: "digital-bp-monitor-omron", name: "Digital Blood Pressure Monitor (Omron)", category: "medical-equipment", image: catMedical, description: "Clinically validated digital BP monitor with cuff-fit indicator.", features: ["Auto inflation", "Memory storage", "1-year warranty"], bestSeller: true },
  { id: "m3", slug: "pulse-oximeter-fingertip", name: "Fingertip Pulse Oximeter", category: "medical-equipment", image: catMedical, description: "Accurate SpO2 and pulse rate measurement with OLED display.", features: ["FDA/CE certified", "Adult & pediatric"] },
  { id: "m4", slug: "infrared-thermometer", name: "Non-Contact Infrared Thermometer", category: "medical-equipment", image: catMedical, description: "Fast, hygienic temperature measurement for clinics and schools.", features: ["1-second reading", "Memory function"] },
  { id: "m5", slug: "nebulizer-machine", name: "Compressor Nebulizer Machine", category: "medical-equipment", image: catMedical, description: "Reliable compressor nebulizer for respiratory therapy.", features: ["Adult & child masks", "Quiet operation"] },
  { id: "m6", slug: "wheelchair-foldable", name: "Foldable Standard Wheelchair", category: "medical-equipment", image: catMedical, description: "Sturdy foldable wheelchair suitable for hospital and home use.", features: ["Removable footrest", "Heavy-duty frame"] },

  // Laboratory
  { id: "l1", slug: "binocular-compound-microscope", name: "Binocular Compound Microscope", category: "laboratory", image: catLab, description: "Professional binocular microscope with 40x–1000x magnification.", features: ["LED illumination", "Achromatic objectives"], bestSeller: true },
  { id: "l2", slug: "centrifuge-machine-8tube", name: "8-Tube Laboratory Centrifuge", category: "laboratory", image: catLab, description: "Compact benchtop centrifuge for clinical and research labs.", features: ["Digital timer", "Up to 4000 rpm"] },
  { id: "l3", slug: "autoclave-sterilizer", name: "Autoclave Sterilizer (24L)", category: "laboratory", image: catLab, description: "Pressure steam sterilizer for instruments and lab consumables.", features: ["Stainless steel chamber", "Safety valve"] },
  { id: "l4", slug: "glassware-beaker-set", name: "Borosilicate Glassware Beaker Set", category: "laboratory", image: catLab, description: "Set of borosilicate beakers (50ml–1000ml) with graduated markings.", features: ["Heat resistant", "Lab grade"] },
  { id: "l5", slug: "ph-meter-digital", name: "Digital pH Meter", category: "laboratory", image: catLab, description: "Accurate digital pH meter with calibration buffers.", features: ["Auto-calibration", "LCD display"] },

  // Consumables
  { id: "c1", slug: "examination-gloves-nitrile", name: "Nitrile Examination Gloves (Box of 100)", category: "consumables", image: catConsumables, description: "Powder-free nitrile examination gloves for clinical use.", features: ["Latex-free", "Textured fingertips"], bestSeller: true },
  { id: "c2", slug: "disposable-syringes-5ml", name: "Disposable Syringes 5ml (Box of 100)", category: "consumables", image: catConsumables, description: "Sterile single-use syringes with luer-slip tips.", features: ["Sterile packed", "Bulk pricing available"] },
  { id: "c3", slug: "surgical-face-mask-3ply", name: "3-Ply Surgical Face Masks (Box of 50)", category: "consumables", image: catConsumables, description: "Triple-layer surgical masks with adjustable nose clip.", features: ["BFE ≥ 95%", "Hypoallergenic"] },
  { id: "c4", slug: "sterile-gauze-pads", name: "Sterile Gauze Pads (Pack)", category: "consumables", image: catConsumables, description: "Absorbent sterile gauze pads for wound dressing.", features: ["Individually wrapped"] },
  { id: "c5", slug: "iv-cannula-set", name: "IV Cannula Set (Assorted Sizes)", category: "consumables", image: catConsumables, description: "Sterile IV cannulas for intravenous access.", features: ["Multiple gauges", "Hospital grade"] },

  // Educational
  { id: "e1", slug: "geometry-mathematical-set", name: "Mathematical Geometry Set", category: "educational", image: catEducation, description: "Complete geometry set for students at all levels.", features: ["Metal case", "Precision tools"] },
  { id: "e2", slug: "scientific-calculator", name: "Scientific Calculator (Casio fx-991)", category: "educational", image: catEducation, description: "Advanced scientific calculator approved for examinations.", features: ["417 functions", "Authentic Casio"] },
  { id: "e3", slug: "exercise-notebooks-bulk", name: "Exercise Notebooks (Bulk Pack)", category: "educational", image: catEducation, description: "Quality exercise notebooks supplied in bulk for schools.", features: ["80–200 pages", "Bulk pricing"] },
  { id: "e4", slug: "classroom-whiteboard-marker", name: "Whiteboard Marker Set", category: "educational", image: catEducation, description: "Dry-erase whiteboard markers for classrooms and offices.", features: ["Assorted colors", "Long-lasting"] },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id || p.slug === id);
}
export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function productsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}
export const bestSellers = products.filter((p) => p.bestSeller);
