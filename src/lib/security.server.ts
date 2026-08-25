import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type PolicyEntry = {
  key: string;
  table: string;
  policy: string;
  command: string;
  roles: string;
  permissive: string;
  using: string;
  check: string;
  rls_enabled: boolean;
};

export type PolicyChange = {
  type: "added" | "removed" | "modified";
  key: string;
  table: string;
  policy: string;
  fields?: { field: string; from: unknown; to: unknown }[];
};

function digestOf(policies: PolicyEntry[]) {
  const raw = JSON.stringify(policies.map((p) => [p.key, p.command, p.roles, p.permissive, p.using, p.check, p.rls_enabled]));
  // Simple deterministic FNV-1a hash — enough to spot inventory drift.
  let h = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `fnv1a-${h.toString(16).padStart(8, "0")}-${policies.length}`;
}

export function diffPolicies(previous: PolicyEntry[], current: PolicyEntry[]): PolicyChange[] {
  const prev = new Map(previous.map((p) => [p.key, p]));
  const cur = new Map(current.map((p) => [p.key, p]));
  const changes: PolicyChange[] = [];

  for (const [key, p] of cur) {
    const before = prev.get(key);
    if (!before) {
      changes.push({ type: "added", key, table: p.table, policy: p.policy });
      continue;
    }
    const fields: { field: string; from: unknown; to: unknown }[] = [];
    for (const f of ["command", "roles", "permissive", "using", "check", "rls_enabled"] as const) {
      if (JSON.stringify(before[f]) !== JSON.stringify(p[f])) fields.push({ field: f, from: before[f], to: p[f] });
    }
    if (fields.length) changes.push({ type: "modified", key, table: p.table, policy: p.policy, fields });
  }
  for (const [key, p] of prev) {
    if (!cur.has(key)) changes.push({ type: "removed", key, table: p.table, policy: p.policy });
  }
  return changes.sort((a, b) => a.key.localeCompare(b.key));
}

export async function computeSnapshot(actorId: string, actorEmail: string | null) {
  const { data: inventory, error } = await supabaseAdmin.rpc("rls_policy_inventory");
  if (error) throw new Error(error.message);
  const policies = (inventory ?? []) as unknown as PolicyEntry[];

  const { data: last } = await supabaseAdmin
    .from("policy_snapshots")
    .select("id, digest, policies, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const previous = ((last?.policies ?? []) as unknown as PolicyEntry[]) ?? [];
  const changes = diffPolicies(previous, policies);
  const digest = digestOf(policies);

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("policy_snapshots")
    .insert({
      captured_by: actorId,
      captured_by_email: actorEmail,
      policy_count: policies.length,
      digest,
      policies: policies as any,
      changes: changes as any,
    })
    .select("id, created_at, digest, policy_count, changes")
    .single();
  if (insertError) throw new Error(insertError.message);

  return {
    snapshot: inserted,
    unchanged: last ? last.digest === digest : false,
    changeCount: changes.length,
  };
}
