// HSK Panda — create payment link (Supabase Edge Function, Deno)
// DO NOT deploy with PAYMENTS_ENABLED=true until backend and webhook tests pass.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { PayOS } from "npm:@payos/node@2.0.6";

const SITE = "https://thanhhochub-commits.github.io";
const SITE_URL = SITE + "/HSK/";
const PLANS: Record<string, { amount: number; label: string }> = {
  pro_30: { amount: 89000, label: "HSK Pro 30 ngay" },
  pro_90: { amount: 219000, label: "HSK Pro 90 ngay" },
  pro_365: { amount: 699000, label: "HSK Pro 365 ngay" },
};
const cors = {
  "Access-Control-Allow-Origin": SITE,
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};
const respond = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: cors });

function adminClient() {
  const key = (Deno.env.get("SUPABASE_SECRET_KEYS")
    ? JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default
    : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const url = Deno.env.get("SUPABASE_URL");
  if (!url || !key) throw Error("Supabase secret configuration is missing");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
function payos() {
  const clientId = Deno.env.get("PAYOS_CLIENT_ID") || Deno.env.get("Client ID");
  const apiKey = Deno.env.get("PAYOS_API_KEY") || Deno.env.get("Api Key");
  const checksumKey = Deno.env.get("PAYOS_CHECKSUM_KEY") || Deno.env.get("Checksum Key");
  if (!clientId || !apiKey || !checksumKey) {
    throw Error("payOS credentials are not configured");
  }
  return new PayOS({ clientId, apiKey, checksumKey });
}
function orderNumber(): number {
  const random = crypto.getRandomValues(new Uint32Array(1))[0] % 100000;
  return Number(String(Date.now()).slice(-10) + String(random).padStart(5, "0"));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { headers: cors });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  // Public purchase remains disabled until the owner verifies a real payment.
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return respond({ error: "Please sign in first" }, 401);
  let orderCode: number | null = null;
  let db: ReturnType<typeof adminClient> | null = null;
  try {
    const body = await req.json();
    const planCode = String(body?.planCode || "");
    const requestedTest = planCode === "owner_test";
    db = adminClient();
    const { data: identity, error: authError } = await db.auth.getUser(token);
    if (authError || !identity.user) return respond({ error: "Session expired" }, 401);

    // Only the verified website owner can generate a 2,000 VND trial payment.
    // This does not enable public payments.
    const ownerEmail = "thanhhochub@gmail.com";
    const isVerifiedOwner = (
      identity.user.email?.trim().toLowerCase() === ownerEmail &&
      Boolean(identity.user.email_confirmed_at)
    );
    if (requestedTest && !isVerifiedOwner) {
      return respond({ error: "Owner verification required for checkout test" }, 403);
    }
    if (!requestedTest && Deno.env.get("PAYMENTS_ENABLED") !== "true") {
      return respond({ error: "Public checkout is not yet enabled" }, 503);
    }
    const plan = requestedTest
      ? { amount: 2000, label: "HSK Panda kiem thu thanh toan" }
      : PLANS[planCode];
    if (!plan) return respond({ error: "Unknown plan" }, 400);

    orderCode = orderNumber();
    const { error: insertError } = await db.from("hsk_orders").insert({
      user_id: identity.user.id,
      order_code: orderCode,
      plan_code: planCode,
      amount_vnd: plan.amount,
      status: "pending",
    });
    if (insertError) throw insertError;

    const link = await payos().paymentRequests.create({
      orderCode,
      amount: plan.amount,
      description: "HSK " + String(orderCode).slice(-8),
      items: [{ name: plan.label, quantity: 1, price: plan.amount }],
      cancelUrl: SITE_URL + "?hsk_payment=cancel",
      returnUrl: SITE_URL + "?hsk_payment=return",
    });
    if (!link?.checkoutUrl || !link?.paymentLinkId) {
      throw Error("payOS did not return a complete payment link");
    }
    const { error: saveError } = await db.from("hsk_orders").update({
      payment_link_id: link.paymentLinkId,
    }).eq("order_code", orderCode).eq("user_id", identity.user.id).eq("status", "pending");
    if (saveError) {
      // Do not hand out an untracked payment URL.
      try { await payos().paymentRequests.cancel(link.paymentLinkId); }
      catch (_) { /* cancellation may not be available; record and investigate */ }
      throw saveError;
    }
    return respond({
      orderCode, checkoutUrl: link.checkoutUrl,
      isOwnerTest: requestedTest, amountVnd: plan.amount,
    });
  } catch (e) {
    if (db && orderCode) {
      await db.from("hsk_orders").update({ status: "cancelled" })
        .eq("order_code", orderCode).eq("status", "pending");
    }
    console.error("create-hsk-checkout", e instanceof Error ? e.message : String(e));
    return respond({ error: "Could not create payment link. Please try again later." }, 503);
  }
});
