# Product Requirements Document (PRD)

## Website Profil dan Pusat Informasi HIMATIKA

| Atribut | Keterangan |
|---|---|
| Pemilik produk | Himpunan Mahasiswa Informatika (HIMATIKA) |
| Status | Draf untuk validasi |
| Versi | 1.1 |
| Target rilis | Belum ditentukan |
| Platform | Website responsif |

## 1. Ringkasan Produk

Website HIMATIKA adalah kanal resmi untuk memperkuat identitas digital organisasi dan menyimpan informasi yang saat ini tersebar di media sosial. Pengunjung dapat mengenal HIMATIKA, melihat kegiatan dan pencapaian, serta mengirim konsultasi atau aspirasi. Pengurus mengelola informasi melalui dashboard tanpa perlu mengubah kode. Website ini juga memuat **modul TOKRAF** milik divisi Ekraf: katalog produk, kalkulator estimasi harga, dan pemesanan via WhatsApp.

## 2. Latar Belakang dan Masalah

- HIMATIKA belum memiliki website resmi sebagai identitas digital.
- Informasi yang hanya disampaikan melalui Instagram mudah tertimbun dan sulit ditemukan kembali.
- Belum tersedia saluran terpusat untuk konsultasi dan aspirasi mahasiswa.
- Konten organisasi perlu dikelola terpusat dan dapat diperbarui saat kepengurusan berganti.

## 3. Tujuan dan Ukuran Keberhasilan

### Tujuan

1. Menyediakan profil resmi HIMATIKA yang mudah diakses.
2. Menyimpan informasi program kerja, berita, kegiatan, galeri, dan prestasi secara terstruktur.
3. Menyediakan saluran konsultasi dan aspirasi yang dapat ditindaklanjuti pengurus.
4. Memungkinkan admin mengelola konten melalui dashboard.

### Indikator keberhasilan

- Seluruh halaman publik utama dapat diakses tanpa login dan nyaman digunakan di ponsel maupun desktop.
- Admin dapat membuat, melihat, mengubah, dan menghapus konten yang termasuk dalam cakupan.
- Pengunjung dapat mengirim aspirasi dan admin dapat melihat serta memperbarui statusnya.
- Konten publik yang berstatus draf tidak ditampilkan kepada pengunjung.

Target angka dan periode pengukuran ditetapkan bersama pemilik produk sebelum rilis.

## 4. Pengguna dan Hak Akses

| Pengguna | Kebutuhan | Hak akses |
|---|---|---|
| Pengunjung umum (mahasiswa, dosen, alumni, masyarakat) | Menemukan informasi resmi, memesan produk TOKRAF, dan menghubungi HIMATIKA | Melihat konten terbit, mengirim aspirasi, serta menggunakan katalog/kalkulator TOKRAF; tidak perlu login |
| Admin Hima (pengurus inti HIMATIKA) | Memperbarui seluruh konten dan menangani pesan masuk | Login, mengelola seluruh konten Hima maupun modul TOKRAF (super admin), membaca serta memperbarui aspirasi |
| Admin Ekraf (PIC divisi Ekraf) | Mengelola katalog & pemesanan TOKRAF | Login, mengelola modul TOKRAF (produk, kategori, profil toko) saja; tidak dapat mengubah konten Hima lainnya |

Terdapat dua peran admin: **Admin Hima** (super admin, semua konten) dan **Admin Ekraf** (terbatas pada modul TOKRAF). Pendaftaran akun pengunjung tidak termasuk cakupan.

## 5. Ruang Lingkup

### 5.1 Fitur publik

- Beranda dengan ringkasan HIMATIKA, berita terbaru, dan sorotan prestasi.
- Profil HIMATIKA: sejarah, visi, misi, dan struktur organisasi.
- Direktori anggota/pengurus.
- Daftar divisi serta halaman detail divisi yang memuat program kerja terkait.
- Daftar berita dan event serta halaman detail.
- Galeri foto kegiatan.
- Daftar prestasi.
- Form konsultasi/aspirasi.
- Modul TOKRAF (divisi Ekraf): katalog produk, detail produk dengan kalkulator estimasi harga, nota/ringkasan pesanan, dan tombol "Pesan via WhatsApp".
- Halaman 404 untuk rute atau konten yang tidak ditemukan.

### 5.2 Fitur admin

