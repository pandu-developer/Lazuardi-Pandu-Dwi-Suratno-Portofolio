# Portfolio — Lazuardi Pandu (Full Stack Developer)

Website portofolio pribadi bergaya **minimalis monokrom**.
Dibangun dengan **HTML + Tailwind (CDN) + CSS + JavaScript** murni — tanpa build step.

- Bahasa konten website: **English**.
- Mendukung **mode gelap & terang** (default: gelap). Tombol toggle ada di navbar; pilihan tersimpan otomatis di browser pengunjung.
- Section: Home (hero) · About (bio, skills, education) · Project · Certifications · Contact.

---

## 🚀 Cara Menjalankan

Pilih salah satu:

1. **Paling gampang:** klik dua kali `index.html` → terbuka di browser.
   (Butuh koneksi internet untuk memuat font & Tailwind dari CDN.)

2. **Pakai VS Code:** install ekstensi *Live Server* → klik kanan `index.html` → *Open with Live Server*.

3. **Pakai server lokal** (opsional, dari terminal di folder ini):
   ```bash
   py -3 -m http.server 5173
   ```
   Lalu buka `http://localhost:5173` di browser.

> Catatan: membuka lewat server (cara 2/3) lebih akurat karena semua path file (CSS, JS, gambar) pasti termuat.

---

## 📁 Struktur Folder

```
Update-porto/
├─ index.html          ← halaman utama (semua konten & teks ada di sini)
├─ assets/
│  ├─ css/style.css    ← styling & design token (warna, ukuran)
│  ├─ js/main.js       ← interaksi (menu, filter, modal, form)
│  ├─ img/
│  │  ├─ profile.svg   ← FOTO PROFIL (ganti dengan fotomu)
│  │  ├─ favicon.svg   ← ikon tab browser
│  │  ├─ og-image.svg  ← gambar preview saat link dibagikan
│  │  └─ certs/        ← gambar sertifikat (JPG)
│  └─ docs/            ← CV + PDF sertifikat (untuk download/pop-up)
├─ robots.txt          ← untuk SEO
├─ sitemap.xml         ← untuk SEO
├─ .claude/launch.json ← config server preview (boleh diabaikan)
└─ README.md           ← file ini
```

---

## ✏️ Cara Edit Konten

Hampir semua yang perlu kamu ubah ada di **`index.html`**. Cari komentar `<!-- ... -->` sebagai penanda.

| Yang mau diubah | Lokasi |
|---|---|
| **Foto profil** | Ganti file `assets/img/profile.svg` dengan fotomu (grayscale, rasio 4:5, format PNG/JPG). Kalau nama file beda, sesuaikan `src` di bagian `hero-photo`. |
| **Nama besar (hero)** | Cari `class="hero-name"` → ubah teks `Lazuardi` dan `Pandu`. |
| **Role & deskripsi** | Cari `class="hero-eyebrow"` (role) dan `hero-desc` (deskripsi). |
| **Link sosial media** | Cari `class="socials"` → ganti semua URL `https://dribbble.com/...`, dll dengan akunmu. |
| **Nama brand (navbar)** | Cari `class="brand"` → ubah teks nama. Nama ini juga muncul di footer (`class="footer-brand"`). |
| **Warna & tema** | Semua warna ada di `style.css` bagian `:root` (mode gelap) dan `:root[data-theme="light"]` (mode terang). Ubah `--accent` untuk warna titik hijau. |
| **About: bio** | Cari `id="about"` → ubah teks `about-lead` & `about-body`. |
| **About: skills** | Cari `class="skill-chips"` → tambah/hapus `<li class="skill-chip">…</li>`. |
| **About: pendidikan** | Cari `class="edu-list"` (di dalam blok "See more" `id="aboutMore"`) → ubah tahun & sekolah. |
| **Project / studi kasus** | Judul & thumbnail ada di `class="work-grid"` (section `id="project"`). Isi studi kasus ada di bawah, di `<script id="casesData">`. |
| **Sertifikat** | Cari `id="certificates"`. Tiap kartu punya `data-cert` (gambar untuk pop-up), `data-pdf` (PDF asli), dan `data-title`. Gambar ada di `assets/img/certs/`, PDF di `assets/docs/`. Kartu **estha** ditandai "Coming Soon" (tidak bisa diklik). |
| **CV (download)** | File CV ada di `assets/docs/CV-Lazuardi-Pandu.pdf`. Tombol "Download CV" ada di **hero (Home)**. |
| **Kontak & email** | Cari `id="contact"`. Email ada di `mailto:` dan atribut `data-email`. |
| **Menu navbar** | Cari `class="nav-menu"` → menu Home / About / Project / Contact. |

