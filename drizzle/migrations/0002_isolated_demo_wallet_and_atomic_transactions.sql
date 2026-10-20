CREATE TABLE public.demo_wallets (
 user_id uuid PRIMARY KEY, forecast_cents bigint NOT NULL DEFAULT 0 CHECK (forecast_cents >= 0), resource_cents bigint NOT NULL DEFAULT 0 CHECK (resource_cents >= 0)
);
GRANT SELECT ON public.demo_wallets TO authenticated;
GRANT ALL ON public.demo_wallets TO service_role;
ALTER TABLE public.demo_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own demo wallet" ON public.demo_wallets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TABLE public.demo_orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, market_slug text NOT NULL, market_question text NOT NULL, market_category text NOT NULL, side text NOT NULL CHECK(side IN ('yes','no')), price_cents integer NOT NULL CHECK(price_cents BETWEEN 1 AND 99), shares integer NOT NULL CHECK(shares BETWEEN 1 AND 1000000), cost_cents bigint NOT NULL, status text NOT NULL DEFAULT 'open', created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.demo_orders TO authenticated;
GRANT ALL ON public.demo_orders TO service_role;
ALTER TABLE public.demo_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own demo orders" ON public.demo_orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TABLE public.demo_transactions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, request_key uuid NOT NULL, kind text NOT NULL, bucket text NOT NULL CHECK(bucket IN ('forecast','resource')), amount_cents bigint NOT NULL CHECK(amount_cents <> 0), description text NOT NULL, order_id uuid REFERENCES public.demo_orders(id), refund_of uuid REFERENCES public.demo_transactions(id), created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,request_key), UNIQUE(refund_of)
);
GRANT SELECT ON public.demo_transactions TO authenticated;
GRANT ALL ON public.demo_transactions TO service_role;
ALTER TABLE public.demo_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own demo transactions" ON public.demo_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX demo_transactions_owner_date ON public.demo_transactions(user_id,created_at DESC);
CREATE OR REPLACE FUNCTION public.demo_money_action(p_action text, p_key uuid, p_data jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); w public.demo_wallets%ROWTYPE; tx public.demo_transactions%ROWTYPE; ord public.demo_orders%ROWTYPE; amount bigint; bucket text; label text; price integer; shares integer;
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in to use demo money'; END IF;
 INSERT INTO public.demo_wallets(user_id) VALUES(uid) ON CONFLICT DO NOTHING;
 SELECT * INTO w FROM public.demo_wallets WHERE user_id=uid FOR UPDATE;
 SELECT * INTO tx FROM public.demo_transactions WHERE user_id=uid AND request_key=p_key;
 IF FOUND THEN RETURN jsonb_build_object('ok',true,'duplicate',true); END IF;
 IF p_action='topup' THEN
  amount := (p_data->>'amount')::bigint;
  IF amount NOT IN (1000,5000,25000,100000) THEN RAISE EXCEPTION 'Unknown demo amount'; END IF;
  amount := amount*100; bucket := p_data->>'bucket';
  IF bucket NOT IN ('forecast','resource') OR bucket IS NULL THEN RAISE EXCEPTION 'Unknown demo balance'; END IF;
  label := 'topup';
 ELSIF p_action='place' THEN
  price := (p_data->>'priceCents')::integer; shares := (p_data->>'shares')::integer;
  IF price IS NULL OR price NOT BETWEEN 1 AND 99 OR shares IS NULL OR shares NOT BETWEEN 1 AND 1000000 OR coalesce(p_data->>'side','') NOT IN ('yes','no') OR coalesce(p_data->>'marketSlug','') !~ '^[a-z0-9-]{3,64}$' THEN RAISE EXCEPTION 'Invalid demo order'; END IF;
  amount := -price::bigint*shares; bucket := 'forecast'; label := 'order';
  IF w.forecast_cents + amount < 0 THEN RAISE EXCEPTION 'Not enough demo forecast credits. Add free credits in Wallet.'; END IF;
  INSERT INTO public.demo_orders(user_id,market_slug,market_question,market_category,side,price_cents,shares,cost_cents) VALUES(uid,p_data->>'marketSlug',left(coalesce(p_data->>'marketQuestion','Demo market'),200),left(coalesce(p_data->>'marketCategory','Demo'),60),p_data->>'side',price,shares,-amount) RETURNING * INTO ord;
 ELSIF p_action='cancel' THEN
  SELECT * INTO ord FROM public.demo_orders WHERE id=(p_data->>'orderId')::uuid AND user_id=uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Demo order not found'; END IF;
  IF ord.status <> 'open' THEN RETURN jsonb_build_object('ok',true); END IF;
  UPDATE public.demo_orders SET status='cancelled' WHERE id=ord.id;
  amount := ord.cost_cents; bucket := 'forecast'; label := 'cancel';
 ELSIF p_action='spend' THEN
  amount := (p_data->>'amountCents')::bigint;
  IF amount IS NULL OR amount < 1 OR amount > 10000000 OR coalesce(p_data->>'purpose','') NOT IN ('support','commercial') THEN RAISE EXCEPTION 'Invalid demo payment'; END IF;
  amount := -amount; bucket := 'resource'; label := p_data->>'purpose';
 ELSIF p_action='refund' THEN
  SELECT * INTO tx FROM public.demo_transactions WHERE id=(p_data->>'transactionId')::uuid AND user_id=uid AND kind IN ('support','commercial') FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Demo payment not found'; END IF;
  IF EXISTS(SELECT 1 FROM public.demo_transactions WHERE refund_of=tx.id) THEN RETURN jsonb_build_object('ok',true); END IF;
  amount := -tx.amount_cents; bucket := 'resource'; label := 'refund';
 ELSE RAISE EXCEPTION 'Unknown demo action'; END IF;
 IF bucket='forecast' THEN
  IF w.forecast_cents+amount < 0 THEN RAISE EXCEPTION 'Not enough demo forecast credits'; END IF;
  UPDATE public.demo_wallets SET forecast_cents=forecast_cents+amount WHERE user_id=uid;
 ELSE
  IF w.resource_cents+amount < 0 THEN RAISE EXCEPTION 'Not enough demo resource units'; END IF;
  UPDATE public.demo_wallets SET resource_cents=resource_cents+amount WHERE user_id=uid;
 END IF;
 INSERT INTO public.demo_transactions(user_id,request_key,kind,bucket,amount_cents,description,order_id,refund_of) VALUES(uid,p_key,label,bucket,amount,label,ord.id,CASE WHEN p_action='refund' THEN tx.id ELSE NULL END);
 RETURN jsonb_build_object('ok',true);
END $$;
REVOKE ALL ON FUNCTION public.demo_money_action(text,uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.demo_money_action(text,uuid,jsonb) TO authenticated;
COMMENT ON TABLE public.demo_wallets IS 'Simulation only. Never migrate balances into real financial entitlements.';
COMMENT ON TABLE public.demo_orders IS 'Simulation only. Debits and cancellation refunds are atomic with demo balances.';