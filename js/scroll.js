document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------ */
  /* Navbar shrink + smooth in-page scroll                               */
  /* ------------------------------------------------------------------ */
  const navbar = document.querySelector(".navbar");

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("glass-strong");
      navbar.style.padding = "8px 8px 8px 22px";
    } else {
      navbar.classList.remove("glass-strong");
      navbar.style.padding = "";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  navbar.classList.add("glass");
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Parallax on background blobs                                        */
  /* ------------------------------------------------------------------ */
  const blobs = document.querySelectorAll(".blob");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = 0.06 + i * 0.03;
          blob.style.transform = `translateY(${y * speed}px)`;
        });
      },
      { passive: true }
    );

    /* Hover tilt on glass cards */
    const tiltEls = document.querySelectorAll(
      ".project-card, .skill-card, .service-card, .stat-card"
    );
    tiltEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }
});
