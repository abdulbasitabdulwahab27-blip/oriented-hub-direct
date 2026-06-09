export const WHATSAPP_PRIMARY = "2348136548965";
export const WHATSAPP_ALT = "2349064007879";
export const EMAIL = "Orientedbanque@outlook.com";
export const ADDRESS = "5, Oke-Fia Street, Opposite Zenith Bank, Osogbo, Nigeria";

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
