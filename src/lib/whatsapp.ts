export const WHATSAPP_PRIMARY = "2348136548965";
export const WHATSAPP_ALT = "2349064007879";
export const WHATSAPP_UK = "447587869499";
export const EMAIL = "Orientedbanque@outlook.com";
export const ADDRESS = "15, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Nigeria";

export function waLink(message: string, phone: string = WHATSAPP_PRIMARY) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(args: {
  name: string;
  category: string;
  quantity: number;
}) {
  return [
    "Hello Oriented Hub,",
    "I want to order:",
    `Product Name: ${args.name}`,
    `Category: ${args.category}`,
    `Quantity: ${args.quantity}`,
    "Please provide price, availability, and delivery details.",
  ].join("\n");
}

export function cartOrderMessage(items: { name: string; category: string; quantity: number }[], customer?: { name?: string; phone?: string; address?: string }) {
  const lines = [
    "Hello Oriented Hub,",
    "I would like to place an order for the following items:",
    "",
    ...items.map((it, i) => `${i + 1}. ${it.name} (${it.category}) — Qty: ${it.quantity}`),
    "",
  ];
  if (customer?.name) lines.push(`Name: ${customer.name}`);
  if (customer?.phone) lines.push(`Phone: ${customer.phone}`);
  if (customer?.address) lines.push(`Delivery Address: ${customer.address}`);
  lines.push("", "Please confirm prices, availability and delivery details.");
  return lines.join("\n");
}

export function quoteMessage(text: string) {
  return `Hello Oriented Hub,\n\nI would like to request a quotation / procurement support for:\n\n${text}\n\nKindly advise on pricing, availability and lead time. Thank you.`;
}

export function salesRepMessage(args: {
  name: string;
  phone: string;
  email?: string;
  location: string;
  occupation?: string;
  experience?: string;
  why?: string;
}) {
  const lines = [
    "Hello Oriented Hub,",
    "I would like to apply to become a Sales Representative.",
    "",
    `Full Name: ${args.name}`,
    `Phone / WhatsApp: ${args.phone}`,
  ];
  if (args.email) lines.push(`Email: ${args.email}`);
  lines.push(`Location (City, State): ${args.location}`);
  if (args.occupation) lines.push(`Occupation / Profession: ${args.occupation}`);
  if (args.experience) lines.push(`Sales / Marketing Experience: ${args.experience}`);
  if (args.why) lines.push("", `Why I want to join: ${args.why}`);
  lines.push("", "Please share the next steps and commission structure. Thank you.");
  return lines.join("\n");
}
