"use client";

import Link from "next/link";
import { useCallback } from "react";
import { getEvents } from "@/lib/api/queries";
import { formatDate, ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function EventsSection() {
  const loadEvents = useCallback(() => getEvents(3), []);
  const events = useApiResource(loadEvents);

  return (
    <section
      aria-labelledby="events-title"
      className="news-section"
      id="event"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Agenda HIMATIKA</p>
          <h2 id="events-title">Event dan kegiatan.</h2>
        </div>
        <Link className="section-index" href="/event">
          LIHAT SEMUA EVENT ↗
        </Link>
      </div>
      {events.data?.length ? (
        <div className="news-grid">
          {events.data.map((item) => (
            <Link
              className="news-card"
              href={`/event/${item.id_berita}`}
              key={item.id_berita}
            >
              <span className="content-tag">event</span>
              <h3>{item.judul ?? "Event HIMATIKA"}</h3>
              {item.tanggal && (
                <time dateTime={item.tanggal}>{formatDate(item.tanggal)}</time>
              )}
              <p>{item.isi ?? "Informasi event belum tersedia."}</p>
            </Link>
          ))}
        </div>
      ) : (
        <ResourceStatus
          empty="Belum ada event yang terbit."
          error={events.error}
          loading={events.loading}
        />
      )}
    </section>
  );
}
