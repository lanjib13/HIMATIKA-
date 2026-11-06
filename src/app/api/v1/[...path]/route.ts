import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAccessToken,
  getHimatikaApiUrl,
} from "@/lib/auth/session";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyApiRequest(
  request: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;
  const token = await getAdminAccessToken();
  const upstreamUrl = new URL(
    `${getHimatikaApiUrl(path.map(encodeURIComponent).join("/"))}${request.nextUrl.search}`,
  );
  const headers = new Headers();

  for (const headerName of ["accept", "content-type"]) {
    const value = request.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "API HIMATIKA tidak dapat dihubungi." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  responseHeaders.set("cache-control", "no-store");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxyApiRequest;
export const POST = proxyApiRequest;
export const PUT = proxyApiRequest;
export const PATCH = proxyApiRequest;
export const DELETE = proxyApiRequest;
