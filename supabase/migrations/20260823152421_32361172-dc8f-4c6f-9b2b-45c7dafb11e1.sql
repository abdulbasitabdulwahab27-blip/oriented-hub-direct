-- Broaden audit summaries to security-sensitive tables
CREATE OR REPLACE FUNCTION public.write_audit_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_actor UUID := auth.uid();
  v_email TEXT;
  v_action TEXT;
  v_rec_id TEXT;
  v_summary TEXT;
  v_old JSONB;
  v_new JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created'; v_old := NULL; v_new := to_jsonb(NEW);
    v_rec_id := COALESCE((v_new->>'id'), '');
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'updated'; v_old := to_jsonb(OLD); v_new := to_jsonb(NEW);
    v_rec_id := COALESCE((v_new->>'id'), '');
  ELSE
    v_action := 'deleted'; v_old := to_jsonb(OLD); v_new := NULL;
    v_rec_id := COALESCE((v_old->>'id'), '');
  END IF;

  IF v_actor IS NOT NULL THEN
    SELECT email INTO v_email FROM public.profiles WHERE id = v_actor;
  END IF;

  IF TG_TABLE_NAME = 'products' THEN
    v_summary := COALESCE(v_new->>'name', v_old->>'name', '');
  ELSIF TG_TABLE_NAME = 'orders' THEN
    v_summary := COALESCE(v_new->>'customer_name', v_old->>'customer_name', '') ||
      CASE WHEN TG_OP = 'UPDATE' AND v_new->>'status' IS DISTINCT FROM v_old->>'status'
           THEN ' — status: ' || COALESCE(v_old->>'status','') || ' → ' || COALESCE(v_new->>'status','')
           ELSE '' END;
  ELSIF TG_TABLE_NAME = 'user_roles' THEN
    v_summary := 'role ' || COALESCE(v_new->>'role', v_old->>'role', '') ||
                 ' for user ' || COALESCE(v_new->>'user_id', v_old->>'user_id', '');
  ELSIF TG_TABLE_NAME = 'reviews' THEN
    v_summary := 'review by ' || COALESCE(v_new->>'customer_name', v_old->>'customer_name', '') ||
      CASE WHEN TG_OP = 'UPDATE' AND v_new->>'approved' IS DISTINCT FROM v_old->>'approved'
           THEN ' — approved: ' || COALESCE(v_old->>'approved','') || ' → ' || COALESCE(v_new->>'approved','')
           ELSE '' END;
  ELSIF TG_TABLE_NAME = 'product_prices' THEN
    v_rec_id := COALESCE(v_new->>'slug', v_old->>'slug', '');
    v_summary := 'price ' || COALESCE(v_new->>'slug', v_old->>'slug', '') || ': ' ||
                 COALESCE(v_old->>'price','—') || ' → ' || COALESCE(v_new->>'price','—');
  ELSIF TG_TABLE_NAME = 'vitals_alerts' THEN
    v_summary := 'speed alert ' || COALESCE(v_new->>'metric', v_old->>'metric', '') || ' on ' ||
                 COALESCE(v_new->>'path', v_old->>'path', '') ||
      CASE WHEN TG_OP = 'UPDATE' AND v_new->>'acknowledged' IS DISTINCT FROM v_old->>'acknowledged'
           THEN ' — acknowledged: ' || COALESCE(v_new->>'acknowledged','') ELSE '' END;
  END IF;

  INSERT INTO public.audit_log (table_name, record_id, action, actor_id, actor_email, summary, old_data, new_data)
  VALUES (TG_TABLE_NAME, v_rec_id, v_action, v_actor, v_email, v_summary, v_old, v_new);

  RETURN COALESCE(NEW, OLD);
END;
$function$;

DROP TRIGGER IF EXISTS reviews_audit ON public.reviews;
CREATE TRIGGER reviews_audit AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS product_prices_audit ON public.product_prices;
CREATE TRIGGER product_prices_audit AFTER INSERT OR UPDATE OR DELETE ON public.product_prices
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

DROP TRIGGER IF EXISTS vitals_alerts_audit ON public.vitals_alerts;
CREATE TRIGGER vitals_alerts_audit AFTER INSERT OR UPDATE OR DELETE ON public.vitals_alerts
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

-- Point-in-time snapshots of every RLS policy, so policy changes are auditable
CREATE TABLE public.policy_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  captured_by uuid,
  captured_by_email text,
  policy_count integer NOT NULL DEFAULT 0,
  digest text NOT NULL,
  policies jsonb NOT NULL,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb
);

GRANT SELECT ON public.policy_snapshots TO authenticated;
GRANT ALL ON public.policy_snapshots TO service_role;

ALTER TABLE public.policy_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read policy snapshots" ON public.policy_snapshots
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX policy_snapshots_created_at_idx ON public.policy_snapshots (created_at DESC);

-- Server-side only inventory of RLS policies and RLS status
CREATE OR REPLACE FUNCTION public.rls_policy_inventory()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT COALESCE(jsonb_agg(x ORDER BY x->>'key'), '[]'::jsonb) FROM (
    SELECT jsonb_build_object(
      'key', p.tablename || '::' || p.policyname,
      'table', p.tablename,
      'policy', p.policyname,
      'command', p.cmd,
      'roles', p.roles::text,
      'permissive', p.permissive,
      'using', COALESCE(p.qual, ''),
      'check', COALESCE(p.with_check, ''),
      'rls_enabled', c.relrowsecurity
    ) AS x
    FROM pg_policies p
    JOIN pg_class c ON c.relname = p.tablename
    JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = p.schemaname
    WHERE p.schemaname = 'public'
  ) s;
$$;

REVOKE ALL ON FUNCTION public.rls_policy_inventory() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rls_policy_inventory() TO service_role;