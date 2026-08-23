/**
 * Build / experiment version stamped on every Core Web Vitals sample so the
 * admin Speed dashboard can compare performance across deploys.
 *
 * Set VITE_BUILD_VERSION at build time (commit sha, release tag, or an
 * experiment name). Falls back to a stable label when unset.
 */
export const BUILD_VERSION: string =
  (import.meta.env["VITE_BUILD_VERSION"] as string | undefined)?.slice(0, 40) || "current";
