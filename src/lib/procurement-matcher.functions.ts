import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";

const candidateSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(180),
  slug: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(100),
  description: z.string().trim().max(450),
  features: z.array(z.string().trim().max(120)).max(8),
});

const requestSchema = z.object({
  need: z.string().trim().min(3).max(3000),
  candidates: z.array(candidateSchema).min(1).max(100),
});

export const recommendProcurementProducts = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, error: "Recommendations are temporarily unavailable. Please enter your requirements manually." };
    }

    const uniqueCandidates = [...new Map(data.candidates.map((candidate) => [candidate.id, candidate])).values()];
    const request = getRequest();
    try {
      const { matchProcurementProducts } = await import("@/lib/procurement-matcher.server");
      const result = await matchProcurementProducts({
        request,
        apiKey,
        need: data.need,
        candidates: uniqueCandidates,
      });
      return { ok: true as const, ...result };
    } catch (error) {
      if (request.signal.aborted) throw error;
      const { ProcurementMatcherError } = await import("@/lib/procurement-matcher.server");
      if (error instanceof ProcurementMatcherError && error.statusCode) {
        setResponseStatus(error.statusCode);
      }
      return {
        ok: false as const,
        error: error instanceof Error
          ? error.message
          : "Recommendations could not be prepared. Please enter your requirements manually.",
      };
    }
  });