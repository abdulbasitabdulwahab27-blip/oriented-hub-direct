import catBooks from "@/assets/cat-books.jpg";
import catMedical from "@/assets/cat-medical.jpg";
import catLab from "@/assets/cat-lab.jpg";
import catConsumables from "@/assets/cat-consumables.jpg";
import catEducation from "@/assets/cat-education.jpg";
import p100img from "@/assets/products/hutchison-clinical-methods.jpg.asset.json";
import p101img from "@/assets/products/clinical-biochemistry-crook.jpg.asset.json";
import p102img from "@/assets/products/public-health-tropics-lucas.jpg.asset.json";
import p103img from "@/assets/products/lippincott-pharmacology-whalen.jpg.asset.json";
import p104img from "@/assets/products/fundamentals-of-nursing-taylor.jpg.asset.json";
import p105img from "@/assets/products/clinical-nursing-procedures-jacob.jpg.asset.json";
import p106img from "@/assets/products/civil-litigation-adefope-okojie.jpg.asset.json";
import p107img from "@/assets/products/high-court-civil-procedure-rules.jpg.asset.json";
import p108img from "@/assets/products/compendium-clinical-medicine-falase.jpg.asset.json";
import p109img from "@/assets/products/genetics-rastogi.jpg.asset.json";
import p110img from "@/assets/products/nigerian-constitutional-law-malemi.jpg.asset.json";
import p111img from "@/assets/products/nigerian-legal-system-malemi.jpg.asset.json";
import p112img from "@/assets/products/midwifery-gynae-nursing-jacob.jpg.asset.json";
import p113img from "@/assets/products/midwifery-for-nurses-elizabeth.jpg.asset.json";
import p114img from "@/assets/products/general-nursing-midwifery-clement.jpg.asset.json";
import p115img from "@/assets/products/islamic-law-of-evidence-hammed.jpg.asset.json";
import p116img from "@/assets/products/adr-arbitration-nigeria-ajetunmobi.jpg.asset.json";
import p117img from "@/assets/products/evidence-act-2011-amended-2023.jpg.asset.json";
import p118img from "@/assets/products/aguda-law-of-evidence.jpg.asset.json";
import p119img from "@/assets/products/paediatrics-tropical-azubuike.jpg.asset.json";
import p120img from "@/assets/products/obstetrics-by-ten-teachers.jpg.asset.json";
import p121img from "@/assets/products/cunningham-anatomy-limbs-koshi.jpg.asset.json";
import p122img from "@/assets/products/medical-law-ethics-nigeria-emiri.jpg.asset.json";
import p123img from "@/assets/products/constitution-frn-1999-amended-2023.jpg.asset.json";
import p124img from "@/assets/products/principles-civil-procedure-efevwerhan.jpg.asset.json";
import p125img from "@/assets/products/criminal-code-efcc.jpg.asset.json";
import p126img from "@/assets/products/law-of-tort-malemi.jpg.asset.json";
import p127img from "@/assets/products/penal-code-northern-nigeria.jpg.asset.json";
import p128img from "@/assets/products/cunningham-thorax-abdomen-koshi.jpg.asset.json";
import p129img from "@/assets/products/brunner-medical-surgical-nursing.jpg.asset.json";
import p130img from "@/assets/products/primary-health-care-developing-countries.jpg.asset.json";
import p131img from "@/assets/products/digital-sat-study-guide-2026.jpg.asset.json";
import p132img from "@/assets/products/kaplan-digital-sat-total-prep-2026.jpg.asset.json";
import p133img from "@/assets/products/medical-lab-science-ochei-kolhatkar.jpg.asset.json";
import p134img from "@/assets/products/bajas-principles-practice-surgery.jpg.asset.json";
import p135img from "@/assets/products/cpr-manikin-adult.jpg.asset.json";
import p136img from "@/assets/products/infant-incubator.jpg.asset.json";
import p137img from "@/assets/products/anatomical-trauma-model.jpg.asset.json";
import p138img from "@/assets/products/patient-care-manikin.jpg.asset.json";
import p139img from "@/assets/products/pelvic-pregnancy-model.jpg.asset.json";
import p140img from "@/assets/products/binocular-microscope-lcd.jpg.asset.json";
import p141img from "@/assets/products/electrophoresis-machine-dy300.jpg.asset.json";
import p142img from "@/assets/products/medical-suction-machine.jpg.asset.json";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "books", name: "Books", tagline: "Academic, medical, law, JAMB & WAEC", image: catBooks },
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
  { id: "p100", slug: 'hutchison-clinical-methods', name: "Hutchison's Clinical Methods (25th Edition)", category: 'books', image: p100img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['International Edition', 'Glynn & Drake', 'Hardcover'], bestSeller: true },
  { id: "p101", slug: 'clinical-biochemistry-crook', name: 'Clinical Biochemistry and Metabolic Medicine', category: 'books', image: p101img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ["International Students' Edition", 'Martin A. Crook'] },
  { id: "p102", slug: 'public-health-tropics-lucas', name: 'Short Textbook of Public Health Medicine for the Tropics', category: 'books', image: p102img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Revised 4th Edition', 'Lucas & Gilles'] },
  { id: "p103", slug: 'lippincott-pharmacology-whalen', name: 'Lippincott Illustrated Reviews: Pharmacology (8th Edition)', category: 'books', image: p103img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['International Edition', 'Karen Whalen', 'Wolters Kluwer'], bestSeller: true },
  { id: "p104", slug: 'fundamentals-of-nursing-taylor', name: 'Fundamentals of Nursing (9th Edition)', category: 'books', image: p104img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['International Edition', 'Taylor, Lynn & Bartlett'], bestSeller: true },
  { id: "p105", slug: 'clinical-nursing-procedures-jacob', name: 'Clinical Nursing Procedures: The Art of Nursing Practice (4th Ed)', category: 'books', image: p105img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Annamma Jacob, Rekha R. & Jadhav Sonali'] },
  { id: "p106", slug: 'civil-litigation-adefope-okojie', name: 'Civil Litigation (3rd Edition)', category: 'books', image: p106img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Quick reference to substantive law & procedure', 'Hon. Justice Adefope-Okojie'] },
  { id: "p107", slug: 'high-court-civil-procedure-rules', name: 'High Court Civil Procedure Rules', category: 'books', image: p107img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Latest edition', 'Princeton & Associates'] },
  { id: "p108", slug: 'compendium-clinical-medicine-falase', name: 'A Compendium of Clinical Medicine (4th Edition)', category: 'books', image: p108img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['A. O. Falase & O. O. Akinkugbe'], bestSeller: true },
  { id: "p109", slug: 'genetics-rastogi', name: 'Genetics (4th Edition)', category: 'books', image: p109img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Veer Bala Rastogi'] },
  { id: "p110", slug: 'nigerian-constitutional-law-malemi', name: 'The Nigerian Constitutional Law', category: 'books', image: p110img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Ese Malemi'] },
  { id: "p111", slug: 'nigerian-legal-system-malemi', name: 'The Nigerian Legal System — Text and Cases', category: 'books', image: p111img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Revised 2021 Edition', 'Ese Malemi'], bestSeller: true },
  { id: "p112", slug: 'midwifery-gynae-nursing-jacob', name: 'A Comprehensive Textbook of Midwifery & Gynecological Nursing (6th Ed)', category: 'books', image: p112img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Annamma Jacob'] },
  { id: "p113", slug: 'midwifery-for-nurses-elizabeth', name: 'Midwifery for Nurses (2nd Edition)', category: 'books', image: p113img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Marie Elizabeth', 'CBS Publishers'] },
  { id: "p114", slug: 'general-nursing-midwifery-clement', name: 'Internship Textbook for General Nursing and Midwifery (3rd Ed)', category: 'books', image: p114img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['I. Clement', 'INC syllabus'] },
  { id: "p115", slug: 'islamic-law-of-evidence-hammed', name: 'Islamic Law of Evidence and Administration of Justice in Nigeria', category: 'books', image: p115img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Hanafi A. Hammed'] },
  { id: "p116", slug: 'adr-arbitration-nigeria-ajetunmobi', name: 'Alternative Dispute Resolution & Arbitration in Nigeria', category: 'books', image: p116img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Law, Theory and Practice', 'Abdulsalam O. Ajetunmobi'] },
  { id: "p117", slug: 'evidence-act-2011-amended-2023', name: 'Evidence Act 2011 (As Amended 2023)', category: 'books', image: p117img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['With Supreme Court authorities & Notaries Public Act 2023'] },
  { id: "p118", slug: 'aguda-law-of-evidence', name: 'Aguda: The Law of Evidence', category: 'books', image: p118img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Revised edition'] },
  { id: "p119", slug: 'paediatrics-tropical-azubuike', name: 'Paediatrics and Child Health in a Tropical Region (3rd Edition)', category: 'books', image: p119img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Azubuike & Nkanginieme'] },
  { id: "p120", slug: 'obstetrics-by-ten-teachers', name: 'Obstetrics by Ten Teachers (20th Edition)', category: 'books', image: p120img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['International Student Edition', 'Kenny & Myers', 'CRC Press'], bestSeller: true },
  { id: "p121", slug: 'cunningham-anatomy-limbs-koshi', name: "Cunningham's Manual of Practical Anatomy — Upper and Lower Limbs (17th Ed, Vol. 1)", category: 'books', image: p121img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Rachel Koshi', 'Oxford'] },
  { id: "p122", slug: 'medical-law-ethics-nigeria-emiri', name: 'Medical Law and Ethics in Nigeria', category: 'books', image: p122img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Festus O. Emiri', 'Malthouse Law Books'] },
  { id: "p123", slug: 'constitution-frn-1999-amended-2023', name: 'Constitution of the Federal Republic of Nigeria 1999 (As Amended 2023)', category: 'books', image: p123img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['With Fundamental Rights (Enforcement Procedure) Rules 2009'], bestSeller: true },
  { id: "p124", slug: 'principles-civil-procedure-efevwerhan', name: 'Principles of Civil Procedure in Nigeria (3rd Edition)', category: 'books', image: p124img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['D. I. Efevwerhan'] },
  { id: "p125", slug: 'criminal-code-efcc', name: 'Criminal Code Cap C38 & EFCC Act — With Cases and Materials', category: 'books', image: p125img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Includes NFIU, MLA, ICPC & MLPA', 'Laws of the Federation'] },
  { id: "p126", slug: 'law-of-tort-malemi', name: 'Law of Tort (2nd Edition)', category: 'books', image: p126img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Ese Malemi', 'Princeton'] },
  { id: "p127", slug: 'penal-code-northern-nigeria', name: 'Penal Code (Cap 89) — With Shariah Penal Code', category: 'books', image: p127img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Northern States Federal Provision Act Cap 345'] },
  { id: "p128", slug: 'cunningham-thorax-abdomen-koshi', name: "Cunningham's Manual of Practical Anatomy — Thorax and Abdomen (17th Ed, Vol. 2)", category: 'books', image: p128img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Rachel Koshi', 'Oxford'] },
  { id: "p129", slug: 'brunner-medical-surgical-nursing', name: "Brunner & Suddarth's Textbook of Medical-Surgical Nursing (16th Ed)", category: 'books', image: p129img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['International Edition', 'Hinkle, Cheever, Overbaugh & Bradley', 'Wolters Kluwer'], bestSeller: true },
  { id: "p130", slug: 'primary-health-care-developing-countries', name: 'A Guide to Primary Health Care Practice in Developing Countries (7th Ed)', category: 'books', image: p130img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Funso Tope-Ajayi'] },
  { id: "p131", slug: 'digital-sat-study-guide-2026', name: 'The Official Digital SAT Study Guide 2026', category: 'books', image: p131img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['College Board', 'Practice tests & sample questions'], bestSeller: true },
  { id: "p132", slug: 'kaplan-digital-sat-total-prep-2026', name: 'Kaplan Digital SAT Total Prep 2026', category: 'books', image: p132img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['1,000+ practice questions', '2 practice tests'] },
  { id: "p133", slug: 'medical-lab-science-ochei-kolhatkar', name: 'Medical Laboratory Science: Theory and Practice', category: 'books', image: p133img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['J. Ochei & A. Kolhatkar', 'CBSPD Edition'], bestSeller: true },
  { id: "p134", slug: 'bajas-principles-practice-surgery', name: "Baja's Principles and Practice of Surgery (5th Edition)", category: 'books', image: p134img.url, description: 'Authentic copy supplied by Oriented Hub. Bulk and institutional pricing available on request.', features: ['Including pathology in the tropics', 'Vol. 1'] },
  { id: "p135", slug: 'cpr-manikin-adult', name: 'Full-Body Adult CPR Training Manikin', category: 'medical-equipment', image: p135img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['BLS / ACLS training', 'Electronic feedback monitor included'], bestSeller: true },
  { id: "p136", slug: 'infant-incubator', name: 'Infant Incubator (Neonatal)', category: 'medical-equipment', image: p136img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['Temperature & humidity control', 'Mobile base', 'Hospital grade'], bestSeller: true },
  { id: "p137", slug: 'anatomical-trauma-model', name: 'Trauma Care Anatomical Patient Model', category: 'medical-equipment', image: p137img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['First-aid and emergency training manikin'] },
  { id: "p138", slug: 'patient-care-manikin', name: 'Full-Body Patient Care Manikin', category: 'medical-equipment', image: p138img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['Articulated joints', 'Nursing skills training'] },
  { id: "p139", slug: 'pelvic-pregnancy-model', name: 'Pelvic & Pregnancy Anatomical Model', category: 'laboratory', image: p139img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['Teaching aid for midwifery & obstetrics students'] },
  { id: "p140", slug: 'binocular-microscope-lcd', name: 'Binocular Microscope with LCD Display', category: 'laboratory', image: p140img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['Built-in screen', 'Achromatic objectives', 'LED illumination'], bestSeller: true },
  { id: "p141", slug: 'electrophoresis-machine-dy300', name: 'DY-300 Electrophoresis Machine with Tank', category: 'laboratory', image: p141img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['EasyTechMed', 'Voltage & current display', 'Complete kit'] },
  { id: "p142", slug: 'medical-suction-machine', name: 'Medical Suction Machine (Twin-Jar)', category: 'laboratory', image: p142img.url, description: 'Sourced from verified suppliers. Bulk and institutional pricing available on request.', features: ['High vacuum', 'Mobile trolley', 'Hospital grade'] },

  // Legacy catalogue
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
