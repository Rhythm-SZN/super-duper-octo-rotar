
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


  // Reading progress
  const progressBar = document.getElementById("articleProgress");
  const articleContent = document.getElementById("articleContent");

  if (progressBar && articleContent) {
    const updateProgress = () => {
      const contentTop = articleContent.offsetTop;
      const contentHeight = articleContent.offsetHeight;
      const availableScroll = contentHeight - window.innerHeight;

      if (availableScroll <= 0) {
        progressBar.style.width = "100%";
        return;
      }

      const progress = Math.min(
        100,
        Math.max(
          0,
          ((window.scrollY - contentTop) / availableScroll) * 100
        )
      );

      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", updateProgress, {
      passive: true
    });

    window.addEventListener("resize", updateProgress);

    updateProgress();
  }


  // Copy article link
  const copyButton = document.getElementById("copyArticleLink");

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const originalText = copyButton.innerHTML;

      try {
        await navigator.clipboard.writeText(window.location.href);
        copyButton.innerHTML = "<span>Copied!</span>";
      } catch (error) {
        copyButton.innerHTML = "<span>Copy unavailable</span>";
      }

      window.setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2000);
    });
  }


  // Native sharing
  const shareButton = document.getElementById("nativeShare");

  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        text: "Read this article from Ernekka Insights.",
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          // Sharing cancelled or unavailable.
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          shareButton.innerHTML = "<span>Link copied!</span>";

          window.setTimeout(() => {
            shareButton.innerHTML = "<span>Share</span>";
          }, 2000);
        } catch (error) {
          shareButton.innerHTML = "<span>Sharing unavailable</span>";
        }
      }
    });
  }


  // Table of contents active section
  const tocLinks = document.querySelectorAll(".article-toc nav a");
  const articleSections = Array.from(tocLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (tocLinks.length && articleSections.length) {
    const updateActiveSection = () => {
      let currentSection = "";

      articleSections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 180) {
          currentSection = section.id;
        }
      });

      tocLinks.forEach(link => {
        const isActive = link.getAttribute("href") === `#${currentSection}`;

        link.classList.toggle("active", isActive);
      });
    };

    window.addEventListener("scroll", updateActiveSection, {
      passive: true
    });

    updateActiveSection();
  }

});