// HSK Panda v1.5 — Supabase session + server-verified premium status.
// Payments remain OFF unless BOTH frontend + Supabase server are enabled.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm";

const config = window.HSK_BILLING_CONFIG || {};
const changes = () => window.dispatchEvent(new Event("hsk-billing-update"));
const billing = {
  configured: false,
  live: false,
  user: null,
  pro: false,
  expiresAt: null,
  error: "",
  isChecking: false,
  lastPayment: null,
  async signInEmail() { throw Error("Hệ thống đăng nhập chưa sẵn sàng."); },
  async signInGoogle() { throw Error("Hệ thống đăng nhập chưa sẵn sàng."); },
  async signOut() {},
  async refresh() {},
  async createCheckout() { throw Error("Thanh toán hiện chưa mở."); },
  async checkPayment() { throw Error("Chưa kết nối thanh toán."); },
};
window.HSKPayment = billing;
changes();

const pubKey = (config.supabasePublishableKey || "").trim();
if (config.supabaseUrl && pubKey && (pubKey.startsWith("sb_publishable_") || pubKey.startsWith("eyJ"))) {
  const db = createClient(config.supabaseUrl, pubKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  billing.configured = true;
  billing.live = config.paymentsEnabled === true;
  const site = window.location.origin + window.location.pathname;

  billing.refresh = async () => {
    const { data: sessionData, error: sessionError } = await db.auth.getSession();
    if (sessionError) throw sessionError;
    billing.user = sessionData.session?.user || null;
    billing.pro = false;
    billing.expiresAt = null;
    billing.error = "";
    if (billing.user) {
      const { data, error } = await db.from("hsk_access")
        .select("plan_code,expires_at").eq("user_id", billing.user.id).maybeSingle();
      if (error) {
        billing.error = "Không lấy được trạng thái gói. Kiểm tra SQL và chính sách RLS.";
      } else if (data?.plan_code === "pro" && data.expires_at &&
                 new Date(data.expires_at).getTime() > Date.now()) {
        billing.pro = true;
        billing.expiresAt = data.expires_at;
      }
    }
    changes();
  };
  billing.signInEmail = async (email) => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw Error("Vui lòng nhập địa chỉ email hợp lệ.");
    }
    const { error } = await db.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: site + "#account" },
    });
    if (error) throw error;
    return "Đã gửi email đăng nhập. Kiểm tra hộp thư và bấm liên kết xác nhận.";
  };
  billing.signInGoogle = async () => {
    const { error } = await db.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: site + "#account" },
    });
    if (error) throw error;
  };
  billing.signOut = async () => {
    const { error } = await db.auth.signOut();
    if (error) throw error;
    billing.user = null;
    billing.pro = false;
    billing.expiresAt = null;
    changes();
  };
  billing.createCheckout = async (days) => {
    if (!billing.live) throw Error("HSK Panda chưa mở thanh toán thật.");
    const map = { 30: "pro_30", 90: "pro_90", 365: "pro_365" };
    if (!map[days]) throw Error("Gói không hợp lệ.");
    const { data: session } = await db.auth.getSession();
    if (!session.session?.access_token) throw Error("Vui lòng đăng nhập trước khi thanh toán.");
    const { data, error } = await db.functions.invoke("hsk-create-checkout", {
      body: { planCode: map[days] },
    });
    if (error || !data?.orderCode || !data.checkoutUrl) {
      throw Error(data?.error || error?.message || "Không tạo được đơn hàng.");
    }
    const link = new URL(data.checkoutUrl);
    if (link.protocol !== "https:" || !link.hostname.endsWith(".payos.vn")) {
      throw Error("Link thanh toán không thuộc payOS.");
    }
    localStorage.setItem("hsk-panda-order", String(data.orderCode));
    window.location.assign(link.href);
  };
  billing.checkPayment = async () => {
    if (!billing.configured || !billing.user) throw Error("Vui lòng đăng nhập trước.");
    const code = Number(localStorage.getItem("hsk-panda-order"));
    if (!Number.isSafeInteger(code)) throw Error("Không tìm thấy mã đơn hàng trên thiết bị.");
    billing.isChecking = true; changes();
    try {
      const { data, error } = await db.functions.invoke("hsk-payment-status", {
        body: { orderCode: code },
      });
      if (error || !data) throw Error(data?.error || error?.message || "Chưa nhận được trạng thái.");
      billing.lastPayment = data;
      await billing.refresh();
      return data;
    } finally { billing.isChecking = false; changes(); }
  };


  // Update Pro status on activation; foreground refresh is the fallback.
  let accessChannel = null;
  let subscribedUserId = null;
  const syncAccessChannel = async () => {
    const userId = billing.user?.id || null;
    if (userId === subscribedUserId) return;
    if (accessChannel) {
      try { await db.removeChannel(accessChannel); } catch (_) {}
      accessChannel = null;
    }
    subscribedUserId = userId;
    if (!userId) return;
    accessChannel = db.channel("hsk-pro-" + userId)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "hsk_access",
        filter: "user_id=eq." + userId,
      }, () => {
        void billing.refresh().catch(() => {});
      }).subscribe();
  };
  const originalRefresh = billing.refresh;
  billing.refresh = async () => {
    await originalRefresh();
    void syncAccessChannel();
  };
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) void billing.refresh().catch(() => {});
  });

  db.auth.onAuthStateChange((_event) => {
    // Async query on next microtask, avoids querying Supabase within the callback.
    queueMicrotask(() => { billing.refresh().catch((e) => {
      billing.error = e instanceof Error ? e.message : "Lỗi xác thực.";
      changes();
    }); });
  });

  try { await billing.refresh(); }
  catch (error) {
    billing.error = error instanceof Error ? error.message : "Không thể kết nối Supabase.";
    changes();
  }

  // On return from payOS, reconcile and refresh even if webhook is delayed.
  let tries = 0;
  let checking = false;
  const reconcile = async () => {
    if (window.location.hash !== "#payment-status" || !billing.user ||
        !billing.live || billing.pro || checking || tries >= 12) return;
    tries++; checking = true;
    try { await billing.checkPayment(); } catch (_) { /* show retry option in UI */ }
    finally { checking = false; }
    if (!billing.pro && tries < 12) setTimeout(reconcile, 5000);
  };
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#payment-status") {
      tries = 0; void reconcile();
    }
  });
  if (window.location.hash === "#payment-status") void reconcile();
}
changes();
