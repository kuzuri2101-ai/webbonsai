const db = window.getSupabase ? window.getSupabase() : null;
const $ = (id) => document.getElementById(id);
let plants = [];
let techniques = [];
const state = { editingPlantId: null, editingTechniqueId: null };

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function slugify(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  const view = $(id); if (view) view.classList.add('active-view');
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`[href="#${id}"]`); if (link) link.classList.add('active');
  $('pageTitle').textContent = id === 'plants' ? 'Loài cây' : id === 'techniques' ? 'Kỹ thuật bonsai' : 'Tổng quan';
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
}

async function requireEditor() {
  if (!db) {
    $('accountInfo').textContent = 'Chưa cấu hình Supabase';
    return false;
  }
  const { data: { session } } = await db.auth.getSession();
  if (!session) { location.href = 'login.html?next=admin.html'; return false; }
  const { data: profile, error } = await db.from('bv_profiles').select('display_name,role').eq('id', session.user.id).maybeSingle();
  if (error || !profile || !['ADMIN','EDITOR'].includes(profile.role)) {
    $('accountInfo').textContent = 'Không có quyền quản trị';
    document.querySelectorAll('.view').forEach(v => v.innerHTML = '<div class="empty">Tài khoản này chưa có quyền ADMIN/EDITOR trong bv_profiles.</div>');
    return false;
  }
  $('accountInfo').textContent = `${profile.display_name} · ${profile.role}`;
  return true;
}

