const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const searchForm = document.querySelector('.plant-search');
const searchInput = document.querySelector('#plant-keyword');
const yearElement = document.querySelector('#current-year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    });
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const keyword = searchInput.value.trim();
    const librarySection = document.querySelector('#thu-vien');

    if (!keyword) {
      searchInput.focus();
      return;
    }

    if (librarySection) {
      librarySection.scrollIntoView({ behavior: 'smooth' });
    }

    searchInput.value = '';
    searchInput.placeholder = `Sắp có kết quả cho: ${keyword}`;
  });
}
