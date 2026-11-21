// HSK Panda: paid HSK Pro checkout, no required login.
// ONLY server-listed plans, exact amounts, token-bound browser entitlement.
// The previous 2,000 VND trial endpoint is retired separately.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { PayOS } from "npm:@payos/node@2.0.6";

const ORIGIN = "https://thanhhochub-commits.github.io";
const HOME = ORIGIN + "/HSK/";
const PLANS: Record<string,{amount:number,days:number,label:string}> = {
  pro_30: {amount:89000,days:30,label:"HSK Pro 30 ngay"},
  pro_90: {amount:219000,days:90,label:"HSK Pro 90 ngay"},
  pro_365: {amount:699000,days:365,label:"HSK Pro 365 ngay"}
};
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};
const respond=(data:unknown,status=200)=>
  new Response(JSON.stringify(data),{status,headers:cors});
const bytesToHex=(v:Uint8Array)=>
  Array.from(v,x=>x.toString(16).padStart(2,"0")).join("");
async function digest(token:string){
  return bytesToHex(new Uint8Array(
    await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token))
  ));
}
function backend() {
  const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
  const key=keys.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url=Deno.env.get("SUPABASE_URL");
  if(!url||!key)throw Error("Backend configuration unavailable");
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
function payos(){
  const clientId=Deno.env.get("PAYOS_CLIENT_ID")||Deno.env.get("Client ID");
  const apiKey=Deno.env.get("PAYOS_API_KEY")||Deno.env.get("Api Key");
  const checksumKey=Deno.env.get("PAYOS_CHECKSUM_KEY")||Deno.env.get("Checksum Key");
  if(!clientId||!apiKey||!checksumKey)throw Error("Missing payment provider credentials");
  return new PayOS({clientId,apiKey,checksumKey});
}
function orderNumber(){
  const random=crypto.getRandomValues(new Uint8Array(2));
  return Number(String(Date.now())+String((random[0]*256+random[1])%100).padStart(2,"0"));
}
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("",{headers:cors});
  if(req.method!=="POST")return respond({error:"Method not allowed"},405);
  if(req.headers.get("origin")!==ORIGIN)
    return respond({error:"Nguồn thanh toán không hợp lệ"},403);

  let db:ReturnType<typeof backend>|null=null;
  let orderCode:number|null=null;
  try{
    const body=await req.json().catch(()=>({}));
    const planCode=typeof body?.planCode==="string"?body.planCode:"";
    const plan=PLANS[planCode];
    if(!plan)return respond({error:"Gói học không tồn tại"},400);
    const submittedToken=typeof body?.guestToken==="string"?body.guestToken:"";
    const token=/^[0-9a-f]{64}$/.test(submittedToken)
      ? submittedToken
      : bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
    const hash=await digest(token);
    db=backend();

    // No accidental double-click payment: reuse a recent pending invoice.
    const {data:pending,error:pendingError}=await db.from("hsk_guest_subscriptions")
      .select("order_code,checkout_url,created_at,status")
      .eq("token_hash",hash).eq("plan_code",planCode).eq("status","pending")
      .order("created_at",{ascending:false}).limit(1).maybeSingle();
    if(pendingError)throw pendingError;
    if(pending?.checkout_url &&
      (Date.now()-Date.parse(pending.created_at)<45*60*1000)) {
      return respond({orderCode:pending.order_code,checkoutUrl:pending.checkout_url,
        guestToken:token,planCode,amountVnd:plan.amount,days:plan.days});
    }

    orderCode=orderNumber();
    const {data:reserved,error:reserveError}=await db.rpc(
      "hsk_reserve_guest_subscription",{
        p_order_code:orderCode,p_token_hash:hash,p_plan_code:planCode
      }
    );
    if(reserveError)throw reserveError;
    if(reserved!==true)return respond({
      error:"Đã đạt giới hạn tạo đơn thanh toán trong ngày. Vui lòng thử sau."
    },429);

    const link=await payos().paymentRequests.create({
      orderCode,
      amount:plan.amount,
      description:"HSK "+String(orderCode).slice(-8),
      items:[{name:plan.label,quantity:1,price:plan.amount}],
      cancelUrl:HOME+"?hsk_payment=cancel#payment-status",
      returnUrl:HOME+"?hsk_payment=return#payment-status",
    });
    if(!link?.checkoutUrl||!link?.paymentLinkId)
      throw Error("Payment provider response incomplete");

    const {data:saved,error:saveError}=await db.from("hsk_guest_subscriptions")
      .update({payment_link_id:link.paymentLinkId,checkout_url:link.checkoutUrl})
      .eq("order_code",orderCode).eq("status","pending")
      .select("order_code").single();
    if(saveError||!saved){
      try{await payos().paymentRequests.cancel(link.paymentLinkId)}catch(_){}
      throw saveError||Error("Unable to register payment link");
    }
    return respond({orderCode,checkoutUrl:link.checkoutUrl,
      guestToken:token,planCode,amountVnd:plan.amount,days:plan.days});
  }catch(e){
    if(db&&orderCode!==null){
      await db.from("hsk_guest_subscriptions")
        .update({status:"cancelled"}).eq("order_code",orderCode)
        .eq("status","pending").is("payment_link_id",null);
    }
    console.error("hsk-plan-checkout",e instanceof Error?e.message:"Payment error");
    return respond({error:"Không tạo được đơn payOS. Chưa bị trừ tiền. Vui lòng thử lại."},503);
  }
});