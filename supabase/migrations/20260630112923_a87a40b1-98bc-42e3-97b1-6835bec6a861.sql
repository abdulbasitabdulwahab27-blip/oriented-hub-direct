
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id TEXT,
  action TEXT NOT NULL CHECK (action IN ('created','updated','deleted')),
  actor_id UUID,
  actor_email TEXT,
  summary TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

CREATE INDEX audit_log_created_at_idx ON public.audit_log (created_at DESC);
CREATE INDEX audit_log_table_name_idx ON public.audit_log (table_name);

CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  END IF;

  INSERT INTO public.audit_log (table_name, record_id, action, actor_id, actor_email, summary, old_data, new_data)
  VALUES (TG_TABLE_NAME, v_rec_id, v_action, v_actor, v_email, v_summary, v_old, v_new);

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER products_audit
AFTER INSERT OR UPDATE OR DELETE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

CREATE TRIGGER orders_audit
AFTER INSERT OR UPDATE OR DELETE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

CREATE TRIGGER user_roles_audit
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
