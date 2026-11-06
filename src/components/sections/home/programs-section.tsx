"use client";

import Link from "next/link";
import { useCallback } from "react";
import { getProker } from "@/lib/api/queries";
import { ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function ProgramsSection() {
  const loadPrograms = useCallback(() => getProker(), []);
  const programs = useApiResource(loadPrograms);

  return (
    <section
      aria-labelledby="program-work-title"
      className="information-section"
      id="program-kerja"
    >
      <div className="section-label">
        <span>02</span>
        <span>Program kerja</span>
      </div>
      <div className="information-content">
        <p className="eyebrow">Dari gagasan menjadi aksi</p>
        <h2 id="program-work-title">Program kerja HIMATIKA.</h2>
        {programs.data?.length ? (
          <div className="api-list">
            {programs.data.map((program) => (
              <Link
                className="api-list-item"
                href={`/proker/${program.id_proker}`}
                key={program.id_proker}
              >
                <h3>{program.nama_proker ?? "Program kerja"}</h3>
                <p>
                  {program.deskripsi ?? "Deskripsi program belum tersedia."}
                </p>
                {program.status && (
                  <span className="content-tag">{program.status}</span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <ResourceStatus
            empty="Belum ada program kerja yang tersedia."
            error={programs.error}
            loading={programs.loading}
          />
        )}
      </div>
    </section>
  );
}
