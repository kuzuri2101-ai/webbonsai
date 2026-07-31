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
  themeIcons.forEach((icon) => {
    icon.textContent = theme === 'dark' ? '☀' : '☾';
  });
}

const storedTheme = localStorage.getItem('cay-sao-roi-theme');
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(storedTheme || (preferredDark ? 'dark' : 'light'));

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
});

function openSearch(initialValue = '') {
  if (!searchModal) return;
  searchModal.classList.add('open');
  searchModal.setAttribute('aria-hidden', 'false');
  body.classList.add('no-scroll');
  const input = searchModal.querySelector('input');
  if (input) {
    input.value = initialValue;
    window.setTimeout(() => input.focus(), 100);
  }
}

function closeSearch() {
  if (!searchModal) return;
  searchModal.classList.remove('open');
  searchModal.setAttribute('aria-hidden', 'true');
  body.classList.remove('no-scroll');
}

searchTriggers.forEach((button) => button.addEventListener('click', () => openSearch()));
document.querySelectorAll('[data-close-search]').forEach((element) => element.addEventListener('click', closeSearch));

if (heroSearch && heroQuery) {
  heroSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    openSearch(heroQuery.value.trim());
  });
}

function openSheet() {
  if (!mobileSheet) return;
  mobileSheet.classList.add('open');
  mobileSheet.setAttribute('aria-hidden', 'false');
  body.classList.add('no-scroll');
}

function closeSheet() {
  if (!mobileSheet) return;
  mobileSheet.classList.remove('open');
  mobileSheet.setAttribute('aria-hidden', 'true');
  body.classList.remove('no-scroll');
}

if (mobileMore) mobileMore.addEventListener('click', openSheet);
document.querySelectorAll('[data-close-sheet]').forEach((element) => element.addEventListener('click', closeSheet));
mobileSheet?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSheet));

if (compareRange && compareBox) {
  const updateCompare = () => {
    compareBox.style.setProperty('--compare', `${Number(compareRange.value)}%`);
  };
  compareRange.addEventListener('input', updateCompare);
  updateCompare();
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

document.querySelectorAll('.chip, .filter-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const group = chip.parentElement;
    group?.querySelectorAll('.active').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
  });
});

const monthName = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date());
if (monthElement) monthElement.textContent = monthName;
if (yearElement) yearElement.textContent = new Date().getFullYear();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSearch();
    closeSheet();
  }
});

// Một số ảnh mẫu Unsplash trước đây đã bị gỡ và trả về 404.
// Thay ngay các URL đó bằng ảnh còn hoạt động trước khi trình duyệt hiển thị biểu tượng ảnh lỗi.
const brokenImageReplacements = [
  ['photo-1614594075929-b84615b3ad4c', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=86'],
  ['photo-1614594575810-2ed9e67dc8a3', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=86'],
  ['photo-1593691509543-c55fb32e5cee', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=84']
];

const fallbackSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#10251d"/>
        <stop offset="1" stop-color="#315f46"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)"/>
    <circle cx="600" cy="355" r="150" fill="#dce8d7" opacity="0.12"/>
    <path d="M600 510c-12-120 22-220 110-300-14 104-52 199-110 300Zm0 0c-63-92-139-149-228-171 75 74 145 131 228 171Z" fill="#dce8d7" opacity="0.78"/>
    <text x="600" y="625" text-anchor="middle" fill="#f7f3e9" font-family="Arial, sans-serif" font-size="42" font-weight="700">Cây Sao Rồi?</text>
    <text x="600" y="674" text-anchor="middle" fill="#c7d4ca" font-family="Arial, sans-serif" font-size="24">Hình ảnh đang được cập nhật</text>
  </svg>
`)}`;

function applyImageFallback(image) {
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = fallbackSvg;
  image.removeAttribute('srcset');
}

document.querySelectorAll('img').forEach((image) => {
  const replacement = brokenImageReplacements.find(([brokenId]) => image.src.includes(brokenId));
  if (replacement) image.src = replacement[1];

  if (image.closest('.hero')) {
    image.loading = 'eager';
    image.fetchPriority = 'high';
  } else {
    image.loading = 'lazy';
    image.decoding = 'async';
  }

  image.addEventListener('error', () => applyImageFallback(image));

  // Bắt cả trường hợp ảnh đã lỗi trước khi script được tải xong.
  if (image.complete && image.naturalWidth === 0) {
    applyImageFallback(image);
  }
});