import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function AchievementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="prestasi" params={params} />;
}
