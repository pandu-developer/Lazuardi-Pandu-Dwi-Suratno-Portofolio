# Portfolio — Lazuardi Pandu (Next.js + TypeScript)

Versi **Next.js 14 (App Router) + TypeScript** dari portofolio, dengan **dashboard admin ber-login** dan **auto-save ke database** (perubahan langsung tayang untuk semua pengunjung — tanpa export/redeploy).

- **Konten** disimpan di **Postgres** saat online, atau **file `data/content.json`** saat development (otomatis, tanpa setup).
- **Admin** di `/admin` (login password), editor untuk hero, about, skills, pendidikan, **projects**, **certificates**, kontak, footer.
- Desain & interaksi sama persis dengan versi statis (dark/light, modal, lightbox, animasi).

---

## 🚀 Menjalankan di lokal

```bash
npm install
```

Buat file **`.env.local`** (sudah ada contohnya; minimal isi 2 baris ini):

```
ADMIN_PASSWORD=passwordrahasiamu
SESSION_SECRET=string-acak-yang-panjang
```

Lalu:

```bash
npm run dev
```

- Situs: **http://localhost:3000**
- Admin: **http://localhost:3000/admin** (login pakai `ADMIN_PASSWORD`)

Di lokal (tanpa `DATABASE_URL`), konten tersimpan di `data/content.json` — jadi langsung bisa dicoba.

---

## ☁️ Deploy ke Vercel + Database

1. **Push** folder repo ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repo.
   - **Root Directory:** `portfolio-next`  ← penting (Next.js ada di subfolder ini)
   - Framework otomatis terdeteksi **Next.js**.
3. **Buat database Postgres** (pilih salah satu, semua ada free tier):
   - **Vercel Postgres** (Storage → Create → Postgres) — paling mudah, env otomatis terisi; **atau**
   - **Neon** / **Supabase** → salin *connection string*-nya.
4. **Set Environment Variables** di Vercel (Settings → Environment Variables):
   | Nama | Isi |
   |---|---|
   | `ADMIN_PASSWORD` | password login admin |
   | `SESSION_SECRET` | string acak panjang (mis. hasil generator) |
   | `DATABASE_URL` | connection string Postgres (kalau pakai Vercel Postgres, ini otomatis ada) |
   | `PGSSL` | *(opsional)* isi `disable` **hanya** kalau DB-mu tidak pakai SSL |
5. **Deploy**. Saat pertama dibuka, tabel `site_content` dibuat otomatis & diisi konten default.

Setelah online: buka **`namadomain.com/admin`** → login → edit → **Simpan** → langsung tayang. 🎉

---

## 🖼️ Menambah gambar

Taruh file gambar di folder **`public/`**, lalu tulis path-nya di admin:
- Foto project: `public/img/projects/namafile.jpg` → isi field gambar dengan `/img/projects/namafile.jpg`
- Gambar sertifikat: `public/img/certs/...` → `/img/certs/...`
- PDF sertifikat/CV: `public/docs/...` → `/docs/...`

Project tanpa gambar → otomatis tampil **placeholder gradient**.

---

## 🔐 Keamanan

- **Ganti** `ADMIN_PASSWORD` dan `SESSION_SECRET` dengan nilai rahasia & acak (jangan pakai contoh default).
- `.env.local` sudah di-`.gitignore` (tidak ikut ke repo). Di produksi, rahasia diisi lewat Environment Variables Vercel.
- Halaman `/admin` dilindungi login (cookie JWT httpOnly). Tanpa login → otomatis diarahkan ke `/admin/login`.

---

## 📁 Struktur singkat

```
portfolio-next/
├─ app/
│  ├─ page.tsx            ← home (server, baca konten dari store)
│  ├─ layout.tsx          ← html, font, metadata, tema
│  ├─ globals.css         ← semua styling (situs + admin)
│  ├─ admin/page.tsx      ← dashboard (dilindungi)
│  ├─ admin/login/page.tsx
│  └─ api/ (login, logout, content)
├─ components/
│  ├─ Portfolio.tsx       ← UI situs (client)
│  └─ AdminDashboard.tsx  ← editor admin (client)
├─ lib/
│  ├─ content.ts          ← tipe + konten default
│  ├─ store.ts            ← Postgres / file store
│  └─ auth.ts             ← login (JWT cookie)
├─ middleware.ts          ← proteksi /admin
└─ public/img, public/docs
```
