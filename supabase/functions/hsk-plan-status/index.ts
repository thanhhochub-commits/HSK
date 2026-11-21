// HSK Panda paid guest entitlement: secret-token capability, not URL-based.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { PayOS } from "npm:@payos/node@2.0.6";
const ORIGIN="https://thanhhochub-commits.github.io";
const headers={
  "Access-Control-Allow-Origin":ORIGIN,
  "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods":"POST,OPTIONS",
  "Content-Type":"application/json"
};
const reply=(data:unknown,status=200)=>
  new Response(JSON.stringify(data),{status,headers});
function backend(){
  const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
  const key=keys.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url=Deno.env.get("SUPABASE_URL");
  if(!key||!url)throw Error("Backend unavailable");
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
function payos(){
  const clientId=Deno.env.get("PAYOS_CLIENT_ID")||Deno.env.get("Client ID");
  const apiKey=Deno.env.get("PAYOS_API_KEY")||Deno.env.get("Api Key");
  const checksumKey=Deno.env.get("PAYOS_CHECKSUM_KEY")||Deno.env.get("Checksum Key");
  if(!clientId||!apiKey||!checksumKey)throw Error("Missing payOS credentials");
  return new PayOS({clientId,apiKey,checksumKey});
}
async function hash(token:string){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,"0")).join("");
}
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("",{headers});
  if(req.method!=="POST")return reply({error:"Method not allowed"},405);
  if(req.headers.get("origin")!==ORIGIN)return reply({error:"Nguồn không hợp lệ"},403);
  try{
    const body=await req.json();
    const token=typeof body?.guestToken==="string"?body.guestToken:"";
    if(!/^[0-9a-f]{64}$/.test(token))
      return reply({error:"Phiên khách không hợp lệ"},401);
    const tokenHash=await hash(token);
    const db=backend();
    const {data:recent,error:readError}=await db.from("hsk_guest_subscriptions")
      .select("order_code,plan_code,amount_vnd,status,payment_link_id,created_at")
      .eq("token_hash",tokenHash).order("created_at",{ascending:false})
      .limit(1).maybeSingle();
    if(readError)throw readError;
    const {data:prior,error:priorError}=await db.from("hsk_guest_trials")
      .select("pro_expires_at").eq("token_hash",tokenHash).eq("status","paid")
      .order("pro_expires_at",{ascending:false}).limit(1).maybeSingle();
    if(priorError)throw priorError;
    if(!recent&&!prior)
      return reply({error:"Không có đơn hàng thuộc phiên này"},404);

    // Webhook is primary. Reconcile with payOS API if the webhook is delayed.
    if(recent?.status==="pending"&&recent.payment_link_id){
      try{
        const info=await payos().paymentRequests.get(recent.payment_link_id);
        if(info?.status==="PAID"&&Number(info?.orderCode)===Number(recent.order_code)
          &&Number(info?.amount)===Number(recent.amount_vnd)
          &&Number(info?.amountPaid)>=Number(recent.amount_vnd)
          &&info?.id===recent.payment_link_id){
          const rpc=await db.rpc("hsk_apply_verified_guest_subscription",{
            p_order_code:recent.order_code,
            p_amount_vnd:recent.amount_vnd,
            p_payment_link_id:recent.payment_link_id,
            p_reference:"reconciled-"+recent.order_code,
          });
          if(rpc.error)throw rpc.error;
        }
      }catch(e){
        console.error("hsk-plan-reconcile",e instanceof Error?e.message:"unavailable");
      }
    }
    const {data:recentPaid,error:paidError}=await db.from("hsk_guest_subscriptions")
      .select("pro_expires_at,plan_code,order_code").eq("token_hash",tokenHash)
      .eq("status","paid").order("pro_expires_at",{ascending:false})
      .limit(1).maybeSingle();
    if(paidError)throw paidError;
    const {data:latest,error:latestError}=await db.from("hsk_guest_subscriptions")
      .select("status,order_code,plan_code,amount_vnd").eq("token_hash",tokenHash)
      .order("created_at",{ascending:false}).limit(1).maybeSingle();
    if(latestError)throw latestError;
    const expiry=[recentPaid?.pro_expires_at,prior?.pro_expires_at]
      .filter((x):x is string=>typeof x==="string")
      .sort((a,b)=>Date.parse(b)-Date.parse(a))[0]||null;

    return reply({
      status:latest?.status||"paid",
      orderCode:latest?.order_code||null,
      planCode:latest?.plan_code||"legacy_trial",
      amountVnd:latest?.amount_vnd||2000,
      proActive:!!expiry&&Date.parse(expiry)>Date.now(),
      expiresAt:expiry,
    });
  }catch(e){
    console.error("hsk-plan-status",e instanceof Error?e.message:"read error");
    return reply({error:"Chưa kiểm tra được đơn. Quyền Pro không bị xóa."},503);
  }
});