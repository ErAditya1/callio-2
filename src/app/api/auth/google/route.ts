import { NextRequest, NextResponse } from "next/server";

function getPublicBackend() {
  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
  if (publicUrl && !publicUrl.includes("dograh-api")) {
    return publicUrl;
  }
  return "https://calling.cheetahagi.com";
}

function getOrigin(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";

  if (host && !host.includes("0.0.0.0") && !host.includes("127.0.0.1") && !host.includes("localhost")) {
    return `${proto}://${host}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && !siteUrl.includes("localhost") && !siteUrl.includes("127.0.0.1") && !siteUrl.includes("0.0.0.0")) {
    return siteUrl;
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
