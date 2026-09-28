(function () {
  "use strict";

  /* ============================================================
     EmailJS
     ============================================================ */
  var EMAILJS_SERVICE_ID = "service_b6jrrxj";
  var EMAILJS_VISIT_TEMPLATE_ID = "template_eebywzc";
  var EMAILJS_CONTACT_TEMPLATE_ID = "template_f9xfv5e";

  if (window.emailjs) {
    emailjs.init({ publicKey: "TE_mllCX35gV37ipK" });
  }

  /* ============================================================
     Footer year
     ============================================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Theme
     ============================================================ */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "helpdev-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  try {
    var savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) applyTheme(savedTheme);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) applyTheme("light");
  } catch (e) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  /* ============================================================
     Mobile menu
     ============================================================ */
  var mobileToggle = document.getElementById("mobileToggle");
  var navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", function () {
      mobileToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ============================================================
     Header scroll state
     ============================================================ */
  var header = document.querySelector(".site-header");
  var lastScroll = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 50);
    lastScroll = y;
  }, { passive: true });

  /* ============================================================
     Active nav highlighting
     ============================================================ */
  var allNavLinks = document.querySelectorAll("[data-nav]");
  var sectionEls = [];
  allNavLinks.forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    var el = document.getElementById(id);
    if (el) sectionEls.push({ link: link, el: el });
  });

  if ("IntersectionObserver" in window && sectionEls.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          allNavLinks.forEach(function (l) { l.classList.remove("active"); });
          sectionEls.forEach(function (s) {
            if (s.el === entry.target) s.link.classList.add("active");
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sectionEls.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* ============================================================
     Cursor glow
     ============================================================ */
  var cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", function (e) {
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
      cursorGlow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", function () {
      cursorGlow.style.opacity = "0";
    });
  }

  /* ============================================================
     Particle canvas
     ============================================================ */
  var canvas = document.getElementById("particleCanvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = Math.min(80, Math.floor(window.innerWidth / 20));

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    };
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, " + this.opacity + ")";
      ctx.fill();
    };

    for (var i = 0; i < particleCount; i++) particles.push(new Particle());

    function connectParticles() {
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(59, 130, 246, " + (0.08 * (1 - dist / 150)) + ")";
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ============================================================
     GSAP Animations
     ============================================================ */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Hero entrance
    var heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero-badge", { y: 30, opacity: 0, duration: 0.8, delay: 0.2 })
      .from(".hero-name .line", { y: 80, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.4")
      .from(".hero-tagline", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".hero-stats", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-cta", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-visual", { scale: 0.8, opacity: 0, duration: 1.2, ease: "back.out(1.4)" }, "-=1")
      .from(".float-card", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.15 }, "-=0.6")
      .from(".scroll-indicator", { opacity: 0, duration: 0.6 }, "-=0.3");

    // Count-up animation for stats
    document.querySelectorAll(".stat-number[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      gsap.to(el, {
        textContent: target,
        duration: 2,
        delay: 1,
        snap: { textContent: 1 },
        ease: "power2.out"
      });
    });

    // Section header animations
    gsap.utils.toArray(".section-header").forEach(function (header) {
      gsap.from(header.children, {
        scrollTrigger: { trigger: header, start: "top 80%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
      });
    });

    // About section
    gsap.utils.toArray(".anim-slide").forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        x: -40, opacity: 0, duration: 0.8, ease: "power3.out"
      });
    });

    // Cards
    gsap.utils.toArray(".anim-card").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        y: 50, opacity: 0, duration: 0.8, delay: i * 0.15, ease: "power3.out"
      });
    });

    // Project cards
    gsap.utils.toArray(".anim-project").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        y: 60, opacity: 0, duration: 1, delay: i * 0.2, ease: "power3.out"
      });
    });

    // Timeline items
    gsap.utils.toArray(".anim-timeline").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
        x: -60, opacity: 0, duration: 1, delay: i * 0.2, ease: "power3.out"
      });
    });

    // Timeline progress line
    var timelineSec = document.getElementById("experience");
    var timelineProgress = document.getElementById("timelineProgress");
    if (timelineSec && timelineProgress) {
      ScrollTrigger.create({
        trigger: timelineSec,
        start: "top 60%",
        end: "bottom 40%",
        onUpdate: function (self) {
          timelineProgress.style.height = (self.progress * 100) + "%";
        }
      });
    }

    // Skill groups
    gsap.utils.toArray(".anim-skill").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        y: 40, opacity: 0, duration: 0.8, delay: i * 0.1, ease: "power3.out"
      });
    });

    // Award cards
    gsap.utils.toArray(".anim-award").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        x: -30, opacity: 0, duration: 0.6, delay: i * 0.1, ease: "power3.out"
      });
    });

    // Smooth scroll for nav
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          gsap.to(window, { scrollTo: { y: target, offsetY: 72 }, duration: 1, ease: "power3.inOut" });
        }
      });
    });

    // Parallax for avatar
    gsap.to(".avatar-container", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      y: 80, ease: "none"
    });

    // Pill hover wobble (subtle)
    document.querySelectorAll(".pill").forEach(function (pill) {
      pill.addEventListener("mouseenter", function () {
        gsap.to(pill, { scale: 1.08, duration: 0.2, ease: "back.out(2)" });
      });
      pill.addEventListener("mouseleave", function () {
        gsap.to(pill, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }

  /* ============================================================
     Contact links
     ============================================================ */
  var WHATSAPP_NUMBER_REVERSED = "926083163619";
  var INSTAGRAM_USER_REVERSED = "3edaprohg_jarus";
  function reverseStr(s) { return s.split("").reverse().join(""); }

  var whatsappBtn = document.getElementById("whatsappBtn");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", function () {
      var number = reverseStr(WHATSAPP_NUMBER_REVERSED);
      var message = encodeURIComponent("Hi Suraj, I came across your portfolio (helpdev.net/surajworks) and would like to connect.");
      window.open("https://wa.me/" + number + "?text=" + message, "_blank", "noopener");
    });
  }

  var instagramBtn = document.getElementById("instagramBtn");
  if (instagramBtn) {
    instagramBtn.addEventListener("click", function () {
      window.open("https://instagram.com/" + reverseStr(INSTAGRAM_USER_REVERSED), "_blank", "noopener");
    });
  }

  /* ============================================================
     Cookie/visit notice
     ============================================================ */
  var NOTICE_KEY = "helpdev-visit-notice-seen";
  var banner = document.getElementById("cookieBanner");
  var acceptBtn = document.getElementById("cookieAccept");

  function sendVisitNotification() {
    var payload = {
      from_name: "Website Visitor",
      ip_address: "",
      location: "",
      device_info: navigator.userAgent,
      page_url: window.location.href,
      referrer: document.referrer || "(direct)",
      timestamp: new Date().toString()
    };
    fetch("https://ipwho.is/")
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        if (geo && geo.success !== false) {
          payload.ip_address = geo.ip || "";
          payload.location = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");
        }
      })
      .catch(function () {})
      .then(function () {
        if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_VISIT_TEMPLATE_ID) {
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_VISIT_TEMPLATE_ID, payload).catch(function () {});
        }
      });
  }

  try {
    if (banner && !localStorage.getItem(NOTICE_KEY)) {
      requestAnimationFrame(function () {
        setTimeout(function () { banner.classList.add("visible"); }, 800);
      });
    }
  } catch (e) {}

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      try { localStorage.setItem(NOTICE_KEY, "seen"); } catch (e) {}
      banner.classList.remove("visible");
    });
  }

  sendVisitNotification();

  /* ============================================================
     Contact form
     ============================================================ */
  var contactForm = document.getElementById("contactForm");
  var cfStatus = document.getElementById("cf-status");
  var cfSubmit = document.getElementById("cf-submit");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      cfStatus.classList.remove("success", "error");

      if (!window.emailjs) {
        cfStatus.textContent = "Messaging is temporarily unavailable. Please use WhatsApp, LinkedIn, or email directly.";
        cfStatus.classList.add("error");
        return;
      }

      cfSubmit.disabled = true;
      cfStatus.textContent = "Sending…";

      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, contactForm)
        .then(function () {
          cfStatus.textContent = "Message sent — thank you! I’ll get back to you soon.";
          cfStatus.classList.add("success");
          contactForm.reset();
        })
        .catch(function () {
          cfStatus.textContent = "Something went wrong. Please try WhatsApp, LinkedIn, or email directly.";
          cfStatus.classList.add("error");
        })
        .finally(function () { cfSubmit.disabled = false; });
    });
  }
})();
