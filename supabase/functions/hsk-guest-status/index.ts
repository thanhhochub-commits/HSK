// HSK Panda: status of 2,000 VND guest trial. Token is a secret capability.
// Only server-side payOS confirmation can activate guest Pro.
import { createClient } from "npm:@supabase/supabase-js@2.119.2";
import { PayOS } from "npm:@payos/node@2.0.6";
const ORIGIN="https://thanhhochub-commits.github.io";
const cors = {
 "Access-Control-Allow-Origin":ORIGIN,
 "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
 "Access-Control-Allow-Methods":"POST,OPTIONS",
 "Content-Type":"application/json",
};
const reply = (v: unknown,status=200) =>
 new Response(JSON.stringify(v),{status,headers:cors});
function admin(){
 const keys=JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}");
 const key=keys.default||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const url=Deno.env.get("SUPABASE_URL");
 if(!url||!key)throw Error("Supabase service not configured");
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
function payos(){
 const clientId=Deno.env.get("PAYOS_CLIENT_ID")||Deno.env.get("Client ID");
 const apiKey=Deno.env.get("PAYOS_API_KEY")||Deno.env.get("Api Key");
 const checksumKey=Deno.env.get("PAYOS_CHECKSUM_KEY")||Deno.env.get("Checksum Key");
 if(!clientId||!apiKey||!checksumKey)throw Error("Missing payOS credentials");
 return new PayOS({clientId,apiKey,checksumKey});
}
async function sha(x:string){
 const data=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(x)));
 return Array.from(data,b=>b.toString(16).padStart(2,"0")).join("");
}
Deno.serve(async (req)=>{
 if(req.method==="OPTIONS")return new Response("",{headers:cors});
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 if(req.headers.get("origin")!==ORIGIN)return reply({error:"Invalid origin"},403);
 try{
  const body=await req.json();
  const token=typeof body?.guestToken==="string"?body.guestToken:"";
  const orderCode=Number(body?.orderCode);
  if(!/^[0-9a-f]{64}$/.test(token)||!Number.isSafeInteger(orderCode))
    return reply({error:"Phiên khách không hợp lệ"},401);
  const db=admin();
  const {data:trial,error}=await db.from("hsk_guest_trials")
   .select("order_code,status,amount_vnd,payment_link_id,pro_expires_at,created_at")
   .eq("token_hash",await sha(token)).eq("order_code",orderCode).maybeSingle();
  if(error)throw error;
  if(!trial)return reply({error:"Không tìm thấy đơn thuộc phiên khách này"},404);
  if(trial.status==="pending"&&trial.payment_link_id){
   try{
    const info=await payos().paymentRequests.get(trial.payment_link_id);
    if(info?.status==="PAID"&&Number(info?.orderCode)===orderCode
      &&Number(info?.amount)===2000&&Number(info?.amountPaid)>=2000
      &&info?.id===trial.payment_link_id){
       const res=await db.rpc("hsk_apply_verified_guest_trial",{
        p_order_code:orderCode,p_amount_vnd:2000,
        p_payment_link_id:trial.payment_link_id,
        p_reference:"verified-by-payos-api-"+orderCode,
       });
       if(res.error)throw res.error;
    }
   }catch(err){console.error("hsk-guest-reconcile",err instanceof Error?err.message:String(err));}
  }
  const {data:updated,error:refreshError}=await db.from("hsk_guest_trials")
    .select("status,pro_expires_at").eq("order_code",orderCode).single();
  if(refreshError)throw refreshError;
  return reply({
   status:updated.status,
   proActive:updated.status==="paid"&&!!updated.pro_expires_at
     &&Date.parse(updated.pro_expires_at)>Date.now(),
   expiresAt:updated.pro_expires_at||null,
   orderCode,
  });
 }catch(e){
  console.error("hsk-guest-status",e instanceof Error?e.message:String(e));
  return reply({error:"Chưa kiểm tra được giao dịch"},503);
 }
});