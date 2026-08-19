CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  city text,
  product text,
  rating integer NOT NULL DEFAULT 5,
  body text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Admins read all reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Guests submit reviews"
  ON public.reviews FOR INSERT
  TO anon
  WITH CHECK (
    approved = false
    AND char_length(btrim(customer_name)) BETWEEN 2 AND 120
    AND char_length(btrim(body)) BETWEEN 10 AND 2000
    AND (city IS NULL OR char_length(city) <= 120)
    AND (product IS NULL OR char_length(product) <= 200)
    AND rating BETWEEN 1 AND 5
  );

CREATE POLICY "Users submit reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    approved = false
    AND char_length(btrim(customer_name)) BETWEEN 2 AND 120
    AND char_length(btrim(body)) BETWEEN 10 AND 2000
    AND (city IS NULL OR char_length(city) <= 120)
    AND (product IS NULL OR char_length(product) <= 200)
    AND rating BETWEEN 1 AND 5
  );

CREATE POLICY "Admins update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));