
document.addEventListener("DOMContentLoaded", () => {
  const CONSENT_KEY = "ernekka_cookie_consent";
  const CONSENT_VERSION = "1.0";

  const defaultConsent = {
    necessary: true,
    analytics: false,
    marketing: false
  };

  let consent = loadConsent();

  function loadConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONSENT_KEY));

      if (saved && saved.version === CONSENT_VERSION && saved.categories) {
        return {
          necessary: true,
          analytics: saved.categories.analytics === true,
          marketing: saved.categories.marketing === true
        };
      }
    } catch (error) {
      console.warn("Cookie preferences could not be read.", error);
    }

    return null;
  }

  function saveConsent(categories) {
    consent = {
      necessary: true,
      analytics: categories.analytics === true,
      marketing: categories.marketing === true
    };

    const record = {
      version: CONSENT_VERSION,
      categories: consent,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch (error) {
      console.warn("Cookie preferences could not be saved.", error);
    }

    document.dispatchEvent(
      new CustomEvent("ernekka:consentchange", {
        detail: { ...consent }
      })
    );

    loadPermittedScripts();
    updateSettingsButton();
    closePreferences();
    hideBanner();
  }

  // Load only scripts whose category has been accepted.
  function loadPermittedScripts() {
    document
      .querySelectorAll('script[type="text/plain"][data-cookie-category]')
      .forEach(originalScript => {
        const category = originalScript.dataset.cookieCategory;

        if (!consent || !consent[category]) return;
        if (originalScript.dataset.cookieLoaded === "true") return;

        const activeScript = document.createElement("script");

        Array.from(originalScript.attributes).forEach(attribute => {
          if (
            attribute.name === "type" ||
            attribute.name === "data-cookie-category" ||
            attribute.name === "data-cookie-loaded"
          ) {
            return;
          }

          activeScript.setAttribute(attribute.name, attribute.value);
        });

        activeScript.textContent = originalScript.textContent;
        originalScript.dataset.cookieLoaded = "true";
        originalScript.after(activeScript);
      });
  }

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.id = "cookieBanner";
  banner.setAttribute("aria-label", "Cookie preferences");
  banner.setAttribute("aria-live", "polite");

  banner.innerHTML = `
    <div class="cookie-banner-copy">
      <span class="cookie-eyebrow">Your privacy matters</span>
      <h2>Cookies, on your terms.</h2>
      <p>
        We use necessary cookies to make this website work.
        With your permission, we may also use optional cookies
        to understand website usage and improve our services.
        You can change your choices at any time.
        Read our <a href="ernekka-privacy-cookies.html">Privacy & Cookies policy</a>.
      </p>
    </div>

    <div class="cookie-banner-actions">
      <button type="button" class="cookie-button cookie-button-primary"
        id="cookieAcceptAll">Accept all</button>

      <button type="button" class="cookie-button cookie-button-secondary"
        id="cookieRejectAll">Reject optional</button>

      <button type="button" class="cookie-text-button"
        id="cookieCustomise">Customise</button>
    </div>
  `;

  document.body.appendChild(banner);

  const preferences = document.createElement("dialog");
  preferences.className = "cookie-dialog";
  preferences.id = "cookiePreferences";

  preferences.innerHTML = `
    <div class="cookie-dialog-inner">
      <div class="cookie-dialog-heading">
        <span class="cookie-eyebrow">Privacy preferences</span>
        <button type="button" class="cookie-close"
          id="cookieClose" aria-label="Close preferences">×</button>
      </div>

      <h2>Choose what you're comfortable with.</h2>
      <p class="cookie-dialog-intro">
        You can update these choices whenever you like.
        Necessary cookies are always active because they support
        the basic operation and security of this website.
      </p>

      <div class="cookie-option">
        <div>
          <h3>Necessary cookies</h3>
          <p>Required for core website functions and security.</p>
        </div>
        <label class="cookie-switch">
          <input type="checkbox" checked disabled>
          <span class="cookie-switch-track"></span>
          <span class="cookie-sr-only">Always active</span>
        </label>
        <span class="cookie-always-on">Always on</span>
      </div>

      <div class="cookie-option">
        <div>
          <h3>Analytics cookies</h3>
          <p>Help us understand how visitors use the website.</p>
        </div>
        <label class="cookie-switch">
          <input type="checkbox" id="cookieAnalytics">
          <span class="cookie-switch-track"></span>
          <span class="cookie-sr-only">Allow analytics cookies</span>
        </label>
      </div>

      <div class="cookie-option">
        <div>
          <h3>Marketing cookies</h3>
          <p>May be used to measure campaigns or support relevant advertising.</p>
        </div>
        <label class="cookie-switch">
          <input type="checkbox" id="cookieMarketing">
          <span class="cookie-switch-track"></span>
          <span class="cookie-sr-only">Allow marketing cookies</span>
        </label>
      </div>

      <div class="cookie-dialog-actions">
        <button type="button" class="cookie-button cookie-button-primary"
          id="cookieSave">Save my choices</button>
        <button type="button" class="cookie-button cookie-button-secondary"
          id="cookieAcceptPreferences">Accept all</button>
      </div>

      <a class="cookie-policy-link" href="ernekka-privacy-cookies.html">
        Read our Privacy & Cookies policy ↗
      </a>
    </div>
  `;

  document.body.appendChild(preferences);

  const acceptAllButton = document.getElementById("cookieAcceptAll");
  const rejectButton = document.getElementById("cookieRejectAll");
  const customiseButton = document.getElementById("cookieCustomise");
  const closeButton = document.getElementById("cookieClose");
  const saveButton = document.getElementById("cookieSave");
  const acceptPreferencesButton =
    document.getElementById("cookieAcceptPreferences");

  const analyticsInput = document.getElementById("cookieAnalytics");
  const marketingInput = document.getElementById("cookieMarketing");

  function showBanner() {
    banner.classList.add("is-visible");
  }

  function hideBanner() {
    banner.classList.remove("is-visible");
  }

  function openPreferences() {
    analyticsInput.checked = consent?.analytics === true;
    marketingInput.checked = consent?.marketing === true;

    if (!preferences.open) {
      preferences.showModal();
    }
  }

  function closePreferences() {
    if (preferences.open) {
      preferences.close();
    }
  }

  acceptAllButton.addEventListener("click", () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
  });

  rejectButton.addEventListener("click", () => {
    saveConsent(defaultConsent);
  });

  customiseButton.addEventListener("click", openPreferences);
  closeButton.addEventListener("click", closePreferences);

  saveButton.addEventListener("click", () => {
    saveConsent({
      necessary: true,
      analytics: analyticsInput.checked,
      marketing: marketingInput.checked
    });
  });

  acceptPreferencesButton.addEventListener("click", () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
  });

  preferences.addEventListener("click", event => {
    if (event.target === preferences) {
      closePreferences();
    }
  });

  // Add a persistent settings link to the existing footer.
  const footerLegal = document.querySelector(".footer-legal");

  if (footerLegal) {
    const settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.className = "cookie-settings-link";
    settingsButton.id = "cookieSettings";
    settingsButton.textContent = "Cookie settings";
    settingsButton.addEventListener("click", openPreferences);
    footerLegal.appendChild(settingsButton);
  }

  function updateSettingsButton() {
    const settingsButton = document.getElementById("cookieSettings");
    if (settingsButton) {
      settingsButton.setAttribute("aria-label", "Manage cookie preferences");
    }
  }

  updateSettingsButton();

  // Existing consent: load only permitted scripts.
  if (consent) {
    loadPermittedScripts();
  } else {
    showBanner();
  }

  // Public helper for other scripts that need to check consent.
  window.ErnekkaConsent = {
    getPreferences: () => consent ? { ...consent } : null,
    hasConsent: category => category === "necessary"
      ? true
      : consent?.[category] === true,
    openSettings: openPreferences
  };
});