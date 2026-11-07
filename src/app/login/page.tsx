"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    admin?: {
      role?: "admin_hima" | "admin_ekraf";
    };
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as LoginResponse;
      if (!response.ok || payload.success !== true) {
        setError(payload.message ?? "Login gagal. Periksa kembali kredensial.");
        return;
      }
      router.replace(
        payload.data?.admin?.role === "admin_ekraf"
          ? "/dashboard/tokraf"
          : "/dashboard",
      );
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi layanan login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div aria-hidden="true" className="login-art">
        <span className="login-orbit login-orbit-one" />
        <span className="login-orbit login-orbit-two" />
        <span className="login-art-monogram">H</span>
        <span className="login-art-caption">HIMPUNAN MAHASISWA INFORMATIKA</span>
      </div>
      <section aria-labelledby="login-title" className="login-panel">
        <Link className="login-back-link" href="/">
          ← Kembali ke website
        </Link>
        <div className="login-brand-mark">H</div>
        <span className="admin-eyebrow">RUANG PENGELOLA</span>
        <h1 id="login-title">Selamat datang<br />kembali.</h1>
        <p className="login-description">
          Masuk untuk mengelola informasi dan aktivitas HIMATIKA.
        </p>

        {process.env.NODE_ENV !== "production" && (
          <p className="login-demo-hint">
            Akun demo lokal (development saja)
            <strong>admin@himatika.ac.id</strong>
            <strong>himatika123</strong>
            <strong>ekraf@himatika.ac.id</strong>
            <strong>ekraf123</strong>
          </p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="admin-field" htmlFor="login-email">
            Email
            <input
              autoComplete="username"
              id="login-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@himatika.ac.id"
              required
              type="email"
              value={email}
            />
          </label>
          <label className="admin-field" htmlFor="login-password">
            Kata sandi
            <input
              autoComplete="current-password"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && (
            <p className="admin-alert" role="alert">
              {error}
            </p>
          )}
          <button className="admin-primary-button login-submit" disabled={loading} type="submit">
            {loading ? "Memverifikasi…" : "Masuk ke dashboard"}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="login-security-note">
          Sesi admin dilindungi dan token tidak disimpan di browser.
        </p>
      </section>
    </main>
  );
}
