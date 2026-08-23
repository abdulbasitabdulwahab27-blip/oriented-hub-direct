ALTER TABLE public.web_vitals ADD COLUMN IF NOT EXISTS build_version text;

CREATE INDEX IF NOT EXISTS web_vitals_created_at_idx ON public.web_vitals (created_at DESC);

CREATE TABLE public.vitals_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'field',
  path text NOT NULL,
  metric text NOT NULL,
  device text NOT NULL DEFAULT 'mobile',
  build_version text,
  value double precision NOT NULL,
  threshold double precision NOT NULL,
  samples integer NOT NULL DEFAULT 0,
  severity text NOT NULL DEFAULT 'warning',
  message text,
  notified boolean NOT NULL DEFAULT false,
  acknowledged boolean NOT NULL DEFAULT false
);

GRANT SELECT, UPDATE ON public.vitals_alerts TO authenticated;
GRANT ALL ON public.vitals_alerts TO service_role;

ALTER TABLE public.vitals_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read speed alerts" ON public.vitals_alerts
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can acknowledge speed alerts" ON public.vitals_alerts
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER touch_vitals_alerts BEFORE UPDATE ON public.vitals_alerts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX vitals_alerts_created_at_idx ON public.vitals_alerts (created_at DESC);