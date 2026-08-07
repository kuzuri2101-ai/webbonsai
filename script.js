const root = document.documentElement;
const body = document.body;
const themeButtons = document.querySelectorAll('.theme-toggle');
const themeIcons = document.querySelectorAll('.theme-icon');
const searchModal = document.querySelector('#search-modal');
const searchTriggers = document.querySelectorAll('.search-trigger');
const heroSearch = document.querySelector('#hero-search');
const heroQuery = document.querySelector('#hero-query');
const mobileSheet = document.querySelector('#mobile-sheet');
const mobileMore = document.querySelector('.mobile-more');
const compareRange = document.querySelector('#compare-range');
const compareBox = document.querySelector('#before-after');
const monthElement = document.querySelector('#current-month');
const yearElement = document.querySelector('#current-year');

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('cay-sao-roi-theme', theme);
  themeIcons.forEach((icon) => { icon.textContent = theme === 'dark' ? '☀' : '☾'; });
}
const storedTheme = localStorage.getItem('cay-sao-roi-theme');
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(storedTheme || (preferredDark ? 'dark' : 'light'));
themeButtons.forEach((button) => button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')));

function openSearch(initialValue = '') {
  if (!searchModal) return;
  searchModal.classList.add('open'); searchModal.setAttribute('aria-hidden', 'false'); body.classList.add('no-scroll');
  const input = searchModal.querySelector('input');
  if (input) { input.value = initialValue; window.setTimeout(() => input.focus(), 100); }
}
function closeSearch() { if (!searchModal) return; searchModal.classList.remove('open'); searchModal.setAttribute('aria-hidden', 'true'); body.classList.remove('no-scroll'); }
searchTriggers.forEach((button) => button.addEventListener('click', () => openSearch()));
document.querySelectorAll('[data-close-search]').forEach((element) => element.addEventListener('click', closeSearch));
if (heroSearch && heroQuery) heroSearch.addEventListener('submit', (event) => { event.preventDefault(); openSearch(heroQuery.value.trim()); });

function openSheet() { if (!mobileSheet) return; mobileSheet.classList.add('open'); mobileSheet.setAttribute('aria-hidden', 'false'); body.classList.add('no-scroll'); }
function closeSheet() { if (!mobileSheet) return; mobileSheet.classList.remove('open'); mobileSheet.setAttribute('aria-hidden', 'true'); body.classList.remove('no-scroll'); }
if (mobileMore) mobileMore.addEventListener('click', openSheet);
document.querySelectorAll('[data-close-sheet]').forEach((element) => element.addEventListener('click', closeSheet));
mobileSheet?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSheet));

if (compareRange && compareBox) {
  const updateCompare = () => compareBox.style.setProperty('--compare', `${Number(compareRange.value)}%`);
  compareRange.addEventListener('input', updateCompare); updateCompare();
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealElements.forEach((element) => observer.observe(element));
} else revealElements.forEach((element) => element.classList.add('visible'));

document.querySelectorAll('.chip, .filter-chip').forEach((chip) => chip.addEventListener('click', () => {
  const group = chip.parentElement; group?.querySelectorAll('.active').forEach((item) => item.classList.remove('active')); chip.classList.add('active');
}));

const monthName = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date());
if (monthElement) monthElement.textContent = monthName;
if (yearElement) yearElement.textContent = new Date().getFullYear();
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeSearch(); closeSheet(); } });

// Tài khoản trên homepage.
const headerActions = document.querySelector('.header-actions');
if (headerActions && !document.querySelector('.login-link')) {
  const loginLink = document.createElement('a');
  loginLink.className = 'login-link'; loginLink.href = 'login.html'; loginLink.textContent = 'Đăng nhập'; loginLink.setAttribute('aria-label', 'Đăng nhập tài khoản');
  loginLink.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 14px;border:1px solid rgba(157,187,143,.35);border-radius:999px;color:inherit;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap;transition:background .2s ease,transform .2s ease;';
  headerActions.insertBefore(loginLink, headerActions.firstChild);
}

const desktopNav = document.querySelector('.desktop-nav');
if (desktopNav && !desktopNav.querySelector('a[href="cap-cuu-cay.html"]')) {
  const rescueLink = document.createElement('a'); rescueLink.href = 'cap-cuu-cay.html'; rescueLink.textContent = 'Cấp cứu cây'; desktopNav.appendChild(rescueLink);
  const labLink = document.createElement('a'); labLink.href = 'lab.html'; labLink.textContent = 'Bonsai Lab'; desktopNav.appendChild(labLink);
}

