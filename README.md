# HIMATIKA — Frontend

Frontend website profil dan pusat informasi Himpunan Mahasiswa Informatika.
Kebutuhan produk lengkap ada di [PRD-HIMATIKA.md](./PRD-HIMATIKA.md).

## Teknologi

- Next.js App Router
- React dan TypeScript
- Tailwind CSS 4
- ESLint

## Menjalankan secara lokal

Gunakan Node.js versi 20.9 atau lebih baru.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).
Pastikan API HIMATIKA berjalan, secara default di `http://localhost:5000/api/v1`.
Atur `HIMATIKA_API_URL` di `.env.local` bila alamat backend berbeda.

## Perintah pemeriksaan

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run api:types` regenerates API contracts after changing the OpenAPI file.

## Struktur utama

```text
src/
  app/
    (public)/      # Beranda, profil, daftar/detail konten, dan aspirasi
    (admin)/       # Dashboard dan halaman admin terproteksi
    api/           # Login/logout BFF dan proxy API berautentikasi
    login/         # Form login admin, tidak memerlukan sesi
    globals.css    # Gaya publik, admin, dan responsif
    layout.tsx     # Root layout dan metadata
  components/
    layout/        # Navbar, footer, public layout, dan admin sidebar
    ui/            # Page header dan status loading/error/kosong
    sections/      # Section home, halaman publik, TOKRAF, aspirasi, dan admin
  hooks/
    use-api-resource.ts
  lib/
    nav.ts         # Navigasi admin
    admin/         # Metadata dan payload resource CRUD
    api/
      admin.ts     # Request API admin
      client.ts    # Klien OpenAPI
      public-content.ts
      queries.ts   # Request API publik dan detail
      schema.d.ts  # Tipe hasil generate dari OpenAPI
    auth/          # Akses dan verifikasi sesi server
public/
  images/          # Aset gambar statis
openapi/
  himatika_openapi.yaml # Sumber kontrak API yang dilacak Git
```

Route group `(public)` dan `(admin)` hanya mengelompokkan implementasi; URL
publik tetap mengikuti sitemap seperti `/berita`, `/tokraf`, dan
`/dashboard/berita`.

## Status implementasi

Beranda memuat data profil, divisi, anggota, program kerja, berita dan event
secara terpisah, galeri, dan prestasi dari API serta menyediakan form
aspirasi. Admin dapat login/logout, melihat ringkasan dashboard, mengelola
profil dan resource CRUD, serta membaca, mengubah status, dan menghapus
aspirasi. Modul TOKRAF menyediakan katalog, detail produk, kalkulator harga
bertingkat, pemesanan via WhatsApp, serta dashboard demo produk/kategori/profil.

Pada development, login memakai akun demo lokal `admin@himatika.ac.id` /
`himatika123` dan tidak memanggil endpoint autentikasi backend. Demo login
dinonaktifkan otomatis pada production; data dashboard dan operasi CRUD tetap
membutuhkan backend.
Login demo Admin Ekraf memakai `ekraf@himatika.ac.id` / `ekraf123` dan juga
hanya tersedia di development.

Halaman publik mencakup profil, aspirasi, serta daftar dan detail anggota,
divisi, program kerja, berita, event, galeri, dan prestasi. Tautan detail
menggunakan ID karena endpoint detail pada kontrak OpenAPI menerima ID, bukan
slug. Tabel admin memuat paling banyak 100 data per resource dan belum memiliki
pagination. Data TOKRAF saat ini adalah fixture demo yang disimpan di
`localStorage`; harga contoh dan role UI bukan integrasi database atau
otorisasi produksi. Form WhatsApp tidak menyimpan pesanan pada website.
Upload berkas galeri belum didukung kontrak API; input galeri menggunakan URL.

## Hal yang perlu disiapkan sebelum rilis

- Pastikan backend berjalan dan URL production menggantikan placeholder.
- Uji integrasi login dan operasi admin dengan backend HIMATIKA yang berjalan.
- Lengkapi kontrak upload foto dan data struktur organisasi.
- Implementasikan endpoint TOKRAF pada backend sesuai
  `openapi/himatika_openapi.yaml`, termasuk pemeriksaan role Admin Hima/Ekraf.
- Ganti fixture dan penyimpanan demo TOKRAF dengan API/database sebelum rilis.

# H I M A T I K A -
