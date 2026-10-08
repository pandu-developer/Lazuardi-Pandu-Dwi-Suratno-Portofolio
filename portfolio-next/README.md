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

1. **Push** repo ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) → login pakai GitHub → **Add New… → Project** → **Import** repo ini.
   - **Root Directory:** klik **Edit** → pilih `portfolio-next`  ← penting! (kalau lupa, yang ter-deploy malah situs statis di root)
   - Framework otomatis terdeteksi **Next.js**.
3. Buka bagian **Environment Variables** (di layar yang sama), isi:
   | Nama | Isi |
   |---|---|
   | `ADMIN_PASSWORD` | password login admin — **min. 8 karakter**, jangan `admin123` |
   | `SESSION_SECRET` | string acak **min. 32 karakter** — buat dengan perintah di bawah |

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```
4. Klik **Deploy**. Situs langsung tampil (konten default), tapi admin **belum bisa menyimpan** karena database belum ada.
5. **Hubungkan database**: di project Vercel → tab **Storage** → **Create Database** → pilih **Neon** (Postgres, ada free plan) → region **Singapore** → **Connect** ke project ini (biarkan *prefix* env var default). Env var database terisi otomatis (`DATABASE_URL` / `POSTGRES_URL` — kode membaca keduanya).
   - Mau pakai Supabase / Neon langsung? Tambahkan env var `DATABASE_URL` berisi *connection string*-nya.
6. **Redeploy**: tab **Deployments** → **⋯** pada deployment teratas → **Redeploy**. (Perubahan env var baru berlaku setelah redeploy.)
7. Buka **`namaproject.vercel.app/admin`** → login → edit → **Simpan** → langsung tayang. 🎉 Tabel `site_content` dibuat otomatis saat pertama dipakai.

> `vercel.json` mengunci region fungsi ke **Singapore (`sin1`)** — dekat pengunjung Indonesia & dekat database di langkah 5.

---

## 🖼️ Menambah gambar

Taruh file gambar di folder **`public/`**, lalu tulis path-nya di admin:
- Foto project: `public/img/projects/namafile.jpg` → isi field gambar dengan `/img/projects/namafile.jpg`
- Gambar sertifikat: `public/img/certs/...` → `/img/certs/...`
- PDF sertifikat/CV: `public/docs/...` → `/docs/...`

Project tanpa gambar → otomatis tampil **placeholder gradient**.

---

## 🔐 Keamanan

- Di produksi, **login admin terkunci otomatis** sampai `ADMIN_PASSWORD` (min. 8 karakter) & `SESSION_SECRET` (min. 32 karakter) diisi — tidak ada password/secret default yang bisa dipakai orang lain.
- `.env.local` sudah di-`.gitignore` (tidak ikut ke repo). Di produksi, rahasia diisi lewat Environment Variables Vercel.
- Halaman `/admin` dilindungi login (cookie JWT httpOnly, 7 hari). Tanpa login → otomatis diarahkan ke `/admin/login`.
- Password salah diberi jeda ±1 detik untuk memperlambat tebak-tebakan — tetap pakai password yang kuat.

---

## 🩺 Kalau ada masalah

| Gejala | Solusi |
|---|---|
| Login: *"Admin belum dikonfigurasi…"* | Isi `ADMIN_PASSWORD` / `SESSION_SECRET` (Settings → Environment Variables), lalu **Redeploy**. |
| Simpan: *"Database belum terhubung…"* | Hubungkan database (langkah 5), lalu **Redeploy**. |
| Simpan: *"Gagal menyimpan ke database…"* / admin: *"Database error"* | `DATABASE_URL` salah. Error `self-signed certificate` (Supabase)? Hapus `?sslmode=require` dari URL. DB tanpa SSL? Tambah `PGSSL=disable`. |
| Yang tampil situs statis lama | **Root Directory** belum `portfolio-next` (Project Settings → Root Directory). |

Detail error: Vercel → project → tab **Logs** (cari `[home]`, `[admin]`, `[api/content]`).

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
