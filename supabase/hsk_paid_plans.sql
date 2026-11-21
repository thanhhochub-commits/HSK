-- HSK Panda — replace the 2,000đ checkout with three commercial plans.
-- Do not delete hsk_guest_trials: already-paid trial stays valid to its expiry.
CREATE TABLE IF NOT EXISTS public.hsk_guest_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code bigint NOT NULL UNIQUE,
  token_hash text NOT NULL CHECK (length(token_hash)=64),
  plan_code text NOT NULL,
  amount_vnd integer NOT NULL,
  duration_days integer NOT NULL,
  payment_link_id text UNIQUE,
  checkout_url text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','cancelled','expired','refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  pro_expires_at timestamptz,
  payment_reference text,
  CONSTRAINT hsk_guest_subscriptions_plans_check CHECK (
    (plan_code='pro_30' AND amount_vnd=89000 AND duration_days=30)
    OR (plan_code='pro_90' AND amount_vnd=219000 AND duration_days=90)
    OR (plan_code='pro_365' AND amount_vnd=699000 AND duration_days=365)
  )
);
CREATE INDEX IF NOT EXISTS hsk_subscriptions_token_idx
ON public.hsk_guest_subscriptions(token_hash,created_at DESC);
CREATE INDEX IF NOT EXISTS hsk_subscriptions_created_idx
ON public.hsk_guest_subscriptions(created_at DESC);

ALTER TABLE public.hsk_guest_subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.hsk_guest_subscriptions FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.hsk_guest_subscriptions TO service_role;

-- Reserve a quote at server-defined price only, with transaction-level rate limiting.
CREATE OR REPLACE FUNCTION public.hsk_reserve_guest_subscription(
  p_order_code bigint, p_token_hash text, p_plan_code text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $func$
DECLARE
 n_all integer;
 n_token integer;
 v_amount integer;
 v_days integer;
BEGIN
  IF p_order_code<=0 OR length(p_token_hash)<>64 THEN RETURN false; END IF;
  CASE p_plan_code
    WHEN 'pro_30' THEN v_amount:=89000; v_days:=30;
    WHEN 'pro_90' THEN v_amount:=219000; v_days:=90;
    WHEN 'pro_365' THEN v_amount:=699000; v_days:=365;
    ELSE RETURN false;
  END CASE;
  PERFORM pg_catalog.pg_advisory_xact_lock(202611230);
  SELECT count(*) INTO n_all FROM public.hsk_guest_subscriptions
   WHERE created_at>now()-interval '24 hours';
  SELECT count(*) INTO n_token FROM public.hsk_guest_subscriptions
   WHERE token_hash=p_token_hash AND created_at>now()-interval '24 hours';
  -- Free-tier cost / abuse cap. Increase only after verifying provider capacity.
  IF n_all>=75 OR n_token>=3 THEN RETURN false; END IF;
  INSERT INTO public.hsk_guest_subscriptions
    (order_code,token_hash,plan_code,amount_vnd,duration_days)
  VALUES (p_order_code,p_token_hash,p_plan_code,v_amount,v_days);
  RETURN true;
END;
$func$;

-- Only an authenticated, verified payOS event or payOS API lookup may call.
-- Row + token advisory locks prevent double-credit and concurrent overextension.
CREATE OR REPLACE FUNCTION public.hsk_apply_verified_guest_subscription(
  p_order_code bigint, p_amount_vnd integer,
  p_payment_link_id text, p_reference text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $func$
DECLARE
 o public.hsk_guest_subscriptions%ROWTYPE;
 v_expiry timestamptz;
BEGIN
  SELECT * INTO o FROM public.hsk_guest_subscriptions
   WHERE order_code=p_order_code FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF p_amount_vnd<>o.amount_vnd OR o.payment_link_id IS NULL
     OR p_payment_link_id<>o.payment_link_id THEN
    RETURN false;
  END IF;
  IF o.status='paid' THEN RETURN true; END IF;
  IF o.status<>'pending' THEN RETURN false; END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(202611231,pg_catalog.hashtext(o.token_hash));
  SELECT GREATEST(
      now(),
      COALESCE(
        (SELECT max(s.pro_expires_at) FROM public.hsk_guest_subscriptions s
         WHERE s.token_hash=o.token_hash AND s.status='paid'),
        now()
      ),
      COALESCE(
        (SELECT max(t.pro_expires_at) FROM public.hsk_guest_trials t
         WHERE t.token_hash=o.token_hash AND t.status='paid'),
        now()
      )
    ) + make_interval(days=>o.duration_days)
    INTO v_expiry;
  UPDATE public.hsk_guest_subscriptions
   SET status='paid',paid_at=now(),pro_expires_at=v_expiry,
       payment_reference=nullif(p_reference,'')
   WHERE id=o.id;
  RETURN true;
END;
$func$;

REVOKE ALL ON FUNCTION public.hsk_reserve_guest_subscription(bigint,text,text)
 FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.hsk_apply_verified_guest_subscription(bigint,integer,text,text)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.hsk_reserve_guest_subscription(bigint,text,text)
 TO service_role;
GRANT EXECUTE ON FUNCTION public.hsk_apply_verified_guest_subscription(bigint,integer,text,text)
 TO service_role;
