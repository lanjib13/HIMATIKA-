import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  DEMO_EKRAF_SESSION_TOKEN,
  DEMO_SESSION_TOKEN,
  getHimatikaApiUrl,
  isDemoAuthEnabled,
} from "@/lib/auth/session";

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    access_token?: string;
    admin?: {
      user_id?: string;
      nama?: string;
      email?: string;
      role?: "admin_hima" | "admin_ekraf";
    };
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: NextRequest) {
  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Format request login tidak valid." },
      { status: 400 },
    );
  }

  if (
    !isRecord(credentials) ||
    typeof credentials.email !== "string" ||
    typeof credentials.password !== "string"
  ) {
    return NextResponse.json(
      { success: false, message: "Email dan kata sandi wajib diisi." },
      { status: 400 },
    );
  }

  if (isDemoAuthEnabled()) {
    const isHimaAdmin =
      credentials.email.trim().toLowerCase() === "admin@himatika.ac.id" &&
      credentials.password === "himatika123";
    const isEkrafAdmin =
      credentials.email.trim().toLowerCase() === "ekraf@himatika.ac.id" &&
      credentials.password === "ekraf123";
    if (!isHimaAdmin && !isEkrafAdmin) {
      return NextResponse.json(
        { success: false, message: "Email atau kata sandi tidak valid." },
        { status: 401 },
      );
    }

    const demoAdmin = isEkrafAdmin
      ? {
          user_id: "demo-ekraf",
          nama: "Admin Ekraf Demo",
          email: "ekraf@himatika.ac.id",
          role: "admin_ekraf" as const,
        }
      : {
          user_id: "demo-admin",
          nama: "Admin Demo",
          email: "admin@himatika.ac.id",
          role: "admin_hima" as const,
        };
    const response = NextResponse.json({
      success: true,
      message: "Login demo berhasil.",
      data: {
        admin: demoAdmin,
      },
    });
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      isEkrafAdmin ? DEMO_EKRAF_SESSION_TOKEN : DEMO_SESSION_TOKEN,
      {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
      },
    );
    return response;
  }

  let upstream: Response;
  try {
    upstream = await fetch(getHimatikaApiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Layanan login HIMATIKA tidak dapat dihubungi." },
      { status: 502 },
    );
  }

  let payload: LoginResponse;
  try {
    payload = (await upstream.json()) as LoginResponse;
  } catch {
    return NextResponse.json(
      { success: false, message: "Respons login dari API tidak valid." },
      { status: 502 },
    );
  }

  const accessToken = payload.data?.access_token;
  if (!upstream.ok || payload.success !== true || !accessToken) {
    return NextResponse.json(
      {
        success: false,
        message:
          upstream.status === 401 || upstream.status === 400
            ? "Email atau kata sandi tidak valid."
            : payload.message ?? "Login HIMATIKA gagal.",
      },
      { status: upstream.status === 400 ? 401 : upstream.status },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: payload.message ?? "Login berhasil.",
    data: { admin: payload.data?.admin },
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  return response;
}
