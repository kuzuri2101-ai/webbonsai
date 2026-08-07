/* Shared Supabase browser client for static Vercel pages.
 * Put the public Supabase URL/key in meta tags on the page:
 * <meta name="supabase-url" content="https://YOUR_PROJECT.supabase.co">
 * <meta name="supabase-anon-key" content="YOUR_PUBLISHABLE_OR_ANON_KEY">
 * Never put a Supabase service_role key in browser code.
 */
(function(){
  let client = null;
  function getConfig(){
    const url = document.querySelector('meta[name="supabase-url"]')?.content?.trim() || '';
    const key = document.querySelector('meta[name="supabase-anon-key"]')?.content?.trim() || '';
    return {url,key};
  }
  window.getSupabase = function(){
    if(client) return client;
    const {url,key}=getConfig();
    if(!url || !key || url.includes('YOUR_PROJECT') || key.includes('YOUR_')) return null;
    if(!window.supabase?.createClient) return null;
    client=window.supabase.createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    return client;
  };
})();
