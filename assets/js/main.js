/* =====================================================================
   Lazuardi Pandu — Portfolio
   Interaksi: navigasi mobile, sticky nav, active link, reveal on scroll,
   filter karya, modal studi kasus (accessible), form kontak, back-to-top.
   Vanilla JS — tanpa dependency.
   ===================================================================== */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    initTheme();
    initMobileNav();
    initStickyNav();
    initActiveLink();
    initReveal();
    initFilters();
    initCaseModal();
    initCertLightbox();
    initAboutToggle();
    initContactForm();
    initBackToTop();
  });

  /* ---- About: tombol "See more" (buka/tutup pendidikan) ---- */
  function initAboutToggle() {
    var btn = document.getElementById("aboutToggle");
    var more = document.getElementById("aboutMore");
    if (!btn || !more) return;
    var label = btn.querySelector(".about-toggle-label");
    btn.addEventListener("click", function () {
      var open = more.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      more.setAttribute("aria-hidden", open ? "false" : "true");
      if (label) label.textContent = open ? "See less" : "See more";
    });
  }

  /* ---- Mode gelap / terang (default: gelap) ---- */
  function initTheme() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    function label() {
      var cur = document.documentElement.getAttribute("data-theme") || "dark";
      btn.setAttribute("aria-label", cur === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    label();
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || "dark";
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  }

  /* ---- Tahun otomatis di footer ---- */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---- Menu mobile (hamburger) ---- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("mobile-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      menu.classList.add("mobile-open");
      toggle.setAttribute("aria-expanded", "true");
    }
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") close();
      else open();
    });
    // Tutup saat klik link atau tekan ESC
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---- Bayangan navbar saat scroll ---- */
  function initStickyNav() {
    var nav = document.getElementById("siteNav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Highlight link nav sesuai section terlihat ---- */
  function initActiveLink() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link[data-section]"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("data-section")] = l; });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var active = map[en.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
  }

  /* ---- Reveal on scroll ----
     Pakai "sweep" berbasis posisi (bukan hanya IntersectionObserver) supaya
     tidak ada konten yang tersangkut tak terlihat saat scroll cepat atau saat
     lompat lewat anchor link (mis. klik menu "Experience"). */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (reduceMotion) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    function sweep() {
      var vh = window.innerHeight;
      var remaining = false;
      items.forEach(function (el) {
        if (el.classList.contains("in-view")) return;
        remaining = true;
        // Tampilkan begitu bagian atas elemen mendekati area pandang.
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in-view");
      });
      return remaining;
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { sweep(); ticking = false; });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", sweep);
    sweep(); // reveal yang sudah terlihat saat awal
  }

  /* ---- Filter karya berdasarkan kategori ---- */
  function initFilters() {
    var btns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        var cat = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = cat === "all" || card.getAttribute("data-category") === cat;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---- Modal studi kasus (accessible) ---- */
  function initCaseModal() {
    var modal = document.getElementById("caseModal");
    if (!modal) return;
    var dialog = modal.querySelector(".modal-dialog");
    var closeBtn = modal.querySelector(".modal-close");
    var lastFocused = null;

    // Ambil data studi kasus dari <script type="application/json">
    var data = {};
    try {
      var raw = document.getElementById("casesData");
      if (raw) data = JSON.parse(raw.textContent);
    } catch (err) { /* biarkan kosong bila JSON invalid */ }

    function fillAndOpen(id, art) {
      var c = data[id];
      if (!c) return;
      modal.querySelector("[data-slot=banner]").innerHTML = art || "";
      modal.querySelector("[data-slot=eyebrow]").textContent = c.category || "";
      modal.querySelector("[data-slot=title]").textContent = c.title || "";
      modal.querySelector("[data-slot=role]").textContent = c.role || "—";
      modal.querySelector("[data-slot=year]").textContent = c.year || "—";
      modal.querySelector("[data-slot=tools]").textContent = c.tools || "—";
      var body = modal.querySelector("[data-slot=sections]");
      body.innerHTML = "";
      (c.sections || []).forEach(function (s) {
        var wrap = document.createElement("div");
        wrap.className = "modal-section";
        var h = document.createElement("h3");
        h.textContent = s.h;
        var p = document.createElement("p");
        p.textContent = s.p;
        wrap.appendChild(h); wrap.appendChild(p);
        body.appendChild(wrap);
      });
      open();
    }

    function open() {
      lastFocused = document.activeElement;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      dialog.scrollTop = 0;
      closeBtn.focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (lastFocused) lastFocused.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") trapFocus(e);
    }
    function trapFocus(e) {
      var f = dialog.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    // Pasang trigger di tiap kartu
    document.querySelectorAll(".project-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var art = card.querySelector(".thumb-art");
        fillAndOpen(card.getAttribute("data-id"), art ? art.outerHTML : "");
      });
    });
    closeBtn.addEventListener("click", close);
    modal.querySelector(".modal-backdrop").addEventListener("click", close);
  }

  /* ---- Lightbox sertifikat (pop-up gambar) ---- */
  function initCertLightbox() {
    var box = document.getElementById("certLightbox");
    if (!box) return;
    var inner = box.querySelector(".lightbox-inner");
    var img = box.querySelector("[data-slot=img]");
    var cap = box.querySelector("[data-slot=cap]");
    var pdf = box.querySelector("[data-slot=pdf]");
    var closeBtn = box.querySelector(".lightbox-close");
    var lastFocused = null;

    function open(src, title, pdfHref) {
      lastFocused = document.activeElement;
      img.src = src;
      img.alt = title || "Sertifikat";
      cap.textContent = title || "";
      if (pdfHref) { pdf.href = pdfHref; pdf.style.display = ""; }
      else { pdf.style.display = "none"; }
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      img.src = "";
      if (lastFocused) lastFocused.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") {
        var f = inner.querySelectorAll('a[href], button:not([disabled])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    document.querySelectorAll(".cert-card[data-cert]").forEach(function (card) {
      card.addEventListener("click", function () {
        open(card.getAttribute("data-cert"), card.getAttribute("data-title"), card.getAttribute("data-pdf"));
      });
    });
    closeBtn.addEventListener("click", close);
    box.querySelector(".lightbox-backdrop").addEventListener("click", close);
  }

  /* ---- Form kontak: validasi + kirim ---- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var status = form.querySelector(".form-status");
    var EMAIL = form.getAttribute("data-email") || "";
    // Ganti dengan endpoint Formspree kamu, mis. "https://formspree.io/f/xxxxxx".
    // Bila dibiarkan kosong, form otomatis pakai fallback mailto (buka aplikasi email).
    var ENDPOINT = form.getAttribute("data-endpoint") || "";

    function setError(field, msg) {
      var wrap = field.closest(".field");
      wrap.classList.toggle("invalid", !!msg);
      var el = wrap.querySelector(".error-msg");
      if (el) el.textContent = msg || "";
    }
    function validate() {
      var ok = true;
      var name = form.elements.name, email = form.elements.email, message = form.elements.message;
      if (!name.value.trim()) { setError(name, "Name is required."); ok = false; } else setError(name, "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Please enter a valid email."); ok = false; } else setError(email, "");
      if (message.value.trim().length < 10) { setError(message, "Message must be at least 10 characters."); ok = false; } else setError(message, "");
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";
      if (!validate()) { status.className = "form-status err"; status.textContent = "Please check the highlighted fields."; return; }

      var payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim()
      };

      // Jika Formspree diset -> kirim via fetch. Jika tidak -> fallback mailto.
      if (ENDPOINT) {
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        status.textContent = "Sending…";
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (r) {
          if (r.ok) {
            form.reset();
            status.className = "form-status ok";
            status.textContent = "Thanks! Your message has been sent.";
          } else {
            throw new Error("bad response");
          }
        }).catch(function () {
          status.className = "form-status err";
          status.textContent = "Couldn't send. Please try again or email me at " + EMAIL + ".";
        }).finally(function () { btn.disabled = false; });
      } else {
        // Fallback: buka aplikasi email pengguna
        var subject = encodeURIComponent("Project Inquiry — " + payload.name);
        var body = encodeURIComponent(payload.message + "\n\n— " + payload.name + " (" + payload.email + ")");
        window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
        status.className = "form-status ok";
        status.textContent = "Opening your email app…";
        form.reset();
      }
    });

    // Bersihkan error saat user mengetik ulang
    ["name", "email", "message"].forEach(function (n) {
      var el = form.elements[n];
      if (el) el.addEventListener("input", function () { setError(el, ""); });
    });
  }

  /* ---- Tombol kembali ke atas ---- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle("show", window.scrollY > 600); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
