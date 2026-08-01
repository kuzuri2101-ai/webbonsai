/* CẤU HÌNH KẾT NỐI CƠ SỞ DỮ LIỆU
   1) Tạo project tại Supabase.
   2) Lấy Project URL và Publishable/anon key.
   3) Dán vào 2 biến bên dưới.
   KHÔNG dán service_role key vào file này. */
window.SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
window.SUPABASE_KEY = 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY';

window.supabaseReady = Boolean(
  window.SUPABASE_URL &&
  window.SUPABASE_KEY &&
  !window.SUPABASE_URL.includes('YOUR_') &&
  !window.SUPABASE_KEY.includes('YOUR_')
);

window.getSupabase = function () {
  if (!window.supabaseReady) return null;
  if (!window.supabase) window.supabase = window.supabaseJs.createClient(window.SUPABASE_URL, window.SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return window.supabase;
};
