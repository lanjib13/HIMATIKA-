"use client";

import { useOrganizationProfile } from "./profile-context";
import { ResourceStatus } from "@/components/ui/ResourceStatus";

export default function AboutSection() {
  const profile = useOrganizationProfile();
  const description = profile.data?.deskripsi;

  return (
    <section
      aria-labelledby="about-title"
      className="intro-section"
      id="tentang"
    >
      <div className="section-label">
        <span>01</span>
        <span>Tentang kami</span>
      </div>
      <div className="intro-content">
        <div>
          <h2 id="about-title">
            {profile.data?.nama_organisasi ?? "Teknologi lebih berarti saat kita "}
            {!profile.data?.nama_organisasi && (
              <span>membangunnya bersama.</span>
            )}
          </h2>
          {profile.data?.visi && (
            <p className="profile-vision">
              <strong>Visi</strong> {profile.data.visi}
            </p>
          )}
        </div>
        <div className="intro-aside">
          {profile.data ? (
            <>
              {description && <p>{description}</p>}
              {profile.data.sejarah && (
                <p>
                  <strong>Sejarah</strong>
                  {profile.data.sejarah}
                </p>
              )}
              {profile.data.misi && (
                <p>
                  <strong>Misi</strong>
                  {profile.data.misi}
                </p>
              )}
              {!description && !profile.data.sejarah && !profile.data.misi && (
                <p>Profil organisasi belum dilengkapi oleh admin.</p>
              )}
            </>
          ) : (
            <ResourceStatus
              empty="Profil belum tersedia."
              error={profile.error}
              loading={profile.loading}
            />
          )}
        </div>
      </div>
    </section>
  );
}