- Login dan logout admin.
- Dashboard ringkasan data dan jumlah pesan baru.
- CRUD profil, anggota, divisi, program kerja, berita/event, galeri, dan prestasi.
- Hak akses dua peran: Admin Hima (super admin, semua konten) dan Admin Ekraf (hanya modul TOKRAF).
- CRUD modul TOKRAF: produk, kategori produk, dan profil toko (nomor WA admin, deskripsi, kontak).
- Pengelolaan pesan aspirasi, termasuk melihat detail dan memperbarui status.
- Validasi formulir, konfirmasi sebelum penghapusan, serta notifikasi keberhasilan/kegagalan.

### 5.3 Di luar cakupan

- Pendaftaran anggota, akun untuk pengunjung, dan pembayaran online (payment gateway) — termasuk untuk TOKRAF.
- Fitur lain yang tidak tercantum dalam PRD ini.

## 6. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas | Kriteria penerimaan |
|---|---|---|---|
| FR-01 | Pengunjung melihat halaman publik | P0 | Halaman publik dapat dibuka tanpa autentikasi dan menampilkan konten terbit. |
| FR-02 | Admin login dan logout | P0 | Kredensial valid membawa admin ke dashboard; kredensial tidak valid menghasilkan pesan umum; logout mengakhiri sesi. |
| FR-03 | Proteksi halaman admin | P0 | Permintaan ke rute dashboard tanpa sesi admin ditolak di sisi server dan diarahkan ke login. |
| FR-04 | Dashboard ringkasan | P0 | Admin dapat melihat ringkasan jumlah data dan jumlah aspirasi baru. |
| FR-05 | Kelola profil HIMATIKA | P0 | Admin dapat melihat, mengubah, dan menyimpan informasi profil. |
| FR-06 | Kelola anggota dan divisi | P0 | Admin dapat membuat, melihat, mengubah, dan menghapus data; daftar publik mengikuti data yang tersimpan. |
| FR-07 | Kelola program kerja | P0 | Admin dapat mengaitkan program kerja dengan divisi; detail divisi menampilkan program kerja terkait. |
| FR-08 | Kelola berita dan event | P0 | Admin dapat membuat, mengubah, dan menghapus berita/event serta mengatur status draf atau terbit; pengunjung hanya melihat konten terbit. |
| FR-09 | Kelola galeri | P0 | Admin dapat mengunggah dan menghapus foto; foto yang valid tampil pada halaman galeri. |
| FR-10 | Kelola prestasi | P0 | Admin dapat membuat, melihat, mengubah, dan menghapus prestasi; data terbit tampil di halaman publik. |
| FR-11 | Kirim konsultasi/aspirasi | P0 | Pengunjung dapat mengirim kategori dan pesan; nama dan kontak opsional; sistem memvalidasi input dan menampilkan konfirmasi setelah berhasil. |
| FR-12 | Tindak lanjuti aspirasi | P0 | Pesan tersimpan dengan status awal “Baru”; admin dapat membaca dan memperbarui status. |
| FR-13 | Pencarian dan filter | P1 | Pengunjung dapat mencari atau memfilter berita, galeri, dan prestasi. |
| FR-14 | Penanganan konten tidak ditemukan | P1 | Rute atau item yang tidak tersedia menampilkan halaman 404 dan tautan kembali ke halaman utama. |
| FR-15 | Katalog produk TOKRAF | P0 | Pengunjung dapat melihat daftar produk TOKRAF dan memfilter berdasarkan kategori; data mengikuti database. |
| FR-16 | Kalkulator estimasi harga TOKRAF | P0 | Pengunjung dapat memilih produk, varian, dan jumlah; sistem menghitung total dengan harga berjenjang dan menampilkan nota/ringkasan beserta catatan bahwa harga bersifat estimasi. |
| FR-17 | Order TOKRAF via WhatsApp | P0 | Tombol pesan membuka wa.me dengan pesan otomatis berisi detail pesanan (produk, varian, jumlah, estimasi, nama, catatan); nomor tujuan diambil dari profil toko. |
| FR-18 | Kelola produk TOKRAF | P0 | Admin Ekraf dan Admin Hima dapat membuat, melihat, mengubah, dan menghapus produk (termasuk varian dan harga berjenjang). |
| FR-19 | Kelola kategori TOKRAF | P1 | Admin Ekraf dan Admin Hima dapat menambah, mengubah, dan menghapus kategori; produk memilih kategori dari daftar yang ada. |
| FR-20 | Kelola profil toko TOKRAF | P0 | Admin Ekraf dan Admin Hima dapat mengubah nomor WA admin, deskripsi, dan kontak yang tampil pada modul TOKRAF. |

