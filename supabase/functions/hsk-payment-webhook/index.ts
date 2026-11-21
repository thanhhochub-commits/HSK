// HSK Panda — signed payOS webhook.
// Deploy with JWT verification DISABLED for this function ONLY.
// Authentication is payOS HMAC signature via the official SDK.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { PayOS } from "npm:@payos/node@2.0.6";

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

function service() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = (Deno.env.get("SUPABASE_SECRET_KEYS")
    ? JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}").default
    : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  if (!url || !key) throw Error("Missing Supabase credentials");
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

Deno.serve(async (req) => {
  // Non-sensitive readiness check. Never disclose secret values.
  if (req.method === "GET") {
    const configured = !!(
      (Deno.env.get("PAYOS_CLIENT_ID") || Deno.env.get("Client ID")) &&
      (Deno.env.get("PAYOS_API_KEY") || Deno.env.get("Api Key")) &&
      (Deno.env.get("PAYOS_CHECKSUM_KEY") || Deno.env.get("Checksum Key"))
    );
    return json({ service: "hsk-payment-webhook", credentialsConfigured: configured });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const envelope = await req.json();
    const verified = await payos().webhooks.verify(envelope);
    if (envelope?.success !== true || envelope?.code !== "00") {
      return json({ received: true, granted: false });
    }
    const code = Number(verified?.orderCode);
    const amount = Number(verified?.amount);
    const link = String(verified?.paymentLinkId || "");
    const ref = String(verified?.reference || "");
    if (!Number.isSafeInteger(code) || !Number.isSafeInteger(amount)
        || amount <= 0 || !link
        || verified?.code !== "00" || verified?.currency !== "VND") {
      return json({ received: true, granted: false });
    }
    // A valid signed test webhook with no matching real order grants nothing.
    const { data, error } = await service().rpc("hsk_apply_verified_payment", {
      p_order_code: code,
      p_amount_vnd: amount,
      p_payment_link_id: link,
      p_reference: ref,
    });
    if (error) throw error;
    return json({ received: true, granted: data === true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("hsk-payOS-webhook", message);
    // Invalid signature must never grant Pro.
    if (/signature|verify|checksum|invalid/i.test(message)) {
      return json({ error: "Invalid signature" }, 401);
    }
    // Other failures return 5xx so payOS can retry delivery.
    return json({ error: "Webhook processing failed" }, 500);
  }
});
