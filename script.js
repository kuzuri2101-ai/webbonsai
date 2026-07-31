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