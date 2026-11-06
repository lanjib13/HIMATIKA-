"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import {
  getPublicDetail,
  type PublicCollectionKind,
} from "@/lib/api/public-content";
import { formatDate, ResourceStatus } from "@/components/ui/ResourceStatus";
import { useApiResource } from "@/hooks/use-api-resource";

export default function PublicDetailPage({
  kind,
  id,
}: {
  kind: PublicCollectionKind;
  id: number;
}) {
  const loadDetail = useCallback(() => getPublicDetail(kind, id), [id, kind]);
  const detail = useApiResource(loadDetail);

  if (!detail.data) {
    return (
      <main className="public-interior">
        <ResourceStatus
          empty="Konten tidak tersedia."
          error={detail.error}
          loading={detail.loading}
        />
        <Link className="public-back-link" href={`/${kind}`}>
          ← Kembali ke daftar
        </Link>
      </main>
    );
  }

  return (
    <main className="public-interior">
      <Link
        className="public-back-link"
        href={`/${kind}`}
      >
        ← Kembali ke {detail.data.category.toLowerCase()}
      </Link>
      <article className="public-detail">
        <header className="public-detail-heading">
          <span className="content-tag">{detail.data.category}</span>
          {detail.data.date && (
            <time>{formatDate(detail.data.date)}</time>
          )}
          <h1>{detail.data.title}</h1>
          {detail.data.description && kind !== "berita" && kind !== "event" && (
            <p>{detail.data.description}</p>
          )}
        </header>
        {detail.data.image && (
          <Image
            alt={detail.data.title}
            className="public-detail-image"
            height={720}
            src={detail.data.image}
            unoptimized
            width={1200}
          />
        )}
        {detail.data.description && (kind === "berita" || kind === "event") && (
          <div className="public-detail-body">{detail.data.description}</div>
        )}
        {detail.data.facts.length > 0 && (
          <dl className="public-detail-facts">
            {detail.data.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </article>
    </main>
  );
}
