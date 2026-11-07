"use client";

import Link from "next/link";
import { useTokrafDemoStore } from "./demo-store";

const links = [
  {
    href: "/dashboard/tokraf/produk",
    title: "Produk",
    description: "Kelola katalog, varian, dan rentang harga.",
  },
  {
    href: "/dashboard/tokraf/kategori",
    title: "Kategori",
    description: "Atur kelompok produk yang tampil di katalog.",
  },
  {
    href: "/dashboard/tokraf/varian",
    title: "Varian & harga",
    description: "Tinjau opsi produk dan harga bertingkat.",
  },
  {
    href: "/dashboard/tokraf/profil",
    title: "Profil toko",
    description: "Atur deskripsi, kontak, dan nomor WhatsApp.",
  },
  {
    href: "/dashboard/tokraf/pesanan",
    title: "Pesanan",
    description: "Ketahui batas pengelolaan pesanan pada demo WhatsApp.",
  },
  {
    href: "/dashboard/tokraf/pengaturan",
    title: "Pengaturan",
    description: "Lihat alur pembayaran dan pengiriman yang berlaku.",
  },
];

export default function TokrafAdminDashboard() {
  const { data, ready, error } = useTokrafDemoStore();
  const published = data?.products.filter((product) => product.status === "terbit").length ?? 0;

  return (
    <section className="tokraf-admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TOKRAF · EKRAF HIMATIKA</span>
          <h1>Kelola toko kreatif.</h1>
          <p>Data demo katalog, kategori, harga, dan profil toko.</p>
        </div>
      </header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <div className="tokraf-admin-stats">
        <div><span>Produk</span><strong>{ready ? data?.products.length ?? 0 : "—"}</strong></div>
        <div><span>Produk terbit</span><strong>{ready ? published : "—"}</strong></div>
        <div><span>Kategori</span><strong>{ready ? data?.categories.length ?? 0 : "—"}</strong></div>
      </div>
      <div className="tokraf-admin-link-grid">
        {links.map((link) => (
          <Link className="tokraf-admin-link-card" href={link.href} key={link.href}>
            <span>BUKA BAGIAN ↗</span>
            <h2>{link.title}</h2>
            <p>{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
