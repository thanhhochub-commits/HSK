// HSK Panda: PUBLIC guest-only 2,000 VND test payment.
// This endpoint NEVER grants Pro and cannot create other priced orders.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { PayOS } from "npm:@payos/node@2.0.6";

const ORIGIN = "https://thanhhochub-commits.github.io";
const BASE = ORIGIN + "/HSK/";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};
const respond = (v: unknown, status = 200) =>
  new Response(JSON.stringify(v), { status, headers: cors });
function admin() {
  const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
  const key = keys.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!url || !key) throw Error("Supabase service not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
function payos() {
  const clientId = Deno.env.get("PAYOS_CLIENT_ID") || Deno.env.get("Client ID");
  const apiKey = Deno.env.get("PAYOS_API_KEY") || Deno.env.get("Api Key");
  const checksumKey = Deno.env.get("PAYOS_CHECKSUM_KEY") || Deno.env.get("Checksum Key");
  if (!clientId || !apiKey || !checksumKey) throw Error("Missing payOS credentials");
  return new PayOS({ clientId, apiKey, checksumKey });
}
function hex(b: Uint8Array): string {
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
async function digest(x: string): Promise<string> {
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x))));
}
function orderNum(): number {
  const two = crypto.getRandomValues(new Uint8Array(2));
  return Number(String(Date.now()) + String((two[0] * 256 + two[1]) % 100).padStart(2, "0"));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { headers: cors });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  if (req.headers.get("origin") !== ORIGIN) {
    return respond({ error: "Invalid checkout origin" }, 403);
  }
  let code: number | null = null;
  let db: ReturnType<typeof admin> | undefined;
  try {
    db = admin();
    const body = await req.json().catch(() => ({}));
    // Reuse the pending link instead of wasting the limited free payOS quota.
    const oldToken = typeof body?.guestToken === "string" ? body.guestToken : "";
    if (/^[0-9a-f]{64}$/.test(oldToken)) {
      const oldHash = await digest(oldToken);
      const { data: old } = await db.from("hsk_guest_trials")
        .select("order_code,checkout_url,status,created_at").eq("token_hash",oldHash).maybeSingle();
      if (old?.status === "pending" && old.checkout_url &&
          Date.now() - Date.parse(old.created_at) < 45 * 60 * 1000) {
        return respond({
          orderCode: old.order_code, checkoutUrl: old.checkout_url,
          guestToken: oldToken, amountVnd: 2000, days: 1,
        });
      }
    }
    const secret = hex(crypto.getRandomValues(new Uint8Array(32)));
    const hashed = await digest(secret);
    code = orderNum();
    const { data: reserved, error: reserveError } = await db
      .rpc("hsk_reserve_guest_trial", { p_order_code: code, p_token_hash: hashed });
    if (reserveError) throw reserveError;
    if (reserved !== true) {
      return respond({ error: "Đã hết số lượt tạo QR thử trong hôm nay." }, 429);
    }
    const link = await payos().paymentRequests.create({
      orderCode: code,
      amount: 2000,
      description: "HSK " + String(code).slice(-8),
      items: [{ name: "HSK Pro test 1 ngay", quantity: 1, price: 2000 }],
      cancelUrl: BASE + "?hsk_payment=cancel#payment-status",
      returnUrl: BASE + "?hsk_payment=return#payment-status",
    });
    if (!link?.checkoutUrl || !link?.paymentLinkId) throw Error("Incomplete payment link");
    const { data: saved, error: saveError } = await db.from("hsk_guest_trials")
      .update({ payment_link_id: link.paymentLinkId, checkout_url: link.checkoutUrl })
      .eq("order_code", code).eq("status", "pending")
      .select("order_code").single();
    if (saveError || !saved) {
      try { await payos().paymentRequests.cancel(link.paymentLinkId); } catch (_) {}
      throw saveError || Error("Unable to save payment link");
    }
    return respond({
      orderCode: code, checkoutUrl: link.checkoutUrl,
      guestToken: secret, amountVnd: 2000, days: 1,
    });
  } catch (e) {
    if (db && code !== null) {
      // No checkout link was delivered to the browser on failure.
      await db.from("hsk_guest_trials").update({ status: "cancelled" })
        .eq("order_code", code).eq("status","pending");
    }
    console.error("hsk-guest-checkout", e instanceof Error ? e.message : String(e));
    return respond({ error: "Không tạo được QR lúc này, vui lòng thử lại sau." }, 503);
  }
});