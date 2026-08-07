/* Shared Supabase browser client for Vercel static pages.
 * The public URL/key are loaded at runtime from /api/supabase-config.
 * Never put a Supabase secret/service_role key in browser code or Git.
 */
(function(){
  let clientPromise = null;

  window.getSupabase = function(){
    if(clientPromise) return clientPromise;

    clientPromise = (async function(){
      if(!window.supabase?.createClient) return null;
      try {
        const response = await fetch('/api/supabase-config', { cache: 'no-store' });
        if(!response.ok) return null;
        const {url,key} = await response.json();
        if(!url || !key) return null;
        return window.supabase.createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
      } catch (error) {
        console.error('Supabase config error:', error);
        return null;
      }
    })();

    return clientPromise;
  };
})();
