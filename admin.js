const db = window.getSupabase ? window.getSupabase() : null;
const $ = (id) => document.getElementById(id);
let plants = [];

const state = { editingId: null };

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
  const view = $(id);
  if (view) view.classList.add('active-view');
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`[href="#${id}"]`);
  if (link) link.classList.add('active');
  $('pageTitle').textContent = id === 'plants' ? 'Loài cây' : 'Tổng quan';
}

async function requireEditor() {
  if (!db) {
    $('accountInfo').textContent = 'Chưa cấu hình Supabase';
    $('plantList').innerHTML = '<div class="empty">Hãy điền SUPABASE_URL và SUPABASE_KEY trong supabase-config.js trước.</div>';
    return false;
  }
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    location.href = 'login.html?next=admin.html';
    return false;
  }
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
  if (error) {
    $('plantList').innerHTML = `<div class="empty">Không tải được dữ liệu: ${escapeHtml(error.message)}</div>`;
    return;
  }
  plants = data || [];
  renderPlants();
  renderStats();
}

function renderPlants() {
  if (!plants.length) {
    $('plantList').innerHTML = '<div class="empty">Chưa có loài cây nào. Hãy thêm dữ liệu đầu tiên.</div>';
    return;
  }
  $('plantList').innerHTML = `<table class="data-table"><thead><tr><th>Tên</th><th>Tên khoa học</th><th>Độ khó</th><th>Trạng thái</th><th></th></tr></thead><tbody>${plants.map(p => `<tr><td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.slug)}</small></td><td>${escapeHtml(p.scientific_name || '—')}</td><td>${escapeHtml(p.difficulty || '—')}</td><td><span class="badge">${escapeHtml(p.status)}</span></td><td><div class="row-actions"><button data-edit="${p.id}">Sửa</button><button class="danger" data-delete="${p.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>`;
  document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openPlant(Number(b.dataset.edit))));
  document.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => deletePlant(Number(b.dataset.delete))));
}

function renderStats() {
  const published = plants.filter(p => p.status === 'PUBLISHED').length;
  const draft = plants.filter(p => p.status === 'DRAFT').length;
  $('stats').innerHTML = `<div class="stat"><strong>${plants.length}</strong><span>Loài cây đang tải</span></div><div class="stat"><strong>${published}</strong><span>Đã xuất bản</span></div><div class="stat"><strong>${draft}</strong><span>Bản nháp</span></div><div class="stat"><strong>12</strong><span>Module dự kiến</span></div>`;
}

function resetForm() {
  state.editingId = null;
  $('plantForm').reset();
  $('plantId').value = '';
  $('dialogTitle').textContent = 'Thêm loài cây';
  $('formError').textContent = '';
  $('difficulty').value = 'BEGINNER';
  $('status').value = 'DRAFT';
}

function openPlant(id = null) {
  resetForm();
  if (id) {
    const p = plants.find(x => x.id === id);
    if (!p) return;
    state.editingId = id;
    $('dialogTitle').textContent = 'Sửa loài cây';
    $('plantName').value = p.name || '';
    $('scientificName').value = p.scientific_name || '';
    $('plantSlug').value = p.slug || '';
    $('shortDescription').value = p.short_description || '';
    $('difficulty').value = p.difficulty || 'BEGINNER';
    $('status').value = p.status || 'DRAFT';
    $('featuredImage').value = p.featured_image || '';
    $('description').value = p.description || '';
  }
  $('plantDialog').showModal();
}

async function savePlant(event) {
  event.preventDefault();
  $('formError').textContent = '';
  const payload = {
    name: $('plantName').value.trim(),
    scientific_name: $('scientificName').value.trim() || null,
    slug: $('plantSlug').value.trim().toLowerCase().replace(/\s+/g, '-'),
    short_description: $('shortDescription').value.trim() || null,
    difficulty: $('difficulty').value,
    status: $('status').value,
    featured_image: $('featuredImage').value.trim() || null,
    description: $('description').value.trim() || null,
    updated_at: new Date().toISOString()
  };
  const { error } = state.editingId
    ? await db.from('bv_plants').update(payload).eq('id', state.editingId)
    : await db.from('bv_plants').insert(payload);
  if (error) {
    $('formError').textContent = error.message;
    return;
  }
  $('plantDialog').close();
  await loadPlants();
}

async function deletePlant(id) {
  const p = plants.find(x => x.id === id);
  if (!p || !confirm(`Xóa “${p.name}”? Thao tác này không thể hoàn tác.`)) return;
  const { error } = await db.from('bv_plants').delete().eq('id', id);
  if (error) {
    alert(`Không thể xóa: ${error.message}`);
    return;
  }
  await loadPlants();
}

$('newPlantBtn').addEventListener('click', () => openPlant());
$('plantForm').addEventListener('submit', savePlant);
$('searchInput').addEventListener('input', loadPlants);
$('statusFilter').addEventListener('change', loadPlants);
$('logoutBtn').addEventListener('click', async () => { if (db) await db.auth.signOut(); location.href = 'login.html'; });
document.querySelectorAll('[data-go="plants"]').forEach(b => b.addEventListener('click', () => { showView('plants'); loadPlants(); }));
document.querySelectorAll('.nav-item[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const id = a.getAttribute('href').slice(1); if (!a.classList.contains('disabled')) { showView(id); if (id === 'plants') loadPlants(); } }));

(async () => {
  const ok = await requireEditor();
  if (ok) {
    await loadPlants();
    showView(location.hash === '#plants' ? 'plants' : 'dashboard');
  }
})();
