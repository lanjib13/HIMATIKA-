import TokrafProductRoute from "@/components/sections/tokraf/TokrafProductDetail";

export default function TokrafProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <TokrafProductRoute params={params} />;
}
