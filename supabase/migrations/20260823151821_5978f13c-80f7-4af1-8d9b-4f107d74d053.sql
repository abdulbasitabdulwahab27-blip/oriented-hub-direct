DROP POLICY IF EXISTS "Signed-in staff can read page speed samples" ON public.web_vitals;
CREATE POLICY "Admins can read page speed samples"
ON public.web_vitals FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));