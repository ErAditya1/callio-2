import { NextRequest, NextResponse } from "next/server";

const DOGRAH = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  return NextResponse.redirect(
    `${DOGRAH}/api/v1/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}