P0 adalah kebutuhan inti rilis awal; P1 dapat dirilis setelah fitur inti stabil.

## 7. Alur Pengguna Utama

### Admin

1. Admin membuka `/login`, lalu memasukkan email dan kata sandi.
2. Sistem memvalidasi kredensial dan hak akses.
3. Jika valid, admin masuk ke `/dashboard`; jika tidak, sistem menampilkan pesan kesalahan tanpa mengungkap bagian kredensial yang salah.
4. Admin memilih jenis konten, membuat atau mengubah data, lalu menyimpan.
5. Sistem memvalidasi data dan menampilkan hasil; kesalahan tidak boleh dilaporkan sebagai keberhasilan.
6. Untuk penghapusan, sistem meminta konfirmasi terlebih dahulu.
7. Admin dapat keluar melalui aksi logout.

### Pengunjung mengirim aspirasi

1. Pengunjung membuka `/aspirasi`.
2. Pengunjung mengisi kategori dan pesan; nama serta kontak boleh dikosongkan.
3. Sistem memvalidasi isian dan melakukan pemeriksaan anti-spam.
4. Jika berhasil, pesan disimpan dengan status “Baru” dan pengunjung menerima konfirmasi.
5. Jika gagal, sistem menjelaskan isian yang perlu diperbaiki atau menyampaikan bahwa pengiriman belum berhasil.

### Pengunjung mencari informasi

1. Pengunjung membuka beranda atau memilih bagian dari navigasi.
2. Pengunjung melihat daftar konten dan dapat membuka halaman detail.
3. Jika konten tidak tersedia, sistem menampilkan halaman 404.

### Pengunjung memesan produk TOKRAF

1. Pengunjung membuka `/tokraf` dan memilih produk dari katalog.
2. Pada halaman detail produk, pengunjung memilih varian (ukuran/warna/opsi sablon) dan memasukkan jumlah.
3. Sistem menghitung estimasi harga (harga berjenjang) dan menampilkan nota/ringkasan.
4. Pengunjung mengisi nama dan catatan opsional, lalu menekan "Pesan via WhatsApp".
5. WhatsApp terbuka dengan pesan otomatis siap kirim ke nomor admin TOKRAF.
6. Admin mengonfirmasi harga final dan memproses pesanan; invoice resmi diterbitkan melalui Paper.id.

### Admin Ekraf mengelola TOKRAF

1. Admin Ekraf login dan masuk ke bagian dashboard TOKRAF.
2. Admin mengelola produk, kategori, dan profil toko.
3. Perubahan langsung tampil di halaman publik modul TOKRAF.

## 8. Sitemap dan Rute

### Halaman publik

| Halaman | Rute |
|---|---|
| Beranda | `/` |
| Profil HIMATIKA | `/profil` |
| Anggota | `/anggota` |
| Detail anggota | `/anggota/[id]` |
| Daftar divisi | `/divisi` |
| Detail divisi | `/divisi/[id]` |
| Program kerja | `/proker` |
| Detail program kerja | `/proker/[id]` |
| Berita dan event | `/berita` |
| Event | `/event` |
| Detail berita/event | `/berita/[id]` atau `/event/[id]` |
| Galeri | `/galeri` |
| Detail galeri | `/galeri/[id]` |
| Prestasi | `/prestasi` |
| Detail prestasi | `/prestasi/[id]` |
| Konsultasi/aspirasi | `/aspirasi` |
| Beranda TOKRAF | `/tokraf` |
| Katalog TOKRAF | `/tokraf/katalog` |
| Detail produk TOKRAF | `/tokraf/produk/[id]` |
| Kalkulator pesanan TOKRAF | `/tokraf/kalkulator` |
| Cara pesan TOKRAF | `/tokraf/cara-pesan` |
| Tentang TOKRAF | `/tokraf/tentang` |
| Kontak TOKRAF | `/tokraf/kontak` |
| Login admin | `/login` |

### Halaman admin

