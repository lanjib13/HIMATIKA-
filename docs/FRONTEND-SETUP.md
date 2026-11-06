# Catatan Setup Frontend HIMATIKA

Dokumen ini mencatat kondisi workspace sebelum setup dan hasil aktual sesudah setup frontend.

## Sebelum pengerjaan

Pemeriksaan pada 6 November 2026:

- Workspace hanya berisi `PRD-HIMATIKA.md`; belum ada aplikasi atau konfigurasi frontend.
- Workspace bukan repository Git.
- Node.js `v24.22.1` dan npm `11.19.1` tersedia.
- PRD menetapkan Next.js, TypeScript, dan Tailwind CSS sebagai arah frontend.
- Belum ada keputusan integrasi backend, autentikasi, atau sumber data.

## Keputusan setup

- Mengikuti stack PRD: Next.js App Router, TypeScript, dan Tailwind CSS.
- Menempatkan kode aplikasi di `src/` dan memakai alias impor `@/*`.
- Setup ini menyiapkan fondasi frontend; belum menghubungkan API, database, atau autentikasi.
- Perubahan tidak boleh menghapus atau menimpa PRD.

## Sesudah pengerjaan

### Fondasi yang dibuat

- Scaffold Next.js App Router, TypeScript, Tailwind CSS, dan ESLint di root workspace.
- Karena nama folder workspace mengandung spasi dan tidak valid sebagai nama paket npm, scaffold dibuat dengan nama valid di folder sementara, lalu dipindahkan ke root tanpa menimpa PRD atau dokumentasi.
- Kode halaman berada di `src/app/`; path alias `@/*` dan strict TypeScript tetap aktif.
- Menambahkan skrip `npm run typecheck` untuk pemeriksaan TypeScript tanpa emit.
- Mengganti template awal dengan beranda pengantar HIMATIKA yang responsif, berbahasa Indonesia, dan mengikuti arahan visual marun pada PRD.
- Menambahkan metadata dasar website dan dokumentasi penggunaan pada `README.md`.
- Menghapus logo/aset serta favicon bawaan yang tidak dipakai.
- Dependensi dan lockfile dikelola melalui npm. Belum ada koneksi API, database, autentikasi, atau pengiriman aspirasi; bagian tersebut menunggu keputusan produk/backend.

### Perubahan file

- `package.json` dan `package-lock.json`: dependensi serta skrip aplikasi.
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `next-env.d.ts`, `AGENTS.md`: konfigurasi scaffold.
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`: halaman, metadata, dan gaya awal.
- `README.md`: panduan menjalankan serta status implementasi.
- `docs/FRONTEND-SETUP.md`: catatan sebelum dan sesudah setup.

### Validasi

- `npm run lint`: lulus.
- `npm run typecheck`: lulus. Pemeriksaan awal menemukan tipe `LayoutProps` belum tersedia sebelum Next menghasilkan tipe route; layout memakai `ReactNode` standar dan pemeriksaan ulang lulus.
- `npm run build`: lulus; beranda dan halaman 404 ter-prerender sebagai halaman statis.
- Smoke test browser pada desktop dan lebar ponsel 390 px: halaman tampil, metadata dan navigasi utama tersedia.
- `npm audit --omit=dev`: 0 kerentanan pada dependensi produksi.
- `npm audit`: melaporkan 8 kerentanan moderat pada pohon dependensi pengembangan ESLint/TypeScript ESLint. Perbaikan otomatis yang ditawarkan menurunkan `eslint-config-next` ke lini Next 15, sehingga tidak diterapkan agar konfigurasi tetap selaras dengan Next 16. Tinjau kembali saat rilis patch yang kompatibel tersedia.

### Langkah berikutnya

1. Validasi identitas visual, teks, dan konten dengan pengurus HIMATIKA.
2. Tentukan arsitektur backend, kontrak API, autentikasi admin, dan aturan akses.
3. Implementasikan halaman publik dan dashboard sesuai PRD.
4. Ganti informasi placeholder dan hubungkan form aspirasi setelah kontak serta layanan backend ditentukan.

## Integrasi API — 6 November 2026

### Sebelum integrasi

- Halaman beranda masih memakai konten statis dan belum mengirim request ke backend.
- Spesifikasi `docs/himatika_openapi.yaml` tersedia dengan server development `http://localhost:5000/api/v1` dan production URL placeholder.
- Belum ada generated API types, konfigurasi alamat backend, atau form aspirasi yang aktif.