async function loadPlants() {
  const search = $('searchInput').value.trim();
  const status = $('statusFilter').value;
  let query = db.from('bv_plants').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  if (search) query = query.or(`name.ilike.%${search}%,scientific_name.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) { $('plantList').innerHTML = `<div class="empty">Không tải được dữ liệu: ${escapeHtml(error.message)}</div>`; return; }
  plants = data || []; renderPlants(); renderStats();
}

function renderPlants() {
  if (!plants.length) { $('plantList').innerHTML = '<div class="empty">Chưa có loài cây nào.</div>'; return; }
  $('plantList').innerHTML = `<table class="data-table"><thead><tr><th>Tên</th><th>Tên khoa học</th><th>Độ khó</th><th>Trạng thái</th><th></th></tr></thead><tbody>${plants.map(p => `<tr><td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.slug)}</small></td><td>${escapeHtml(p.scientific_name || '—')}</td><td>${escapeHtml(p.difficulty || '—')}</td><td><span class="badge">${escapeHtml(p.status)}</span></td><td><div class="row-actions"><button data-edit-plant="${p.id}">Sửa</button><button class="danger" data-delete-plant="${p.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>`;
  document.querySelectorAll('[data-edit-plant]').forEach(b => b.addEventListener('click', () => openPlant(Number(b.dataset.editPlant))));
  document.querySelectorAll('[data-delete-plant]').forEach(b => b.addEventListener('click', () => deletePlant(Number(b.dataset.deletePlant))));
}

function renderStats() {
  const published = plants.filter(p => p.status === 'PUBLISHED').length;
  const draft = plants.filter(p => p.status === 'DRAFT').length;
  $('stats').innerHTML = `<div class="stat"><strong>${plants.length}</strong><span>Loài cây đang tải</span></div><div class="stat"><strong>${published}</strong><span>Đã xuất bản</span></div><div class="stat"><strong>${draft}</strong><span>Bản nháp</span></div><div class="stat"><strong>${techniques.length}</strong><span>Kỹ thuật</span></div>`;
}

function resetPlantForm() {
  state.editingPlantId = null; $('plantForm').reset(); $('dialogTitle').textContent = 'Thêm loài cây'; $('formError').textContent = '';
  $('difficulty').value = 'BEGINNER'; $('status').value = 'DRAFT';
}

function openPlant(id = null) {
  resetPlantForm();
  if (id) {
    const p = plants.find(x => x.id === id); if (!p) return;
    state.editingPlantId = id; $('dialogTitle').textContent = 'Sửa loài cây';
    $('plantName').value = p.name || ''; $('scientificName').value = p.scientific_name || ''; $('plantSlug').value = p.slug || '';
    $('shortDescription').value = p.short_description || ''; $('difficulty').value = p.difficulty || 'BEGINNER'; $('status').value = p.status || 'DRAFT';
    $('featuredImage').value = p.featured_image || ''; $('description').value = p.description || '';
  }
  $('plantDialog').showModal();
}

async function savePlant(event) {
  event.preventDefault(); $('formError').textContent = '';
  const payload = { name: $('plantName').value.trim(), scientific_name: $('scientificName').value.trim() || null, slug: slugify($('plantSlug').value.trim()), short_description: $('shortDescription').value.trim() || null, difficulty: $('difficulty').value, status: $('status').value, featured_image: $('featuredImage').value.trim() || null, description: $('description').value.trim() || null, updated_at: new Date().toISOString() };
  const result = state.editingPlantId ? await db.from('bv_plants').update(payload).eq('id', state.editingPlantId) : await db.from('bv_plants').insert(payload);
  if (result.error) { $('formError').textContent = result.error.message; return; }
  $('plantDialog').close(); await loadPlants();
}

async function deletePlant(id) {
  const p = plants.find(x => x.id === id); if (!p || !confirm(`Xóa “${p.name}”? Thao tác này không thể hoàn tác.`)) return;
  const { error } = await db.from('bv_plants').delete().eq('id', id);
  if (error) { alert(`Không thể xóa: ${error.message}`); return; }
  await loadPlants();
}

async function loadTechniques() {
  const search = $('techSearchInput').value.trim(); const status = $('techStatusFilter').value; const difficulty = $('techDifficultyFilter').value;
  let query = db.from('bv_techniques').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status); if (difficulty) query = query.eq('difficulty', difficulty);
  if (search) query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) { $('techniqueList').innerHTML = `<div class="empty">Không tải được kỹ thuật: ${escapeHtml(error.message)}</div>`; return; }
  techniques = data || []; renderTechniques(); renderStats();
}

function renderTechniques() {
  if (!techniques.length) { $('techniqueList').innerHTML = '<div class="empty">Chưa có kỹ thuật nào.</div>'; return; }
  $('techniqueList').innerHTML = `<table class="data-table"><thead><tr><th>Kỹ thuật</th><th>Danh mục</th><th>Độ khó</th><th>Trạng thái</th><th></th></tr></thead><tbody>${techniques.map(t => `<tr><td><strong>${escapeHtml(t.name)}</strong><br><small>${escapeHtml(t.slug)}</small></td><td>${escapeHtml(t.category || '—')}</td><td>${escapeHtml(t.difficulty || '—')}</td><td><span class="badge">${escapeHtml(t.status)}</span></td><td><div class="row-actions"><button data-edit-technique="${t.id}">Sửa</button><button class="danger" data-delete-technique="${t.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>`;
  document.querySelectorAll('[data-edit-technique]').forEach(b => b.addEventListener('click', () => openTechnique(Number(b.dataset.editTechnique))));
  document.querySelectorAll('[data-delete-technique]').forEach(b => b.addEventListener('click', () => deleteTechnique(Number(b.dataset.deleteTechnique))));
}

function resetTechniqueForm() {
  state.editingTechniqueId = null; $('techniqueForm').reset(); $('techniqueDialogTitle').textContent = 'Thêm kỹ thuật'; $('techniqueFormError').textContent = '';
  $('techniqueDifficulty').value = 'BEGINNER'; $('techniqueStatus').value = 'DRAFT'; $('stepsEditor').innerHTML = '';
}

function addStep(step = {}) {
  const wrapper = document.createElement('div'); wrapper.className = 'step-editor'; wrapper.dataset.stepId = step.id || '';
  wrapper.innerHTML = `<div class="step-number">Bước <span class="step-index"></span></div><div class="grid-2"><label>Tiêu đề<input class="step-title" required value="${escapeHtml(step.title || '')}"></label><label>Cảnh báo<input class="step-warning" value="${escapeHtml(step.warning || '')}"></label></div><label>Nội dung<textarea class="step-description" rows="4" required>${escapeHtml(step.description || '')}</textarea></label><button type="button" class="danger remove-step">Xóa bước</button>`;
  wrapper.querySelector('.remove-step').addEventListener('click', () => { wrapper.remove(); renumberSteps(); });
  $('stepsEditor').appendChild(wrapper); renumberSteps();
}

function renumberSteps() {
  [...document.querySelectorAll('.step-editor')].forEach((el, i) => { el.querySelector('.step-index').textContent = i + 1; });
}

async function fetchSteps(techniqueId) {
  const { data, error } = await db.from('bv_technique_steps').select('*').eq('technique_id', techniqueId).order('step_number');
  if (error) throw error; return data || [];
}

async function openTechnique(id = null) {
  resetTechniqueForm();
  if (id) {
    const t = techniques.find(x => x.id === id); if (!t) return;
    state.editingTechniqueId = id; $('techniqueDialogTitle').textContent = 'Sửa kỹ thuật';
    $('techniqueName').value = t.name || ''; $('techniqueSlug').value = t.slug || ''; $('techniqueCategory').value = t.category || 'OTHER'; $('techniqueDifficulty').value = t.difficulty || 'BEGINNER';
    $('bestSeason').value = t.best_season || ''; $('techniqueStatus').value = t.status || 'DRAFT'; $('techniqueDescription').value = t.description || ''; $('toolsRequired').value = t.tools_required || '';
    $('safetyNotes').value = t.safety_notes || ''; $('commonMistakes').value = t.common_mistakes || ''; $('expertTips').value = t.expert_tips || '';
    try { const steps = await fetchSteps(id); steps.forEach(addStep); } catch (error) { $('techniqueFormError').textContent = `Không tải được các bước: ${error.message}`; }
  }
  if (!document.querySelector('.step-editor')) addStep();
  $('techniqueDialog').showModal();
}

async function saveTechnique(event) {
  event.preventDefault(); $('techniqueFormError').textContent = '';
  const payload = { name: $('techniqueName').value.trim(), slug: slugify($('techniqueSlug').value.trim()), category: $('techniqueCategory').value, difficulty: $('techniqueDifficulty').value, best_season: $('bestSeason').value.trim() || null, status: $('techniqueStatus').value, description: $('techniqueDescription').value.trim() || null, tools_required: $('toolsRequired').value.trim() || null, safety_notes: $('safetyNotes').value.trim() || null, common_mistakes: $('commonMistakes').value.trim() || null, expert_tips: $('expertTips').value.trim() || null, updated_at: new Date().toISOString() };
  const result = state.editingTechniqueId ? await db.from('bv_techniques').update(payload).eq('id', state.editingTechniqueId).select().single() : await db.from('bv_techniques').insert(payload).select().single();
  if (result.error) { $('techniqueFormError').textContent = result.error.message; return; }
  const techniqueId = result.data.id;
  if (state.editingTechniqueId) {
    const { error } = await db.from('bv_technique_steps').delete().eq('technique_id', techniqueId);
    if (error) { $('techniqueFormError').textContent = error.message; return; }
  }
  const stepRows = [...document.querySelectorAll('.step-editor')].map((el, i) => ({ technique_id: techniqueId, step_number: i + 1, title: el.querySelector('.step-title').value.trim(), description: el.querySelector('.step-description').value.trim(), warning: el.querySelector('.step-warning').value.trim() || null })).filter(s => s.title && s.description);
  if (stepRows.length) {
    const { error } = await db.from('bv_technique_steps').insert(stepRows);
    if (error) { $('techniqueFormError').textContent = error.message; return; }
  }
  $('techniqueDialog').close(); await loadTechniques();
}

async function deleteTechnique(id) {
  const t = techniques.find(x => x.id === id); if (!t || !confirm(`Xóa “${t.name}” và toàn bộ các bước?`)) return;
  const { error } = await db.from('bv_techniques').delete().eq('id', id);
  if (error) { alert(`Không thể xóa: ${error.message}`); return; }
  await loadTechniques();
}

$('newPlantBtn').addEventListener('click', () => openPlant());
$('plantForm').addEventListener('submit', savePlant);
$('searchInput').addEventListener('input', loadPlants);
$('statusFilter').addEventListener('change', loadPlants);
$('newTechniqueBtn').addEventListener('click', () => openTechnique());
$('techniqueForm').addEventListener('submit', saveTechnique);
$('addStepBtn').addEventListener('click', () => addStep());
$('techSearchInput').addEventListener('input', loadTechniques);
$('techStatusFilter').addEventListener('change', loadTechniques);
$('techDifficultyFilter').addEventListener('change', loadTechniques);
$('logoutBtn').addEventListener('click', async () => { if (db) await db.auth.signOut(); location.href = 'login.html'; });
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { showView(b.dataset.go); if (b.dataset.go === 'plants') loadPlants(); if (b.dataset.go === 'techniques') loadTechniques(); }));
document.querySelectorAll('.nav-item[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const id = a.getAttribute('href').slice(1); if (!a.classList.contains('disabled')) { showView(id); if (id === 'plants') loadPlants(); if (id === 'techniques') loadTechniques(); } }));

(async () => {
  const ok = await requireEditor();
  if (!ok) return;
  await Promise.all([loadPlants(), loadTechniques()]);
  showView(location.hash === '#plants' ? 'plants' : location.hash === '#techniques' ? 'techniques' : 'dashboard');
})();
