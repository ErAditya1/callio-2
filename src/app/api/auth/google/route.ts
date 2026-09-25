import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "calling.cheetahagi.com";
  const proto = req.headers.get("x-forwarded-proto") || "https";

  let origin = `${proto}://${host}`;
  if (origin.includes("0.0.0.0") || origin.includes("127.0.0.1") || origin.includes("localhost")) {
    origin = "https://calling.cheetahagi.com";
  }

  const redirectUri = `${origin}/api/auth/google/callback`;
  const publicBackend = "https://calling.cheetahagi.com";

  return NextResponse.redirect(
    `${publicBackend}/api/v1/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}
