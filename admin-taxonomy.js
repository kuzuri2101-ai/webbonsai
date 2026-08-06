const taxonomyDb = window.getSupabase ? window.getSupabase() : null;
const taxonomyState = { formId: null, styleId: null };
let formsData = [];
let stylesData = [];

const tax$ = (id) => document.getElementById(id);
const taxEscape = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const taxSlug = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function taxonomyView(id) {
  if (typeof showView === 'function') showView(id);
  if (id === 'forms') loadForms();
  if (id === 'styles') loadStyles();
}

async function loadForms() {
  if (!taxonomyDb) return;
  const search = tax$('formSearchInput').value.trim();
  const status = tax$('formStatusFilter').value;
  let q = taxonomyDb.from('bv_forms').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  if (search) q = q.ilike('name', `%${search}%`);
  const { data, error } = await q;
  if (error) { tax$('formList').innerHTML = `<div class="empty">Không tải được dáng cây: ${taxEscape(error.message)}</div>`; return; }
  formsData = data || [];
  tax$('formList').innerHTML = formsData.length ? `<table class="data-table"><thead><tr><th>Dáng</th><th>Độ khó</th><th>Trạng thái</th><th></th></tr></thead><tbody>${formsData.map(f => `<tr><td><strong>${taxEscape(f.name)}</strong><br><small>${taxEscape(f.slug)}</small></td><td>${taxEscape(f.difficulty || '—')}</td><td><span class="badge">${taxEscape(f.status)}</span></td><td><div class="row-actions"><button data-edit-form="${f.id}">Sửa</button><button class="danger" data-delete-form="${f.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>` : '<div class="empty">Chưa có dáng cây nào.</div>';
  document.querySelectorAll('[data-edit-form]').forEach(b => b.addEventListener('click', () => openForm(Number(b.dataset.editForm))));
  document.querySelectorAll('[data-delete-form]').forEach(b => b.addEventListener('click', () => deleteForm(Number(b.dataset.deleteForm))));
}

function resetFormData() {
  taxonomyState.formId = null;
  tax$('formDataForm').reset();
  tax$('formDialogTitle').textContent = 'Thêm dáng cây';
  tax$('formDataError').textContent = '';
  tax$('formDifficulty').value = 'BEGINNER';
  tax$('formStatus').value = 'DRAFT';
}

function openForm(id = null) {
  resetFormData();
  if (id) {
    const f = formsData.find(x => x.id === id); if (!f) return;
    taxonomyState.formId = id;
    tax$('formDialogTitle').textContent = 'Sửa dáng cây';
    tax$('formName').value = f.name || ''; tax$('formSlug').value = f.slug || '';
    tax$('formDescription').value = f.description || ''; tax$('formCharacteristics').value = f.characteristics || '';
    tax$('formStructure').value = f.structure || ''; tax$('formDifficulty').value = f.difficulty || 'BEGINNER'; tax$('formStatus').value = f.status || 'DRAFT';
  }
  tax$('formDialog').showModal();
}

async function saveFormData(e) {
  e.preventDefault();
  const payload = { name: tax$('formName').value.trim(), slug: taxSlug(tax$('formSlug').value.trim()), description: tax$('formDescription').value.trim() || null, characteristics: tax$('formCharacteristics').value.trim() || null, structure: tax$('formStructure').value.trim() || null, difficulty: tax$('formDifficulty').value, status: tax$('formStatus').value, updated_at: new Date().toISOString() };
  const result = taxonomyState.formId ? await taxonomyDb.from('bv_forms').update(payload).eq('id', taxonomyState.formId) : await taxonomyDb.from('bv_forms').insert(payload);
  if (result.error) { tax$('formDataError').textContent = result.error.message; return; }
  tax$('formDialog').close(); await loadForms();
}

async function deleteForm(id) {
  const f = formsData.find(x => x.id === id); if (!f || !confirm(`Xóa “${f.name}”?`)) return;
  const { error } = await taxonomyDb.from('bv_forms').delete().eq('id', id);
  if (error) { alert(`Không thể xóa: ${error.message}`); return; }
  await loadForms();
}

