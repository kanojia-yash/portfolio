document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------ */
  /* Active year in footer                                              */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Mobile nav toggle                                                   */
  /* ------------------------------------------------------------------ */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenuMobile = document.querySelector(".nav-menu-mobile");

  if (navToggle && navMenuMobile) {
    const closeMobileMenu = () => {
      navToggle.classList.remove("open");
      navMenuMobile.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    };

    const openMobileMenu = () => {
      navToggle.classList.add("open");
      navMenuMobile.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navMenuMobile.classList.contains("open");
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    navMenuMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close when clicking outside the menu
    document.addEventListener("click", (e) => {
      if (
        navMenuMobile.classList.contains("open") &&
        !navMenuMobile.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenuMobile.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    // Close automatically if the viewport is resized past the mobile breakpoint
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navMenuMobile.classList.contains("open")) {
        closeMobileMenu();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Active nav link highlighting on scroll                              */
  /* ------------------------------------------------------------------ */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const highlightNav = () => {
    let current = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  /* ------------------------------------------------------------------ */
  /* Typing effect for hero role                                         */
  /* ------------------------------------------------------------------ */
  const typeTarget = document.getElementById("typing-text");
  if (typeTarget) {
    const roles = JSON.parse(typeTarget.dataset.roles || "[]");
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = roles[roleIndex] || "";
      if (!deleting) {
        charIndex++;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    if (roles.length) tick();
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal (IntersectionObserver)                                */
  /* ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* Animated skill bars                                                 */
  /* ------------------------------------------------------------------ */
  const skillCards = document.querySelectorAll(".skill-card");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector(".skill-bar-fill");
          if (fill) fill.style.width = fill.dataset.percent + "%";
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillCards.forEach((card) => skillObserver.observe(card));

  /* ------------------------------------------------------------------ */
  /* Magnetic buttons                                                    */
  /* ------------------------------------------------------------------ */
  const magnetic = document.querySelectorAll(".magnetic");
  magnetic.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  /* ------------------------------------------------------------------ */
  /* Contact form logic lives in js/contact.js                           */
  /* ------------------------------------------------------------------ */
});
