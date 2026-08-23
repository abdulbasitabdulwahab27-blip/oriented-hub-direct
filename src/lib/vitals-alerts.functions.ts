import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Admin access required");
}

/** Runs the field-data budget check on demand from the admin Speed dashboard. */
export const runVitalsAlertCheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ hours: z.number().int().min(1).max(168).default(24) }).parse(data ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { runFieldAlertCheck } = await import("@/lib/vitals-alerts.server");
    return runFieldAlertCheck(data.hours);
  });
