CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  market_slug text NOT NULL,
  market_question text NOT NULL,
  market_category text NOT NULL,
  side text NOT NULL CHECK (side IN ('yes','no')),
  price_cents integer NOT NULL CHECK (price_cents BETWEEN 1 AND 99),
  shares integer NOT NULL CHECK (shares > 0),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','cancelled','filled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own orders read" ON public.orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "own orders place" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "own orders cancel" ON public.orders
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "own orders remove" ON public.orders
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX orders_user_status_idx ON public.orders (user_id, status, created_at DESC);