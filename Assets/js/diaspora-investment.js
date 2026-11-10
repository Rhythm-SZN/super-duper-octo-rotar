
document.addEventListener('DOMContentLoaded', () => {

  // =====================================
  // LANGUAGE SWITCHER
  // =====================================

  const languageButtons = document.querySelectorAll('[data-language]');
  const translatableElements = document.querySelectorAll('[data-en][data-fr]');

  let currentLanguage = 'en';

  function setLanguage(language) {
    if (!['en', 'fr'].includes(language)) return;

    currentLanguage = language;

    document.documentElement.lang = language;

    translatableElements.forEach(element => {
      const translatedText = element.dataset[language];

      if (translatedText !== undefined) {
        element.textContent = translatedText;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-en-placeholder][data-fr-placeholder]')
      .forEach(element => {
        element.placeholder = element.dataset[`${language}Placeholder`];
      });

    // Update language button states
    languageButtons.forEach(button => {
      const isActive = button.dataset.language === language;

      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    // Update page title
    document.title = language === 'fr'
      ? 'Investissement diaspora | Ernekka Limited'
      : 'Diaspora Investment | Ernekka Limited';
  }

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.language);
    });
  });


  // =====================================
  // MOBILE NAVIGATION
  // =====================================

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
      const isOpen =
        menuToggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMenu();
      } else {
        primaryNav.classList.add('is-open');

        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation');
        menuToggle.textContent = '×';
      }
    });

    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
      const clickedInsideNav = primaryNav.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMenu();
      }
    });
  }


  // =====================================
  // CURRENT YEAR
  // =====================================

  const currentYear = document.getElementById('currentYear');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // =====================================
  // ACTIVE PAGE INDICATOR
  // =====================================

  const currentPageLink = document.querySelector(
    '.nav-links a[href="ernekka-diaspora-investment.html"]'
  );

  if (currentPageLink) {
    currentPageLink.setAttribute('aria-current', 'page');
  }


  // =====================================
  // ENQUIRY FORM
  // =====================================

  const enquiryForm = document.getElementById('diasporaEnquiryForm');
  const formStatus = document.getElementById('formStatus');

  if (enquiryForm && formStatus) {

    enquiryForm.addEventListener('submit', event => {
      event.preventDefault();

      formStatus.className = 'di-form-status';
      formStatus.textContent = '';

      if (!enquiryForm.checkValidity()) {
        enquiryForm.reportValidity();

        formStatus.classList.add('error');

        formStatus.textContent = currentLanguage === 'fr'
          ? 'Veuillez vérifier les champs obligatoires et votre consentement.'
          : 'Please check the required fields and your privacy consent.';

        return;
      }

      // DEMO MODE:
      // No information is sent, uploaded or stored.
      // Connect an approved form endpoint before launch.

      formStatus.classList.add('success');

      formStatus.textContent = currentLanguage === 'fr'
        ? 'Le formulaire est actuellement en mode démonstration. Aucune information n’a été envoyée. Le système de réception doit être configuré avant le lancement.'
        : 'This form is currently in demo mode. No information has been sent. The enquiry submission system must be connected before launch.';
    });
  }


  // =====================================
  // BACK TO TOP
  // =====================================

  const backToTop = document.getElementById('backToTop');

  if (backToTop) {

    const updateBackToTop = () => {
      backToTop.classList.toggle(
        'visible',
        window.scrollY > 420
      );
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