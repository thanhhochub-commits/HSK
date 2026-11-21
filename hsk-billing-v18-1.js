// HSK Panda v1.8.1 — production paid plans, browser-token access.
// Server (Supabase + payOS) is the only source of truth for Pro eligibility.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm";

const config=window.HSK_BILLING_CONFIG||{};
const changes=()=>window.dispatchEvent(new Event("hsk-billing-update"));
const PLANS=Object.freeze({
  pro_30:{amount:89000,days:30},
  pro_90:{amount:219000,days:90},
  pro_365:{amount:699000,days:365},
});
const billing={
  configured:false,
  live:false,
  user:null,
  pro:false,
  guestPro:false,
  expiresAt:null,
  lastPayment:null,
  isChecking:false,
  error:"",
  async refresh(){},
  async signInEmail(){throw Error("Chưa kết nối tài khoản")},
  async signInGoogle(){throw Error("Chưa kết nối Google")},
  async signOut(){},
  async createPlanCheckout(){throw Error("Chưa kết nối thanh toán")},
  async checkPayment(){throw Error("Chưa kết nối kiểm tra giao dịch")},
  async restoreRecoveryCode(){throw Error("Chưa kết nối máy chủ")},
  getRecoveryCode(){return null},
};
window.HSKPayment=billing;
changes();