| Halaman | Rute |
|---|---|
| Dashboard | `/dashboard` |
| Kelola profil | `/dashboard/profil` |
| Kelola anggota | `/dashboard/anggota` |
| Kelola divisi | `/dashboard/divisi` |
| Kelola program kerja | `/dashboard/proker` |
| Kelola berita/event | `/dashboard/berita` |
| Kelola galeri | `/dashboard/galeri` |
| Kelola prestasi | `/dashboard/prestasi` |
| Kelola aspirasi | `/dashboard/aspirasi` |
| Kelola produk TOKRAF | `/dashboard/tokraf/produk` |
| Kelola kategori TOKRAF | `/dashboard/tokraf/kategori` |
| Kelola varian template TOKRAF | `/dashboard/tokraf/varian` |
| Kelola pesanan TOKRAF | `/dashboard/tokraf/pesanan` |
| Kelola profil toko TOKRAF | `/dashboard/tokraf/profil` |
| Pengaturan TOKRAF | `/dashboard/tokraf/pengaturan` |

Navigasi publik memuat Beranda, Profil, Anggota, Divisi, Berita, Galeri, Prestasi, Aspirasi, dan TOKRAF. Navigasi TOKRAF memuat Beranda, Katalog, Kalkulator Pesanan, Cara Pesan, Tentang, dan Kontak. Sidebar admin memuat Dashboard, Profil, Anggota, Divisi, Proker, Berita, Galeri, Prestasi, Aspirasi, TOKRAF (terlihat oleh Admin Ekraf; Admin Hima dapat mengakses semua), dan Logout. Submenu TOKRAF memuat Dashboard TOKRAF, Produk, Kategori, Varian Template, Pesanan, Profil Website, dan Pengaturan.

## 9. Kebutuhan Nonfungsional

- **Keamanan:** kata sandi tidak disimpan dalam teks biasa; semua aksi admin dan akses dashboard diverifikasi di server; pesan kesalahan login tidak membocorkan apakah email atau kata sandi yang salah.
- **Anti-spam:** formulir aspirasi memakai pembatasan kiriman dan/atau CAPTCHA. Pilihan mekanisme ditentukan sebelum implementasi.
- **Privasi:** nama dan kontak aspirasi bersifat opsional; akses pesan dibatasi untuk admin; kebijakan penyimpanan dan penghapusan pesan perlu ditetapkan pemilik produk.
- **Performa:** gambar dioptimalkan dan dimuat secara efisien; halaman publik harus terasa cepat pada perangkat dan jaringan umum pengguna.
- **Responsif:** tata letak berfungsi pada ponsel, tablet, dan desktop.
- **Aksesibilitas:** teks mudah dibaca, kontras warna memadai, kontrol dapat digunakan dengan keyboard, dan gambar informatif memiliki teks alternatif.
- **SEO:** halaman publik memiliki judul dan deskripsi yang relevan; konten draf tidak diindeks.
- **Kemudahan perawatan:** admin dapat memperbarui konten rutin tanpa perubahan kode.
- **Unggahan:** format JPG, PNG, atau WebP; batas ukuran awal yang diusulkan maksimal 2 MB per gambar, menunggu persetujuan pemilik produk.

## 10. Konten dan Data

Entitas utama yang perlu didukung:

- **Profil:** sejarah, visi, misi, dan struktur organisasi.
- **Anggota:** nama, jabatan/peran, divisi (jika ada), foto, dan urutan tampilan.
- **Divisi:** nama, slug, deskripsi, dan informasi terkait.
- **Program kerja:** judul, deskripsi, divisi, periode, dan status publikasi bila diperlukan.
- **Berita/event:** judul, slug, kategori, isi, gambar sampul, tanggal, dan status draf/terbit.
- **Galeri:** foto, keterangan opsional, tanggal/kegiatan, dan teks alternatif.
- **Prestasi:** judul/deskripsi, tanggal atau periode, pihak terkait, dan gambar opsional.
- **Aspirasi:** kategori, pesan, nama opsional, kontak opsional, waktu kirim, dan status tindak lanjut.
- **Produk TOKRAF:** nama, slug, deskripsi, foto, kategori (relasi ke kategori), harga dasar, varian (ukuran/warna/opsi), dan ketentuan harga berjenjang.
- **Kategori TOKRAF:** nama dan urutan tampilan.
- **Profil toko TOKRAF:** nomor WA admin, deskripsi, kontak, dan pengaturan umum modul.

Validasi panjang teks, kewajiban tiap kolom, kebutuhan pengarsipan, serta nilai status aspirasi harus disepakati sebelum rancangan database final.

