import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";

  let origin = host ? `${proto}://${host}` : "";
  if (!origin || origin.includes("0.0.0.0") || origin.includes("127.0.0.1") || origin.includes("localhost")) {
    origin = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://calling.cheetahagi.com";
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const publicBackend = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://calling.cheetahagi.com";

  return NextResponse.redirect(
    `${publicBackend}/api/v1/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}

