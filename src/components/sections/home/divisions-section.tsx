"use client";

import Link from "next/link";
import { useCallback } from "react";
import { getDivisi } from "@/lib/api/queries";
import { ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function DivisionsSection() {
  const loadDivisions = useCallback(() => getDivisi(), []);
  const divisions = useApiResource(loadDivisions);

  return (
    <section
      aria-labelledby="division-title"
      className="program-section"
      id="divisi"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Jelajahi HIMATIKA</p>
          <h2 id="division-title">Ruang untuk bertumbuh bersama.</h2>
        </div>
        <span className="section-index">DIVISI</span>
      </div>

      {divisions.data?.length ? (
        <div className="highlight-grid">
          {divisions.data.map((division, index) => (
            <Link
              className="highlight-card"
              href={`/divisi/${division.id_divisi}`}
              key={division.id_divisi ?? division.slug}
            >
              <span className="card-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="card-copy">
                <strong>{division.nama_divisi ?? "Divisi HIMATIKA"}</strong>
                <span>
                  {division.deskripsi ?? "Informasi divisi belum ditambahkan."}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <ResourceStatus
          empty="Belum ada divisi yang dipublikasikan."
          error={divisions.error}
          loading={divisions.loading}
        />
      )}
    </section>
  );
}
