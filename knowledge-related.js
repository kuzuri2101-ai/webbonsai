/* Bonsai Việt — related knowledge loader */
(function(){
  const U=window.SUPABASE_URL||'',K=window.SUPABASE_ANON_KEY||''; if(!U||!K)return;
  const root=document.querySelector('[data-related-knowledge]'); if(!root)return;
  const type=root.dataset.relatedType, id=root.dataset.relatedId; if(!type||!id)return;
  const headers={apikey:K,Authorization:'Bearer '+K};
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const configs={
    plant:{tables:[['Kỹ thuật','bv_technique_plants','bv_techniques','technique_id','plant_id','name','technique'],['Bài viết','bv_article_plants','bv_articles','article_id','plant_id','title','article'],['Tác phẩm','bv_work_plants','bv_works','work_id','plant_id','name','work']]},
    technique:{tables:[['Cây','bv_technique_plants','bv_plants','plant_id','technique_id','name','plant'],['Bài viết','bv_article_techniques','bv_articles','article_id','technique_id','title','article'],['Tác phẩm','bv_work_techniques','bv_works','work_id','technique_id','name','work']]}
  };
  const cfg=configs[type]; if(!cfg)return;
  async function get([label,jtable,table,target,source,name,targetType]){
    const q=`${U}/rest/v1/${jtable}?select=${target}(${name},slug)&${source}=eq.${encodeURIComponent(id)}`;
    const r=await fetch(q,{headers}); if(!r.ok)return {label,items:[],targetType};
    const rows=await r.json(); return {label,targetType,items:rows.map(x=>x[target]).filter(Boolean)};
  }
  Promise.all(cfg.tables.map(get)).then(groups=>{
    root.innerHTML=groups.map(g=>`<section class="related-group"><h2>${esc(g.label)}</h2><div class="related-list">${g.items.length?g.items.map(x=>`<a href="knowledge.html?type=${encodeURIComponent(g.targetType)}&slug=${encodeURIComponent(x.slug)}">${esc(x.name||x.title)}</a>`).join(''):'<span class="related-empty">Chưa có nội dung liên quan.</span>'}</div></section>`).join('');
  });
})();
