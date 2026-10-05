"use client";
import { useEffect } from "react";
import type { SiteContent } from "@/lib/content";

/* ---- small inline icons (JSX) ---- */
const Arrow = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H8M17 7v9" /></svg>);
const Magnify = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8.5v5M8.5 11h5" /></svg>);

function catList(projects: SiteContent["projects"]): string[] {
  const out: string[] = [];
  projects.forEach((p) => { if (p.category && out.indexOf(p.category) === -1) out.push(p.category); });
  return out;
}
function initial(title: string) { return (String(title || "?").trim().charAt(0) || "?").toUpperCase(); }

export default function Portfolio({ content: c }: { content: SiteContent }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const on = (t: any, ev: string, fn: any, opt?: any) => { t.addEventListener(ev, fn, opt); cleanups.push(() => t.removeEventListener(ev, fn, opt)); };
    const $ = (id: string) => document.getElementById(id);

    /* theme toggle */
    (function () {
      const btn = $("themeToggle"); if (!btn) return;
      const label = () => { const cur = document.documentElement.getAttribute("data-theme") || "dark"; btn.setAttribute("aria-label", cur === "dark" ? "Switch to light mode" : "Switch to dark mode"); };
      label();
      on(btn, "click", () => { const cur = document.documentElement.getAttribute("data-theme") || "dark"; const next = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); try { localStorage.setItem("theme", next); } catch {} label(); });
    })();

    /* mobile nav */
    (function () {
      const toggle = $("navToggle"), menu = $("navMenu"); if (!toggle || !menu) return;
      const close = () => { menu.classList.remove("mobile-open"); toggle.setAttribute("aria-expanded", "false"); };
      const open = () => { menu.classList.add("mobile-open"); toggle.setAttribute("aria-expanded", "true"); };
      on(toggle, "click", () => toggle.getAttribute("aria-expanded") === "true" ? close() : open());
      on(menu, "click", (e: any) => { if (e.target.closest("a")) close(); });
      on(document, "keydown", (e: any) => { if (e.key === "Escape") close(); });
    })();

    /* sticky nav shadow */
    (function () {
      const nav = $("siteNav"); if (!nav) return;
      const f = () => nav.classList.toggle("scrolled", window.scrollY > 12); f(); on(window, "scroll", f, { passive: true });
    })();

    /* active link */
    (function () {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link[data-section]"));
      if (!links.length || !("IntersectionObserver" in window)) return;
      const map: Record<string, HTMLElement> = {};
      links.forEach((l) => { map[l.getAttribute("data-section")!] = l; });
      const obs = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { links.forEach((l) => l.classList.remove("active")); map[(en.target as HTMLElement).id]?.classList.add("active"); } }), { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(map).forEach((id) => { const s = $(id); if (s) obs.observe(s); });
      cleanups.push(() => obs.disconnect());
    })();

    /* reveal (replay every scroll) */
    (function () {
      const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
      if (!items.length) return;
      if (reduceMotion) { items.forEach((el) => el.classList.add("in-view")); return; }
      const sweep = () => { const vh = window.innerHeight; items.forEach((el) => { const top = el.getBoundingClientRect().top; if (top >= vh * 0.96) el.classList.remove("in-view"); else if (top < vh * 0.88) el.classList.add("in-view"); }); };
      let ticking = false;
      const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { sweep(); ticking = false; }); };
      on(window, "scroll", onScroll, { passive: true }); on(window, "resize", onScroll, { passive: true });
      sweep();
    })();

    /* filters */
    (function () {
      const btns = Array.from(document.querySelectorAll<HTMLButtonElement>(".filter-btn"));
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".project-card"));
      btns.forEach((btn) => on(btn, "click", () => {
        btns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("active"); btn.setAttribute("aria-pressed", "true");
        const cat = btn.getAttribute("data-filter");
        cards.forEach((card) => card.classList.toggle("is-hidden", !(cat === "all" || card.getAttribute("data-category") === cat)));
      }));
    })();

    /* case study modal */
    (function () {
      const modal = $("caseModal"); if (!modal) return;
      const dialog = modal.querySelector<HTMLElement>(".modal-dialog")!;
      const closeBtn = modal.querySelector<HTMLElement>(".modal-close")!;
      let last: HTMLElement | null = null;
      const q = (s: string) => modal.querySelector<HTMLElement>(s)!;
      const open = () => { last = document.activeElement as HTMLElement; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; dialog.scrollTop = 0; closeBtn.focus(); document.addEventListener("keydown", onKey); };
      const close = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); last?.focus(); };
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") return close(); if (e.key === "Tab") { const f = dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])'); if (!f.length) return; const first = f[0], lastf = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastf.focus(); } else if (!e.shiftKey && document.activeElement === lastf) { e.preventDefault(); first.focus(); } } };
      document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => on(card, "click", () => {
        const idx = parseInt(card.getAttribute("data-index") || "-1", 10);
        const p = c.projects[idx]; if (!p) return;
        const art = card.querySelector(".thumb-art");
        q("[data-slot=banner]").innerHTML = art ? art.outerHTML : "";
        q("[data-slot=eyebrow]").textContent = p.category || "";
        q("[data-slot=title]").textContent = p.title || "";
        q("[data-slot=role]").textContent = p.role || "—";
        q("[data-slot=year]").textContent = p.year || "—";
        q("[data-slot=tools]").textContent = p.tools || "—";
        const body = q("[data-slot=sections]"); body.innerHTML = "";
        ([["Overview", p.overview], ["Problem", p.problem], ["Process", p.process], ["Solution", p.solution], ["Result", p.result]] as const).forEach(([h, t]) => { if (!t) return; const w = document.createElement("div"); w.className = "modal-section"; const hh = document.createElement("h3"); hh.textContent = h; const pp = document.createElement("p"); pp.textContent = t; w.appendChild(hh); w.appendChild(pp); body.appendChild(w); });
        open();
      }));
      on(closeBtn, "click", close);
      on(modal.querySelector(".modal-backdrop"), "click", close);
    })();

    /* certificate lightbox */
    (function () {
      const box = $("certLightbox"); if (!box) return;
      const inner = box.querySelector<HTMLElement>(".lightbox-inner")!;
      const img = box.querySelector<HTMLImageElement>("[data-slot=img]")!;
      const cap = box.querySelector<HTMLElement>("[data-slot=cap]")!;
      const pdf = box.querySelector<HTMLAnchorElement>("[data-slot=pdf]")!;
      const closeBtn = box.querySelector<HTMLElement>(".lightbox-close")!;
      let last: HTMLElement | null = null;
      const open = (src: string, title: string, pdfHref: string) => { last = document.activeElement as HTMLElement; img.src = src; img.alt = title || "Certificate"; cap.textContent = title || ""; if (pdfHref) { pdf.href = pdfHref; pdf.style.display = ""; } else pdf.style.display = "none"; box.classList.add("open"); box.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; closeBtn.focus(); document.addEventListener("keydown", onKey); };
      const close = () => { box.classList.remove("open"); box.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); img.src = ""; last?.focus(); };
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") return close(); if (e.key === "Tab") { const f = inner.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"); if (!f.length) return; const first = f[0], lastf = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastf.focus(); } else if (!e.shiftKey && document.activeElement === lastf) { e.preventDefault(); first.focus(); } } };
      document.querySelectorAll<HTMLElement>(".cert-card[data-cert]").forEach((card) => on(card, "click", () => open(card.getAttribute("data-cert")!, card.getAttribute("data-title") || "", card.getAttribute("data-pdf") || "")));
      on(closeBtn, "click", close);
      on(box.querySelector(".lightbox-backdrop"), "click", close);
    })();

    /* contact form */
    (function () {
      const form = $("contactForm") as HTMLFormElement | null; if (!form) return;
      const status = form.querySelector<HTMLElement>(".form-status")!;
      const EMAIL = c.contact.email || "";
      const ENDPOINT = c.contact.formEndpoint || "";
      const setErr = (field: HTMLElement, msg: string) => { const wrap = field.closest(".field")!; wrap.classList.toggle("invalid", !!msg); const el = wrap.querySelector(".error-msg"); if (el) el.textContent = msg || ""; };
      const validate = () => { let ok = true; const n = form.elements.namedItem("name") as HTMLInputElement, e = form.elements.namedItem("email") as HTMLInputElement, m = form.elements.namedItem("message") as HTMLTextAreaElement; if (!n.value.trim()) { setErr(n, "Name is required."); ok = false; } else setErr(n, ""); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())) { setErr(e, "Please enter a valid email."); ok = false; } else setErr(e, ""); if (m.value.trim().length < 10) { setErr(m, "Message must be at least 10 characters."); ok = false; } else setErr(m, ""); return ok; };
      on(form, "submit", (ev: Event) => {
        ev.preventDefault(); status.className = "form-status"; status.textContent = "";
        if (!validate()) { status.className = "form-status err"; status.textContent = "Please check the highlighted fields."; return; }
        const payload = { name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(), email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(), message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim() };
        if (ENDPOINT) {
          const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!; btn.disabled = true; status.textContent = "Sending…";
          fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload) })
            .then((r) => { if (!r.ok) throw new Error(); form.reset(); status.className = "form-status ok"; status.textContent = "Thanks! Your message has been sent."; })
            .catch(() => { status.className = "form-status err"; status.textContent = "Couldn't send. Please email me at " + EMAIL + "."; })
            .finally(() => { btn.disabled = false; });
        } else {
          window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Project Inquiry — " + payload.name) + "&body=" + encodeURIComponent(payload.message + "\n\n— " + payload.name + " (" + payload.email + ")");
          status.className = "form-status ok"; status.textContent = "Opening your email app…"; form.reset();
        }
      });
      ["name", "email", "message"].forEach((n) => { const el = form.elements.namedItem(n) as HTMLElement; if (el) on(el, "input", () => setErr(el, "")); });
    })();

    /* back to top */
    (function () {
      const btn = $("backToTop"); if (!btn) return;
      const f = () => btn.classList.toggle("show", window.scrollY > 600); f(); on(window, "scroll", f, { passive: true });
      on(btn, "click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
    })();

    return () => cleanups.forEach((fn) => fn());
  }, [c]);

  const cats = catList(c.projects);
  const year = new Date().getFullYear();

  return (
    <>
      <div className="shell">
        {/* NAV */}
        <nav className="site-nav" id="siteNav" aria-label="Main navigation">
          <div className="nav-inner">
            <a className="brand" href="#top" aria-label={`${c.brand} — home`}><span className="brand-dot" aria-hidden /> {c.brand}</a>
            <ul className="nav-menu" id="navMenu">
              <li><a className="nav-link" href="#top" data-section="top">Home</a></li>
              <li><a className="nav-link" href="#about" data-section="about">About</a></li>
              <li><a className="nav-link" href="#project" data-section="project">Project</a></li>
              <li><a className="nav-link" href="#contact" data-section="contact">Contact</a></li>
              <li className="nav-cta-mobile"><a className="btn btn-solid" href="#contact" style={{ width: "100%" }}>Let&apos;s Talk</a></li>
            </ul>
            <div className="nav-right">
              <button className="theme-toggle" id="themeToggle" type="button" aria-label="Switch theme">
                <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></svg>
                <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" /></svg>
              </button>
              <a className="btn btn-solid nav-cta desktop-only" href="#contact">Let&apos;s Talk</a>
              <button className="nav-toggle" id="navToggle" aria-label="Open menu" aria-controls="navMenu" aria-expanded="false">
                <svg className="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                <svg className="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <header className="card-surface section hero" id="top" style={{ marginTop: 16 }}>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-eyebrow"><span className="brand-dot" aria-hidden /> {c.hero.role}</p>
              <h1 className="hero-name"><span className="line fill">{c.hero.name1}</span><span className="line outline">{c.hero.name2}</span></h1>
              <p className="hero-desc">{c.hero.desc}</p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="#contact">Let&apos;s Collaborate <span className="btn-arrow"><Arrow /></span></a>
                <a className="btn btn-outline" href="/docs/CV-Lazuardi-Pandu.pdf" download>Download CV <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg></a>
                <a className="btn btn-outline" href="#project">View Projects</a>
              </div>
              <ul className="socials">
                <li><a className="social-pill" href={c.socials.dribbble} target="_blank" rel="noopener" aria-label="Dribbble (opens in a new tab)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><circle cx="12" cy="12" r="10" /><path d="M5 8c4 3 9 4 14 3M8 3.5c4 4.5 6 9.5 6.5 16.5M20 13c-6-2-11 .5-13 5" /></svg> Dribbble</a></li>
                <li><a className="social-pill" href={c.socials.instagram} target="_blank" rel="noopener" aria-label="Instagram (opens in a new tab)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg> Instagram</a></li>
                <li><a className="social-pill" href={c.socials.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn (opens in a new tab)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M7 10v7M7 7.2v.01M11 17v-4a2 2 0 0 1 4 0v4" strokeLinecap="round" /></svg> LinkedIn</a></li>
                <li><a className="social-pill" href={c.socials.behance} target="_blank" rel="noopener" aria-label="Behance (opens in a new tab)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path d="M3 7h4.5a2.2 2.2 0 0 1 0 4.5H3zM3 11.5h5a2.4 2.4 0 0 1 0 5H3zM14.5 8.5H20M21 14.2a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM15 14.2h6" strokeLinecap="round" strokeLinejoin="round" /></svg> Behance</a></li>
              </ul>
            </div>
            <div className="hero-photo reveal"><img src="/img/profile.svg" alt={`Photo of ${c.brand}`} width={440} height={550} /></div>
          </div>
        </header>

        {/* MARQUEE */}
        <div className="marquee card-surface" style={{ marginTop: 16, borderRadius: "var(--radius-xl)" }} aria-hidden>
          <div className="marquee-track">
            {[...c.about.skills, ...c.about.skills].map((s, i) => (<span className="marquee-item" key={i}>{s}</span>))}
          </div>
        </div>

        {/* ABOUT */}
        <section className="card-surface section" id="about" style={{ marginTop: 16 }} aria-labelledby="about-title">
          <div className="section-head reveal">
            <p className="section-label"><span className="dash" /> 01 — About</p>
            <h2 className="section-title" id="about-title">About me.</h2>
          </div>
          <div className="about-grid">
            <p className="about-lead reveal">{c.about.lead}</p>
            <div className="about-body reveal" data-delay="1">
              {c.about.body.map((p, i) => (<p key={i}>{p}</p>))}
              <h3 className="about-subtitle">Skills</h3>
              <ul className="skill-chips">{c.about.skills.map((s, i) => (<li className="skill-chip" key={i}>{s}</li>))}</ul>
            </div>
          </div>
          <div className="about-more" id="aboutMore" aria-hidden="true">
            <div className="about-more-inner">
              <h3 className="about-subtitle">Education</h3>
              <div className="edu-list">
                {c.about.education.map((e, i) => (<div className="edu-item" key={i}><span className="edu-year">{e.year}</span><div><p className="edu-school">{e.school}</p><p className="edu-note">{e.note}</p></div></div>))}
              </div>
              <p className="about-soft">{c.about.soft}</p>
            </div>
          </div>
          <button className="btn btn-outline about-toggle reveal" id="aboutToggle" type="button" aria-expanded="false" aria-controls="aboutMore"><span className="about-toggle-label">See more</span><svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
        </section>

        {/* PROJECT */}
        <section className="card-surface section" id="project" style={{ marginTop: 16 }} aria-labelledby="project-title">
          <div className="section-head reveal">
            <p className="section-label"><span className="dash" /> 02 — Selected Project</p>
            <h2 className="section-title" id="project-title">Projects I&apos;m proud of.</h2>
            <p className="section-intro">Click a project to open the case study: problem, process, solution, and result.</p>
          </div>
          <div className="work-filters reveal" role="group" aria-label="Filter projects by category">
            <button className="filter-btn active" data-filter="all" aria-pressed="true">All</button>
            {cats.map((cat) => (<button className="filter-btn" data-filter={cat} aria-pressed="false" key={cat}>{cat}</button>))}
          </div>
          <div className="work-grid">
            {c.projects.map((p, i) => (
              <button className="project-card reveal" data-index={i} data-category={p.category} aria-label={`Open ${p.title} case study`} key={i}>
                <div className="project-thumb">
                  {p.image ? (
                    <img className="thumb-art" src={p.image} alt={p.title} loading="lazy" />
                  ) : (
                    <svg className="thumb-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={p.title}>
                      <defs><linearGradient id={`ph-${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ededed" /><stop offset="1" stopColor="#cfcfcf" /></linearGradient></defs>
                      <rect width="400" height="300" fill={`url(#ph-${i})`} />
                      <text x="200" y="196" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="132" fontWeight="700" fill="#0a0a0a" opacity="0.92">{initial(p.title)}</text>
                    </svg>
                  )}
                  {p.category && <span className="thumb-badge">{p.category}</span>}
                  <span className="thumb-open" aria-hidden><Arrow /></span>
                </div>
                <div className="project-meta"><h3 className="project-title">{p.title}</h3><span className="project-cat">{p.year}</span></div>
              </button>
            ))}
          </div>
        </section>

        {/* CERTIFICATES */}
        <section className="card-surface section" id="certificates" style={{ marginTop: 16 }} aria-labelledby="cert-title">
          <div className="section-head reveal">
            <p className="section-label"><span className="dash" /> 03 — Certifications</p>
            <h2 className="section-title" id="cert-title">Certificates &amp; achievements.</h2>
            <p className="section-intro">Click a certificate to view it full-size. And there&apos;s something I&apos;m cooking up 👀</p>
          </div>
          <div className="cert-grid">
            {c.certificates.map((ct, i) => ct.comingSoon ? (
              <div className="cert-card cert-soon reveal" aria-label={`${ct.issuer} — coming soon`} key={i}>
                <span className="cert-thumb">
                  <span className="cert-badge-soon">Coming Soon</span>
                  {ct.image ? (<img src={ct.image} alt={ct.issuer} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (
                    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label={ct.issuer}>
                      <defs><linearGradient id={`cs-${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d2e50" /><stop offset="1" stopColor="#0a1c33" /></linearGradient></defs>
                      <rect width="400" height="250" fill={`url(#cs-${i})`} />
                      <text x="200" y="140" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="72" fontWeight="700" fill="#f4c430">{ct.issuer}</text>
                      <text x="200" y="178" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="15" fill="#cdd8e6">{ct.name}</text>
                    </svg>
                  )}
                </span>
                <span className="cert-info"><span className="cert-issuer">{ct.issuer}</span><span className="cert-name">{ct.name}</span><span className="cert-meta">{ct.meta}</span></span>
              </div>
            ) : (
              <button className="cert-card reveal" data-cert={ct.image} data-title={ct.title} data-pdf={ct.pdf} aria-label={`View ${ct.name}`} key={i}>
                <span className="cert-thumb">
                  {ct.image ? (<img src={ct.image} alt={ct.name} loading="lazy" />) : (
                    <svg className="thumb-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={ct.name}><defs><linearGradient id={`cph-${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ededed" /><stop offset="1" stopColor="#cfcfcf" /></linearGradient></defs><rect width="400" height="300" fill={`url(#cph-${i})`} /><text x="200" y="196" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontSize="132" fontWeight="700" fill="#0a0a0a">{initial(ct.name)}</text></svg>
                  )}
                  <span className="cert-view" aria-hidden><Magnify /> View certificate</span>
                </span>
                <span className="cert-info"><span className="cert-issuer">{ct.issuer}</span><span className="cert-name">{ct.name}</span><span className="cert-meta">{ct.meta}</span></span>
              </button>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="card-surface section" id="contact" style={{ marginTop: 16 }} aria-labelledby="contact-title">
          <div className="contact-wrap">
            <div className="contact-aside reveal">
              <p className="section-label"><span className="dash" /> 04 — Contact</p>
              <h2 className="section-title" id="contact-title">Got a project? Let&apos;s talk.</h2>
              <p className="contact-lead">Open to collaboration, freelance projects, or internship opportunities.</p>
              <div className="contact-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg><a href={`mailto:${c.contact.email}`}>{c.contact.email}</a></div>
              <div className="contact-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><circle cx="12" cy="10" r="3" /><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" /></svg><span>{c.contact.location}</span></div>
              <div className="contact-line" style={{ borderBottom: "none" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><span>{c.contact.reply}</span></div>
            </div>
            <div className="reveal" data-delay="1">
              <form className="contact-form" id="contactForm" noValidate>
                <div className="field"><label htmlFor="cf-name">Name</label><input type="text" id="cf-name" name="name" autoComplete="name" placeholder="Your name" required /><span className="error-msg" aria-live="polite" /></div>
                <div className="field"><label htmlFor="cf-email">Email</label><input type="email" id="cf-email" name="email" autoComplete="email" placeholder="you@example.com" required /><span className="error-msg" aria-live="polite" /></div>
                <div className="field"><label htmlFor="cf-message">Message</label><textarea id="cf-message" name="message" placeholder="Tell me about your project or idea…" required /><span className="error-msg" aria-live="polite" /></div>
                <button type="submit" className="btn btn-solid" style={{ width: "100%" }}>Send Message <span className="btn-arrow"><Arrow /></span></button>
                <p className="form-status" role="status" aria-live="polite" />
                <p className="form-note">By sending, you agree your data is used only to reply to this message.</p>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">{c.brand}</div>
              <p className="section-intro" style={{ marginTop: 8 }}>{c.footer.tagline}</p>
            </div>
            <ul className="footer-links">
              <li><a href="#top">Home</a></li><li><a href="#about">About</a></li><li><a href="#project">Project</a></li><li><a href="#contact">Contact</a></li>
              <li><a href={c.socials.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
              <li><a href={c.socials.dribbble} target="_blank" rel="noopener">Dribbble</a></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <span>© {year} {c.brand}. All rights reserved.</span>
            <a className="to-top" href="#top">Back to top <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      <div className="modal" id="caseModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
        <div className="modal-backdrop" />
        <div className="modal-dialog" role="document">
          <button className="modal-close" aria-label="Close case study"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
          <div className="modal-banner" data-slot="banner" />
          <div className="modal-body">
            <p className="modal-eyebrow" data-slot="eyebrow" />
            <h2 className="modal-title" id="modalTitle" data-slot="title" />
            <div className="modal-facts">
              <div className="modal-fact"><div className="k">Role</div><div className="v" data-slot="role" /></div>
              <div className="modal-fact"><div className="k">Year</div><div className="v" data-slot="year" /></div>
              <div className="modal-fact"><div className="k">Tools</div><div className="v" data-slot="tools" /></div>
            </div>
            <div data-slot="sections" />
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <div className="lightbox" id="certLightbox" role="dialog" aria-modal="true" aria-label="Certificate preview" aria-hidden="true">
        <div className="lightbox-backdrop" />
        <div className="lightbox-inner" role="document">
          <button className="lightbox-close" aria-label="Close preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lightbox-img" data-slot="img" src="" alt="" />
          <p className="lightbox-cap" data-slot="cap" />
          <div className="lightbox-actions"><a data-slot="pdf" href="#" target="_blank" rel="noopener">Open original PDF ↗</a></div>
        </div>
      </div>

      <button className="back-to-top" id="backToTop" type="button" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></button>

      {/* about see-more toggle wiring */}
      <AboutToggleScript />
    </>
  );
}

/* tiny client effect for the About "See more" toggle */
function AboutToggleScript() {
  useEffect(() => {
    const btn = document.getElementById("aboutToggle");
    const more = document.getElementById("aboutMore");
    if (!btn || !more) return;
    const label = btn.querySelector(".about-toggle-label");
    const fn = () => { const open = more.classList.toggle("open"); btn.setAttribute("aria-expanded", open ? "true" : "false"); more.setAttribute("aria-hidden", open ? "false" : "true"); if (label) label.textContent = open ? "See less" : "See more"; };
    btn.addEventListener("click", fn);
    return () => btn.removeEventListener("click", fn);
  }, []);
  return null;
}
