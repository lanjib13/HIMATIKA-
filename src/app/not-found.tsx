import Link from "next/link";

export default function NotFound() {
  return (
    <main className="public-interior not-found-page">
      <span className="admin-eyebrow">404 · HALAMAN TIDAK DITEMUKAN</span>
      <h1>Halaman ini tidak tersedia.</h1>
      <p>Periksa kembali alamat yang dibuka atau kembali ke beranda HIMATIKA.</p>
      <Link className="admin-primary-button" href="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}
