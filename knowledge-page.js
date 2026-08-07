const db = window.getSupabase ? window.getSupabase() : null;
const params = new URLSearchParams(location.search);
const type = params.get('type') || 'plant';
const slug = params.get('slug') || '';
const $ = id => document.getElementById(id);
const esc = (v='') => String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

async function load(){
  if(!db){ $('title').textContent='Trang kiến thức đang được cấu hình'; $('lead').textContent='Cần kết nối Supabase để tải dữ liệu xuất bản.'; $('main-content').innerHTML='<div class="notice">Trang này đã có template và logic dữ liệu. Hãy cấu hình client Supabase chung của website.</div>'; return; }
  if(!slug){ $('title').textContent='Thiếu slug'; return; }
  if(type==='technique') return loadTechnique();
  return loadPlant();
}

async function loadPlant(){
  const {data:p,error}=await db.from('bv_plants').select('*').eq('slug',slug).eq('status','PUBLISHED').maybeSingle();
  if(error||!p){ $('title').textContent='Không tìm thấy loài cây'; $('lead').textContent='Nội dung có thể chưa được xuất bản.'; return; }
  document.title=`${p.name} | Bonsai Việt`;
  $('breadcrumb').textContent=`Bách khoa Bonsai Việt / Cây / ${p.name}`;
  $('eyebrow').textContent='Hồ sơ loài cây'; $('title').textContent=p.name; $('lead').textContent=p.short_description||p.description||'';
  $('main-content').innerHTML=`<h2>Thông tin chăm sóc</h2><div class="facts"><div class="fact"><small>Tên khoa học</small><strong>${esc(p.scientific_name||'—')}</strong></div><div class="fact"><small>Độ khó</small><strong>${esc(p.difficulty||'—')}</strong></div><div class="fact"><small>Ánh sáng</small><strong>${esc(p.sunlight||'—')}</strong></div><div class="fact"><small>Tưới nước</small><strong>${esc(p.watering||'—')}</strong></div><div class="fact"><small>Giá thể</small><strong>${esc(p.soil||'—')}</strong></div><div class="fact"><small>Tốc độ sinh trưởng</small><strong>${esc(p.growth_rate||'—')}</strong></div></div><h2>Mô tả</h2><p class="lead">${esc(p.description||'Đang cập nhật.')}</p><h2>Lưu ý kỹ thuật</h2><p class="lead">${esc(p.pruning_notes||'Đang cập nhật.')}</p>`;
  const {data:rels}=await db.from('bv_plant_techniques').select('difficulty,bv_techniques(name,slug)').eq('plant_id',p.id);
  $('related').innerHTML=(rels||[]).map(r=>r.bv_techniques?`<a href="knowledge.html?type=technique&slug=${encodeURIComponent(r.bv_techniques.slug)}">🔧 ${esc(r.bv_techniques.name)} <small>· ${esc(r.difficulty||'')}</small></a>`:'').join('')||'<div class="empty">Chưa có kỹ thuật liên quan.</div>';
}

async function loadTechnique(){
  const {data:t,error}=await db.from('bv_techniques').select('*').eq('slug',slug).eq('status','PUBLISHED').maybeSingle();
  if(error||!t){ $('title').textContent='Không tìm thấy kỹ thuật'; $('lead').textContent='Nội dung có thể chưa được xuất bản.'; return; }
  document.title=`${t.name} | Bonsai Việt`;
  $('breadcrumb').textContent=`Bách khoa Bonsai Việt / Kỹ thuật / ${t.name}`; $('eyebrow').textContent='Kỹ thuật bonsai'; $('title').textContent=t.name; $('lead').textContent=t.description||'';
  const {data:steps}=await db.from('bv_technique_steps').select('*').eq('technique_id',t.id).order('step_number');
  $('main-content').innerHTML=`<h2>Các bước thực hiện</h2><div class="steps">${(steps||[]).map(s=>`<div class="step"><h3>${esc(s.title)}</h3><p>${esc(s.content||'')}</p>${s.warning?`<div class="notice">⚠️ ${esc(s.warning)}</div>`:''}</div>`).join('')||'<div class="empty">Chưa có các bước hướng dẫn.</div>'}</div><h2>Thông tin kỹ thuật</h2><div class="facts"><div class="fact"><small>Độ khó</small><strong>${esc(t.difficulty||'—')}</strong></div><div class="fact"><small>Danh mục</small><strong>${esc(t.category||'—')}</strong></div><div class="fact"><small>Mùa thực hiện</small><strong>${esc(t.best_season||'—')}</strong></div><div class="fact"><small>Dụng cụ</small><strong>${esc(t.tools_required||'—')}</strong></div></div><h2>Lỗi thường gặp</h2><p class="lead">${esc(t.common_mistakes||'Đang cập nhật.')}</p>`;
  const {data:rels}=await db.from('bv_plant_techniques').select('difficulty,bv_plants(name,slug)').eq('technique_id',t.id);
  $('related').innerHTML=(rels||[]).map(r=>r.bv_plants?`<a href="knowledge.html?type=plant&slug=${encodeURIComponent(r.bv_plants.slug)}">🌳 ${esc(r.bv_plants.name)} <small>· ${esc(r.difficulty||'')}</small></a>`:'').join('')||'<div class="empty">Chưa có loài cây liên quan.</div>';
}
load();
