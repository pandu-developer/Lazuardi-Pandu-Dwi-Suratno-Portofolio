/* =====================================================================
   Lazuardi Pandu — Portfolio ADMIN dashboard
   Edit konten tanpa buka VS Code. Simpan = preview (localStorage).
   Export = unduh content-data.js untuk di-publish ke hosting.

   CATATAN KEAMANAN: passcode di bawah hanya pengaman DASAR (client-side),
   mudah dilihat orang yang paham teknis. Untuk benar-benar aman, jangan
   upload admin.html ke hosting publik, atau lindungi lewat fitur hosting
   (mis. password protection Netlify). GANTI passcode di bawah ini.
   ===================================================================== */
(function () {
  "use strict";
  var ADMIN_PASSCODE = "pandu2026"; // <-- GANTI passcode ini

  var base = window.SITE_CONTENT || {};

  /* ---------- util ---------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function deepMerge(b, o) {
    if (Array.isArray(o)) return o.slice();
    if (o && typeof o === "object") {
      var out = {}, k;
      for (k in b) out[k] = b[k];
      for (k in o) {
        out[k] = (b && typeof b[k] === "object" && !Array.isArray(b[k]) && o[k] && typeof o[k] === "object" && !Array.isArray(o[k]))
          ? deepMerge(b[k], o[k]) : o[k];
      }
      return out;
    }
    return o;
  }
  function getDraft() {
    try { var r = localStorage.getItem("siteContentDraft"); return r ? JSON.parse(r) : null; } catch (e) { return null; }
  }
  function working() {
    var d = getDraft();
    return d ? deepMerge(clone(base), d) : clone(base);
  }
  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? e.value.trim() : ""; }
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- passcode gate ---------- */
  function initGate() {
    var gate = $("gate"), app = $("app");
    function unlock() { gate.style.display = "none"; app.hidden = false; try { sessionStorage.setItem("adminUnlocked", "1"); } catch (e) {} start(); }
    try { if (sessionStorage.getItem("adminUnlocked") === "1") { unlock(); return; } } catch (e) {}
    function tryUnlock() {
      if ($("gateInput").value === ADMIN_PASSCODE) unlock();
      else { $("gateErr").textContent = "Passcode salah."; $("gateInput").value = ""; }
    }
    $("gateBtn").addEventListener("click", tryUnlock);
    $("gateInput").addEventListener("keydown", function (e) { if (e.key === "Enter") tryUnlock(); });
    $("gateInput").focus();
  }

  /* ---------- skills editor ---------- */
  function skillRow(value) {
    var wrap = document.createElement("div");
    wrap.className = "row-item";
    var input = document.createElement("input");
    input.type = "text"; input.value = value || ""; input.placeholder = "mis. React";
    input.className = "skill-input";
    var del = document.createElement("button");
    del.type = "button"; del.className = "icon-btn"; del.title = "Hapus";
    del.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    del.addEventListener("click", function () { wrap.remove(); });
    wrap.appendChild(input); wrap.appendChild(del);
    return wrap;
  }
  function eduRow(e) {
    e = e || {};
    var wrap = document.createElement("div");
    wrap.className = "edu-row";
    function inp(v, ph, cls) { var i = document.createElement("input"); i.type = "text"; i.value = v || ""; i.placeholder = ph; i.className = cls; return i; }
    var y = inp(e.year, "2024 — Present", "edu-year-i");
    var s = inp(e.school, "Nama sekolah", "edu-school-i");
    var n = inp(e.note, "Keterangan", "edu-note-i");
    var del = document.createElement("button");
    del.type = "button"; del.className = "icon-btn"; del.title = "Hapus";
    del.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    del.addEventListener("click", function () { wrap.remove(); });
    wrap.appendChild(y); wrap.appendChild(s); wrap.appendChild(n); wrap.appendChild(del);
    return wrap;
  }

  /* ---------- populate & collect ---------- */
  function populate(c) {
    c = c || {}; var h = c.hero || {}, so = c.socials || {}, a = c.about || {}, ct = c.contact || {}, f = c.footer || {};
    $("f-brand").value = c.brand || "";
    $("f-theme").value = c.theme || "dark";
    $("f-hero-role").value = h.role || "";
    $("f-hero-name1").value = h.name1 || "";
    $("f-hero-name2").value = h.name2 || "";
    $("f-hero-desc").value = h.desc || "";
    $("f-soc-dribbble").value = so.dribbble || "";
    $("f-soc-instagram").value = so.instagram || "";
    $("f-soc-linkedin").value = so.linkedin || "";
    $("f-soc-behance").value = so.behance || "";
    $("f-about-lead").value = a.lead || "";
    $("f-about-body0").value = (a.body && a.body[0]) || "";
    $("f-about-body1").value = (a.body && a.body[1]) || "";
    $("f-about-soft").value = a.soft || "";
    $("f-c-email").value = ct.email || "";
    $("f-c-location").value = ct.location || "";
    $("f-c-reply").value = ct.reply || "";
    $("f-c-endpoint").value = ct.formEndpoint || "";
    $("f-footer-tagline").value = f.tagline || "";
    // skills
    var se = $("skillsEditor"); se.innerHTML = "";
    (a.skills || []).forEach(function (s) { se.appendChild(skillRow(s)); });
    // education
    var ee = $("eduEditor"); ee.innerHTML = "";
    (a.education || []).forEach(function (e) { ee.appendChild(eduRow(e)); });
  }
  function collect() {
    var skills = [].map.call(document.querySelectorAll(".skill-input"), function (i) { return i.value.trim(); }).filter(Boolean);
    var edu = [].map.call(document.querySelectorAll("#eduEditor .edu-row"), function (r) {
      return {
        year: r.querySelector(".edu-year-i").value.trim(),
        school: r.querySelector(".edu-school-i").value.trim(),
        note: r.querySelector(".edu-note-i").value.trim()
      };
    }).filter(function (e) { return e.year || e.school || e.note; });
    return {
      brand: val("f-brand"),
      theme: val("f-theme") || "dark",
      hero: { role: val("f-hero-role"), name1: val("f-hero-name1"), name2: val("f-hero-name2"), desc: val("f-hero-desc") },
      socials: { dribbble: val("f-soc-dribbble"), instagram: val("f-soc-instagram"), linkedin: val("f-soc-linkedin"), behance: val("f-soc-behance") },
      about: { lead: val("f-about-lead"), body: [val("f-about-body0"), val("f-about-body1")], skills: skills, education: edu, soft: val("f-about-soft") },
      contact: { email: val("f-c-email"), location: val("f-c-location"), reply: val("f-c-reply"), formEndpoint: val("f-c-endpoint") },
      footer: { tagline: val("f-footer-tagline") }
    };
  }

  /* ---------- actions ---------- */
  function saveDraft(silent) {
    try { localStorage.setItem("siteContentDraft", JSON.stringify(collect())); if (!silent) toast("Tersimpan (preview diperbarui) ✓"); return true; }
    catch (e) { toast("Gagal menyimpan."); return false; }
  }
  function exportFile() {
    var header = "/* Portfolio CONTENT — di-generate dari admin.html. Ganti file lama di assets/js/ untuk publish. */\n";
    var text = header + "window.SITE_CONTENT = " + JSON.stringify(collect(), null, 2) + ";\n";
    var blob = new Blob([text], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "content-data.js";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
    toast("content-data.js diunduh ✓");
  }
  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var text = String(reader.result);
        var start = text.indexOf("{"), end = text.lastIndexOf("}");
        if (start === -1 || end === -1) throw new Error("format");
        var obj = JSON.parse(text.slice(start, end + 1));
        populate(deepMerge(clone(base), obj));
        toast("Berhasil diimpor. Klik Simpan untuk terapkan.");
      } catch (e) { toast("File tidak valid (harus content-data.js / .json)."); }
    };
    reader.readAsText(file);
  }
  function preview() { if (saveDraft(true)) { toast("Membuka preview…"); window.open("index.html", "_blank"); } }
  function resetDraft() {
    if (!confirm("Reset semua perubahan ke versi terpublish (content-data.js)? Draft preview akan dihapus.")) return;
    try { localStorage.removeItem("siteContentDraft"); } catch (e) {}
    populate(clone(base));
    toast("Direset ke versi terpublish.");
  }

  /* ---------- admin theme toggle ---------- */
  function initTheme() {
    var btn = $("btnTheme"), sun = btn.querySelector(".icon-sun"), moon = btn.querySelector(".icon-moon");
    function sync() { var d = document.documentElement.getAttribute("data-theme") === "dark"; sun.style.display = d ? "" : "none"; moon.style.display = d ? "none" : ""; }
    sync();
    btn.addEventListener("click", function () {
      var next = (document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  }

  /* ---------- start ---------- */
  function start() {
    populate(working());
    initTheme();
    $("btnSave").addEventListener("click", function () { saveDraft(false); });
    $("btnPreview").addEventListener("click", preview);
    $("btnExport").addEventListener("click", exportFile);
    $("btnReset").addEventListener("click", resetDraft);
    $("addSkill").addEventListener("click", function () { $("skillsEditor").appendChild(skillRow("")); });
    $("addEdu").addEventListener("click", function () { $("eduEditor").appendChild(eduRow({})); });
    $("fileImport").addEventListener("change", function (e) { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ""; });
  }

  document.addEventListener("DOMContentLoaded", initGate);
})();
