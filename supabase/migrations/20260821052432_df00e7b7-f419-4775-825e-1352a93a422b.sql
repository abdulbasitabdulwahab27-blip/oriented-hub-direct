ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS product_slug text,
  ADD COLUMN IF NOT EXISTS order_code text,
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS reviews_product_slug_approved_idx ON public.reviews (product_slug) WHERE approved;