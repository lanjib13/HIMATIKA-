"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminApiError, getDashboardSummary } from "@/lib/api/admin";
import type { paths } from "@/lib/api/schema";

type Summary = NonNullable<
  paths["/dashboard/summary"]["get"]["responses"][200]["content"]["application/json"]["data"]
>;

const cards: {
  key: keyof Summary;
  label: string;
  href: string;
  accent?: boolean;
}[] = [
  { key: "total_anggota", label: "Anggota", href: "/dashboard/anggota" },
  { key: "total_divisi", label: "Divisi", href: "/dashboard/divisi" },
  { key: "total_proker", label: "Program kerja", href: "/dashboard/proker" },
  { key: "total_berita", label: "Publikasi (API)", href: "/dashboard/berita" },
  { key: "total_galeri", label: "Foto galeri", href: "/dashboard/galeri" },
  { key: "total_prestasi", label: "Prestasi", href: "/dashboard/prestasi" },
  {
    key: "aspirasi_baru",
    label: "Aspirasi baru",
    href: "/dashboard/aspirasi",
    accent: true,
  },
];

export default function DashboardOverview({ adminName }: { adminName: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getDashboardSummary()
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof AdminApiError
            ? loadError.message
            : loadError instanceof Error
              ? loadError.message
              : "Ringkasan dashboard gagal dimuat.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <div className="dashboard-welcome">
        <div>
          <span className="admin-eyebrow">OVERVIEW · HIMATIKA</span>
          <h1>Selamat datang, {adminName}.</h1>
          <p>Ringkasan aktivitas dan konten website organisasi.</p>
        </div>
        <span aria-hidden="true" className="dashboard-welcome-mark">
          H
        </span>
      </div>

      {error && (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      )}

      <div className="dashboard-section-title">
        <div>
          <h2>Ringkasan data</h2>
          <p>Jumlah data terbaru dari layanan HIMATIKA.</p>
        </div>
        <span>{loading ? "Memuat…" : "DATA API"}</span>
      </div>

      <div className="dashboard-stat-grid">
        {cards.map((card, index) => (
          <Link
            className={`dashboard-stat-card${card.accent ? " is-highlight" : ""}`}
            href={card.href}
            key={card.key}
          >
            <span className="dashboard-stat-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{loading ? "—" : (summary?.[card.key] ?? 0)}</strong>
            <span>{card.label}</span>
            <span aria-hidden="true" className="dashboard-stat-arrow">
              ↗
            </span>
          </Link>
        ))}
      </div>

      <div className="dashboard-shortcuts">
        <div>
          <span className="admin-eyebrow">AKSI CEPAT</span>
          <h2>Mulai kelola konten.</h2>
          <p>Pilih bagian yang ingin diperbarui atau tinjau aspirasi terbaru.</p>
        </div>
        <div className="dashboard-shortcut-links">
          <Link href="/dashboard/berita">Buat berita <span>↗</span></Link>
          <Link href="/dashboard/event">Buat event <span>↗</span></Link>
          <Link href="/dashboard/anggota">Kelola anggota <span>↗</span></Link>
          <Link href="/dashboard/aspirasi">Buka aspirasi <span>↗</span></Link>
        </div>
      </div>
    </section>
  );
}
