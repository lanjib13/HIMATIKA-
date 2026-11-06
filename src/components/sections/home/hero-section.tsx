"use client";

import { useOrganizationProfile } from "./profile-context";

export default function HeroSection({
}: Record<string, never> = {}) {
  const profile = useOrganizationProfile();

  return (
    <section aria-labelledby="hero-title" className="hero" id="beranda">
      <div className="hero-copy">
        <p className="eyebrow">
          <span aria-hidden="true" className="eyebrow-dot" />
          Himpunan Mahasiswa Informatika
        </p>
        <h1 id="hero-title">
          Bertumbuh
          <br />
          bersama <span>teknologi.</span>
        </h1>
        <p className="hero-description">
          {profile.data?.deskripsi ??
            "Ruang untuk belajar, berkarya, dan berkolaborasi bagi keluarga besar Informatika."}
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#tentang">
            Kenali HIMATIKA <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="#divisi">
            Jelajahi divisi <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="hero-art">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="hero-monogram">H</div>
        <div className="hero-note">
          <span>IDEAS</span>
          <span>INTO</span>
          <strong>
            IMPACT<span>.</span>
          </strong>
        </div>
        <span className="hero-coordinate">01° INFORMATIKA</span>
      </div>

      <div className="hero-footer">
        <span>Organisasi · Pembelajaran · Kolaborasi</span>
        <a href="#tentang">
          Gulir untuk mengenal kami <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
