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
    applyContent();
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

  /* ---- Terapkan konten dari content-data.js (+ preview draft dari admin) ---- */
  function deepMerge(base, over) {
    if (Array.isArray(over)) return over.slice();
    if (over && typeof over === "object") {
      var out = {};
      var k;
      for (k in base) out[k] = base[k];
      for (k in over) {
        out[k] = (base && typeof base[k] === "object" && !Array.isArray(base[k]) && over[k] && typeof over[k] === "object" && !Array.isArray(over[k]))
          ? deepMerge(base[k], over[k]) : over[k];
      }
      return out;
    }
    return over;
  }
  function getContent() {
    var base = window.SITE_CONTENT || {};
    try {
      var raw = localStorage.getItem("siteContentDraft");
      if (raw) return deepMerge(base, JSON.parse(raw));
    } catch (e) {}
    return base;
  }
  function resolve(obj, path) {
    return path.split(".").reduce(function (o, k) { return (o == null) ? undefined : o[k]; }, obj);
  }
  function applyContent() {
    var c = getContent();
    if (!c) return;
    // Teks sederhana
    document.querySelectorAll("[data-c]").forEach(function (el) {
      var v = resolve(c, el.getAttribute("data-c"));
      if (typeof v === "string") el.textContent = v;
    });
    // Link (href)
    document.querySelectorAll("[data-c-href]").forEach(function (el) {
      var v = resolve(c, el.getAttribute("data-c-href"));
      if (typeof v === "string" && v) el.setAttribute("href", v);
    });
    // Email
    var mail = document.querySelector("[data-c-mail]");
    if (mail && c.contact && c.contact.email) {
      mail.textContent = c.contact.email;
      mail.setAttribute("href", "mailto:" + c.contact.email);
    }
    // Skills
    if (c.about && Array.isArray(c.about.skills)) {
      var sc = document.getElementById("skillChips");
      if (sc) {
        sc.innerHTML = "";
        c.about.skills.forEach(function (s) {
          var li = document.createElement("li");
          li.className = "skill-chip";
          li.textContent = s;
          sc.appendChild(li);
        });
      }
    }
    // Education
    if (c.about && Array.isArray(c.about.education)) {
      var ed = document.getElementById("eduList");
      if (ed) {
        ed.innerHTML = "";
        c.about.education.forEach(function (e) {
          var item = document.createElement("div");
          item.className = "edu-item";
          var y = document.createElement("span");
          y.className = "edu-year";
          y.textContent = e.year || "";
          var box = document.createElement("div");
          var s = document.createElement("p");
          s.className = "edu-school";
          s.textContent = e.school || "";
          var n = document.createElement("p");
          n.className = "edu-note";
          n.textContent = e.note || "";
          box.appendChild(s); box.appendChild(n);
          item.appendChild(y); item.appendChild(box);
          ed.appendChild(item);
        });
      }
    }
    // Form kontak (email + endpoint)
    var form = document.getElementById("contactForm");
    if (form && c.contact) {
      if (c.contact.email) form.setAttribute("data-email", c.contact.email);
      form.setAttribute("data-endpoint", c.contact.formEndpoint || "");
    }
    // Meta title (opsional, ikut role)
    if (c.brand && c.hero && c.hero.role) {
      document.title = c.brand + " — " + c.hero.role;
    }
    renderProjects(c);
    renderCerts(c);
  }

  /* ---- Helper untuk render project & sertifikat dari data ---- */
  function escHtml(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escAttr(s) { return escHtml(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  var _uid = 0;
  function rid() { return "ph" + Date.now().toString(36) + (_uid++); }
  function nodeFromHTML(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function placeholderSVG(title, dark) {
    var initial = (String(title || "?").trim().charAt(0) || "?").toUpperCase();
    var id = rid();
    var c1 = dark ? "#2f2f2f" : "#ededed", c2 = dark ? "#0a0a0a" : "#cfcfcf", tc = dark ? "#ffffff" : "#0a0a0a";
    return '<svg class="thumb-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + escAttr(title) + '">'
      + '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>'
      + '<rect width="400" height="300" fill="url(#' + id + ')"/>'
      + '<text x="200" y="196" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="132" font-weight="700" fill="' + tc + '" opacity="0.92">' + escHtml(initial) + '</text></svg>';
  }
  function mkFilter(val, label, active) {
    var b = document.createElement("button");
    b.className = "filter-btn" + (active ? " active" : "");
    b.setAttribute("data-filter", val);
    b.setAttribute("aria-pressed", active ? "true" : "false");
    b.textContent = label;
    return b;
  }
  function renderProjects(c) {
    var grid = document.getElementById("workGrid"), fw = document.getElementById("workFilters");
    if (!grid || !Array.isArray(c.projects)) return;
    var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>';
    if (fw) {
      var cats = [];
      c.projects.forEach(function (p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category); });
      fw.innerHTML = "";
      fw.appendChild(mkFilter("all", "All", true));
      cats.forEach(function (cat) { fw.appendChild(mkFilter(cat, cat, false)); });
    }
    grid.innerHTML = "";
    c.projects.forEach(function (p, i) {
      var btn = document.createElement("button");
      btn.className = "project-card reveal";
      btn.setAttribute("data-index", i);
      btn.setAttribute("data-category", p.category || "");
      btn.setAttribute("aria-label", "Open " + (p.title || "project") + " case study");
      var thumb = document.createElement("div"); thumb.className = "project-thumb";
      thumb.appendChild(p.image ? nodeFromHTML('<img class="thumb-art" src="' + escAttr(p.image) + '" alt="' + escAttr(p.title) + '" loading="lazy" />') : nodeFromHTML(placeholderSVG(p.title, false)));
      if (p.category) { var badge = document.createElement("span"); badge.className = "thumb-badge"; badge.textContent = p.category; thumb.appendChild(badge); }
      var open = document.createElement("span"); open.className = "thumb-open"; open.setAttribute("aria-hidden", "true"); open.innerHTML = arrow; thumb.appendChild(open);
      var meta = document.createElement("div"); meta.className = "project-meta";
      var h = document.createElement("h3"); h.className = "project-title"; h.textContent = p.title || "";
      var yr = document.createElement("span"); yr.className = "project-cat"; yr.textContent = p.year || "";
      meta.appendChild(h); meta.appendChild(yr);
      btn.appendChild(thumb); btn.appendChild(meta);
      grid.appendChild(btn);
    });
  }
  function comingSoonArt(ct) {
    if (ct.image) return '<img src="' + escAttr(ct.image) + '" alt="' + escAttr(ct.issuer) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover" />';
    var id = rid();
    return '<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + escAttr(ct.issuer) + '">'
      + '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2e50"/><stop offset="1" stop-color="#0a1c33"/></linearGradient></defs>'
      + '<rect width="400" height="250" fill="url(#' + id + ')"/>'
      + '<text x="200" y="140" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="72" font-weight="700" fill="#f4c430">' + escHtml(ct.issuer || "") + '</text>'
      + '<text x="200" y="178" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" fill="#cdd8e6">' + escHtml(ct.name || "") + '</text></svg>';
  }
  function renderCerts(c) {
    var grid = document.getElementById("certGrid");
    if (!grid || !Array.isArray(c.certificates)) return;
    var mag = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8.5v5M8.5 11h5"/></svg>';
    grid.innerHTML = "";
    c.certificates.forEach(function (ct) {
      var info = '<span class="cert-info"><span class="cert-issuer">' + escHtml(ct.issuer) + '</span><span class="cert-name">' + escHtml(ct.name) + '</span><span class="cert-meta">' + escHtml(ct.meta) + '</span></span>';
      if (ct.comingSoon) {
        var div = document.createElement("div");
        div.className = "cert-card cert-soon reveal";
        div.setAttribute("aria-label", (ct.issuer || "Item") + " — coming soon");
        div.innerHTML = '<span class="cert-thumb"><span class="cert-badge-soon">Coming Soon</span>' + comingSoonArt(ct) + '</span>' + info;
        grid.appendChild(div);
      } else {
        var btn = document.createElement("button");
        btn.className = "cert-card reveal";
        if (ct.image) btn.setAttribute("data-cert", ct.image);
        if (ct.title) btn.setAttribute("data-title", ct.title);
        if (ct.pdf) btn.setAttribute("data-pdf", ct.pdf);
        btn.setAttribute("aria-label", "View " + (ct.name || "certificate"));
        var art = ct.image ? '<img src="' + escAttr(ct.image) + '" alt="' + escAttr(ct.name) + '" loading="lazy" />' : placeholderSVG(ct.name, false);
        btn.innerHTML = '<span class="cert-thumb">' + art + '<span class="cert-view" aria-hidden="true">' + mag + ' View certificate</span></span>' + info;
        grid.appendChild(btn);
      }
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
    // Animasi diulang setiap elemen masuk area pandang (bukan sekali saja).
    function sweep() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var top = el.getBoundingClientRect().top;
        if (top >= vh * 0.96) el.classList.remove("in-view");      // masih di bawah layar → siap dianimasikan lagi (di luar layar, mundurnya tak terlihat)
        else if (top < vh * 0.88) el.classList.add("in-view");     // sudah cukup masuk → animasikan masuk
      });
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

    function fillAndOpen(p, art) {
      if (!p) return;
      modal.querySelector("[data-slot=banner]").innerHTML = art || "";
      modal.querySelector("[data-slot=eyebrow]").textContent = p.category || "";
      modal.querySelector("[data-slot=title]").textContent = p.title || "";
      modal.querySelector("[data-slot=role]").textContent = p.role || "—";
      modal.querySelector("[data-slot=year]").textContent = p.year || "—";
      modal.querySelector("[data-slot=tools]").textContent = p.tools || "—";
      var body = modal.querySelector("[data-slot=sections]");
      body.innerHTML = "";
      [["Overview", p.overview], ["Problem", p.problem], ["Process", p.process], ["Solution", p.solution], ["Result", p.result]].forEach(function (s) {
        if (!s[1]) return;
        var wrap = document.createElement("div");
        wrap.className = "modal-section";
        var h = document.createElement("h3"); h.textContent = s[0];
        var pp = document.createElement("p"); pp.textContent = s[1];
        wrap.appendChild(h); wrap.appendChild(pp);
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
        var idx = parseInt(card.getAttribute("data-index"), 10);
        var p = (getContent().projects || [])[idx];
        var art = card.querySelector(".thumb-art");
        fillAndOpen(p, art ? art.outerHTML : "");
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
