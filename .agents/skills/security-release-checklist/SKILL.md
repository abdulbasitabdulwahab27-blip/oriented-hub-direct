---
name: security-release-checklist
description: Run before every release of Oriented Hub (or any Lovable Cloud app) to catch security regressions. Triggers on phrases like "pre-release security check", "security checklist", "ready to publish", "before release", or any request to audit security posture prior to shipping.
---

# Security Release Checklist

Run this **before every publish/release**. Work top to bottom; do not skip steps. Stop and fix anything that fails before shipping.

## 1. Run the automated scanners (in parallel)

- `security--run_security_scan` — fresh Supabase/RLS scan (not persisted).
- `security--get_scan_results` with `force: true` — persisted findings.
- `code--dependency_scan` — npm high/critical CVEs.
- `supabase--linter` — DB linter warnings.

Triage every finding. Fix or `security--manage_security_finding` with a real justification. Never blanket-ignore.

## 2. Database & RLS audit

For **every** table in `public`:
- [ ] `ENABLE ROW LEVEL SECURITY` is on.
- [ ] Explicit `GRANT`s exist for the roles the policies allow (no `anon` grant unless a policy intentionally allows anon).
- [ ] No policy uses `USING (true)` or `WITH CHECK (true)` for write operations.
- [ ] Insert/update policies validate ownership (`auth.uid() = user_id`) or input shape (length, JSON structure).
- [ ] `service_role` is granted only where edge functions / admin code need it.

For **every** function:
- [ ] `SECURITY DEFINER` functions live in the `private` schema (or have `PUBLIC` execute revoked).
- [ ] `SET search_path = public` (or `private`) is set explicitly.
- [ ] Callable only by `authenticated` / `service_role`, not `anon`, unless intentionally public.

## 3. Roles & privilege escalation

- [ ] Roles live in `public.user_roles`, never on `profiles` or `users`.
- [ ] `has_role` is in `private` schema and called from RLS as `private.has_role(...)`.
- [ ] `user_roles` has explicit admin-only `INSERT`, `UPDATE`, `DELETE` policies.
- [ ] No client code reads role from `localStorage` / `sessionStorage` to gate UI as security.

## 4. Auth configuration

- [ ] Leaked-password (HIBP) protection is **on**.
- [ ] No anonymous sign-ups unless explicitly required.
- [ ] Email auto-confirm matches the product intent (off by default).
- [ ] Social providers configured for every provider referenced in UI (Google etc.).
- [ ] OAuth `redirect_uri` is `window.location.origin` based, not a protected route.

## 5. Server functions & edge endpoints

- [ ] Every `createServerFn` that touches user data uses `.middleware([requireSupabaseAuth])`.
- [ ] Inputs validated with `zod` inside `.inputValidator()`.
- [ ] `supabaseAdmin` (service role) is only imported inside `.server.ts` files or dynamically inside handler bodies — never at module scope of files the client imports.
- [ ] Privileged server functions check role (`private.has_role(userId, 'admin')`) before acting.
- [ ] Public routes under `/api/public/*` verify signatures/secrets before processing.

## 6. Secrets & keys

- [ ] No secrets in client bundle. Search the repo:
  ```bash
  rg -n "SERVICE_ROLE|sk_live|sk_test|BEGIN PRIVATE KEY|api[_-]?key\s*=\s*['\"]" src/ || echo "clean"
  ```
- [ ] Only `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` are exposed via `import.meta.env`.
- [ ] `process.env.*` reads happen **inside** server function handlers, not at module scope.

## 7. Client-side input validation

- [ ] All user inputs validated with `zod` (length + shape) before hitting Supabase or external URLs (WhatsApp, mailto).
- [ ] URL params built with `encodeURIComponent`.
- [ ] No `dangerouslySetInnerHTML` with user content.

## 8. Dependencies

- [ ] `code--dependency_scan` reports no high/critical CVEs, or remaining ones are documented.
- [ ] No Node-only packages imported into server functions (see `server-runtime` notes).

## 9. Smoke test the live preview

Drive Playwright against `http://localhost:8080`:
- [ ] Anonymous user cannot reach `/admin` or `/_authenticated/*` (redirects to `/auth`).
- [ ] Anonymous checkout creates an order with `user_id = null` and cannot read other orders.
- [ ] Signed-in non-admin cannot mutate `user_roles` or other users' orders (expect RLS denial in Network tab).
- [ ] Admin dashboard loads stats, orders, customers without 401/403.

## 10. Sign-off

- [ ] All scanners green or every finding has a written justification.
- [ ] `security--update_memory` updated if posture changed.
- [ ] Note the release version + date in the PR / publish message.

Only after every box is checked: call `preview_ui--publish`.
