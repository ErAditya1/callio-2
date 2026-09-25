import { NextRequest, NextResponse } from "next/server";

function getPublicBackend() {
  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
  if (publicUrl && !publicUrl.includes("dograh-api")) {
    return publicUrl;
  }
  return "https://calling.cheetahagi.com";
}

function getOrigin(req: NextRequest) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    try {
      const u = new URL(process.env.GOOGLE_REDIRECT_URI);
      if (u.origin && !u.origin.includes("localhost") && !u.origin.includes("127.0.0.1")) {
        return u.origin;
      }
    } catch {}
  }
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

export async function GET(req: NextRequest) {
  const origin = getOrigin(req);
  const publicBackend = getPublicBackend();
  const redirectUri = `${origin}/api/auth/google/callback`;

  return NextResponse.redirect(
    `${publicBackend}/api/v1/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}
