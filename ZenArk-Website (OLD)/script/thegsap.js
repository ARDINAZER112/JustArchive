/* ============================================================
   ARCHTEN — GSAP ANIMATIONS
   Full cinematic animation suite
   ============================================================ */

// ─── Load GSAP + Plugins from CDN ────────────────────────────
(function loadGSAP() {
  const scripts = [
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js",
  ];

  let loaded = 0;
  scripts.forEach((src) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => {
      loaded++;
      if (loaded === scripts.length) initAnimations();
    };
    document.head.appendChild(s);
  });
})();

/* ============================================================
   INIT
   ============================================================ */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, CustomEase);

  // Custom easing curves
  CustomEase.create("smooth", "M0,0 C0.25,0.46 0.45,0.94 1,1");
  CustomEase.create("snap",   "M0,0 C0.6,0 0.4,1 1,1");
  CustomEase.create("bounce", "M0,0 C0.215,0.61 0.355,1 0.5,0.975 0.645,0.95 0.73,0.95 1,1");

  initLoader();
  initCursor();
  initNavbar();
  initHero();
  initParticles();
  initFeaturesSection();
  initProjectCards();
  initAboutSection();
  initSocialSection();
  initFooter();
  initScrollProgress();
  initMagneticButtons();
  initSmoothNavScroll();
  initFloatingOrbs();
}

/* ============================================================
   1. PAGE LOADER
   ============================================================ */
function initLoader() {
  // Create loader DOM
  const loader = document.createElement("div");
  loader.id = "archten-loader";
  loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader-logo">ARCHTEN</div>
      <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
      <div class="loader-percent">0%</div>
    </div>
  `;
  Object.assign(loader.style, {
    position: "fixed", inset: "0", zIndex: "99999",
    background: "#0c0c0f", display: "flex",
    alignItems: "center", justifyContent: "center",
    flexDirection: "column",
  });

  const style = document.createElement("style");
  style.textContent = `
    #archten-loader { font-family: 'Syne', 'Segoe UI', sans-serif; }
    .loader-inner { text-align: center; }
    .loader-logo {
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #a88bff, #e8c96b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 32px;
    }
    .loader-bar-wrap {
      width: min(320px, 80vw);
      height: 2px;
      background: rgba(255,255,255,0.07);
      border-radius: 99px;
      overflow: hidden;
      margin: 0 auto 16px;
    }
    .loader-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #a88bff, #e8c96b);
      border-radius: 99px;
    }
    .loader-percent {
      font-size: 13px;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.1em;
      font-family: 'DM Sans', sans-serif;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(loader);
  document.body.style.overflow = "hidden";

  const bar     = loader.querySelector(".loader-bar");
  const percent = loader.querySelector(".loader-percent");
  const logo    = loader.querySelector(".loader-logo");

  // Logo letter split animation
  const letters = logo.textContent.split("");
  logo.innerHTML = letters
    .map((l) => `<span style="display:inline-block;opacity:0;transform:translateY(40px)">${l}</span>`)
    .join("");

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = "";
      // Reveal page
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => loader.remove(),
      });
    },
  });

  tl.to(logo.querySelectorAll("span"), {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: "back.out(2)",
  })
  .to(bar, {
    width: "100%",
    duration: 1.8,
    ease: "power2.inOut",
    onUpdate: function () {
      percent.textContent = Math.round(this.progress() * 100) + "%";
    },
  }, "-=0.2")
  .to(logo.querySelectorAll("span"), {
    opacity: 0,
    y: -30,
    stagger: 0.04,
    duration: 0.4,
    ease: "power2.in",
  }, "+=0.1");
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch

  const cursorStyle = document.createElement("style");
  cursorStyle.textContent = `
    * { cursor: none !important; }
    #arch-cursor {
      position: fixed; top: 0; left: 0; z-index: 99998;
      pointer-events: none; mix-blend-mode: difference;
    }
    #arch-cursor .c-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #fff; position: absolute;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background 0.2s;
    }
    #arch-cursor .c-ring {
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.5);
      position: absolute; transform: translate(-50%, -50%);
    }
    body.cursor-hover #arch-cursor .c-dot {
      width: 60px; height: 60px; background: rgba(168,139,255,0.15);
      border: 1px solid rgba(168,139,255,0.5);
    }
    body.cursor-hover #arch-cursor .c-ring { opacity: 0; }
    body.cursor-click #arch-cursor .c-dot {
      width: 16px; height: 16px; background: #e8c96b;
    }
  `;
  document.head.appendChild(cursorStyle);

  const cursor = document.createElement("div");
  cursor.id = "arch-cursor";
  cursor.innerHTML = `<div class="c-dot"></div><div class="c-ring"></div>`;
  document.body.appendChild(cursor);

  const dot  = cursor.querySelector(".c-dot");
  const ring = cursor.querySelector(".c-ring");

  let mx = 0, my = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot,  { x: mx, y: my, duration: 0.12, ease: "none" });
    gsap.to(ring, { x: mx, y: my, duration: 0.45, ease: "power2.out" });
  });

  // Hover states
  const hoverTargets = "a, button, .project-card, .feature-card, .hero-btn, .btn, .nav-btn, .social-media .menu-links a";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup",   () => document.body.classList.remove("cursor-click"));
}