### Sesudah integrasi

- Menambahkan `openapi-typescript` dan `openapi-fetch`, serta perintah `npm run api:types`.
- Menghasilkan `src/lib/api/schema.d.ts` dari spesifikasi OpenAPI agar route, schema, query, dan payload tercermin di TypeScript.
- Memperinci tipe response terpaginasikan untuk divisi, anggota, proker, berita, galeri, prestasi, dan aspirasi dengan referensi ke schema item masing-masing.
- Menambahkan API client bertipe pada `src/lib/api/client.ts` dan query/pengiriman aspirasi pada `src/lib/api/queries.ts`.
- Menambahkan rewrite same-origin `/api/v1/*` ke `HIMATIKA_API_URL` di Next.js dan template `.env.example`.
- Beranda meminta profil, divisi, anggota, proker, berita, galeri, dan prestasi dari API. Kegagalan data ditampilkan per bagian.
- Form aspirasi mengirim field sesuai schema OpenAPI, menampilkan hasil/error, dan menghormati status HTTP termasuk 422/429.
- Menambahkan rincian pemakaian dan gap kontrak ke `docs/API-INTEGRATION.md`; memperbarui README.
- Login, sesi admin, dashboard CRUD, detail konten, dan pengelolaan aspirasi admin masih belum memiliki UI.

### Validasi integrasi API

- `npm run api:types`: lulus dan schema berhasil dihasilkan.
- `npm run typecheck`: lulus.
- `npm run lint`: lulus.
- `npm run build`: lulus; beranda tetap ter-prerender dan memuat API setelah hidrasi.
- Smoke test browser memakai mock sementara dengan bentuk response OpenAPI: data profil dan resource tampil, dan form mengirim aspirasi serta mereset field setelah sukses.
- Smoke test tanpa backend mengonfirmasi status error API terlihat pada setiap bagian, bukan dibiarkan dalam status memuat.
- `npm audit --omit=dev`: 0 kerentanan pada dependensi produksi.
- `npm audit`: masih melaporkan 8 kerentanan moderat di dependensi pengembangan ESLint/TypeScript ESLint. Perbaikan otomatis yang ditawarkan membutuhkan downgrade `eslint-config-next`; tidak diterapkan agar tidak mengganti lini Next.js.
- Backend HIMATIKA tidak tersedia di workspace ini, sehingga komunikasi ke server resmi belum diuji. Gunakan URL backend sebenarnya di `.env.local` untuk pengujian end-to-end.

## Dashboard admin — pengerjaan lanjutan

### Sebelum pengerjaan

- Halaman publik telah terhubung ke OpenAPI, tetapi route login dan dashboard
  admin belum tersedia.
- Belum ada UI untuk ringkasan dashboard, pengelolaan profil, resource CRUD,
  atau tindak lanjut aspirasi.
- Spesifikasi menyediakan token Bearer, sehingga alur admin memerlukan
  penyimpanan sesi server agar token tidak terekspos di browser.

### Sesudah pengerjaan

- Menata komponen admin terpisah dari route App Router: shell navigasi,
  dashboard ringkasan, pengelola resource, profil, dan aspirasi.
- Menambahkan `/login` dan route dashboard sesuai sitemap PRD. Layout dashboard
  memverifikasi admin di server melalui `GET /auth/me` dan mengarahkan sesi
  tidak valid ke halaman login.
