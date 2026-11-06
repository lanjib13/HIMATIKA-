import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="proker" params={params} />;
}