/* ============================================================
   3. NAVBAR ANIMATIONS
   ============================================================ */
function initNavbar() {
  const header  = document.querySelector("header");
  const logo    = document.querySelector(".logo");
  const navLinks = document.querySelectorAll(".nav-link");
  const navBtns  = document.querySelectorAll(".nav-btn");

  // Initial entrance
  gsap.from(logo, { opacity: 0, x: -30, duration: 0.8, ease: "power3.out", delay: 0.1 });
  gsap.from(navLinks, {
    opacity: 0, y: -16, stagger: 0.07, duration: 0.6,
    ease: "power3.out", delay: 0.2,
  });
  gsap.from(navBtns, {
    opacity: 0, scale: 0.6, stagger: 0.08, duration: 0.5,
    ease: "back.out(2)", delay: 0.4,
  });

  // Shrink on scroll
  ScrollTrigger.create({
    start: "top -80px",
    onEnter: () => gsap.to(header, { paddingTop: 0, paddingBottom: 0, duration: 0.3 }),
    onLeaveBack: () => gsap.to(header, { paddingTop: 0, paddingBottom: 0, duration: 0.3 }),
  });

  // Nav link underline anim on hover
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      gsap.to(link, { scaleX: 1.04, duration: 0.2, ease: "power2.out" });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(link, { scaleX: 1, duration: 0.25, ease: "power2.out" });
    });
  });
}

/* ============================================================
   4. HERO SECTION
   ============================================================ */
