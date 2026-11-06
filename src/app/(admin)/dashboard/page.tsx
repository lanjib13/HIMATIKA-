import DashboardOverview from "@/components/sections/admin/dashboard-overview";
import { getAuthenticatedAdmin } from "@/lib/auth/session";

export default async function DashboardPage() {
  const admin = await getAuthenticatedAdmin();
  return <DashboardOverview adminName={admin?.nama || "Admin"} />;
}
