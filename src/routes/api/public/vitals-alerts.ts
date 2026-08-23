import { createFileRoute } from "@tanstack/react-router";
import process from "node:process";
import { z } from "zod";

/**
 * Scheduled / CI endpoint for speed alerting.
 *
 * POST with header `x-vitals-token: $VITALS_ALERT_TOKEN`.
 *   { "mode": "field", "hours": 24 }                → scans real-visitor p75
 *   { "mode": "lighthouse", "violations": [ ... ] } → records CI budget failures
 */
const lighthouseViolation = z.object({
  path: z.string().min(1).max(300),
  metric: z.string().min(1).max(40),
  value: z.number().finite(),
  threshold: z.number().finite(),
  device: z.string().max(20).default("mobile"),
  build_version: z.string().max(40).optional().nullable(),
});

const body = z.union([
  z.object({ mode: z.literal("field").default("field"), hours: z.number().int().min(1).max(168).default(24) }),
  z.object({ mode: z.literal("lighthouse"), violations: z.array(lighthouseViolation).min(1).max(100) }),
]);

export const Route = createFileRoute("/api/public/vitals-alerts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env["VITALS_ALERT_TOKEN"];
        if (!token) return new Response("Alerting not configured", { status: 503 });
        if (request.headers.get("x-vitals-token") !== token) {
          return new Response("Unauthorized", { status: 401 });
        }

        let parsed: z.infer<typeof body>;
        try {
          parsed = body.parse(await request.json());
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const mod = await import("@/lib/vitals-alerts.server");

        if (parsed.mode === "lighthouse") {
          const created = await mod.recordAlerts(
            parsed.violations.map((v) => ({
              source: "lighthouse" as const,
              path: v.path,
              metric: v.metric,
              device: v.device,
              build_version: v.build_version ?? null,
              value: v.value,
              threshold: v.threshold,
              samples: 0,
              severity: "critical" as const,
              message: `Lighthouse ${v.metric} on ${v.path} is ${v.value} (budget ${v.threshold}).`,
            })),
          );
          const mail = await mod.emailAlerts(created);
          return Response.json({ created: created.length, emailed: mail.sent });
        }

        const result = await mod.runFieldAlertCheck(parsed.hours);
        return Response.json(result);
      },
    },
  },
});
