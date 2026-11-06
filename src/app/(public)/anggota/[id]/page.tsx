import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="anggota" params={params} />;
}
