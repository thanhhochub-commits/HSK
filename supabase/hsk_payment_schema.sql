-- HSK Panda | Schema for verified, automatic Pro activation
-- Run ONCE in the HSK Supabase SQL Editor. Idempotent for a fresh database
-- and the simple hsk_orders / hsk_access tables from the prior setup.
-- No customer is charged merely by applying this file.

CREATE TABLE IF NOT EXISTS public.hsk_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_code BIGINT NOT NULL UNIQUE,
  plan_code TEXT NOT NULL,
  amount_vnd INTEGER NOT NULL CHECK (amount_vnd > 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','cancelled','expired','refunded')),
  payment_link_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.hsk_access (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  plan_code TEXT NOT NULL DEFAULT 'free',
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hsk_orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS hsk_orders_reference_unique
ON public.hsk_orders(payment_reference) WHERE payment_reference IS NOT NULL;
CREATE INDEX IF NOT EXISTS hsk_orders_user_created_idx
ON public.hsk_orders(user_id, created_at DESC);

ALTER TABLE public.hsk_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hsk_access ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.hsk_orders FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.hsk_access FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE public.hsk_orders TO authenticated;
GRANT SELECT ON TABLE public.hsk_access TO authenticated;

DO $policies$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='hsk_orders'
      AND policyname='View own orders'
  ) THEN
    CREATE POLICY "View own orders"
      ON public.hsk_orders FOR SELECT TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='hsk_access'
      AND policyname='View own access'
  ) THEN
    CREATE POLICY "View own access"
      ON public.hsk_access FOR SELECT TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END;
$policies$;

-- Called only by service_role after PayOS signature or PayOS API verification.
-- Locks one order row and extends Pro at most once per verified payment.
CREATE OR REPLACE FUNCTION public.hsk_apply_verified_payment(
  p_order_code BIGINT,
  p_amount_vnd INTEGER,
  p_payment_link_id TEXT,
  p_reference TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  o public.hsk_orders%ROWTYPE;
  days_for_plan INTEGER;
BEGIN
  SELECT * INTO o
    FROM public.hsk_orders
    WHERE order_code = p_order_code
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF o.amount_vnd <> p_amount_vnd
      OR o.payment_link_id IS NULL
      OR o.payment_link_id <> p_payment_link_id THEN
    RETURN FALSE;
  END IF;

  IF o.status = 'paid' THEN
    RETURN TRUE;
  END IF;

  IF o.status <> 'pending' THEN
    RETURN FALSE;
  END IF;

  CASE o.plan_code
    WHEN 'owner_test' THEN
      days_for_plan := 1;
      IF o.amount_vnd <> 2000 THEN RETURN FALSE; END IF;
    WHEN 'pro_30' THEN
      days_for_plan := 30;
      IF o.amount_vnd <> 89000 THEN RETURN FALSE; END IF;
    WHEN 'pro_90' THEN
      days_for_plan := 90;
      IF o.amount_vnd <> 219000 THEN RETURN FALSE; END IF;
    WHEN 'pro_365' THEN
      days_for_plan := 365;
      IF o.amount_vnd <> 699000 THEN RETURN FALSE; END IF;
    ELSE
      RETURN FALSE;
  END CASE;

  UPDATE public.hsk_orders
  SET status='paid', paid_at=now(),
      payment_reference=NULLIF(p_reference,'')
  WHERE id=o.id;

  INSERT INTO public.hsk_access(user_id,plan_code,expires_at,updated_at)
  VALUES (o.user_id, 'pro', now() + make_interval(days=>days_for_plan), now())
  ON CONFLICT (user_id) DO UPDATE
  SET plan_code='pro',
      expires_at=GREATEST(
        COALESCE(public.hsk_access.expires_at,now()),now()
      ) + make_interval(days=>days_for_plan),
      updated_at=now();

  RETURN TRUE;
END;
$func$;

REVOKE ALL ON FUNCTION public.hsk_apply_verified_payment(
  BIGINT,INTEGER,TEXT,TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hsk_apply_verified_payment(
  BIGINT,INTEGER,TEXT,TEXT
) TO service_role;

-- Pro checks must use the server-held hsk_access table, never localStorage.
-- No INSERT / UPDATE / DELETE policy is granted to customers.
