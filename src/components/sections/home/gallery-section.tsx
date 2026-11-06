"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { getGaleri } from "@/lib/api/queries";
import { formatDate, ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function GallerySection() {
  const loadGallery = useCallback(() => getGaleri(), []);
  const gallery = useApiResource(loadGallery);

  return (
    <section
      aria-labelledby="gallery-title"
      className="gallery-section"
      id="galeri"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Momen HIMATIKA</p>
          <h2 id="gallery-title">Cerita dalam gambar.</h2>
        </div>
        <span className="section-index">GALERI</span>
      </div>
      {gallery.data?.length ? (
        <div className="gallery-grid">
          {gallery.data.map((photo) => (
            <Link
              className="gallery-card"
              href={`/galeri/${photo.id_galeri}`}
              key={photo.id_galeri}
            >
              {photo.gambar && (
                <Image
                  alt={photo.judul ?? "Foto kegiatan HIMATIKA"}
                  className="gallery-image"
                  height={420}
                  src={photo.gambar}
                  unoptimized
                  width={640}
                />
              )}
              <h3>{photo.judul ?? "Kegiatan HIMATIKA"}</h3>
              {photo.tanggal_kegiatan && (
                <time dateTime={photo.tanggal_kegiatan}>
                  {formatDate(photo.tanggal_kegiatan)}
                </time>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <ResourceStatus
          empty="Belum ada foto galeri yang tersedia."
          error={gallery.error}
          loading={gallery.loading}
        />
      )}
    </section>
  );
}