async function loadStyles() {
  if (!taxonomyDb) return;
  const search = tax$('styleSearchInput').value.trim();
  const status = tax$('styleStatusFilter').value;
  let q = taxonomyDb.from('bv_styles').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  if (search) q = q.or(`name.ilike.%${search}%,country.ilike.%${search}%,region.ilike.%${search}%`);
  const { data, error } = await q;
  if (error) { tax$('styleList').innerHTML = `<div class="empty">Không tải được trường phái: ${taxEscape(error.message)}</div>`; return; }
  stylesData = data || [];
  tax$('styleList').innerHTML = stylesData.length ? `<table class="data-table"><thead><tr><th>Trường phái</th><th>Loại</th><th>Quốc gia / khu vực</th><th>Trạng thái</th><th></th></tr></thead><tbody>${stylesData.map(s => `<tr><td><strong>${taxEscape(s.name)}</strong><br><small>${taxEscape(s.slug)}</small></td><td>${taxEscape(s.style_type || '—')}</td><td>${taxEscape([s.country, s.region].filter(Boolean).join(' · ') || '—')}</td><td><span class="badge">${taxEscape(s.status)}</span></td><td><div class="row-actions"><button data-edit-style="${s.id}">Sửa</button><button class="danger" data-delete-style="${s.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>` : '<div class="empty">Chưa có trường phái nào.</div>';
  document.querySelectorAll('[data-edit-style]').forEach(b => b.addEventListener('click', () => openStyle(Number(b.dataset.editStyle))));
  document.querySelectorAll('[data-delete-style]').forEach(b => b.addEventListener('click', () => deleteStyle(Number(b.dataset.deleteStyle))));
}

function resetStyleData() {
  taxonomyState.styleId = null;
  tax$('styleDataForm').reset();
  tax$('styleDialogTitle').textContent = 'Thêm trường phái';
  tax$('styleDataError').textContent = '';
  tax$('styleType').value = 'STYLE';
  tax$('styleStatus').value = 'DRAFT';
}

function openStyle(id = null) {
  resetStyleData();
  if (id) {
    const s = stylesData.find(x => x.id === id); if (!s) return;
    taxonomyState.styleId = id;
    tax$('styleDialogTitle').textContent = 'Sửa trường phái';
    tax$('styleName').value = s.name || ''; tax$('styleSlug').value = s.slug || ''; tax$('styleType').value = s.style_type || 'STYLE';
    tax$('styleCountry').value = s.country || ''; tax$('styleRegion').value = s.region || ''; tax$('styleDescription').value = s.description || '';
    tax$('styleHistory').value = s.history || ''; tax$('styleCharacteristics').value = s.characteristics || ''; tax$('stylePhilosophy').value = s.philosophy || ''; tax$('styleStatus').value = s.status || 'DRAFT';
  }
  tax$('styleDialog').showModal();
}

async function saveStyleData(e) {
  e.preventDefault();
  const payload = { name: tax$('styleName').value.trim(), slug: taxSlug(tax$('styleSlug').value.trim()), style_type: tax$('styleType').value, country: tax$('styleCountry').value.trim() || null, region: tax$('styleRegion').value.trim() || null, description: tax$('styleDescription').value.trim() || null, history: tax$('styleHistory').value.trim() || null, characteristics: tax$('styleCharacteristics').value.trim() || null, philosophy: tax$('stylePhilosophy').value.trim() || null, status: tax$('styleStatus').value, updated_at: new Date().toISOString() };
  const result = taxonomyState.styleId ? await taxonomyDb.from('bv_styles').update(payload).eq('id', taxonomyState.styleId) : await taxonomyDb.from('bv_styles').insert(payload);
  if (result.error) { tax$('styleDataError').textContent = result.error.message; return; }
  tax$('styleDialog').close(); await loadStyles();
}

async function deleteStyle(id) {
  const s = stylesData.find(x => x.id === id); if (!s || !confirm(`Xóa “${s.name}”?`)) return;
  const { error } = await taxonomyDb.from('bv_styles').delete().eq('id', id);
  if (error) { alert(`Không thể xóa: ${error.message}`); return; }
  await loadStyles();
}

document.addEventListener('DOMContentLoaded', () => {
  tax$('newFormBtn').addEventListener('click', () => openForm());
  tax$('formDataForm').addEventListener('submit', saveFormData);
  tax$('formSearchInput').addEventListener('input', loadForms);
  tax$('formStatusFilter').addEventListener('change', loadForms);
  tax$('newStyleBtn').addEventListener('click', () => openStyle());
  tax$('styleDataForm').addEventListener('submit', saveStyleData);
  tax$('styleSearchInput').addEventListener('input', loadStyles);
  tax$('styleStatusFilter').addEventListener('change', loadStyles);
  document.querySelectorAll('.nav-item[href="#forms"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); taxonomyView('forms'); }));
  document.querySelectorAll('.nav-item[href="#styles"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); taxonomyView('styles'); }));
  if (location.hash === '#forms') taxonomyView('forms');
  if (location.hash === '#styles') taxonomyView('styles');
});
