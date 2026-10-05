"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent, Project, Certificate, EduItem } from "@/lib/content";

const emptyProject: Project = { title: "", category: "", year: "", image: "", role: "", tools: "", overview: "", problem: "", process: "", solution: "", result: "" };
const emptyCert: Certificate = { issuer: "", name: "", meta: "", image: "", pdf: "", title: "", comingSoon: false };

const DelBtn = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className="icon-btn" title="Hapus" onClick={onClick}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  </button>
);

export default function AdminDashboard({ initial }: { initial: SiteContent }) {
  const [data, setData] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);
  const router = useRouter();

  function showToast(msg: string, err = false) { setToast({ msg, err }); setTimeout(() => setToast(null), 2600); }

  function setPath(path: string, value: any) {
    setData((prev) => {
      const copy: any = structuredClone(prev);
      const keys = path.split(".");
      let o: any = copy;
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
      o[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  // skills
  const setSkill = (i: number, v: string) => setData((d) => { const s = [...d.about.skills]; s[i] = v; return { ...d, about: { ...d.about, skills: s } }; });
  const addSkill = () => setData((d) => ({ ...d, about: { ...d.about, skills: [...d.about.skills, ""] } }));
  const delSkill = (i: number) => setData((d) => ({ ...d, about: { ...d.about, skills: d.about.skills.filter((_, x) => x !== i) } }));
  // education
  const setEdu = (i: number, f: keyof EduItem, v: string) => setData((d) => { const e = structuredClone(d.about.education); e[i][f] = v; return { ...d, about: { ...d.about, education: e } }; });
  const addEdu = () => setData((d) => ({ ...d, about: { ...d.about, education: [...d.about.education, { year: "", school: "", note: "" }] } }));
  const delEdu = (i: number) => setData((d) => ({ ...d, about: { ...d.about, education: d.about.education.filter((_, x) => x !== i) } }));
  // projects
  const setProj = (i: number, f: keyof Project, v: string) => setData((d) => { const p = structuredClone(d.projects); (p[i] as any)[f] = v; return { ...d, projects: p }; });
  const addProj = () => setData((d) => ({ ...d, projects: [...d.projects, { ...emptyProject }] }));
  const delProj = (i: number) => setData((d) => ({ ...d, projects: d.projects.filter((_, x) => x !== i) }));
  // certs
  const setCert = (i: number, f: keyof Certificate, v: any) => setData((d) => { const c = structuredClone(d.certificates); (c[i] as any)[f] = v; return { ...d, certificates: c }; });
  const addCert = () => setData((d) => ({ ...d, certificates: [...d.certificates, { ...emptyCert }] }));
  const delCert = (i: number) => setData((d) => ({ ...d, certificates: d.certificates.filter((_, x) => x !== i) }));

  async function save() {
    setSaving(true);
    const clean: SiteContent = { ...data, about: { ...data.about, skills: data.about.skills.map((s) => s.trim()).filter(Boolean) } };
    try {
      const r = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(clean) });
      if (r.ok) { showToast("Tersimpan & langsung tayang ✓"); router.refresh(); }
      else { showToast("Gagal menyimpan (sesi habis?).", true); }
    } catch { showToast("Gagal menyimpan.", true); }
    setSaving(false);
  }
  async function logout() { await fetch("/api/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }
  function toggleTheme() { const cur = document.documentElement.getAttribute("data-theme") || "dark"; const next = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); try { localStorage.setItem("theme", next); } catch {} }

  return (
    <div className="admin-page">
      <div className="admin-bar">
        <div className="admin-bar-inner">
          <h1><span className="brand-dot" aria-hidden /> Admin — Konten</h1>
          <div className="admin-btns">
            <button className="abtn" type="button" onClick={toggleTheme}>Tema</button>
            <a className="abtn" href="/" target="_blank" rel="noopener">Lihat situs ↗</a>
            <button className="abtn" type="button" onClick={logout}>Logout</button>
            <button className="abtn primary" type="button" onClick={save} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</button>
          </div>
        </div>
      </div>

      <div className="admin-shell">
        <div className="note-box"><b>Auto-publish:</b> klik <b>Simpan</b> → perubahan langsung tersimpan ke database &amp; tayang di situs. Untuk gambar, taruh file di folder <code>public/img/…</code> lalu tulis path-nya (mis. <code>/img/projects/x.jpg</code>), atau pakai URL online.</div>

        {/* Identitas */}
        <div className="admin-card">
          <h2>Identitas</h2>
          <div className="grid2">
            <div className="frow"><label>Nama Brand</label><input value={data.brand} onChange={(e) => setPath("brand", e.target.value)} /></div>
            <div className="frow"><label>Tema default</label><select value={data.theme} onChange={(e) => setPath("theme", e.target.value)}><option value="dark">Gelap (dark)</option><option value="light">Terang (light)</option></select></div>
          </div>
        </div>

        {/* Hero */}
        <div className="admin-card">
          <h2>Hero (Home)</h2>
          <div className="grid2">
            <div className="frow"><label>Role</label><input value={data.hero.role} onChange={(e) => setPath("hero.role", e.target.value)} /></div>
            <div className="frow"><label>Nama (baris 1, isi)</label><input value={data.hero.name1} onChange={(e) => setPath("hero.name1", e.target.value)} /></div>
          </div>
          <div className="frow"><label>Nama (baris 2, outline)</label><input value={data.hero.name2} onChange={(e) => setPath("hero.name2", e.target.value)} /></div>
          <div className="frow"><label>Deskripsi singkat</label><textarea value={data.hero.desc} onChange={(e) => setPath("hero.desc", e.target.value)} /></div>
        </div>

        {/* Sosial */}
        <div className="admin-card">
          <h2>Sosial Media</h2>
          <div className="grid2">
            <div className="frow"><label>Dribbble</label><input value={data.socials.dribbble} onChange={(e) => setPath("socials.dribbble", e.target.value)} /></div>
            <div className="frow"><label>Instagram</label><input value={data.socials.instagram} onChange={(e) => setPath("socials.instagram", e.target.value)} /></div>
            <div className="frow"><label>LinkedIn</label><input value={data.socials.linkedin} onChange={(e) => setPath("socials.linkedin", e.target.value)} /></div>
            <div className="frow"><label>Behance</label><input value={data.socials.behance} onChange={(e) => setPath("socials.behance", e.target.value)} /></div>
          </div>
        </div>

        {/* About */}
        <div className="admin-card">
          <h2>About</h2>
          <div className="frow"><label>Kalimat utama (lead)</label><textarea value={data.about.lead} onChange={(e) => setPath("about.lead", e.target.value)} /></div>
          <div className="frow"><label>Paragraf 1</label><textarea value={data.about.body[0] || ""} onChange={(e) => setPath("about.body.0", e.target.value)} /></div>
          <div className="frow"><label>Paragraf 2</label><textarea value={data.about.body[1] || ""} onChange={(e) => setPath("about.body.1", e.target.value)} /></div>
          <div className="frow"><label>Baris &quot;beyond tech&quot;</label><input value={data.about.soft} onChange={(e) => setPath("about.soft", e.target.value)} /></div>
        </div>

        {/* Skills */}
        <div className="admin-card">
          <h2>Skills</h2>
          <p className="hint">Dipakai juga untuk strip teks berjalan (marquee).</p>
          {data.about.skills.map((s, i) => (
            <div className="row-item" key={i}><input value={s} onChange={(e) => setSkill(i, e.target.value)} placeholder="mis. React" /><DelBtn onClick={() => delSkill(i)} /></div>
          ))}
          <button className="add-btn" type="button" onClick={addSkill}>+ Tambah skill</button>
        </div>

        {/* Education */}
        <div className="admin-card">
          <h2>Pendidikan</h2>
          {data.about.education.map((e, i) => (
            <div className="edu-row" key={i}>
              <input value={e.year} onChange={(ev) => setEdu(i, "year", ev.target.value)} placeholder="2024 — Present" />
              <input value={e.school} onChange={(ev) => setEdu(i, "school", ev.target.value)} placeholder="Nama sekolah" />
              <input value={e.note} onChange={(ev) => setEdu(i, "note", ev.target.value)} placeholder="Keterangan" />
              <DelBtn onClick={() => delEdu(i)} />
            </div>
          ))}
          <button className="add-btn" type="button" onClick={addEdu}>+ Tambah pendidikan</button>
        </div>

        {/* Projects */}
        <div className="admin-card">
          <h2>Projects</h2>
          <p className="hint">Gambar kosong → placeholder gradient otomatis. Kategori dipakai untuk tombol filter.</p>
          {data.projects.map((p, i) => (
            <div className="editor-item" key={i}>
              <div className="editor-item-head"><strong>{p.title || "Project"}</strong><DelBtn onClick={() => delProj(i)} /></div>
              <div className="grid2">
                <div className="frow"><label>Judul</label><input value={p.title} onChange={(e) => setProj(i, "title", e.target.value)} /></div>
                <div className="frow"><label>Kategori</label><input value={p.category} onChange={(e) => setProj(i, "category", e.target.value)} placeholder="Web App / Mobile App / …" /></div>
              </div>
              <div className="grid2">
                <div className="frow"><label>Tahun</label><input value={p.year} onChange={(e) => setProj(i, "year", e.target.value)} /></div>
                <div className="frow"><label>Gambar (path, opsional)</label><input value={p.image} onChange={(e) => setProj(i, "image", e.target.value)} placeholder="/img/projects/x.jpg" /></div>
              </div>
              <div className="grid2">
                <div className="frow"><label>Peran</label><input value={p.role} onChange={(e) => setProj(i, "role", e.target.value)} /></div>
                <div className="frow"><label>Tools</label><input value={p.tools} onChange={(e) => setProj(i, "tools", e.target.value)} /></div>
              </div>
              <div className="frow"><label>Overview</label><textarea value={p.overview} onChange={(e) => setProj(i, "overview", e.target.value)} /></div>
              <div className="frow"><label>Problem</label><textarea value={p.problem} onChange={(e) => setProj(i, "problem", e.target.value)} /></div>
              <div className="frow"><label>Process</label><textarea value={p.process} onChange={(e) => setProj(i, "process", e.target.value)} /></div>
              <div className="frow"><label>Solution</label><textarea value={p.solution} onChange={(e) => setProj(i, "solution", e.target.value)} /></div>
              <div className="frow"><label>Result</label><textarea value={p.result} onChange={(e) => setProj(i, "result", e.target.value)} /></div>
            </div>
          ))}
          <button className="add-btn" type="button" onClick={addProj}>+ Tambah project</button>
        </div>

        {/* Certificates */}
        <div className="admin-card">
          <h2>Certificates</h2>
          <p className="hint">Centang &quot;Coming Soon&quot; untuk kartu belum jadi (seperti estha).</p>
          {data.certificates.map((ct, i) => (
            <div className="editor-item" key={i}>
              <div className="editor-item-head"><strong>{ct.name || ct.issuer || "Certificate"}</strong><DelBtn onClick={() => delCert(i)} /></div>
              <div className="grid2">
                <div className="frow"><label>Penerbit (issuer)</label><input value={ct.issuer} onChange={(e) => setCert(i, "issuer", e.target.value)} /></div>
                <div className="frow"><label>Nama</label><input value={ct.name} onChange={(e) => setCert(i, "name", e.target.value)} /></div>
              </div>
              <div className="frow"><label>Keterangan (meta)</label><input value={ct.meta} onChange={(e) => setCert(i, "meta", e.target.value)} placeholder="mis. Certified · Jul 2025" /></div>
              <div className="grid2">
                <div className="frow"><label>Gambar (path)</label><input value={ct.image} onChange={(e) => setCert(i, "image", e.target.value)} placeholder="/img/certs/x.jpg" /></div>
                <div className="frow"><label>PDF (path, opsional)</label><input value={ct.pdf} onChange={(e) => setCert(i, "pdf", e.target.value)} placeholder="/docs/x.pdf" /></div>
              </div>
              <div className="frow"><label>Judul pop-up (opsional)</label><input value={ct.title} onChange={(e) => setCert(i, "title", e.target.value)} /></div>
              <label className="check-row"><input type="checkbox" checked={ct.comingSoon} onChange={(e) => setCert(i, "comingSoon", e.target.checked)} /> Tandai &quot;Coming Soon&quot; (tidak bisa diklik)</label>
            </div>
          ))}
          <button className="add-btn" type="button" onClick={addCert}>+ Tambah sertifikat</button>
        </div>

        {/* Kontak */}
        <div className="admin-card">
          <h2>Kontak</h2>
          <div className="grid2">
            <div className="frow"><label>Email</label><input value={data.contact.email} onChange={(e) => setPath("contact.email", e.target.value)} /></div>
            <div className="frow"><label>Lokasi</label><input value={data.contact.location} onChange={(e) => setPath("contact.location", e.target.value)} /></div>
          </div>
          <div className="frow"><label>Waktu balas</label><input value={data.contact.reply} onChange={(e) => setPath("contact.reply", e.target.value)} /></div>
          <div className="frow"><label>Formspree endpoint (opsional)</label><input value={data.contact.formEndpoint} onChange={(e) => setPath("contact.formEndpoint", e.target.value)} placeholder="https://formspree.io/f/xxxx" /></div>
        </div>

        {/* Footer */}
        <div className="admin-card">
          <h2>Footer</h2>
          <div className="frow"><label>Tagline footer</label><input value={data.footer.tagline} onChange={(e) => setPath("footer.tagline", e.target.value)} /></div>
        </div>
      </div>

      {toast && <div className={"toast show" + (toast.err ? " err" : "")}>{toast.msg}</div>}
    </div>
  );
}
