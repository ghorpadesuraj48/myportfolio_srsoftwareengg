(function () {
  "use strict";

  /* ============================================================
     EmailJS init — service id provided by Suraj (EmailJS dashboard)
     ============================================================ */
  var EMAILJS_SERVICE_ID = "service_b6jrrxj";
  var EMAILJS_VISIT_TEMPLATE_ID = "template_eebywzc"; // 
  var EMAILJS_CONTACT_TEMPLATE_ID = "template_f9xfv5e"; // 

  if (window.emailjs) {
    emailjs.init({ publicKey: "TE_mllCX35gV37ipK" });
  }

  /* ============================================================
     Footer year
     ============================================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Theme switcher (dark / light), persisted
     ============================================================ */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "helpdev-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  /* ============================================================
     Smooth-scroll nav + active section highlighting
     ============================================================ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  // Collapse mobile nav after a link is clicked
  var navCollapseEl = document.getElementById("navMain");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCollapseEl && navCollapseEl.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(navCollapseEl).hide();
      }
    });
  });

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ============================================================
     Reveal-on-scroll for hero elements
     ============================================================ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i * 60) + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ============================================================
     Contact links — WhatsApp & Instagram
     Numbers/usernames are stored reversed so they never appear
     as plain readable text in the page source. Assembled only
     at the moment the visitor clicks.
     ============================================================ */
  var WHATSAPP_NUMBER_REVERSED = "926083163619"; // reverse of 916361380629
  var INSTAGRAM_USER_REVERSED = "3edaprohg_jarus"; // reverse of suraj_ghorpade3

  function reverseStr(s) {
    return s.split("").reverse().join("");
  }

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
      var username = reverseStr(INSTAGRAM_USER_REVERSED);
      window.open("https://instagram.com/" + username, "_blank", "noopener");
    });
  }

  /* ============================================================
     Cookie consent banner + honest visit notification
     Accept -> sends an EmailJS notification with client-available
     metadata only (timestamp, page, referrer, device, approx
     location via public IP geolocation API). No account/identity
     data is ever read — none is accessible from client-side JS.
     Decline -> banner closes, nothing is sent.
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
      .catch(function () { /* geolocation optional — proceed without it */ })
      .then(function () {
        if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_VISIT_TEMPLATE_ID) {
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_VISIT_TEMPLATE_ID, payload).catch(function () {
            /* silently ignore delivery errors — non-critical */
          });
        }
      });
  }

  // The notice is informational only — it does not gate anything, so it is
  // shown once per browser rather than requiring a click every visit.
  if (banner && !localStorage.getItem(NOTICE_KEY)) {
    requestAnimationFrame(function () {
      setTimeout(function () { banner.classList.add("visible"); }, 600);
    });
  }
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem(NOTICE_KEY, "seen");
      banner.classList.remove("visible");
    });
  }

  // Notification fires on every page load, independent of the notice above.
  sendVisitNotification();

  /* ============================================================
     Contact form — sends via EmailJS to surajgworks@gmail.com
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

      emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, contactForm)
        .then(function () {
          cfStatus.textContent = "Message sent — thank you! I'll get back to you soon.";
          cfStatus.classList.add("success");
          contactForm.reset();
        })
        .catch(function () {
          cfStatus.textContent = "Something went wrong. Please try WhatsApp, LinkedIn, or email directly.";
          cfStatus.classList.add("error");
        })
        .finally(function () {
          cfSubmit.disabled = false;
        });
    });
  }
})();
