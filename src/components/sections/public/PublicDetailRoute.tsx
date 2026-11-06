import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import PublicDetailPage from "./PublicDetailPage";
import type { PublicCollectionKind } from "@/lib/api/public-content";

export default function PublicDetailRoute({
  params,
  kind,
}: {
  params: Promise<{ id: string }>;
  kind: PublicCollectionKind;
}) {
  return (
    <Suspense fallback={<div className="public-interior">Memuat detail…</div>}>
      <ResolvedPublicDetail params={params} kind={kind} />
    </Suspense>
  );
}

function ResolvedPublicDetail({
  params,
  kind,
}: {
  params: Promise<{ id: string }>;
  kind: PublicCollectionKind;
}) {
  const { id } = use(params);
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId < 1) notFound();

  return <PublicDetailPage kind={kind} id={numericId} />;
}
