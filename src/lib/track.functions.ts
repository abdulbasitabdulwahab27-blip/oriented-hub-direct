import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  code: z.string().trim().min(4).max(40),
  phone: z.string().trim().min(7).max(30),
});

const digits = (v: string) => v.replace(/\D/g, "");

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const phoneDigits = digits(data.phone);
    if (phoneDigits.length < 9) return { order: null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select(
        "tracking_code, customer_name, customer_phone, status, created_at, received_at, preparing_at, quoted_at, delivered_at, items",
      )
      .ilike("tracking_code", data.code)
      .limit(5);

    if (error) throw new Error("Unable to look up order");

    const match = (rows ?? []).find(
      (r) => digits(r.customer_phone ?? "").slice(-9) === phoneDigits.slice(-9),
    );
    if (!match) return { order: null };

    const { customer_phone: _omit, ...safe } = match;
    return { order: safe };
  });
