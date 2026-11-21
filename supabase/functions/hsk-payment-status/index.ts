// HSK Panda — authenticated order status and webhook-failure fallback.
// GET payOS link details server-to-server; never trust browser success URLs.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";

const ORIGIN = "https://thanhhochub-commits.github.io";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};
const respond = (x: unknown, status = 200) =>
  new Response(JSON.stringify(x), { headers: cors, status });
function dbAdmin() {
  return createClient(Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { headers: cors });
  if (req.method !== "POST") return respond({ error: "Method not allowed" }, 405);
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return respond({ error: "Unauthorized" }, 401);
  try {
    const db = dbAdmin();
    const { data: userData, error: authError } = await db.auth.getUser(token);
    if (authError || !userData.user) return respond({ error: "Unauthorized" }, 401);
    const body = await req.json();
    const orderCode = Number(body?.orderCode);
    if (!Number.isSafeInteger(orderCode)) return respond({ error: "Invalid order" }, 400);
    const { data: order, error: orderError } = await db.from("hsk_orders")
      .select("order_code,user_id,status,amount_vnd,payment_link_id")
      .eq("order_code", orderCode)
      .eq("user_id", userData.user.id).maybeSingle();
    if (orderError) throw orderError;
    if (!order) return respond({ error: "Order not found" }, 404);

    if (order.status === "pending" && order.payment_link_id) {
      const id = Deno.env.get("PAYOS_CLIENT_ID") || "";
      const key = Deno.env.get("PAYOS_API_KEY") || "";
      if (id && key) {
        const response = await fetch(
          "https://api-merchant.payos.vn/v2/payment-requests/" +
            encodeURIComponent(order.payment_link_id), {
            headers: { "x-client-id": id, "x-api-key": key },
          },
        );
        if (response.ok) {
          const result = await response.json();
          const info = result?.data;
          if (result.code === "00" && info?.status === "PAID"
              && Number(info.orderCode) === orderCode
              && Number(info.amount) === Number(order.amount_vnd)
              && Number(info.amountPaid) >= Number(order.amount_vnd)
              && info.id === order.payment_link_id) {
            const { error: rpcError } = await db.rpc("hsk_apply_verified_payment", {
              p_order_code: orderCode,
              p_amount_vnd: Number(order.amount_vnd),
              p_payment_link_id: order.payment_link_id,
              p_reference: "payos-reconciled-" + orderCode,
            });
            if (rpcError) throw rpcError;
          }
        }
      }
    }
    const { data: updated, error: updateError } = await db.from("hsk_orders")
      .select("status").eq("order_code", orderCode).single();
    if (updateError) throw updateError;
    const { data: access, error: accessError } = await db.from("hsk_access")
      .select("plan_code,expires_at").eq("user_id", userData.user.id).maybeSingle();
    if (accessError) throw accessError;
    return respond({
      orderCode, status: updated.status,
      proActive: access?.plan_code === "pro"
        && !!access?.expires_at && Date.parse(access.expires_at) > Date.now(),
      expiresAt: access?.expires_at || null,
    });
  } catch (e) {
    console.error("hsk-payment-status", e instanceof Error ? e.message : String(e));
    return respond({ error: "Could not verify payment status" }, 503);
  }
});
