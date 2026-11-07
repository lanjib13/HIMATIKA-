"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { TokrafDemoStore } from "./demo-store";

const links = [
  { href: "/tokraf", label: "Beranda" },
  { href: "/tokraf/katalog", label: "Katalog" },
  { href: "/tokraf/kalkulator", label: "Kalkulator" },
  { href: "/tokraf/cara-pesan", label: "Cara pesan" },
  { href: "/tokraf/tentang", label: "Tentang" },
  { href: "/tokraf/kontak", label: "Kontak" },
];

function TokrafNavigationLinks({ pathname }: { pathname: string | null }) {
  return (
    <div className="tokraf-navigation-wrap">
      <div className="tokraf-navigation">
        <Link className="tokraf-wordmark" href="/tokraf">
          TOKRAF <span>EKRAF HIMATIKA</span>
        </Link>
        <nav aria-label="Navigasi TOKRAF" className="tokraf-nav-links">
          {links.map((link) => {
            const active =
              pathname !== null &&
              (pathname === link.href ||
                (link.href !== "/tokraf" && pathname.startsWith(link.href)));
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "is-active" : ""}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function TokrafNavigation() {
  const pathname = usePathname();
  return <TokrafNavigationLinks pathname={pathname} />;
}

export default function TokrafShell({ children }: { children: ReactNode }) {
  return (
    <TokrafDemoStore>
      <Suspense fallback={<TokrafNavigationLinks pathname={null} />}>
        <TokrafNavigation />
      </Suspense>
      {children}
    </TokrafDemoStore>
  );
}