## 11. Arahan Desain

- Gaya modern dan interaktif.
- Warna utama merah marun, dengan putih dan abu-abu gelap sebagai warna pendamping; gunakan warna aksen secukupnya.
- Pastikan kontras dan keterbacaan tetap baik pada semua ukuran layar.
- Referensi visual: [himatikuaa.github.io](https://himatikuaa.github.io/), [things.inc](https://things.inc/), dan [hima-if.teknokrat.ac.id](https://hima-if.teknokrat.ac.id/).
- Modul TOKRAF mengikuti identitas visual yang sama (merah marun), dengan latar ivory/krem dan biru tua sebagai aksen pada elemen katalog — konsisten dengan spesifikasi TOKRAF.

## 12. Arahan Teknologi dan Keputusan Terbuka

Rancangan awal menyebut Next.js, TypeScript, Tailwind CSS, Express.js, PostgreSQL melalui Supabase, serta hosting Vercel/Render. Keputusan final perlu dibuat sebelum implementasi:

1. Pilih antara Express yang di-host terpisah (misalnya Render/Railway) atau Next.js Route Handlers di Vercel. Express tidak berjalan sebagai server permanen pada Vercel.
2. Tentukan penggunaan Supabase Auth dan penyimpanan file untuk mengurangi implementasi backend khusus.
3. Tetapkan strategi akses database dan kebijakan Row Level Security agar aksi admin tetap terlindungi.
4. Tetapkan cara membuat akun admin awal dan proses pergantian akses saat periode kepengurusan berubah.
5. Tetapkan target rilis dan penanggung jawab operasional setelah website diluncurkan.
6. Siapkan peran admin ganda (Admin Hima & Admin Ekraf) beserta kebijakan akses modul TOKRAF pada database dan dashboard.

## 13. Rencana Rilis

1. **Rilis inti:** beranda, profil, anggota, divisi dan program kerja, autentikasi admin, dashboard, CRUD konten dasar, serta modul TOKRAF (katalog, kalkulator, dan order via WhatsApp).
2. **Rilis konten:** berita/event, galeri, dan prestasi.
3. **Rilis interaksi:** aspirasi, pengelolaan status pesan, pencarian/filter, dan penyempurnaan animasi.

Urutan dapat disesuaikan setelah prioritas dan kapasitas tim disepakati. Semua fitur tetap harus memenuhi kebutuhan keamanan, responsivitas, dan aksesibilitas sebelum rilis publik.

## 14. Kriteria Siap Rilis

- Alur utama pengunjung dan admin lulus pengujian fungsional (termasuk alur TOKRAF: lihat katalog, hitung estimasi, kirim ke WhatsApp).
- Pengunjung tanpa login tidak dapat membaca atau mengubah data privat/admin.
- Data draf tidak muncul di halaman publik.
- Validasi, status kosong, status gagal, dan konfirmasi penghapusan tersedia.
- Unggahan gambar dibatasi sesuai format dan ukuran yang disepakati.
- Tampilan diuji pada ponsel dan desktop.
- Judul/deskripsi SEO dan halaman 404 tersedia.
- Mekanisme anti-spam dan kebijakan privasi pesan aspirasi telah diputuskan.
- Pemilik produk menyetujui konten, identitas visual, domain, serta target rilis.

## 15. Asumsi dan Hal yang Perlu Dikonfirmasi

- “Konsultasi/aspirasi” menggunakan satu formulir dengan kategori; apakah konsultasi membutuhkan alur privat atau respons langsung belum ditentukan.
- Kontak pengirim bersifat opsional, sesuai konsep awal.
- Tahap awal hanya menyediakan satu peran admin.
- Status aspirasi awal adalah “Baru”; status lanjutan dan alur tindak lanjut perlu divalidasi.
- Batas gambar 2 MB merupakan usulan awal, bukan keputusan final.
- Target rilis, target angka keberhasilan, kebijakan retensi data, dan pilihan arsitektur backend belum ditentukan.
- Modul TOKRAF dikelola oleh Admin Ekraf; Admin Hima bertindak sebagai super admin yang juga dapat mengaksesnya.
- Pembayaran TOKRAF dilakukan di WhatsApp (QRIS/Transfer); pengiriman hanya COD. Invoice/administrasi keuangan ditangani admin di luar website.
