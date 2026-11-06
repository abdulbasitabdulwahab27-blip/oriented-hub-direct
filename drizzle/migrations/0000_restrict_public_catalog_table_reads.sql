DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can read prices" ON public.product_prices;

CREATE POLICY "Admins can read prices"
  ON public.product_prices
  FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT ON public.products, public.product_prices FROM anon, PUBLIC;
GRANT SELECT ON public.products, public.product_prices TO authenticated;

CREATE OR REPLACE VIEW public.catalog_products
WITH (security_barrier = true)
AS
SELECT id, slug, name, category, image, description, features, best_seller,
       sort_order, created_at, updated_at, price, currency, stock, track_stock
FROM public.products;

CREATE OR REPLACE VIEW public.catalog_product_prices
WITH (security_barrier = true)
AS
SELECT slug, price, currency, updated_at
FROM public.product_prices;

GRANT SELECT ON public.catalog_products, public.catalog_product_prices TO anon, authenticated;