import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getServerBackendUrl } from '@/lib/apiClient';

const OSS_TOKEN_COOKIE = 'dograh_auth_token';

// Paths that don't require authentication in OSS mode.
// Marketing pages, demo simulators, voices showcase, pricing, and auth endpoints.
const PUBLIC_PATHS = [
  '/',
  '/ai-voice-agents',
  '/ai-calling',
  '/inbound-calls',
  '/outbound-calls',
  '/voices',
  '/demo',
  '/use-cases',
  '/pricing',
  '/integrations',
  '/customer-stories',
  '/security',
  '/about',
  '/contact',
  '/resources',
  '/blog',
  '/faq',
  '/legal',
  '/terms',
  '/privacy',
  '/cookies',
  '/status',
  '/auth/login',
  '/auth/signup',
  '/embed'
];

let cachedAuthProvider: string | null = null;

async function fetchAuthProvider(): Promise<string> {
  if (cachedAuthProvider) {
    return cachedAuthProvider;
  }

  try {
    const backendUrl = getServerBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/health`, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const data = await res.json();
      cachedAuthProvider = (data.auth_provider as string) || 'local';
      return cachedAuthProvider;
    }
  } catch {
    // Backend not reachable — fall through without caching so we retry next request.
  }

  return 'local'; // Default to local in dev/OSS mode
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // FAST PATH: Allow public marketing & demo paths immediately without any backend network call
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const authProvider = await fetchAuthProvider();

  // Only handle OSS mode
  if (authProvider !== 'local') {
    return NextResponse.next();
  }

  const token = request.cookies.get(OSS_TOKEN_COOKIE)?.value;

  // If no token on private/dashboard routes, redirect to login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public static assets (anything with a file extension, e.g. /dograh-logo.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf)).*)',
  ],
};
