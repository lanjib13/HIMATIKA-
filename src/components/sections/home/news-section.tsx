"use client";

import Link from "next/link";
import { useCallback } from "react";
import { getBerita } from "@/lib/api/queries";
import { formatDate, ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function NewsSection() {
  const loadNews = useCallback(() => getBerita(3), []);
  const news = useApiResource(loadNews);

  return (
    <section
      aria-labelledby="news-title"
      className="news-section"
      id="informasi"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Cerita dan kabar terbaru</p>
          <h2 id="news-title">Berita HIMATIKA.</h2>
        </div>
        <Link className="section-index" href="/berita">
          LIHAT SEMUA BERITA ↗
        </Link>
      </div>
      {news.data?.length ? (
        <div className="news-grid">
          {news.data.map((item) => (
            <Link
              className="news-card"
              href={`/berita/${item.id_berita}`}
              key={item.id_berita}
            >
              <span className="content-tag">{item.kategori ?? "berita"}</span>
              <h3>{item.judul ?? "Berita HIMATIKA"}</h3>
              {item.tanggal && (
                <time dateTime={item.tanggal}>{formatDate(item.tanggal)}</time>
              )}
              <p>{item.isi ?? "Konten berita belum tersedia."}</p>
            </Link>
          ))}
        </div>
      ) : (
        <ResourceStatus
          empty="Belum ada berita yang terbit."
          error={news.error}
          loading={news.loading}
        />
      )}
    </section>
  );
}
