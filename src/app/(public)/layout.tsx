import type { ReactNode } from "react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function PublicRouteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PublicLayout>{children}</PublicLayout>;
}
