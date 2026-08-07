/* Bonsai Việt — extended related content */
(function(){
 const U=window.SUPABASE_URL||'',K=window.SUPABASE_ANON_KEY||''; if(!U||!K)return;
 const root=document.querySelector('[data-extended-related]'); if(!root)return;
 const type=root.dataset.type,id=root.dataset.id; if(!type||!id)return;
 const h={apikey:K,Authorization:'Bearer '+K};
 const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
 const configs={
  form:[['Cây liên quan','bv_plant_forms','bv_plants','plant_id','form_id','name','plant'],['Trường phái','bv_form_styles','bv_styles','style_id','form_id','name','style'],['Tác phẩm','bv_work_forms','bv_works','work_id','form_id','name','work'],['Bài viết','bv_article_forms','bv_articles','article_id','form_id','title','article']],
  style:[['Cây liên quan','bv_plant_styles','bv_plants','plant_id','style_id','name','plant'],['Dáng cây','bv_form_styles','bv_forms','form_id','style_id','name','form'],['Nghệ nhân','bv_artist_styles','bv_artists','artist_id','style_id','name','artist'],['Tác phẩm','bv_work_styles','bv_works','work_id','style_id','name','work'],['Bài viết','bv_article_styles','bv_articles','article_id','style_id','title','article']],
  artist:[['Trường phái','bv_artist_styles','bv_styles','style_id','artist_id','name','style'],['Tác phẩm','bv_works','bv_works','artist_id','artist_id','name','work']],
  work:[['Cây','bv_work_plants','bv_plants','plant_id','work_id','name','plant'],['Kỹ thuật','bv_work_techniques','bv_techniques','technique_id','work_id','name','technique'],['Dáng','bv_work_forms','bv_forms','form_id','work_id','name','form'],['Trường phái','bv_work_styles','bv_styles','style_id','work_id','name','style'],['Nghệ nhân','bv_works','bv_artists','artist_id','work_id','name','artist']]
 };
 const cfg=configs[type]; if(!cfg)return;
 async function get(c){const [label,j,t,target,source,name,tt]=c; const url=`${U}/rest/v1/${j}?select=${target}(${name},slug)&${source}=eq.${encodeURIComponent(id)}`;const r=await fetch(url,{headers:h});if(!r.ok)return {label,items:[],tt};const rows=await r.json();return {label,tt,items:rows.map(x=>x[target]).filter(Boolean)};}
 Promise.all(cfg.map(get)).then(groups=>root.innerHTML=groups.map(g=>`<section class="related-group"><h2>${esc(g.label)}</h2><div class="related-list">${g.items.length?g.items.map(x=>`<a href="knowledge.html?type=${encodeURIComponent(g.tt)}&slug=${encodeURIComponent(x.slug)}">${esc(x.name||x.title)}</a>`).join(''):'<span class="related-empty">Chưa có nội dung liên quan.</span>'}</div></section>`).join(''));
})();