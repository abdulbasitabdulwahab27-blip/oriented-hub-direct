export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-medical-equipment-suppliers-in-nigeria",
    title: "How to Choose a Medical Equipment Supplier in Nigeria",
    description:
      "A practical guide to choosing a reliable medical equipment supplier in Nigeria — what to verify, what to ask, and how The Oriented Hub supplies hospitals and clinics nationwide.",
    date: "2026-01-15",
    readingTime: "5 min read",
    summary:
      "A dependable medical equipment supplier in Nigeria should offer authentic products, transparent quotations, installation support and nationwide delivery. The Oriented Hub supplies diagnostic and clinical equipment to hospitals, clinics, schools of nursing and universities across Nigeria.",
    sections: [
      {
        heading: "What makes a good medical equipment supplier?",
        body: [
          "Authenticity comes first. Equipment should be sourced from authorised distributors, arrive with the manufacturer's documentation, and match the specification quoted.",
          "Beyond the product itself, look for clear written quotations, realistic delivery timelines, after-sales support and a supplier who can handle institutional procurement paperwork.",
        ],
      },
      {
        heading: "Questions to ask before you order",
        body: [
          "Ask for the brand and model, the warranty position, the lead time, and whether bulk or institutional pricing applies. For larger devices, confirm who handles delivery, installation and basic training.",
          "For tenders and accreditation purchases, confirm the supplier can issue proper invoices and supply within your deadline.",
        ],
      },
      {
        heading: "How The Oriented Hub supplies medical equipment",
        body: [
          "The Oriented Hub supplies diagnostic tools, patient monitoring devices, hospital furniture, anatomical models and clinical simulators. Orders are confirmed by WhatsApp or email, quoted in writing, and delivered across Nigeria — with worldwide shipping available on request.",
        ],
      },
    ],
  },
  {
    slug: "best-waec-textbooks-for-students",
    title: "Best WAEC Textbooks for Students in Nigeria",
    description:
      "The recommended WAEC textbooks and revision materials Nigerian students should buy, and how to source authentic physical copies from The Oriented Hub.",
    date: "2026-01-22",
    readingTime: "4 min read",
    summary:
      "The most useful WAEC preparation set combines a recommended core textbook per subject, past questions, and a revision guide. The Oriented Hub supplies authentic physical WAEC and JAMB textbooks with delivery across Nigeria. We do not sell PDFs.",
    sections: [
      {
        heading: "Build your subject core first",
        body: [
          "Start with one strong recommended textbook per subject — English, Mathematics, Biology, Chemistry, Physics, Economics, Government and Literature. A single well-chosen text beats several overlapping ones.",
        ],
      },
      {
        heading: "Add past questions and revision guides",
        body: [
          "Past question collections train exam technique: timing, question phrasing and marking patterns. Pair each core textbook with a past-question compilation and work through them under timed conditions.",
        ],
      },
      {
        heading: "Buying authentic copies",
        body: [
          "Pirated copies often have missing pages and unreadable diagrams. The Oriented Hub supplies authentic printed WAEC, JAMB and university textbooks, with bulk pricing for schools and bookshops.",
        ],
      },
    ],
  },
  {
    slug: "essential-laboratory-equipment-for-schools",
    title: "Essential Laboratory Equipment for Schools and Colleges",
    description:
      "A checklist of essential laboratory equipment for secondary schools, colleges and universities in Nigeria, including accreditation-ready lab setups.",
    date: "2026-02-04",
    readingTime: "5 min read",
    summary:
      "A functional school laboratory needs microscopes, glassware, measuring instruments, reagents, safety equipment and storage. The Oriented Hub supplies complete laboratory setups for schools, colleges and universities across Nigeria.",
    sections: [
      {
        heading: "Core equipment checklist",
        body: [
          "Compound microscopes and prepared slides, beakers, flasks, measuring cylinders, pipettes, burettes, test tubes and racks, weighing balances, hot plates or Bunsen burners, thermometers and pH meters.",
        ],
      },
      {
        heading: "Safety and storage",
        body: [
          "Lab coats, gloves, goggles, eye-wash provision, fire extinguishers, first aid boxes, fume management and lockable reagent cabinets should be budgeted from the start, not added later.",
        ],
      },
      {
        heading: "Accreditation-ready laboratories",
        body: [
          "Universities and colleges preparing for accreditation usually need documented equipment lists matched to the programme. The Oriented Hub supplies laboratory equipment alongside NUC accreditation textbooks so departments can source everything from one supplier.",
        ],
      },
    ],
  },
  {
    slug: "top-nursing-books-in-nigeria",
    title: "Top Nursing Books for Students in Nigeria",
    description:
      "The nursing textbooks Nigerian nursing students and schools of nursing rely on most, and where to buy authentic physical copies.",
    date: "2026-02-18",
    readingTime: "4 min read",
    summary:
      "Core nursing texts in Nigeria include Fundamentals of Nursing, Brunner & Suddarth's Medical-Surgical Nursing, Clinical Nursing Procedures, midwifery texts and anatomy and physiology titles such as Ross & Wilson. The Oriented Hub supplies these as authentic printed books.",
    sections: [
      {
        heading: "Foundation year",
        body: [
          "Fundamentals of Nursing and Ross & Wilson Anatomy and Physiology in Health and Illness cover the base of practice and body systems.",
        ],
      },
      {
        heading: "Clinical and specialty years",
        body: [
          "Brunner & Suddarth's Textbook of Medical-Surgical Nursing, Clinical Nursing Procedures, midwifery texts and paediatrics titles carry students through clinical postings and examinations.",
        ],
      },
      {
        heading: "Buying for a school of nursing",
        body: [
          "Schools ordering in volume can request an institutional quotation. The Oriented Hub supplies bulk book orders with delivery nationwide.",
        ],
      },
    ],
  },
  {
    slug: "hospital-consumables-every-clinic-needs",
    title: "Hospital Consumables Every Clinic Needs in Stock",
    description:
      "A restocking checklist of the hospital consumables every Nigerian clinic, hospital and health centre should keep on hand.",
    date: "2026-03-02",
    readingTime: "4 min read",
    summary:
      "Every clinic should keep gloves, syringes and needles, dressings, antiseptics, IV sets, sample containers and PPE in stock. The Oriented Hub supplies hospital consumables and stationeries in bulk across Nigeria.",
    sections: [
      {
        heading: "Daily-use consumables",
        body: [
          "Examination and surgical gloves, syringes and needles in a range of sizes, cotton wool, gauze, bandages, plasters, antiseptic solutions and alcohol swabs.",
        ],
      },
      {
        heading: "Procedure and diagnostic supplies",
        body: [
          "IV giving sets and cannulae, catheters, sample bottles, specimen containers, test strips, sharps containers and disposal bags.",
        ],
      },
      {
        heading: "Stationery and record keeping",
        body: [
          "Case note folders, patient record cards, registers, request forms and labels keep clinical documentation reliable. The Oriented Hub supplies hospital stationeries alongside clinical consumables.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
