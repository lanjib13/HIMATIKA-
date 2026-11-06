import "server-only";
import { cookies } from "next/headers";
import type { components } from "@/lib/api/schema";

export const ADMIN_SESSION_COOKIE = "himatika_admin_session";
export const DEMO_SESSION_TOKEN = "himatika-demo-session";

const demoAdmin: components["schemas"]["Admin"] = {
  user_id: "demo-admin",
  nama: "Admin Demo",
  email: "admin@himatika.ac.id",
};

async function getAdminSessionValue() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
}

export async function getAdminAccessToken() {
  const sessionValue = await getAdminSessionValue();
  return sessionValue === DEMO_SESSION_TOKEN ? undefined : sessionValue;
}

export function isDemoAuthEnabled() {
  return process.env.NODE_ENV !== "production";
}

export function isDemoSession(value: string | undefined) {
  return isDemoAuthEnabled() && value === DEMO_SESSION_TOKEN;
}

export function getHimatikaApiUrl(path: string) {
  const baseUrl = (
    process.env.HIMATIKA_API_URL ?? "http://localhost:5000/api/v1"
  ).replace(/\/+$/, "");
  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}

export async function getAuthenticatedAdmin() {
  const sessionValue = await getAdminSessionValue();
  if (isDemoSession(sessionValue)) return demoAdmin;

  const token = sessionValue;
  if (!token) return null;

  let response: Response;
  try {
    response = await fetch(getHimatikaApiUrl("/auth/me"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new Error("Layanan autentikasi HIMATIKA tidak dapat dihubungi.");
  }

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error("Status autentikasi admin tidak dapat diverifikasi.");
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: components["schemas"]["Admin"];
  };
  if (payload.success !== true || !payload.data) return null;
  return payload.data;
}