---

## 🏅 Menambah / Mengganti Sertifikat

1. Simpan gambar sertifikat (JPG/PNG, sisi terpanjang ±1600px) ke `assets/img/certs/`, dan (opsional) PDF aslinya ke `assets/docs/`.
   - Punya sertifikat dalam bentuk PDF? Ubah ke gambar dulu (mis. screenshot, atau export dari PDF).
2. Di `index.html` bagian `id="certificates"`, salin satu blok `<button class="cert-card" ...>`, lalu ubah:
   - `data-cert="assets/img/certs/namafile.jpg"` (gambar untuk pop-up)
   - `data-pdf="assets/docs/namafile.pdf"` (opsional; hapus atribut ini kalau tak ada PDF)
   - `data-title="..."` dan teks di `cert-issuer` / `cert-name` / `cert-meta`.
3. Kartu **estha** memakai class `cert-soon` (tidak bisa diklik, ada badge "Coming Soon"). Ganti/hapus sesuai kebutuhan.

## 📬 Mengaktifkan Form Kontak

Secara default, tombol **Kirim Pesan** akan membuka aplikasi email (mailto). Agar pesan terkirim otomatis tanpa buka email:

1. Daftar gratis di [formspree.io](https://formspree.io), buat form baru, salin endpoint-nya (contoh: `https://formspree.io/f/abcdwxyz`).
2. Buka `index.html`, cari `id="contactForm"`, lalu isi atribut:
   ```html
   data-endpoint="https://formspree.io/f/abcdwxyz"
   ```
3. Selesai. Pesan akan masuk ke emailmu lewat Formspree.

---

## 🔎 SEO (sebelum launch)

Setelah punya domain final, ganti `https://lazuardipandu.example.com` di file-file ini:
- `index.html` (tag `<link rel="canonical">`, Open Graph `og:url`, dan JSON-LD)
- `sitemap.xml`
- `robots.txt`

Opsional: buat versi PNG dari `og-image.svg` (ukuran 1200×630) agar preview link lebih kompatibel di semua platform sosmed.

---

## 🌐 Cara Deploy (gratis)

**Netlify (paling mudah — drag & drop):**
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop).
2. Seret seluruh folder `Update-porto` ke sana. Langsung online.

**Vercel / GitHub Pages** juga bisa — cukup upload folder ini (situs statis, tidak perlu konfigurasi khusus).

---

## ⚡ Catatan Performa (Tailwind)

Situs ini memakai **Tailwind Play CDN** agar tanpa build step. Untuk hasil skor Lighthouse maksimal (target PRD ≥ 90), disarankan **compile Tailwind** saat produksi supaya file CSS jauh lebih kecil:

```bash
npm install -D tailwindcss
npx tailwindcss -i ./src.css -o ./assets/css/tailwind.css --minify
```
Lalu ganti `<script src="https://cdn.tailwindcss.com">` dengan `<link rel="stylesheet" href="assets/css/tailwind.css">`.
(Ini opsional — situs sudah berjalan penuh tanpa langkah ini.)

---

## ✅ Checklist Sebelum Launch

- [ ] Ganti foto profil dengan foto asli
- [ ] Update semua link sosial media
- [ ] Isi studi kasus dengan proyek asli + ganti thumbnail
- [ ] Sesuaikan pengalaman & angka di navbar
- [ ] Ganti/hapus testimoni placeholder
- [ ] Aktifkan Formspree (atau pastikan email benar)
- [ ] Ganti domain di meta SEO, sitemap, robots
- [ ] Cek tampilan di HP & desktop

---

Dibuat sesuai PRD "Website Portofolio Pribadi — Lazuardi Pandu" v1.0.
# Lazuardi-Pandu-Dwi-Suratno-Portofolio
