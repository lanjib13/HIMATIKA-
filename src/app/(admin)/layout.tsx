import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getAuthenticatedAdmin } from "@/lib/auth/session";

export const instant = false;

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) redirect("/login");

  return (
    <AdminSidebar adminName={admin.nama || admin.email || "Admin"}>
      {children}
    </AdminSidebar>
  );
}
