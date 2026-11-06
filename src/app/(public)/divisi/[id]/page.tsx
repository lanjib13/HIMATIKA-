import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function DivisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="divisi" params={params} />;
}
