const awDb = window.getSupabase ? window.getSupabase() : null;
const awState = { artistId: null, workId: null };
let artistsData = [], worksData = [], plantsForWorks = [], formsForWorks = [], stylesForWorks = [];
const aw$ = id => document.getElementById(id);
const awEscape = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const awSlug = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const awError = (target, error) => { if (aw$(target)) aw$(target).textContent = error?.message || 'Có lỗi xảy ra.'; };
function awView(id) { if (typeof showView === 'function') showView(id); const titles = { artists: 'Nghệ nhân', works: 'Tác phẩm' }; if (aw$('pageTitle') && titles[id]) aw$('pageTitle').textContent = titles[id]; if (id === 'artists') loadArtists(); if (id === 'works') loadWorks(); }

async function loadArtists() {
  if (!awDb) return;
  const search = aw$('artistSearchInput').value.trim();
  const status = aw$('artistStatusFilter').value;
  let q = awDb.from('bv_artists').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  if (search) q = q.ilike('name', `%${search}%`);
  const { data, error } = await q;
  if (error) { aw$('artistList').innerHTML = `<div class="empty">Không tải được nghệ nhân: ${awEscape(error.message)}</div>`; return; }
  artistsData = data || [];
  aw$('artistList').innerHTML = artistsData.length ? `<table class="data-table"><thead><tr><th>Nghệ nhân</th><th>Kinh nghiệm</th><th>Chuyên môn</th><th>Xác thực</th><th>Trạng thái</th><th></th></tr></thead><tbody>${artistsData.map(a => `<tr><td><strong>${awEscape(a.name)}</strong><br><small>${awEscape(a.slug)}</small></td><td>${a.experience_years ? `${a.experience_years} năm` : '—'}</td><td>${awEscape(a.specialization || '—')}</td><td>${a.verified ? '✓' : '—'}</td><td><span class="badge">${awEscape(a.status)}</span></td><td><div class="row-actions"><button data-edit-artist="${a.id}">Sửa</button><button class="danger" data-delete-artist="${a.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>` : '<div class="empty">Chưa có nghệ nhân nào.</div>';
  document.querySelectorAll('[data-edit-artist]').forEach(b => b.addEventListener('click', () => openArtist(Number(b.dataset.editArtist))));
  document.querySelectorAll('[data-delete-artist]').forEach(b => b.addEventListener('click', () => deleteArtist(Number(b.dataset.deleteArtist))));
}
function resetArtist() { awState.artistId = null; aw$('artistForm').reset(); aw$('artistDialogTitle').textContent = 'Thêm nghệ nhân'; aw$('artistFormError').textContent = ''; aw$('artistStatus').value = 'DRAFT'; aw$('artistVerified').checked = false; }
function openArtist(id = null) { resetArtist(); if (id) { const a = artistsData.find(x => x.id === id); if (!a) return; awState.artistId = id; aw$('artistDialogTitle').textContent = 'Sửa nghệ nhân'; aw$('artistName').value = a.name || ''; aw$('artistSlug').value = a.slug || ''; aw$('artistBio').value = a.biography || ''; aw$('artistExperience').value = a.experience_years || ''; aw$('artistSpecialization').value = a.specialization || ''; aw$('artistPhilosophy').value = a.philosophy || ''; aw$('artistAchievements').value = a.achievements || ''; aw$('artistStatus').value = a.status || 'DRAFT'; aw$('artistVerified').checked = !!a.verified; } aw$('artistDialog').showModal(); }
async function saveArtist(e) { e.preventDefault(); const payload = { name: aw$('artistName').value.trim(), slug: awSlug(aw$('artistSlug').value.trim()), biography: aw$('artistBio').value.trim() || null, experience_years: aw$('artistExperience').value ? Number(aw$('artistExperience').value) : null, specialization: aw$('artistSpecialization').value.trim() || null, philosophy: aw$('artistPhilosophy').value.trim() || null, achievements: aw$('artistAchievements').value.trim() || null, status: aw$('artistStatus').value, verified: aw$('artistVerified').checked }; const result = awState.artistId ? await awDb.from('bv_artists').update(payload).eq('id', awState.artistId) : await awDb.from('bv_artists').insert(payload); if (result.error) { awError('artistFormError', result.error); return; } aw$('artistDialog').close(); await loadArtists(); }
async function deleteArtist(id) { const a = artistsData.find(x => x.id === id); if (!a || !confirm(`Xóa “${a.name}”? Tác phẩm liên quan sẽ giữ lại nhưng bỏ liên kết nghệ nhân.`)) return; const { error } = await awDb.from('bv_artists').delete().eq('id', id); if (error) { alert(`Không thể xóa: ${error.message}`); return; } await loadArtists(); }

