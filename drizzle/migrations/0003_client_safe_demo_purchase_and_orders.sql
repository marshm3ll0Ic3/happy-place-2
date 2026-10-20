CREATE OR REPLACE FUNCTION public.demo_buy_pack(_pack_id text, _nonce uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE uid uuid := auth.uid(); p public.credit_packs%ROWTYPE;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Sign in to buy demo credits'; END IF;
  IF NOT EXISTS (SELECT 1 FROM feature_flags WHERE key='credit_purchase_enabled' AND enabled) THEN RAISE EXCEPTION 'Credit purchases are disabled'; END IF;
  SELECT * INTO p FROM credit_packs WHERE id=_pack_id AND active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pack not found'; END IF;
  PERFORM post_transfer('mock:'||uid||':'||_nonce, 'purchase', p.name||' pack', NULL, 'dsc_issuance', uid, NULL, 'restricted', p.dsc_amount);
  INSERT INTO payments(user_id, pack_id, stripe_session_id, amount_cents, dsc_amount, status)
  VALUES (uid, p.id, 'mock:'||uid||':'||_nonce, p.price_cents, p.dsc_amount, 'mock');
  RETURN p.dsc_amount;
END $$;

CREATE OR REPLACE FUNCTION public.demo_place_order(_slug text, _question text, _category text, _side text, _price integer, _shares integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE uid uuid := auth.uid(); cost integer; promo integer; restr integer; bp integer; br integer; oid uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Sign in to trade'; END IF;
  IF _slug !~ '^[a-z0-9-]{3,64}$' OR _side NOT IN ('yes','no') OR _price NOT BETWEEN 1 AND 99 OR _shares NOT BETWEEN 1 AND 1000000 THEN RAISE EXCEPTION 'Invalid order'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext(uid::text));
  cost := ceil(_price::numeric*_shares/100);
  SELECT coalesce(sum(CASE WHEN direction='credit' THEN amount ELSE -amount END),0) INTO bp FROM ledger_entries WHERE user_id=uid AND bucket='promotional';
  SELECT coalesce(sum(CASE WHEN direction='credit' THEN amount ELSE -amount END),0) INTO br FROM ledger_entries WHERE user_id=uid AND bucket='restricted';
  promo := least(bp, cost); restr := cost - promo;
  IF restr > br THEN RAISE EXCEPTION 'Not enough DSC — this order needs % DSC. Buy demo credits in your Wallet.', cost; END IF;
  INSERT INTO orders(user_id, market_slug, market_question, market_category, side, price_cents, shares)
  VALUES (uid, _slug, left(_question,200), left(_category,60), _side, _price, _shares) RETURNING id INTO oid;
  IF promo > 0 THEN PERFORM post_transfer('order:'||oid||':promotional','trade_debit',upper(_side)||' · '||left(_question,80),uid,NULL,NULL,'trade_escrow','promotional',promo); END IF;
  IF restr > 0 THEN PERFORM post_transfer('order:'||oid||':restricted','trade_debit',upper(_side)||' · '||left(_question,80),uid,NULL,NULL,'trade_escrow','restricted',restr); END IF;
  RETURN cost;
END $$;

CREATE OR REPLACE FUNCTION public.demo_cancel_order(_order_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE uid uuid := auth.uid(); r record;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  UPDATE orders SET status='cancelled' WHERE id=_order_id AND user_id=uid AND status='open';
  IF NOT FOUND THEN RETURN; END IF;
  FOR r IN SELECT e.amount, e.bucket FROM ledger_entries e JOIN transactions t ON t.id=e.transaction_id
    WHERE e.user_id=uid AND e.direction='debit' AND t.idempotency_key LIKE 'order:'||_order_id||':%' LOOP
    PERFORM post_transfer('refund:'||_order_id||':'||r.bucket,'refund','Order cancelled · refund',NULL,'trade_escrow',uid,NULL,r.bucket,r.amount);
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.demo_buy_pack(text,uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.demo_place_order(text,text,text,text,integer,integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.demo_cancel_order(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.demo_buy_pack(text,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.demo_place_order(text,text,text,text,integer,integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.demo_cancel_order(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.post_transfer(text,txn_type,text,uuid,text,uuid,text,credit_bucket,integer) FROM PUBLIC, anon, authenticated;