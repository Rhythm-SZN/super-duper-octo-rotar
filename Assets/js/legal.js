
document.addEventListener("DOMContentLoaded", () => {

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    primaryNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }


  // Current year
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  // Back to top
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 420);
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }


  // Active legal-page table of contents
  const tocLinks = document.querySelectorAll(".legal-sidebar nav a");

  const sections = Array.from(tocLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (tocLinks.length && sections.length) {
    const updateActiveLink = () => {
      let currentSection = "";

      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
          currentSection = section.id;
        }
      });

      tocLinks.forEach(link => {
        const isActive =
          link.getAttribute("href") === `#${currentSection}`;

        link.classList.toggle("active", isActive);
      });
    };

    window.addEventListener("scroll", updateActiveLink, {
      passive: true
    });

    updateActiveLink();
  }

});