
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


  // Contact form
  const contactForm = document.getElementById("ernekkaContactForm");
  const feedback = document.getElementById("contactFormFeedback");

  if (contactForm && feedback) {

    const fields = {
      name: document.getElementById("contactName"),
      email: document.getElementById("contactEmail"),
      division: document.getElementById("contactDivision"),
      message: document.getElementById("contactMessage"),
      consent: document.getElementById("contactConsent")
    };

    const errors = {
      name: document.getElementById("nameError"),
      email: document.getElementById("emailError"),
      division: document.getElementById("divisionError"),
      message: document.getElementById("messageError"),
      consent: document.getElementById("consentError")
    };


    const clearError = (fieldName) => {
      const field = fields[fieldName];
      const error = errors[fieldName];

      if (error) error.textContent = "";

      if (field && field.classList) {
        field.classList.remove("invalid");
      }

      if (field && field.removeAttribute) {
        field.removeAttribute("aria-invalid");
      }
    };


    const showError = (fieldName, message) => {
      const field = fields[fieldName];
      const error = errors[fieldName];

      if (error) error.textContent = message;

      if (field && field.classList) {
        field.classList.add("invalid");
      }

      if (field && field.setAttribute) {
        field.setAttribute("aria-invalid", "true");
      }
    };


    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];

      if (!field) return;

      const eventName =
        field.type === "checkbox" || field.tagName === "SELECT"
          ? "change"
          : "input";

      field.addEventListener(eventName, () => {
        clearError(fieldName);
      });
    });


    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      Object.keys(fields).forEach(clearError);

      feedback.hidden = true;
      feedback.textContent = "";

      let isValid = true;
      let firstInvalidField = null;


      // Name
      if (fields.name.value.trim().length < 2) {
        showError("name", "Please enter your full name.");
        isValid = false;
        firstInvalidField ||= fields.name;
      }


      // Email
      const emailValue = fields.email.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(emailValue)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
        firstInvalidField ||= fields.email;
      }


      // Division
      if (!fields.division.value) {
        showError("division", "Please select an area of enquiry.");
        isValid = false;
        firstInvalidField ||= fields.division;
      }


      // Message
      if (fields.message.value.trim().length < 10) {
        showError(
          "message",
          "Please provide a little more detail (at least 10 characters)."
        );

        isValid = false;
        firstInvalidField ||= fields.message;
      }


      // Consent
      if (!fields.consent.checked) {
        showError(
          "consent",
          "Please confirm that you agree to the use of your information to respond to this enquiry."
        );

        isValid = false;
        firstInvalidField ||= fields.consent;
      }


      if (!isValid) {
        firstInvalidField?.focus();
        return;
      }


      feedback.textContent =
        "Thank you for completing the demonstration form. The form is not connected to an enquiry system yet, so your information has not been sent or stored. Please use the final configured contact channel when it becomes available.";

      feedback.hidden = false;

      feedback.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "nearest"
      });
    });

  }

});