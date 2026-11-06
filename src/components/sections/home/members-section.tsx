"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { getAnggota } from "@/lib/api/queries";
import { ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function MembersSection() {
  const loadMembers = useCallback(() => getAnggota(), []);
  const members = useApiResource(loadMembers);

  return (
    <section
      aria-labelledby="members-title"
      className="members-section"
      id="anggota"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Keluarga HIMATIKA</p>
          <h2 id="members-title">Orang-orang di balik gagasan.</h2>
        </div>
        <span className="section-index">ANGGOTA</span>
      </div>
      {members.data?.length ? (
        <div className="members-grid">
          {members.data.map((member) => (
            <Link
              className="member-card"
              href={`/anggota/${member.id_anggota}`}
              key={member.id_anggota}
            >
              {member.foto && (
                <Image
                  alt={member.nama ?? "Anggota HIMATIKA"}
                  className="member-image"
                  height={320}
                  src={member.foto}
                  unoptimized
                  width={320}
                />
              )}
              <h3>{member.nama ?? "Anggota HIMATIKA"}</h3>
              <p>Himpunan Mahasiswa Informatika</p>
            </Link>
          ))}
        </div>
      ) : (
        <ResourceStatus
          empty="Belum ada data anggota yang tersedia."
          error={members.error}
          loading={members.loading}
        />
      )}
    </section>
  );
}
