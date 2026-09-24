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

## 🛠️ Dashboard Admin (edit konten TANPA VS Code)

Buka **`admin.html`** (dobel-klik, atau `http://localhost:5173/admin.html`, atau `namadomain.com/admin.html` setelah online).

1. Masukkan **passcode**. Default: `pandu2026` — **ganti** di `assets/js/admin.js` (baris `ADMIN_PASSCODE`).
2. Edit teks lewat form → klik **Simpan** (perubahan tersimpan sebagai preview).
3. Klik **Preview ↗** untuk melihat hasilnya di website.
4. Agar perubahan **tampil online untuk semua orang**, klik **Export** → dapat file `content-data.js` → **ganti file lama** di `assets/js/content-data.js` pada hosting:
   - **Netlify:** taruh file baru ke folder proyek (timpa yang lama), lalu drag folder lagi ke Netlify.
   - **GitHub:** buka file `assets/js/content-data.js` di github.com → **Edit/Upload** → commit → website auto-update.
5. **Reset** = kembalikan ke versi terpublish. **Import** = muat file `content-data.js` yang sudah ada.

**Yang bisa diedit lewat dashboard:** nama brand, role, hero, deskripsi, sosial media, About (bio, skills, pendidikan), **Projects** (judul, kategori, tahun, gambar, studi kasus), **Certificates** (gambar, PDF, judul, coming-soon), kontak, tagline footer, tema default.
**Yang masih lewat file:** foto profil hero, dan file gambar/PDF-nya sendiri (lihat catatan gambar).

> 🖼️ **Gambar project & sertifikat:** dashboard menyimpan **path** gambar, bukan file-nya. Taruh file gambar di `assets/img/...` (dan PDF di `assets/docs/...`), lalu tulis path-nya di form (mis. `assets/img/projects/furniture.jpg`), atau pakai URL gambar online. Project **tanpa gambar → otomatis tampil placeholder gradient** dengan huruf awal judul. Kategori project dipakai untuk membuat tombol filter secara otomatis.

> ⚠️ **Keamanan:** passcode di admin.html hanya pengaman **dasar** (bisa dilihat orang yang paham teknis). Kalau tak mau orang lain buka, **jangan upload `admin.html` ke hosting** (pakai lokal saja), atau lindungi lewat fitur password hosting.

---

## 📁 Struktur Folder

```
Update-porto/
├─ index.html          ← halaman utama (website)
├─ admin.html          ← DASHBOARD ADMIN (edit konten tanpa VS Code)
├─ assets/
│  ├─ css/style.css    ← styling & design token (warna, ukuran)
│  ├─ js/main.js       ← interaksi (menu, filter, modal, form)
│  ├─ js/content-data.js ← SEMUA teks yang bisa diedit (dibaca website)
│  ├─ js/admin.js      ← logika dashboard admin
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

**Cara termudah: pakai Dashboard Admin di atas.** Kalau mau edit manual lewat file, sebagian besar teks ada di `assets/js/content-data.js`; sisanya (foto, proyek, sertifikat) di `index.html` — cari komentar `<!-- ... -->` sebagai penanda.

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
| **Project / studi kasus** | Paling mudah lewat **Dashboard → Projects**. Manual: array `projects` di `assets/js/content-data.js`. |
| **Sertifikat** | Paling mudah lewat **Dashboard → Certificates**. Manual: array `certificates` di `assets/js/content-data.js` (kartu **estha** = `comingSoon: true`). |
| **CV (download)** | File CV ada di `assets/docs/CV-Lazuardi-Pandu.pdf`. Tombol "Download CV" ada di **hero (Home)**. |
| **Kontak & email** | Cari `id="contact"`. Email ada di `mailto:` dan atribut `data-email`. |
| **Menu navbar** | Cari `class="nav-menu"` → menu Home / About / Project / Contact. |

---

## 🏅 Menambah Sertifikat / Project (via Dashboard)

Paling mudah lewat **Dashboard** (`admin.html`) → bagian **Projects** atau **Certificates** (tombol "+ Tambah…").

1. Siapkan gambar (JPG/PNG, sisi terpanjang ±1600px) di `assets/img/certs/` atau `assets/img/projects/`, dan (opsional) PDF di `assets/docs/`.
   - Sertifikat berupa PDF? Ubah ke gambar dulu (screenshot / export).
2. Di form, isi **Gambar (path)** mis. `assets/img/certs/namafile.jpg`, dan **PDF (path)** bila ada. Project boleh dikosongkan gambarnya → placeholder otomatis.
3. Untuk kartu "belum jadi" (seperti estha), centang **Coming Soon**.
4. Klik **Simpan** → **Preview** → **Export** → ganti `assets/js/content-data.js` di hosting.

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
