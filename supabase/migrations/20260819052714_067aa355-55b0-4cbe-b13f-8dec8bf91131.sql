ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_code text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_tracking_code_key ON public.orders (tracking_code) WHERE tracking_code IS NOT NULL;

CREATE OR REPLACE FUNCTION public.track_order(_code text, _phone text)
RETURNS TABLE (
  tracking_code text,
  customer_name text,
  status text,
  created_at timestamptz,
  received_at timestamptz,
  preparing_at timestamptz,
  quoted_at timestamptz,
  delivered_at timestamptz,
  items jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.tracking_code, o.customer_name, o.status, o.created_at,
         o.received_at, o.preparing_at, o.quoted_at, o.delivered_at, o.items
  FROM public.orders o
  WHERE o.tracking_code IS NOT NULL
    AND upper(btrim(o.tracking_code)) = upper(btrim(_code))
    AND right(regexp_replace(o.customer_phone, '\D', '', 'g'), 9)
        = right(regexp_replace(coalesce(_phone,''), '\D', '', 'g'), 9)
    AND length(regexp_replace(coalesce(_phone,''), '\D', '', 'g')) >= 9
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.track_order(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;