import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payload = z.object({
  trackingCode: z.string().trim().min(3).max(40),
  name: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(3).max(600),
  fulfilment: z.string().trim().max(40),
  order: z.string().trim().min(1).max(4000),
  notes: z.string().trim().max(2000).optional().nullable(),
  source: z.string().trim().max(60).default("order-page"),
});

type Payload = z.infer<typeof payload>;

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

function buildHtml(d: Payload) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap">${esc(label)}</td><td style="padding:6px 0;font-size:14px;color:#111">${esc(value).replace(/\n/g, "<br/>")}</td></tr>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px">
  <h2 style="margin:0 0 4px">New order — ${esc(d.trackingCode)}</h2>
  <p style="margin:0 0 16px;color:#666;font-size:13px">Submitted from the ${esc(d.source)} on theorientedhub.com</p>
  <table style="border-collapse:collapse;width:100%">
    ${row("Customer", d.name)}
    ${row("WhatsApp", d.phone)}
    ${row("Fulfilment", d.fulfilment)}
    ${row("Address / pickup", d.address)}
    ${row("Tracking code", d.trackingCode)}
    ${d.notes ? row("Notes", d.notes) : ""}
  </table>
  <h3 style="margin:20px 0 6px;font-size:15px">Order details</h3>
  <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;background:#f6f6f6;padding:12px;border-radius:8px;margin:0">${esc(d.order)}</pre>
  <p style="margin:20px 0 0"><a href="https://wa.me/${d.phone.replace(/[^0-9]/g, "")}" style="background:#128c7e;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;font-size:14px">Reply on WhatsApp</a></p>
</div>`;
}

/**
 * Emails a copy of every submitted order to the shop inbox.
 * Returns { sent:false, reason } instead of throwing so a mail outage can
 * never block an order from being saved or handed to WhatsApp.
 */
export const emailOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => payload.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["RESEND_API_KEY"];
    const to = process.env["ORDER_NOTIFY_EMAIL"] ?? "Orientedbanque@outlook.com";
    const from = process.env["ORDER_NOTIFY_FROM"] ?? "The Oriented Hub <orders@theorientedhub.com>";
    if (!apiKey) return { sent: false as const, reason: "email_not_configured" };

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: to,
          subject: `New order ${data.trackingCode} — ${data.name}`,
          html: buildHtml(data),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error(`Order email failed [${res.status}]: ${body}`);
        return { sent: false as const, reason: `provider_error_${res.status}` };
      }
      return { sent: true as const };
    } catch (err) {
      console.error("Order email threw", err);
      return { sent: false as const, reason: "network_error" };
    }
  });
