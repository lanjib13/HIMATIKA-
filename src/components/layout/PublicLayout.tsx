import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { ProfileProvider } from "@/components/sections/home/profile-context";

export default function PublicSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProfileProvider>
      <Navbar />
      {children}
      <Footer />
    </ProfileProvider>
  );
}
