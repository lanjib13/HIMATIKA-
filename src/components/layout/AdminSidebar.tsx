"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_NAVIGATION } from "@/lib/nav";

export default function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setLogoutError(payload.message ?? "Logout API gagal.");
        router.replace("/login");
        return;
      }
      router.replace("/login");
    } catch {
      setLogoutError("Tidak dapat menghubungi layanan logout.");
      setLoggingOut(false);
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/dashboard">
          <span className="admin-brand-mark">H</span>
          <span>
            HIMATIKA
            <small>CONTROL ROOM</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">WORKSPACE</div>
        <nav aria-label="Navigasi dashboard" className="admin-navigation">
          {ADMIN_NAVIGATION.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`admin-nav-link${active ? " is-active" : ""}`}
                href={item.href}
                key={item.href}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-avatar" aria-hidden="true">
            {adminName.slice(0, 1).toUpperCase()}
          </span>
          <span className="admin-identity">
            <strong>{adminName}</strong>
            <small>Administrator</small>
          </span>
          <button
            aria-label="Logout"
            className="admin-logout-icon"
            disabled={loggingOut}
            onClick={handleLogout}
            title="Logout"
            type="button"
          >
            ↗
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">HIMATIKA / ADMIN</span>
            <strong>
              {ADMIN_NAVIGATION.find(
                (item) =>
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href)),
              )?.label ?? "Kelola data"}
            </strong>
          </div>
          <Link className="admin-public-link" href="/">
            Lihat website <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <main className="admin-content">
          {logoutError && (
            <p className="admin-alert" role="alert">
              {logoutError}
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