function initHero() {
  const heroContent = document.querySelector(".hero-content");
  if (!heroContent) return;

  const h1s    = heroContent.querySelectorAll("h1");
  const heroP  = heroContent.querySelector("p");
  const btns   = heroContent.querySelectorAll(".hero-btn");

  const tl = gsap.timeline({ delay: 2.2 }); // after loader

  tl.from(h1s[0], { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" })
    .from(h1s[1], {
      opacity: 0, y: 50, scale: 0.9, duration: 0.9, ease: "back.out(1.4)",
    }, "-=0.2")
    .from(heroP, { opacity: 0, y: 24, duration: 0.6, ease: "power2.out" }, "-=0.4")
    .from(btns, {
      opacity: 0, y: 30, scale: 0.85, stagger: 0.1,
      duration: 0.6, ease: "back.out(2)",
    }, "-=0.3");

  // Parallax hero on scroll
  gsap.to(".hero-content", {
    yPercent: 28,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
  });

  // Hero blobs floating
  gsap.to(".hero::before", {
    y: -40, x: 20,
    duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut",
  });
}

/* ============================================================
   5. FLOATING PARTICLES (canvas)
   ============================================================ */
function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "arch-particles";
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", zIndex: "0",
    pointerEvents: "none", opacity: "0.45",
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#a88bff", "#e8c96b", "#5de4c7", "#ffffff"];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.15;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ============================================================
   6. FEATURES SECTION
   ============================================================ */
function initFeaturesSection() {
  const section = document.querySelector(".features");
  if (!section) return;

  const title = section.querySelector(".section-title");
  const cards = section.querySelectorAll(".feature-card");

  // Title split reveal
  if (title) {
    gsap.from(title, {
      opacity: 0, y: 60, scale: 0.92,
      duration: 0.9, ease: "power4.out",
      scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none none" },
    });
  }

  // Cards stagger entrance
  gsap.from(cards, {
    opacity: 0, y: 80, scale: 0.88, rotationX: 8,
    stagger: { each: 0.12, ease: "power2.out" },
    duration: 0.9, ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: section.querySelector(".features-grid"),
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  // Icon bounce on scroll reveal
  cards.forEach((card, i) => {
    const icon = card.querySelector(".feature-icon");
    if (!icon) return;
    gsap.from(icon, {
      scale: 0, rotation: -15, opacity: 0,
      duration: 0.7, ease: "back.out(2.5)",
      delay: i * 0.1,
      scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
    });

    // Hover float
    card.addEventListener("mouseenter", () => {
      gsap.to(icon, { y: -10, rotation: 8, scale: 1.1, duration: 0.4, ease: "back.out(2)" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(icon, { y: 0, rotation: 0, scale: 1, duration: 0.4, ease: "power2.out" });
    });
  });
}

/* ============================================================
   7. PROJECT CARDS
   ============================================================ */
function initProjectCards() {
  const containers = document.querySelectorAll(".projects-container");

  containers.forEach((container) => {
    const title = container.querySelector(".section-title");
    const cards = container.querySelectorAll(".project-card");

    if (title) {
      // Title + decorative line
      gsap.from(title, {
        opacity: 0, x: -50, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none none" },
      });
    }

    cards.forEach((card, i) => {
      // Alternating entrance: odd from left, even from right
      const fromX = i % 2 === 0 ? -60 : 60;
      gsap.from(card, {
        opacity: 0, x: fromX, y: 40, scale: 0.92, rotationY: i % 2 === 0 ? -6 : 6,
        duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
      });

      // Tilt on mouse move
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width  - 0.5;
        const cy = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(card, {
          rotationY: cx * 10, rotationX: -cy * 6,
          transformPerspective: 800,
          duration: 0.4, ease: "power2.out",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationY: 0, rotationX: 0,
          duration: 0.6, ease: "elastic.out(1, 0.5)",
        });
      });
    });
  });
}

/* ============================================================
   8. ABOUT SECTION
   ============================================================ */
function initAboutSection() {
  const section = document.querySelector(".about");
  if (!section) return;

  const h2    = section.querySelector("h2");
  const ps    = section.querySelectorAll("p");
  const items = section.querySelectorAll("li");
  const img   = section.querySelector(".about-image");
  const ghLink = section.querySelector("a[href*='github']");

  // Heading reveal
  if (h2) {
    gsap.from(h2, {
      opacity: 0, y: 50, skewX: -4,
      duration: 0.9, ease: "power4.out",
      scrollTrigger: { trigger: h2, start: "top 88%", toggleActions: "play none none none" },
    });
  }

  // Paragraphs
  gsap.from(ps, {
    opacity: 0, y: 30, stagger: 0.15,
    duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
  });

  // List items stagger with left slide
  gsap.from(items, {
    opacity: 0, x: -50, stagger: 0.1,
    duration: 0.6, ease: "power3.out",
    scrollTrigger: {
      trigger: section.querySelector("ul"),
      start: "top 85%", toggleActions: "play none none none",
    },
  });

  // Image reveal with clip path
  if (img) {
    gsap.from(img, {
      clipPath: "inset(0 100% 0 0)",
      duration: 1.2, ease: "power4.inOut",
      scrollTrigger: { trigger: img, start: "top 80%", toggleActions: "play none none none" },
    });

    // Parallax image
    gsap.to(img, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5,
      },
    });
  }

  // GitHub button pulse
  if (ghLink) {
    gsap.to(ghLink, {
      scale: 1.06, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
  }
}

/* ============================================================
   9. SOCIAL MEDIA SECTION
   ============================================================ */
function initSocialSection() {
  const section = document.querySelector(".social-media");
  if (!section) return;

  const title = section.querySelector("h2");
  const links = section.querySelectorAll(".menu-links a");

  if (title) {
    gsap.from(title, {
      opacity: 0, y: 50, scale: 0.9,
      duration: 0.9, ease: "back.out(1.5)",
      scrollTrigger: { trigger: title, start: "top 85%", toggleActions: "play none none none" },
    });
  }

  // Fan-out entrance
  links.forEach((link, i) => {
    const angle = (i - links.length / 2) * 12;
    gsap.from(link, {
      opacity: 0, y: 60, rotation: angle, scale: 0.6,
      duration: 0.8, ease: "back.out(2)",
      delay: i * 0.08,
      scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
    });

    // Bounce on hover
    link.addEventListener("mouseenter", () => {
      gsap.to(link, { y: -12, scale: 1.05, duration: 0.35, ease: "back.out(3)" });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(link, { y: 0, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ============================================================
   10. FOOTER
   ============================================================ */
function initFooter() {
  const footer = document.querySelector("footer");
  if (!footer) return;

  gsap.from(footer.querySelectorAll(".footer-column"), {
    opacity: 0, y: 40, stagger: 0.12, duration: 0.7, ease: "power3.out",
    scrollTrigger: { trigger: footer, start: "top 90%", toggleActions: "play none none none" },
  });

  gsap.from(footer.querySelector(".copyright"), {
    opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: footer, start: "top 85%", toggleActions: "play none none none" },
  });
}

/* ============================================================
   11. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  Object.assign(bar.style, {
    position: "fixed", top: "0", left: "0", height: "2.5px",
    width: "0%", zIndex: "99997",
    background: "linear-gradient(90deg, #a88bff, #e8c96b, #5de4c7)",
    pointerEvents: "none",
    boxShadow: "0 0 10px rgba(168,139,255,0.7)",
  });
  document.body.appendChild(bar);

  gsap.to(bar, {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
}

/* ============================================================
   12. MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const magnets = document.querySelectorAll(".hero-btn, .btn-primary, .nav-btn");

  magnets.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r  = btn.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width  / 2;
      const cy = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, {
        x: cx * 0.35, y: cy * 0.35,
        duration: 0.4, ease: "power2.out",
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ============================================================
   13. SMOOTH NAV SCROLL (enhanced with GSAP)
   ============================================================ */
function initSmoothNavScroll() {
  const allNavLinks = document.querySelectorAll('[href^="#"]');
  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#" || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 1.2, ease: "power4.inOut",
      });
    });
  });
}

/* ============================================================
   14. FLOATING AMBIENT ORBS (decorative)
   ============================================================ */
function initFloatingOrbs() {
  const orbsData = [
    { color: "#a88bff", size: 380, x: "10%",  y: "20%",  opacity: 0.05 },
    { color: "#e8c96b", size: 260, x: "80%",  y: "60%",  opacity: 0.04 },
    { color: "#5de4c7", size: 200, x: "50%",  y: "85%",  opacity: 0.045 },
    { color: "#a88bff", size: 180, x: "90%",  y: "10%",  opacity: 0.035 },
  ];

  const container = document.createElement("div");
  container.id = "arch-orbs";
  Object.assign(container.style, {
    position: "fixed", inset: "0", zIndex: "0", pointerEvents: "none", overflow: "hidden",
  });

  orbsData.forEach((orb, i) => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      width:  orb.size + "px",
      height: orb.size + "px",
      left:   orb.x,
      top:    orb.y,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
      opacity: orb.opacity,
      filter: "blur(60px)",
    });
    container.appendChild(el);

    // Float animation
    gsap.to(el, {
      x: (i % 2 === 0 ? 60 : -60),
      y: (i % 2 === 0 ? -40 : 50),
      duration: 8 + i * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 1.2,
    });
  });

  document.body.appendChild(container);
}

/* ============================================================
   15. SECTION DIVIDER LINES (scroll-drawn)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const line = document.createElement("div");
      Object.assign(line.style, {
        position: "absolute", bottom: "0", left: "50%",
        transform: "translateX(-50%)",
        height: "1px", width: "0%",
        background: "linear-gradient(90deg, transparent, rgba(168,139,255,0.3), transparent)",
        pointerEvents: "none",
      });
      section.style.position = "relative";
      section.appendChild(line);

      gsap.to(line, {
        width: "80%",
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "bottom 95%",
          toggleActions: "play none none none",
        },
      });
    });
  }, 3000);
});