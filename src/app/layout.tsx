import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIMATIKA | Himpunan Mahasiswa Informatika",
  description:
    "Ruang untuk belajar, berkarya, dan berkolaborasi bersama Himpunan Mahasiswa Informatika.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
