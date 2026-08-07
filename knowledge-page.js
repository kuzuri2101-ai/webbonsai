const params = new URLSearchParams(location.search);
const type = params.get('type') || 'plant';
const slug = params.get('slug') || '';
const $ = id => document.getElementById(id);
const esc = (v='') => String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
const link = (t,s) => `knowledge.html?type=${encodeURIComponent(t)}&slug=${encodeURIComponent(s)}`;
const renderLinks = (items, icon, targetType, label) => `<section class="related-group"><h2>${icon} ${label}</h2><div class="related-list">${(items||[]).filter(x=>x).map(x=>`<a href="${link(targetType,x.slug)}">${esc(x.name||x.title)}</a>`).join('')||'<span class="related-empty">Chưa có nội dung liên quan.</span>'}</div></section>`;

async function load(){
  const db = window.getSupabase ? await window.getSupabase() : null;
  if(!db){ $('title').textContent='Trang kiến thức đang được cấu hình'; $('lead').textContent='Cần kết nối Supabase để tải dữ liệu xuất bản.'; $('main-content').innerHTML='<div class="notice">Cần cấu hình client Supabase chung của website.</div>'; return; }
  if(!slug){ $('title').textContent='Thiếu slug'; return; }
  if(type==='technique') return loadTechnique(db);
  return loadPlant(db);
}

async function loadPlant(db){
  const {data:p,error}=await db.from('bv_plants').select('*').eq('slug',slug).eq('status','PUBLISHED').maybeSingle();
  if(error||!p){ $('title').textContent='Không tìm thấy loài cây'; $('lead').textContent='Nội dung có thể chưa được xuất bản.'; return; }
  document.title=`${p.name} | Bách khoa Bonsai Việt`;
  $('breadcrumb').textContent=`Bách khoa Bonsai Việt / Cây / ${p.name}`; $('eyebrow').textContent='Hồ sơ loài cây'; $('title').textContent=p.name; $('lead').textContent=p.short_description||p.description||'';
  $('main-content').innerHTML=`<h2>Thông tin chăm sóc</h2><div class="facts"><div class="fact"><small>Tên khoa học</small><strong>${esc(p.scientific_name||'—')}</strong></div><div class="fact"><small>Độ khó</small><strong>${esc(p.difficulty||'—')}</strong></div><div class="fact"><small>Ánh sáng</small><strong>${esc(p.sunlight||'—')}</strong></div><div class="fact"><small>Tưới nước</small><strong>${esc(p.watering||'—')}</strong></div><div class="fact"><small>Giá thể</small><strong>${esc(p.soil||'—')}</strong></div><div class="fact"><small>Tốc độ sinh trưởng</small><strong>${esc(p.growth_rate||'—')}</strong></div></div><h2>Mô tả</h2><p class="lead">${esc(p.description||'Đang cập nhật.')}</p><h2>Lưu ý kỹ thuật</h2><p class="lead">${esc(p.pruning_notes||'Đang cập nhật.')}</p><div id="related-content" class="related-knowledge"></div>`;
  const [{data:techs},{data:articles},{data:works}]=await Promise.all([
    db.from('bv_plant_techniques').select('difficulty,bv_techniques(name,slug)').eq('plant_id',p.id),
    db.from('bv_article_plants').select('bv_articles(title,slug)').eq('plant_id',p.id),
    db.from('bv_work_plants').select('bv_works(name,slug)').eq('plant_id',p.id)
  ]);
  const r=$('related-content'); r.innerHTML=renderLinks((techs||[]).map(x=>x.bv_techniques),'🔧','technique','Kỹ thuật liên quan')+renderLinks((articles||[]).map(x=>x.bv_articles),'📝','article','Bài viết liên quan')+renderLinks((works||[]).map(x=>x.bv_works),'🏆','work','Tác phẩm liên quan');
}

async function loadTechnique(db){
  const {data:t,error}=await db.from('bv_techniques').select('*').eq('slug',slug).eq('status','PUBLISHED').maybeSingle();
  if(error||!t){ $('title').textContent='Không tìm thấy kỹ thuật'; $('lead').textContent='Nội dung có thể chưa được xuất bản.'; return; }
  document.title=`${t.name} | Bách khoa Bonsai Việt`;
  $('breadcrumb').textContent=`Bách khoa Bonsai Việt / Kỹ thuật / ${t.name}`; $('eyebrow').textContent='Kỹ thuật bonsai'; $('title').textContent=t.name; $('lead').textContent=t.description||'';
  const {data:steps}=await db.from('bv_technique_steps').select('*').eq('technique_id',t.id).order('step_number');
  $('main-content').innerHTML=`<h2>Các bước thực hiện</h2><div class="steps">${(steps||[]).map(s=>`<div class="step"><h3>Bước ${esc(s.step_number)} — ${esc(s.title)}</h3><p>${esc(s.content||'')}</p>${s.warning?`<div class="notice">⚠️ ${esc(s.warning)}</div>`:''}</div>`).join('')||'<div class="empty">Chưa có các bước hướng dẫn.</div>'}</div><h2>Thông tin kỹ thuật</h2><div class="facts"><div class="fact"><small>Độ khó</small><strong>${esc(t.difficulty||'—')}</strong></div><div class="fact"><small>Danh mục</small><strong>${esc(t.category||'—')}</strong></div><div class="fact"><small>Mùa thực hiện</small><strong>${esc(t.best_season||'—')}</strong></div><div class="fact"><small>Dụng cụ</small><strong>${esc(t.tools_required||'—')}</strong></div></div><h2>Lỗi thường gặp</h2><p class="lead">${esc(t.common_mistakes||'Đang cập nhật.')}</p><div id="related-content" class="related-knowledge"></div>`;
  const [{data:plants},{data:articles},{data:works}]=await Promise.all([
    db.from('bv_plant_techniques').select('difficulty,bv_plants(name,slug)').eq('technique_id',t.id),
    db.from('bv_article_techniques').select('bv_articles(title,slug)').eq('technique_id',t.id),
    db.from('bv_work_techniques').select('bv_works(name,slug)').eq('technique_id',t.id)
  ]);
  const r=$('related-content'); r.innerHTML=renderLinks((plants||[]).map(x=>x.bv_plants),'🌳','plant','Loài cây phù hợp')+renderLinks((articles||[]).map(x=>x.bv_articles),'📝','article','Bài viết liên quan')+renderLinks((works||[]).map(x=>x.bv_works),'🏆','work','Tác phẩm liên quan');
}
load();