const pubKey=(config.supabasePublishableKey||"").trim();
if(config.supabaseUrl && (pubKey.startsWith("sb_publishable_")||pubKey.startsWith("eyJ"))){
  const db=createClient(config.supabaseUrl,pubKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},
  });
  billing.configured=true;
  billing.live=true;
  const base=window.location.origin+window.location.pathname;

  const recognized=(token)=>/^[a-f0-9]{64}$/.test(String(token||""));
  const currentToken=()=>localStorage.getItem("hsk-panda-plan-token")||
    localStorage.getItem("hsk-panda-guest-token")||"";
  const currentOrder=()=>localStorage.getItem("hsk-panda-plan-order");
  const applyExpiry=(expiry,source)=>{
    const time=Date.parse(expiry||"");
    if(Number.isFinite(time)&&time>Date.now()&&
       (!billing.expiresAt||time>Date.parse(billing.expiresAt))){
      billing.expiresAt=expiry;
      billing.pro=true;
      if(source==="guest")billing.guestPro=true;
    }
  };
  billing.getRecoveryCode=()=>{
    const token=currentToken();
    return recognized(token)?token:null;
  };
  billing.checkPlanStatus=async(token=currentToken())=>{
    if(!recognized(token))throw Error("Chưa có mã phiên thanh toán");
    const {data,error}=await db.functions.invoke("hsk-plan-status",{
      body:{guestToken:token}
    });
    if(error||!data)throw Error(data?.error||error?.message||"Không thể xác nhận quyền học");
    if(data.error)throw Error(data.error);
    billing.lastPayment=data;
    if(data.proActive===true)applyExpiry(data.expiresAt,"guest");
    changes();
    return data;
  };
  billing.checkLegacyTrialStatus=async()=>{
    const token=localStorage.getItem("hsk-panda-guest-token");
    const code=Number(localStorage.getItem("hsk-panda-guest-order"));
    if(!recognized(token)||!Number.isSafeInteger(code))
      throw Error("Không có phiên dùng thử cũ");
    const {data,error}=await db.functions.invoke("hsk-guest-status",{
      body:{guestToken:token,orderCode:code},
    });
    if(error||!data)throw Error(data?.error||error?.message||"Không thể đọc quyền dùng thử");
    if(data.proActive===true)applyExpiry(data.expiresAt,"guest");
    if(!currentOrder())billing.lastPayment=data;
    changes();
    return data;
  };

  billing.refresh=async()=>{
    billing.pro=false;billing.guestPro=false;billing.expiresAt=null;billing.error="";
    try{
      const {data:sessionData}=await db.auth.getSession();
      billing.user=sessionData?.session?.user||null;
      if(billing.user){
        const {data,error}=await db.from("hsk_access").select("plan_code,expires_at")
          .eq("user_id",billing.user.id).maybeSingle();
        if(!error&&data?.plan_code==="pro")applyExpiry(data.expires_at,"account");
      }
    }catch(error){ /* Guest sessions must work even if optional email auth fails. */ }
    const token=currentToken();
    if(recognized(token)){
      try{await billing.checkPlanStatus(token)}
      catch(error){
        // Legacy 2K transaction predates the 30/90/365 endpoints.
        try{await billing.checkLegacyTrialStatus()}
        catch(_){billing.error=error instanceof Error?error.message:"Lỗi kiểm tra Pro"}
      }
    }
    changes();
    return billing.pro;
  };

  billing.createPlanCheckout=async(planCode)=>{
    const plan=PLANS[planCode];
    if(!plan)throw Error("Gói thanh toán không hợp lệ");
    const token=currentToken();
    const {data,error}=await db.functions.invoke("hsk-plan-checkout",{
      body:{planCode,guestToken:recognized(token)?token:""}
    });
    if(error||!data||!data.orderCode||!data.checkoutUrl||
      !recognized(data.guestToken)||data.planCode!==planCode||
      Number(data.amountVnd)!==plan.amount||Number(data.days)!==plan.days)
      throw Error(data?.error||error?.message||"Chưa tạo được QR thanh toán payOS");
    const destination=new URL(data.checkoutUrl);
    if(destination.protocol!=="https:"||!destination.hostname.endsWith(".payos.vn"))
      throw Error("Địa chỉ thanh toán không thuộc payOS");
    // Persist BEFORE navigating to payOS so the returning customer can be identified.
    localStorage.setItem("hsk-panda-plan-token",data.guestToken);
    localStorage.setItem("hsk-panda-plan-order",String(data.orderCode));
    window.location.assign(destination.href);
  };

  billing.checkPayment=async()=>{
    billing.isChecking=true;changes();
    try{
      if(recognized(currentToken())){
        return await billing.checkPlanStatus();
      }
      const legacy=await billing.checkLegacyTrialStatus();
      return legacy;
    }finally{billing.isChecking=false;changes()}
  };

  billing.restoreRecoveryCode=async(raw)=>{
    const token=String(raw||"").trim().toLowerCase();
    if(!recognized(token))throw Error("Mã khôi phục phải gồm 64 ký tự.");
    // Confirm with backend first; an arbitrary key never unlocks the UI.
    const {data,error}=await db.functions.invoke("hsk-plan-status",{
      body:{guestToken:token}
    });
    if(error||!data||data.error||data.proActive!==true)
      throw Error(data?.error||error?.message||"Mã này chưa có quyền Pro còn hiệu lực.");
    localStorage.setItem("hsk-panda-plan-token",token);
    if(data.orderCode)localStorage.setItem("hsk-panda-plan-order",String(data.orderCode));
    await billing.refresh();
    return data;
  };

  billing.signInEmail=async(email)=>{
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email||"")))
      throw Error("Vui lòng nhập email hợp lệ");
    const {error}=await db.auth.signInWithOtp({
      email:String(email).trim(),options:{emailRedirectTo:base+"#account"}
    });
    if(error)throw error;
    return "Đã gửi đường dẫn đăng nhập. Kiểm tra email của bạn.";
  };
  billing.signInGoogle=async()=>{
    const {error}=await db.auth.signInWithOAuth({
      provider:"google",options:{redirectTo:base+"#account"}
    });
    if(error)throw error;
  };
  billing.signOut=async()=>{
    const {error}=await db.auth.signOut();
    if(error)throw error;
    billing.user=null;
    await billing.refresh();
  };

  // Old 2K is no longer purchasable; existing paid legacy trial still works.
  let accessChannel=null;let accessUserId=null;
  const subscribe=async()=>{
    const id=billing.user?.id||null;
    if(id===accessUserId)return;
    if(accessChannel){
      try{await db.removeChannel(accessChannel)}catch(_){}
      accessChannel=null;
    }
    accessUserId=id;
    if(!id)return;
    accessChannel=db.channel("hsk-pro-"+id)
      .on("postgres_changes",{
        event:"*",schema:"public",table:"hsk_access",filter:"user_id=eq."+id,
      },()=>{void billing.refresh().catch(()=>{})}).subscribe();
  };
  db.auth.onAuthStateChange(()=>{
    queueMicrotask(()=>{void billing.refresh().then(subscribe).catch(()=>{})});
  });
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden)void billing.refresh().catch(()=>{});
  });
  window.addEventListener("focus",()=>{void billing.refresh().catch(()=>{})});

  if(new URLSearchParams(window.location.search).has("hsk_payment")){
    window.location.hash="#payment-status";
  }
  await billing.refresh().catch(error=>{
    billing.error=error instanceof Error?error.message:"Không kết nối được máy chủ";
    changes();
  });

  // Provider returns do not grant Pro; only server-confirmed status does.
  let attempts=0,checking=false;
  const reconcile=async()=>{
    if(window.location.hash!=="#payment-status"||!recognized(currentToken())||
      (billing.pro&&billing.lastPayment?.status!=="pending")||checking||attempts>=15)return;
    checking=true;attempts++;
    try{await billing.checkPayment()}catch(_){}
    finally{checking=false}
    if(billing.lastPayment?.status==="pending"&&attempts<15)setTimeout(reconcile,4000);
  };
  window.addEventListener("hashchange",()=>{
    if(window.location.hash==="#payment-status"){attempts=0;void reconcile()}
  });
  if(window.location.hash==="#payment-status")void reconcile();
}
changes();
