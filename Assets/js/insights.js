
document.addEventListener('DOMContentLoaded', () => {

  // MOBILE NAVIGATION
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('primaryNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');

      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation' : 'Open navigation'
      );
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  // FOOTER YEAR
  const currentYear = document.getElementById('currentYear');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // BACK TO TOP
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 420);
    };

    window.addEventListener('scroll', updateBackToTop, {
      passive: true
    });

    updateBackToTop();

    backToTop.addEventListener('click', () => {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // INSIGHTS CATEGORY FILTERS AND SEARCH
  const filterButtons = document.querySelectorAll('.insight-filter');
  const searchInput = document.getElementById('insightsSearch');
  const insightCards = document.querySelectorAll('.insight-card');
  const emptyMessage = document.getElementById('insightsEmpty');

  let activeCategory = 'all';

  function filterInsights() {
    const searchTerm = searchInput
      ? searchInput.value.trim().toLowerCase()
      : '';

    let visibleCount = 0;

    insightCards.forEach(card => {
      const category = card.dataset.category;
      const searchData = (
        card.dataset.search + ' ' + card.textContent
      ).toLowerCase();

      const matchesCategory =
        activeCategory === 'all' || category === activeCategory;

      const matchesSearch =
        searchData.includes(searchTerm);

      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter;

      filterButtons.forEach(filter => {
        const isActive = filter === button;

        filter.classList.toggle('active', isActive);
        filter.setAttribute('aria-pressed', String(isActive));
      });

      filterInsights();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterInsights);
  }

});