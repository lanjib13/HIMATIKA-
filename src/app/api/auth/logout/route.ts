import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getHimatikaApiUrl,
  getAdminAccessToken,
} from "@/lib/auth/session";

export async function POST() {
  const token = await getAdminAccessToken();
  let upstreamLogoutSucceeded = false;

  if (token) {
    try {
      const upstream = await fetch(getHimatikaApiUrl("/auth/logout"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      upstreamLogoutSucceeded = upstream.ok;
    } catch {
      upstreamLogoutSucceeded = false;
    }
  }

  const response = NextResponse.json(
    token && !upstreamLogoutSucceeded
      ? {
          success: false,
          message:
            "Sesi lokal sudah dihapus, tetapi API belum mengonfirmasi logout.",
        }
      : { success: true, message: "Logout berhasil." },
    { status: token && !upstreamLogoutSucceeded ? 502 : 200 },
  );
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
