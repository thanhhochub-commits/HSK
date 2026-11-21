-- HSK Panda: guest-only 2,000 VND Pro smoke-test.
-- Guest access is attached to a secret held in THIS BROWSER only.
-- Do not treat this as a replacement for registered paid subscriptions.
CREATE TABLE IF NOT EXISTS public.hsk_guest_trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code bigint NOT NULL UNIQUE,
  token_hash text NOT NULL UNIQUE CHECK (char_length(token_hash)=64),
  payment_link_id text UNIQUE,
  checkout_url text,
  amount_vnd integer NOT NULL DEFAULT 2000 CHECK (amount_vnd=2000),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','cancelled','expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  pro_expires_at timestamptz,
  payment_reference text
);
ALTER TABLE public.hsk_guest_trials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.hsk_guest_trials FROM PUBLIC, anon, authenticated;
CREATE INDEX IF NOT EXISTS hsk_guest_trials_created_idx
  ON public.hsk_guest_trials(created_at DESC);

-- Bounded test links: max ten guest trials per rolling 24 hours.
CREATE OR REPLACE FUNCTION public.hsk_reserve_guest_trial(
  p_order_code bigint, p_token_hash text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE n integer;
BEGIN
  IF p_order_code <= 0 OR length(p_token_hash) <> 64 THEN
    RETURN false;
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(202611220);
  SELECT count(*) INTO n FROM public.hsk_guest_trials
    WHERE created_at > now() - interval '24 hours';
  IF n >= 10 THEN RETURN false; END IF;
  INSERT INTO public.hsk_guest_trials(order_code,token_hash)
    VALUES(p_order_code,p_token_hash);
  RETURN true;
END;
$fn$;

-- Signed payOS webhook or server-to-server payOS reconciliation ONLY.
-- Duplicate deliveries do not extend a trial twice.
CREATE OR REPLACE FUNCTION public.hsk_apply_verified_guest_trial(
  p_order_code bigint, p_amount_vnd integer,
  p_payment_link_id text, p_reference text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE r public.hsk_guest_trials%ROWTYPE;
BEGIN
  SELECT * INTO r FROM public.hsk_guest_trials
    WHERE order_code=p_order_code FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF p_amount_vnd<>2000 OR r.amount_vnd<>2000
    OR r.payment_link_id IS NULL
    OR r.payment_link_id<>p_payment_link_id THEN
    RETURN false;
  END IF;
  IF r.status='paid' THEN RETURN true; END IF;
  IF r.status<>'pending' THEN RETURN false; END IF;
  UPDATE public.hsk_guest_trials
    SET status='paid',paid_at=now(),
      pro_expires_at=now()+interval '1 day',
      payment_reference=nullif(p_reference,'')
    WHERE id=r.id;
  RETURN true;
END;
$fn$;

REVOKE ALL ON FUNCTION public.hsk_reserve_guest_trial(bigint,text)
  FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.hsk_apply_verified_guest_trial(bigint,integer,text,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.hsk_reserve_guest_trial(bigint,text)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.hsk_apply_verified_guest_trial(bigint,integer,text,text)
  TO service_role;

-- Service role alone may read and update guest checkouts.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hsk_guest_trials TO service_role;
