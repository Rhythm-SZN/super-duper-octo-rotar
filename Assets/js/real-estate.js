
document.addEventListener('DOMContentLoaded', () => {

  // MOBILE NAVIGATION
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (menuToggle && primaryNav) {

    const closeMenu = () => {
      primaryNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.textContent = '☰';
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMenu();
      } else {
        primaryNav.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation');
        menuToggle.textContent = '×';
      }
    });

    // Close menu after selecting a page.
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu with Escape.
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    // Close menu when clicking outside it.
    document.addEventListener('click', event => {
      const clickedInsideNav = primaryNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMenu();
      }
    });

  }


  // CURRENT YEAR
  const currentYear = document.getElementById('currentYear');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // BACK TO TOP BUTTON
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

});