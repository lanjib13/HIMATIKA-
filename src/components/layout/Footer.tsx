"use client";

import Link from "next/link";
import { useOrganizationProfile } from "@/components/sections/home/profile-context";

export default function SiteFooter() {
  const { data } = useOrganizationProfile();
  const organizationName = data?.nama_organisasi ?? "HIMATIKA";
  return (
    <footer className="site-footer">
      <Link
        aria-label={`${organizationName}, kembali ke atas`}
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
      <p>Belajar bersama. Berkarya bersama.</p>
      <Link className="back-to-top" href="/">
        Kembali ke beranda ↑
      </Link>
    </footer>
  );
}
