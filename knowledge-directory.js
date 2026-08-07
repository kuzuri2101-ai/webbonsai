/* Bonsai Việt — dynamic public knowledge directory */
(function(){
  const U=window.SUPABASE_URL||'',K=window.SUPABASE_ANON_KEY||''; if(!U||!K)return;
  const grid=document.querySelector('[data-directory-grid]'); if(!grid)return;
  const headers={apikey:K,Authorization:'Bearer '+K};
  const groups=[
    ['plant','🌳','Cây bonsai','bv_plants','name'],
    ['technique','🔧','Kỹ thuật','bv_techniques','name'],
    ['form','🌿','Dáng cây','bv_forms','name'],
    ['style','🎎','Trường phái','bv_styles','name'],
    ['artist','👨‍🌾','Nghệ nhân','bv_artists','name'],
    ['work','🏆','Tác phẩm','bv_works','name']
  ];
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  async function load([type,icon,label,table,name]){
    const r=await fetch(`${U}/rest/v1/${table}?select=id,${name},slug&status=eq.PUBLISHED&order=${name}.asc&limit=100`,{headers});
    if(!r.ok)return {type,icon,label,items:[]};
    return {type,icon,label,items:await r.json()};
  }
  Promise.all(groups.map(load)).then(all=>{
    grid.innerHTML=all.map(g=>`<section class="directory-section"><div class="directory-title"><h2>${g.icon} ${g.label}</h2><span>${g.items.length} mục</span></div><div class="directory-list">${g.items.length?g.items.map(x=>`<a href="knowledge.html?type=${encodeURIComponent(g.type)}&slug=${encodeURIComponent(x.slug)}"><strong>${esc(x.name)}</strong></a>`).join(''):'<p class="directory-empty">Chưa có dữ liệu đã xuất bản.</p>'}</div></section>`).join('');
  }).catch(()=>{grid.innerHTML='<p>Không thể tải thư viện lúc này.</p>';});
})();
