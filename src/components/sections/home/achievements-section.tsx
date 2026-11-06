"use client";

import Link from "next/link";
import { useCallback } from "react";
import { getPrestasi } from "@/lib/api/queries";
import { formatDate, ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function AchievementsSection() {
  const loadAchievements = useCallback(() => getPrestasi(), []);
  const achievements = useApiResource(loadAchievements);

  return (
    <section
      aria-labelledby="achievement-title"
      className="achievement-section"
      id="prestasi"
    >
      <div className="section-label">
        <span>03</span>
        <span>Prestasi</span>
      </div>
      <div className="achievement-content">
        <div>
          <p className="eyebrow">Bangga dengan setiap pencapaian</p>
          <h2 id="achievement-title">Karya yang berdampak.</h2>
        </div>
        {achievements.data?.length ? (
          <div className="achievement-list">
            {achievements.data.map((achievement) => (
              <Link
                className="achievement-item"
                href={`/prestasi/${achievement.id_prestasi}`}
                key={achievement.id_prestasi}
              >
                <span>{formatDate(achievement.tanggal) ?? "HIMATIKA"}</span>
                <h3>{achievement.nama_prestasi ?? "Prestasi HIMATIKA"}</h3>
                <p>
                  {[achievement.tingkat, achievement.penyelenggara]
                    .filter(Boolean)
                    .join(" · ") || achievement.deskripsi}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <ResourceStatus
            empty="Belum ada prestasi yang ditambahkan."
            error={achievements.error}
            loading={achievements.loading}
          />
        )}
      </div>
    </section>
  );
}
