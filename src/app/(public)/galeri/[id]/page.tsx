import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="galeri" params={params} />;
}
