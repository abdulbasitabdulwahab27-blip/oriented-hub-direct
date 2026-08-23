import { supabase } from "@/integrations/supabase/client";

/**
 * Core Web Vitals field monitoring.
 *
 * Collects LCP / INP / CLS (plus TTFB and FCP for context) from real visitors
 * and stores each sample in the `web_vitals` table so the admin dashboard can
 * report p75 per page and flag pages that break the mobile budgets below.
 */

export type VitalMetric = "LCP" | "INP" | "CLS" | "TTFB" | "FCP";

/** Tighter-than-default mobile budgets (ms, except CLS which is unitless). */
export const MOBILE_BUDGETS: Record<VitalMetric, { good: number; poor: number }> = {
  LCP: { good: 2000, poor: 2800 },
  INP: { good: 150, poor: 300 },
  CLS: { good: 0.05, poor: 0.1 },
  TTFB: { good: 600, poor: 1200 },
  FCP: { good: 1500, poor: 2500 },
};

export function rateMetric(metric: VitalMetric, value: number) {
  const b = MOBILE_BUDGETS[metric];
  if (value <= b.good) return "good" as const;
  if (value <= b.poor) return "needs-improvement" as const;
  return "poor" as const;
}

function deviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
}

/** Only a fraction of sessions report, to keep writes cheap. */
const SAMPLE_RATE = 0.25;

let started = false;

export async function initWebVitals() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (Math.random() > SAMPLE_RATE) return;

  const { onLCP, onINP, onCLS, onTTFB, onFCP } = await import("web-vitals");
  const device = deviceType();

  const report = (metric: VitalMetric) => (m: { value: number; navigationType?: string }) => {
    const value = metric === "CLS" ? Number(m.value.toFixed(4)) : Math.round(m.value);
    const path = window.location.pathname.slice(0, 299);
    void supabase
      .from("web_vitals")
      .insert({
        path,
        metric,
        value,
        rating: rateMetric(metric, value),
        device,
        navigation_type: m.navigationType ?? null,
      })
      .then(() => undefined, () => undefined);
  };

  onLCP(report("LCP"));
  onINP(report("INP"));
  onCLS(report("CLS"));
  onTTFB(report("TTFB"));
  onFCP(report("FCP"));
}
