// HSK Panda — public frontend configuration only.
// Fill the PUBLISHABLE key from Supabase Dashboard > Project Settings > API Keys.
// Never paste service_role, secret keys, PayOS keys, or database password here.
window.HSK_BILLING_CONFIG = Object.freeze({
  supabaseUrl: "https://ylljdozgrfjtukfobzml.supabase.co",
  supabasePublishableKey: "sb_publishable_XAz145FugoePGVqMqiZx8w_uxVsdeh8",   // sb_publishable_... (safe for frontend with RLS)
  // Temporary all-access research mode. Does not modify actual payOS orders.
  experimentalOpenAll: true,
  paymentsEnabled: false,      // DO NOT set true before live backend verification
  supabaseProjectId: "ylljdozgrfjtukfobzml",
});
