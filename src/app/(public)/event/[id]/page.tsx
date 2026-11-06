import PublicDetailRoute from "@/components/sections/public/PublicDetailRoute";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PublicDetailRoute kind="event" params={params} />;
}
