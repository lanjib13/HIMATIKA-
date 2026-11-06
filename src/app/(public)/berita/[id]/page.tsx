import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="berita" params={params} />;
}
