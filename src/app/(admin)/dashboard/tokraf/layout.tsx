import { redirect } from "next/navigation";
import TokrafAdminLayout from "@/components/sections/tokraf/TokrafAdminLayout";
import { getAuthenticatedAdmin } from "@/lib/auth/session";

export default async function TokrafDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/login");
  if (admin.role !== "admin_hima" && admin.role !== "admin_ekraf") {
    redirect("/dashboard");
  }

  return <TokrafAdminLayout>{children}</TokrafAdminLayout>;
}
