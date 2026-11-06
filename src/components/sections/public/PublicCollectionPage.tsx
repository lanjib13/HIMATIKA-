"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import {
  getPublicCollection,
  type PublicCollectionKind,
} from "@/lib/api/public-content";
import { formatDate, ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";
import PageHeader from "@/components/ui/PageHeader";

const collectionInfo: Record<
  PublicCollectionKind,
  { eyebrow: string; title: string; description: string }
> = {
  anggota: {
    eyebrow: "Keluarga HIMATIKA",
    title: "Orang-orang di balik gagasan.",
    description: "Kenali anggota yang bertumbuh dan berkarya bersama HIMATIKA.",
  },
  divisi: {
    eyebrow: "Jelajahi HIMATIKA",
    title: "Ruang untuk bertumbuh bersama.",
    description: "Temukan bidang dan ruang kolaborasi di HIMATIKA.",
  },
  proker: {
    eyebrow: "Dari gagasan menjadi aksi",
    title: "Program kerja.",
    description: "Program dan kegiatan yang dijalankan oleh HIMATIKA.",
  },
  berita: {
    eyebrow: "Cerita dan kabar terbaru",
    title: "Berita HIMATIKA.",
    description: "Informasi dan kabar terbaru dari HIMATIKA.",
  },
  event: {
    eyebrow: "Agenda HIMATIKA",
    title: "Event dan kegiatan.",
    description: "Jelajahi acara dan kegiatan yang dipublikasikan HIMATIKA.",
  },
  galeri: {
    eyebrow: "Momen HIMATIKA",
    title: "Cerita dalam gambar.",
    description: "Dokumentasi kegiatan dan kebersamaan HIMATIKA.",
  },
  prestasi: {
    eyebrow: "Pencapaian",
    title: "Karya yang berdampak.",
    description: "Apresiasi untuk pencapaian dan prestasi HIMATIKA.",
  },
};

export default function PublicCollectionPage({
  kind,
}: {
  kind: PublicCollectionKind;
}) {
  const loadCollection = useCallback(() => getPublicCollection(kind), [kind]);
  const collection = useApiResource(loadCollection);
  const info = collectionInfo[kind];

  return (
    <main className="public-interior">
      <PageHeader {...info} />
      {collection.data?.length ? (
        <div className="public-collection-grid">
          {collection.data.filter((item) => item.id > 0).map((item) => (
            <Link
              className="public-collection-card"
              href={item.href}
              key={`${kind}-${item.id}`}
            >
              {item.image && (
                <Image
                  alt={item.title}
                  className="public-collection-image"
                  height={420}
                  src={item.image}
                  unoptimized
                  width={680}
                />
              )}
              <div className="public-collection-card-content">
                {(item.category || item.date) && (
                  <div className="public-collection-meta">
                    {item.category && (
                      <span className="content-tag">{item.category}</span>
                    )}
                    {item.date && <time>{formatDate(item.date)}</time>}
                  </div>
                )}
                <h2>{item.title}</h2>
                {item.meta && <p className="public-card-meta">{item.meta}</p>}
                {item.description && (
                  <p className="public-card-description">{item.description}</p>
                )}
                <span className="public-card-link">
                  Baca selengkapnya <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ResourceStatus
          empty="Belum ada konten yang dipublikasikan."
          error={collection.error}
          loading={collection.loading}
        />
      )}
    </main>
  );
}
