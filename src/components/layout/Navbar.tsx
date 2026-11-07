"use client";

import Link from "next/link";
import { useOrganizationProfile } from "@/components/sections/home/profile-context";

export default function SiteHeader() {
  const { data } = useOrganizationProfile();
  const organizationName = data?.nama_organisasi ?? "HIMATIKA";
  return (
    <header className="site-header">
      <Link
        aria-label={`${organizationName}, beranda`}
        className="brand"
        href="/"
      >
        <span aria-hidden="true" className="brand-mark">
          H
        </span>
        <span className="brand-name">
          {organizationName}
          <span>Himpunan Mahasiswa Informatika</span>
        </span>
      </Link>

      <nav aria-label="Navigasi utama" className="main-nav">
        <Link href="/profil">Tentang</Link>
        <Link href="/anggota">Anggota</Link>
        <Link href="/divisi">Divisi</Link>
        <Link href="/proker">Program</Link>
        <Link href="/berita">Berita</Link>
        <Link href="/event">Event</Link>
        <Link href="/galeri">Galeri</Link>
        <Link href="/prestasi">Prestasi</Link>
        <Link href="/tokraf">TOKRAF</Link>
      </nav>

      <Link className="header-cta" href="/aspirasi">
        Sampaikan aspirasi <span aria-hidden="true">↗</span>
      </Link>
    </header>
  );
}