const brokenImageReplacements = [
  ['photo-1614594075929-b84615b3ad4c', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=86'],
  ['photo-1614594575810-2ed9e67dc8a3', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=86'],
  ['photo-1593691509543-c55fb32e5cee', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=84']
];
const fallbackSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#17352a"/><circle cx="600" cy="355" r="150" fill="#dce8d7" opacity=".12"/><path d="M600 510c-12-120 22-220 110-300-14 104-52 199-110 300Zm0 0c-63-92-139-149-228-171 75 74 145 131 228 171Z" fill="#dce8d7" opacity=".78"/><text x="600" y="625" text-anchor="middle" fill="#f7f3e9" font-family="Arial" font-size="42" font-weight="700">Bonsai Việt</text></svg>`)}`;
function applyImageFallback(image) { if (image.dataset.fallbackApplied === 'true') return; image.dataset.fallbackApplied = 'true'; image.src = fallbackSvg; image.removeAttribute('srcset'); }
document.querySelectorAll('img').forEach((image) => {
  const replacement = brokenImageReplacements.find(([brokenId]) => image.src.includes(brokenId)); if (replacement) image.src = replacement[1];
  if (image.closest('.hero')) { image.loading = 'eager'; image.fetchPriority = 'high'; } else { image.loading = 'lazy'; image.decoding = 'async'; }
  image.addEventListener('error', () => applyImageFallback(image)); if (image.complete && image.naturalWidth === 0) applyImageFallback(image);
});

// =========================
// BONSAI VIỆT + SUPABASE
// =========================
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const slugUrl = (type, slug) => `knowledge.html?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`;
const plantTrack = document.querySelector('#plant-track');
let plantsCache = [];
let techniquesCache = [];

function plantImage(plant, index) {
  if (plant.image_url) return plant.image_url;
  const fallbacks = [
    'https://images.unsplash.com/photo-1614594575810-2ed9e67dc8a3?auto=format&fit=crop&w=800&q=84',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=84',
    'https://images.unsplash.com/photo-1614594075929-b84615b3ad4c?auto=format&fit=crop&w=800&q=84',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=84'
  ];
  return fallbacks[index % fallbacks.length];
}
function plantMatchesFilter(plant, filter) {
  if (filter === 'all') return true;
  const text = `${plant.name || ''} ${plant.description || ''} ${plant.short_description || ''} ${plant.difficulty || ''} ${plant.sunlight || ''}`.toLowerCase();
  if (filter === 'easy') return /dễ|easy|thấp/.test(text);
  if (filter === 'sun') return /nắng|trực tiếp|chịu nắng/.test(text);
  if (filter === 'flower') return /hoa|ra hoa/.test(text);
  if (filter === 'bonsai') return true;
  return true;
}
function renderPlants(filter = 'all') {
  if (!plantTrack) return;
  const items = plantsCache.filter((plant) => plantMatchesFilter(plant, filter));
  if (!items.length) { plantTrack.innerHTML = '<div class="plant-loading">Không có cây phù hợp với bộ lọc này.</div>'; return; }
  plantTrack.innerHTML = items.map((plant, index) => `
    <article class="plant-card reveal visible">
      <a class="plant-photo" href="${slugUrl('plant', plant.slug)}" aria-label="Xem ${esc(plant.name)}">
        <img src="${esc(plantImage(plant, index))}" alt="${esc(plant.name)}" loading="lazy" />
        <span>${esc(plant.difficulty || 'Đang cập nhật')}</span>
      </a>
      <div class="plant-body">
        <p class="latin">${esc(plant.scientific_name || 'Bonsai Việt')}</p>
        <h3>${esc(plant.name)}</h3>
        <div class="spec-row"><span>☀ ${esc(plant.sunlight || 'Đang cập nhật')}</span><span>◉ ${esc(plant.watering || 'Đang cập nhật')}</span></div>
        <a href="${slugUrl('plant', plant.slug)}">Xem hồ sơ cây →</a>
      </div>
    </article>`).join('');
  plantTrack.querySelectorAll('img').forEach((image) => image.addEventListener('error', () => applyImageFallback(image)));
}

async function loadBonsaiData() {
  if (!plantTrack || !window.getSupabase) return;
  const db = await window.getSupabase();
  if (!db) { plantTrack.innerHTML = '<div class="plant-loading">Chưa cấu hình kết nối Supabase. Hãy kiểm tra biến môi trường trên Vercel.</div>'; return; }
  const [{ data: plants, error: plantError }, { data: techniques, error: techniqueError }] = await Promise.all([
    db.from('bv_plants').select('id,name,slug,scientific_name,difficulty,sunlight,watering,short_description,description,image_url,status').eq('status', 'PUBLISHED').order('name'),
    db.from('bv_techniques').select('id,name,slug,category,difficulty,status').eq('status', 'PUBLISHED').order('name')
  ]);
  if (plantError) { console.error('Supabase plants error:', plantError); plantTrack.innerHTML = '<div class="plant-loading">Không tải được dữ liệu cây. Kiểm tra RLS/policy của Supabase.</div>'; return; }
  plantsCache = plants || [];
  techniquesCache = techniqueError ? [] : (techniques || []);
  renderPlants('all');

  document.querySelectorAll('[data-plant-filter]').forEach((button) => {
    button.addEventListener('click', () => renderPlants(button.dataset.plantFilter || 'all'));
  });

  const searchInput = searchModal?.querySelector('.modal-search-form input');
  const results = document.querySelector('#search-results');
  const runSearch = (query) => {
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const plants = plantsCache.filter((p) => `${p.name} ${p.scientific_name || ''} ${p.description || ''}`.toLowerCase().includes(q)).slice(0, 6);
    const techs = techniquesCache.filter((t) => `${t.name} ${t.category || ''}`.toLowerCase().includes(q)).slice(0, 6);
    results.innerHTML = [...plants.map((p) => `<a href="${slugUrl('plant', p.slug)}"><strong>🌳 ${esc(p.name)}</strong><small>Loài cây</small></a>`), ...techs.map((t) => `<a href="${slugUrl('technique', t.slug)}"><strong>✂ ${esc(t.name)}</strong><small>Kỹ thuật</small></a>`)].join('') || '<p class="search-no-result">Không tìm thấy nội dung phù hợp.</p>';
  };
  searchInput?.addEventListener('input', (event) => runSearch(event.target.value));
  searchModal?.querySelector('.modal-search-form')?.addEventListener('submit', (event) => { event.preventDefault(); runSearch(searchInput?.value || ''); });
}
loadBonsaiData();
