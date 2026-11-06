# Integrasi Frontend dengan HIMATIKA OpenAPI

## Sumber kontrak

- Spesifikasi: [`himatika_openapi.yaml`](./himatika_openapi.yaml)
- Versi OpenAPI: 3.0.3
- API base URL yang tercantum pada spesifikasi: `http://localhost:5000/api/v1`
- Tipe TypeScript hasil generate: [`../src/lib/api/schema.d.ts`](../src/lib/api/schema.d.ts)

Tipe dihasilkan dari spesifikasi. Jangan mengedit `schema.d.ts` langsung; ubah YAML terlebih dahulu, lalu jalankan `npm run api:types`.

## Konfigurasi lokal dan deployment

1. Pastikan API HIMATIKA berjalan dan menerima request di `http://localhost:5000/api/v1`.
2. Salin `.env.example` menjadi `.env.local`.
3. Ubah `HIMATIKA_API_URL` jika backend memakai alamat atau prefix API lain.
4. Jalankan `npm run dev`.

Browser memanggil path same-origin `/api/v1/...`. Next.js meneruskan request tersebut ke `HIMATIKA_API_URL`, sehingga frontend tidak memerlukan konfigurasi CORS untuk request browser-ke-backend langsung. Saat deployment, atur variabel `HIMATIKA_API_URL` pada environment hosting ke URL backend sebenarnya; `https://api.example.com/api/v1` pada spesifikasi masih URL placeholder.

## Endpoint yang sudah dipakai halaman publik

| Method dan endpoint | Penggunaan |
|---|---|
| `GET /profil` | Nama organisasi, deskripsi, sejarah, visi, dan misi |
| `GET /divisi?page=1&limit=4` | Daftar divisi |
| `GET /anggota?page=1&limit=6` | Direktori anggota tanpa menampilkan NIM |
| `GET /proker?page=1&limit=3` | Sorotan program kerja |
| `GET /berita?page=1&limit=3&kategori=berita` | Berita yang diterbitkan |
| `GET /berita?page=1&limit=3&kategori=event` | Event yang diterbitkan |
| `GET /galeri?page=1&limit=6` | Foto kegiatan |
| `GET /prestasi?page=1&limit=3` | Prestasi HIMATIKA |
| `POST /aspirasi` | Form pengiriman aspirasi |

Halaman detail memakai endpoint publik `GET /anggota/{id}`, `GET /divisi/{id}`,
`GET /proker/{id}`, `GET /berita/{id}`, `GET /galeri/{id}`, dan
`GET /prestasi/{id}`. UI memisahkan berita dan event menjadi daftar, detail,
form admin, dan menu dashboard tersendiri. Kontrak API saat ini masih
menggabungkan keduanya pada endpoint `/berita`, dibedakan oleh query
`kategori=berita` atau `kategori=event` dan field kategori pada body. Karena
itu, frontend belum dapat memakai endpoint atau model backend terpisah sampai
spesifikasi OpenAPI diperbarui. Kontrak detail menerima ID numerik, sehingga
URL detail frontend menggunakan `/resource/{id}` meski PRD sebelumnya
menyebut slug.

Query list mengikuti parameter `page` dan `limit` pada spesifikasi. Form aspirasi mengirim `kategori` dan `pesan` wajib; `nama` dan `kontak` opsional. Validasi panjang mengikuti kontrak: kategori maksimal 50 karakter, nama/kontak maksimal 100 karakter, dan pesan minimal 5 karakter.

Respons harus memakai envelope `success`, `message`, dan `data` seperti spesifikasi. Kegagalan endpoint ditampilkan pada bagian terkait, sedangkan kegagalan kirim aspirasi ditampilkan di form. Status `422` dan `429` ditangani sebagai kesalahan yang bisa dipahami pengunjung.

## Autentikasi dan endpoint admin

Skema OpenAPI juga mendefinisikan login/logout, informasi admin, ringkasan dashboard, CRUD konten, dan pengelolaan aspirasi dengan Bearer JWT. Tipe seluruh route tersebut tersedia melalui kontrak hasil generate. `createAuthenticatedApiClient(accessToken)` menambahkan header Bearer untuk integrasi berikutnya.

Halaman login dan dashboard admin sudah dibuat. Browser mengirim login ke
`/api/auth/login`; route handler meneruskan kredensial ke `POST /auth/login`
dan menyimpan token API dalam cookie HttpOnly, Secure pada production, dan
SameSite=Lax. Token tidak dikirim balik ke browser dan tidak disimpan di
`localStorage`.

Untuk development, autentikasi memakai akun demo lokal
`admin@himatika.ac.id` / `himatika123` tanpa request ke backend. Sesi demo hanya
diterima saat `NODE_ENV` bukan `production`; build production tetap memakai
endpoint login HIMATIKA. Login demo hanya menyediakan sesi UI dan tidak
memalsukan data CRUD, yang tetap memerlukan backend.

Request `/api/v1/*` diteruskan oleh route handler BFF. Cookie dibaca di server
dan dipakai sebagai Bearer token saat menghubungi backend. Layout dashboard
memverifikasi sesi dengan `GET /auth/me` di server dan mengarahkan sesi tidak
valid ke `/login`. Logout menghapus cookie lokal dan meminta `POST /auth/logout`.
API tetap harus memverifikasi otorisasi setiap operasi; proteksi UI bukan
pengganti otorisasi backend.

List admin saat ini mengambil paling banyak 100 item per resource tanpa
pagination. List berita/event menggunakan filter kategori agar kedua resource
tidak tercampur di dashboard. Ringkasan API hanya menyediakan `total_berita`,
jadi kartu publikasi dashboard tetap memakai angka gabungan dari field
ringkasan tersebut; backend belum menyediakan total terpisah untuk event.
Struktur organisasi mengelola relasi melalui ID anggota karena
kontrak endpoint belum menyertakan nama/foto anggota. Galeri memakai URL
gambar; upload file tidak tersedia pada spesifikasi.

## Batas kontrak yang perlu dikonfirmasi

- Endpoint galeri menerima `gambar` sebagai string URL; spesifikasi belum menyediakan upload multipart atau endpoint penyimpanan file.
- `/struktur-organisasi` hanya mengembalikan `id_anggota`, jabatan, urutan, dan periode, bukan nama/foto anggota. Relasi perlu diambil lewat endpoint anggota atau response API diperluas jika halaman struktur akan dibuat.
- Kategori aspirasi adalah string bebas, bukan daftar pilihan.
- Periode struktur organisasi tidak memiliki nilai default yang ditentukan.
- Anti-spam/rate limiting harus ditegakkan backend. Kontrak saat ini tidak mendefinisikan token CAPTCHA.
- Endpoint list tidak mendefinisikan semua kemungkinan respons error. Frontend tetap menampilkan error HTTP, tetapi tim API sebaiknya mendokumentasikan respons error konsisten untuk semua endpoint.

## Regenerasi dan pemeriksaan

```bash
npm run api:types
npm run typecheck
npm run lint
npm run build
```

Tipe response list di OpenAPI diperinci agar setiap `data[]` menunjuk schema resource yang benar. Perubahan ini mendokumentasikan bentuk data yang memang sudah tersedia di bagian `components/schemas`; perubahan tidak menambah route atau field backend.