async function loadWorkReferences() {
  const [plants, forms, styles, artists] = await Promise.all([
    awDb.from('bv_plants').select('id,name').order('name'),
    awDb.from('bv_forms').select('id,name').order('name'),
    awDb.from('bv_styles').select('id,name').order('name'),
    awDb.from('bv_artists').select('id,name').order('name')
  ]);
  if (plants.error || forms.error || styles.error || artists.error) return;
  plantsForWorks = plants.data || []; formsForWorks = forms.data || []; stylesForWorks = styles.data || []; artistsData = artists.data || artistsData;
  aw$('workPlant').innerHTML = plantsForWorks.map(x => `<option value="${x.id}">${awEscape(x.name)}</option>`).join('');
  aw$('workForm').innerHTML = '<option value="">Không chọn</option>' + formsForWorks.map(x => `<option value="${x.id}">${awEscape(x.name)}</option>`).join('');
  aw$('workStyle').innerHTML = '<option value="">Không chọn</option>' + stylesForWorks.map(x => `<option value="${x.id}">${awEscape(x.name)}</option>`).join('');
  aw$('workArtist').innerHTML = '<option value="">Không gán nghệ nhân</option>' + artistsData.map(x => `<option value="${x.id}">${awEscape(x.name)}</option>`).join('');
}
async function loadWorks() {
  if (!awDb) return;
  await loadWorkReferences();
  const search = aw$('workSearchInput').value.trim();
  const status = aw$('workStatusFilter').value;
  let q = awDb.from('bv_works').select('*, bv_plants(name), bv_forms(name), bv_styles(name), bv_artists(name)').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  if (search) q = q.ilike('name', `%${search}%`);
  const { data, error } = await q;
  if (error) { aw$('workList').innerHTML = `<div class="empty">Không tải được tác phẩm: ${awEscape(error.message)}</div>`; return; }
  worksData = data || [];
  aw$('workList').innerHTML = worksData.length ? `<table class="data-table"><thead><tr><th>Tác phẩm</th><th>Loài</th><th>Dáng</th><th>Nghệ nhân</th><th>Tuổi cây</th><th>Trạng thái</th><th></th></tr></thead><tbody>${worksData.map(w => `<tr><td><strong>${awEscape(w.name)}</strong><br><small>${awEscape(w.slug)}</small></td><td>${awEscape(w.bv_plants?.name || '—')}</td><td>${awEscape(w.bv_forms?.name || '—')}</td><td>${awEscape(w.bv_artists?.name || '—')}</td><td>${w.estimated_age ? `${w.estimated_age} năm` : '—'}</td><td><span class="badge">${awEscape(w.status)}</span></td><td><div class="row-actions"><button data-edit-work="${w.id}">Sửa</button><button class="danger" data-delete-work="${w.id}">Xóa</button></div></td></tr>`).join('')}</tbody></table>` : '<div class="empty">Chưa có tác phẩm nào.</div>';
  document.querySelectorAll('[data-edit-work]').forEach(b => b.addEventListener('click', () => openWork(Number(b.dataset.editWork))));
  document.querySelectorAll('[data-delete-work]').forEach(b => b.addEventListener('click', () => deleteWork(Number(b.dataset.deleteWork))));
}
function resetWork() { awState.workId = null; aw$('workFormData').reset(); aw$('workDialogTitle').textContent = 'Thêm tác phẩm'; aw$('workFormError').textContent = ''; aw$('workStatus').value = 'DRAFT'; }
function openWork(id = null) { resetWork(); if (id) { const w = worksData.find(x => x.id === id); if (!w) return; awState.workId = id; aw$('workDialogTitle').textContent = 'Sửa tác phẩm'; aw$('workName').value = w.name || ''; aw$('workSlug').value = w.slug || ''; aw$('workPlant').value = w.plant_id || ''; aw$('workForm').value = w.form_id || ''; aw$('workStyle').value = w.style_id || ''; aw$('workArtist').value = w.artist_id || ''; aw$('workDescription').value = w.description || ''; aw$('workAge').value = w.estimated_age || ''; aw$('workHeight').value = w.height_cm || ''; aw$('workWidth').value = w.width_cm || ''; aw$('workTrunk').value = w.trunk_diameter_cm || ''; aw$('workOrigin').value = w.origin || ''; aw$('workStory').value = w.creation_story || ''; aw$('workTechniques').value = w.technique_notes || ''; aw$('workStatus').value = w.status || 'DRAFT'; } aw$('workDialog').showModal(); }
async function saveWork(e) { e.preventDefault(); const payload = { name: aw$('workName').value.trim(), slug: awSlug(aw$('workSlug').value.trim()), plant_id: Number(aw$('workPlant').value), form_id: aw$('workForm').value ? Number(aw$('workForm').value) : null, style_id: aw$('workStyle').value ? Number(aw$('workStyle').value) : null, artist_id: aw$('workArtist').value ? Number(aw$('workArtist').value) : null, description: aw$('workDescription').value.trim() || null, estimated_age: aw$('workAge').value ? Number(aw$('workAge').value) : null, height_cm: aw$('workHeight').value ? Number(aw$('workHeight').value) : null, width_cm: aw$('workWidth').value ? Number(aw$('workWidth').value) : null, trunk_diameter_cm: aw$('workTrunk').value ? Number(aw$('workTrunk').value) : null, origin: aw$('workOrigin').value.trim() || null, creation_story: aw$('workStory').value.trim() || null, technique_notes: aw$('workTechniques').value.trim() || null, status: aw$('workStatus').value }; if (!payload.plant_id) { aw$('workFormError').textContent = 'Hãy chọn loài cây.'; return; } const result = awState.workId ? await awDb.from('bv_works').update(payload).eq('id', awState.workId) : await awDb.from('bv_works').insert(payload); if (result.error) { awError('workFormError', result.error); return; } aw$('workDialog').close(); await loadWorks(); }
async function deleteWork(id) { const w = worksData.find(x => x.id === id); if (!w || !confirm(`Xóa “${w.name}”?`)) return; const { error } = await awDb.from('bv_works').delete().eq('id', id); if (error) { alert(`Không thể xóa: ${error.message}`); return; } await loadWorks(); }

document.addEventListener('DOMContentLoaded', () => {
  aw$('newArtistBtn')?.addEventListener('click', () => openArtist()); aw$('artistForm')?.addEventListener('submit', saveArtist); aw$('artistSearchInput')?.addEventListener('input', loadArtists); aw$('artistStatusFilter')?.addEventListener('change', loadArtists);
  aw$('newWorkBtn')?.addEventListener('click', async () => { await loadWorkReferences(); openWork(); }); aw$('workFormData')?.addEventListener('submit', saveWork); aw$('workSearchInput')?.addEventListener('input', loadWorks); aw$('workStatusFilter')?.addEventListener('change', loadWorks);
  document.querySelectorAll('.nav-item[href="#artists"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); awView('artists'); })); document.querySelectorAll('.nav-item[href="#works"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); awView('works'); }));
  if (location.hash === '#artists') awView('artists'); if (location.hash === '#works') awView('works');
});
