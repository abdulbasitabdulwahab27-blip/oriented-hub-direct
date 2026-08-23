CREATE TABLE public.web_vitals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  metric text not null,
  value double precision not null,
  rating text not null,
  device text not null default 'unknown',
  navigation_type text
);
GRANT INSERT ON public.web_vitals TO anon, authenticated;
GRANT SELECT ON public.web_vitals TO authenticated;
GRANT ALL ON public.web_vitals TO service_role;
ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a page speed sample" ON public.web_vitals FOR INSERT TO anon, authenticated WITH CHECK (
  metric IN ('LCP','INP','CLS','TTFB','FCP')
  AND rating IN ('good','needs-improvement','poor')
  AND device IN ('mobile','desktop','unknown')
  AND length(path) < 300
  AND value >= 0 AND value < 3600000
);
CREATE POLICY "Signed-in staff can read page speed samples" ON public.web_vitals FOR SELECT TO authenticated USING (true);
CREATE INDEX web_vitals_created_at_idx ON public.web_vitals (created_at DESC);
CREATE INDEX web_vitals_path_metric_idx ON public.web_vitals (path, metric);