- Menambahkan BFF login/logout dan proxy `/api/v1/*`. Access token disimpan
  hanya dalam cookie HttpOnly; cookie memakai Secure di production dan
  SameSite=Lax.
- Menambahkan login demo lokal untuk development dengan kredensial
  `admin@himatika.ac.id` / `himatika123`. Login demo tidak memanggil backend dan
  otomatis nonaktif di production; operasi CRUD tetap menggunakan API.
- Menghubungkan ringkasan ke `GET /dashboard/summary`; profil ke
  `GET/PUT /profil`; daftar, tambah, edit, dan hapus resource ke operasi CRUD
  yang tersedia di OpenAPI; aspirasi mendukung daftar, filter status, update
  status, dan hapus.
- Menambahkan layout dashboard responsif dan formulir login, tabel, status
  loading/error/sukses, konfirmasi hapus, serta navigasi cepat.
- Galeri menggunakan URL gambar sesuai kontrak; upload file belum dapat
  dilakukan. Struktur organisasi memakai ID anggota sesuai response API.

### Batasan dan validasi

- Daftar admin dibatasi 100 item dan belum menyediakan pagination.
- Backend asli tidak tersedia untuk pengujian end-to-end; autentikasi dan
  operasi CRUD perlu diverifikasi terhadap server HIMATIKA.
- Pemeriksaan TypeScript dan ESLint lulus setelah pengerjaan dashboard.
- `npm run build` lulus dan menghasilkan route login serta dashboard.

## Pemisahan komponen halaman publik

- Sebelumnya seluruh bagian beranda disusun dari satu file komponen; halaman
  daftar dan detail publik juga memakai route dinamis generik.
- Route publik dipindahkan ke route group `(public)` dengan file page terpisah
  untuk profil, anggota, divisi, program kerja, berita dan event secara
  terpisah, galeri,
  prestasi, dan aspirasi. Group ini menyediakan layout bersama.
- Komponen disusun di `src/components/layout`, `src/components/ui`, dan
  `src/components/sections` (termasuk sections home, public, dan admin).
- Setiap section memuat datanya sendiri melalui hook bersama
  `src/hooks/use-api-resource.ts`; form aspirasi mengelola submit dan
  statusnya sendiri. Profil dibagikan melalui context agar hanya dimuat
  sekali dalam layout publik.
- Berita dan event kini ditampilkan di section beranda yang berbeda; keduanya
  memakai filter kategori agar kontennya tidak tercampur.

## Penyelarasan struktur direktori

- Halaman admin dipindahkan ke route group `(admin)` dan kini menggunakan
  page eksplisit untuk setiap resource pada `dashboard/`.
- Navbar, Footer, AdminSidebar, PageHeader, status resource, dan menu admin
  ditempatkan di folder layout/UI/library yang ditetapkan.
- Guard dashboard tetap berada di server layout; middleware terpisah tidak
  diperlukan dan akan menggandakan pemeriksaan sesi.
- Struktur aktual dan perbedaan yang disengaja dicatat di
  `docs/directory.md`. Modul API tetap dipisah menurut kontrak publik/admin dan
  tipe hasil generate OpenAPI.

## Halaman publik daftar dan detail

- Menambahkan halaman profil dan aspirasi, daftar anggota/divisi/program
  kerja/berita/event/galeri/prestasi, serta halaman detail per item.
- Kartu pada beranda dan halaman daftar kini mengarah ke detail terkait.
- Berita dan event memiliki menu admin, halaman daftar, detail, dan bagian
  beranda tersendiri. Keduanya tetap memakai endpoint `/berita` dengan query
  kategori yang berbeda, sesuai kontrak OpenAPI saat ini.
- Endpoint detail API menerima ID numerik (bukan slug); URL detail mengikuti
  `/resource/{id}`. Backend belum menyediakan route detail berbasis slug.
- Shell halaman publik membagikan header/footer dan memuat profil organisasi
  sekali; masing-masing daftar/detail meminta resource sendiri.
