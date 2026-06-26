ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS received_at timestamptz,
  ADD COLUMN IF NOT EXISTS preparing_at timestamptz,
  ADD COLUMN IF NOT EXISTS quoted_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz;

CREATE OR REPLACE FUNCTION public.stamp_order_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'received'  AND NEW.received_at  IS NULL THEN NEW.received_at  := now(); END IF;
    IF NEW.status = 'preparing' AND NEW.preparing_at IS NULL THEN NEW.preparing_at := now(); END IF;
    IF NEW.status = 'quoted'    AND NEW.quoted_at    IS NULL THEN NEW.quoted_at    := now(); END IF;
    IF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN NEW.delivered_at := now(); END IF;
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'received'  AND NEW.received_at  IS NULL THEN NEW.received_at  := now(); END IF;
    IF NEW.status = 'preparing' AND NEW.preparing_at IS NULL THEN NEW.preparing_at := now(); END IF;
    IF NEW.status = 'quoted'    AND NEW.quoted_at    IS NULL THEN NEW.quoted_at    := now(); END IF;
    IF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN NEW.delivered_at := now(); END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_stamp_order_status ON public.orders;
CREATE TRIGGER trg_stamp_order_status
BEFORE INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.stamp_order_status();