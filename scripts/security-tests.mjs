/**
 * Automated role-based security tests.
 *
 *   node scripts/security-tests.mjs
 *
 * Verifies:
 *  - web_vitals reads are denied to anonymous and normal users, allowed for admins
 *  - a sensitive audited action (product_prices write) lands in audit_log with the right actor
 *  - audit_log itself is admin-only
 *
 * Requires SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (or anon key) and
 * SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !ANON || !SERVICE) {
  console.error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const anonOpts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(URL, SERVICE, anonOpts);

const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const stamp = Date.now();
const users = [];

async function makeUser(role) {
  const email = `sectest+${role}.${stamp}@example.com`;
  const password = `Test-${stamp}-${role}!`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw new Error(`createUser(${role}): ${error.message}`);
  users.push(data.user.id);
  if (role === "admin") {
    await admin.from("user_roles").delete().eq("user_id", data.user.id);
    const { error: rErr } = await admin.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
    if (rErr) throw new Error(`grant admin: ${rErr.message}`);
  }
  const client = createClient(URL, ANON, anonOpts);
  const { error: sErr } = await client.auth.signInWithPassword({ email, password });
  if (sErr) throw new Error(`signIn(${role}): ${sErr.message}`);
  return { client, email, id: data.user.id };
}

async function main() {
  const anon = createClient(URL, ANON, anonOpts);
  const testPath = `/__sectest-${stamp}`;
  const priceSlug = `__sectest-${stamp}`;

  // Anonymous may write a sample (public telemetry) but must not read any.
  const ins = await anon.from("web_vitals").insert({
    path: testPath,
    metric: "LCP",
    value: 1234,
    rating: "good",
    device: "mobile",
  });
  check("anon can insert a web_vitals sample", !ins.error, ins.error?.message ?? "");

  const anonRead = await anon.from("web_vitals").select("id").limit(5);
  check("anon cannot read web_vitals", (anonRead.data?.length ?? 0) === 0, anonRead.error?.message ?? `rows=${anonRead.data?.length ?? 0}`);

  const user = await makeUser("user");
  const userRead = await user.client.from("web_vitals").select("id").limit(5);
  check(
    "normal user cannot read web_vitals",
    (userRead.data?.length ?? 0) === 0,
    userRead.error?.message ?? `rows=${userRead.data?.length ?? 0}`,
  );

  const userAudit = await user.client.from("audit_log").select("id").limit(5);
  check("normal user cannot read audit_log", (userAudit.data?.length ?? 0) === 0, userAudit.error?.message ?? "");

  const adm = await makeUser("admin");
  const adminRead = await adm.client.from("web_vitals").select("id, path").eq("path", testPath);
  check("admin can read web_vitals samples", (adminRead.data?.length ?? 0) > 0, adminRead.error?.message ?? "");

  // End-to-end audited sensitive action.
  const w = await adm.client.from("product_prices").insert({ slug: priceSlug, price: 4321, currency: "NGN" });
  check("admin can write product_prices (audited action)", !w.error, w.error?.message ?? "");

  let entry = null;
  for (let i = 0; i < 10 && !entry; i++) {
    const { data } = await admin
      .from("audit_log")
      .select("id, table_name, action, actor_email, summary, record_id")
      .eq("table_name", "product_prices")
      .eq("record_id", priceSlug)
      .limit(1);
    entry = data?.[0] ?? null;
    if (!entry) await new Promise((r) => setTimeout(r, 300));
  }
  check("audited action recorded in audit_log", !!entry, entry ? JSON.stringify(entry.summary) : "no entry found");
  check("audit entry attributes the correct actor", entry?.actor_email === adm.email, `${entry?.actor_email} vs ${adm.email}`);
  check("audit entry records the create action", entry?.action === "created", String(entry?.action));

  const adminAudit = await adm.client.from("audit_log").select("id").eq("record_id", priceSlug);
  check("admin can read audit_log", (adminAudit.data?.length ?? 0) > 0, adminAudit.error?.message ?? "");

  // Cleanup
  await admin.from("product_prices").delete().eq("slug", priceSlug);
  await admin.from("web_vitals").delete().eq("path", testPath);
  await admin.from("audit_log").delete().eq("record_id", priceSlug);
  for (const id of users) await admin.auth.admin.deleteUser(id);
}

main()
  .then(() => {
    const failed = results.filter((r) => !r.pass);
    console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
    process.exit(failed.length ? 1 : 0);
  })
  .catch(async (e) => {
    console.error("Test run error:", e.message);
    for (const id of users) await admin.auth.admin.deleteUser(id).catch(() => {});
    process.exit(1);
  });
