import { NextRequest, NextResponse } from "next/server";
import { OSS_TOKEN_COOKIE, OSS_USER_COOKIE } from "@/lib/auth/cookies";

function getOrigin(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1") && !configured.includes("0.0.0.0")) {
    return configured;
  }
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && !host.includes("0.0.0.0") && !host.includes("127.0.0.1") && !host.includes("localhost")) {
    return `${proto}://${host}`;
  }
  return req.nextUrl.origin;
}

const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const origin = getOrigin(req);

  if (error || !code) {
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error || "oauth_cancelled")}`, origin));
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  // Dograh handles the token exchange directly at /api/v1/auth/google/callback
  const upstream = await fetch(`${BACKEND}/api/v1/auth/google/callback?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent((err as any).detail || "oauth_failed")}`, origin));
  }

  const data = await upstream.json() as { token: string; user: { id: number; email: string; name?: string; organization_id: number; provider_id: string } };
  const redirectUrl = new URL("/after-sign-in", origin);
  const res = NextResponse.redirect(redirectUrl);

  res.cookies.set(OSS_TOKEN_COOKIE, data.token, { path: "/", httpOnly: false, sameSite: "lax" });
  res.cookies.set(OSS_USER_COOKIE, JSON.stringify(data.user), { path: "/", httpOnly: false, sameSite: "lax" });
  return res;
}
