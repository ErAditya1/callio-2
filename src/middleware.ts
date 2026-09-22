import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getServerBackendUrl } from '@/lib/apiClient';
import { OSS_TOKEN_COOKIE } from '@/lib/auth/cookies';

// DEMO FLOW (frontend-only prototype): every route is open without login so the
// full click-through (auth → create-agent → payment → dashboard) can be built
// and reviewed with no backend running. Set to false to restore the login gate.
const DEMO_OPEN_ROUTES = false;

// Paths that don't require authentication in OSS mode.
// Marketing pages, demo simulators, voices showcase, pricing, and all auth routes.
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
  '/login',
  '/signup',
  '/auth/login',
  '/auth/signup',
  '/auth/signin',
  '/after-sign-in',
  '/handler',
  '/embed'
];

let cachedAuthProvider: string | null = null;

async function fetchAuthProvider(): Promise<string> {
  if (cachedAuthProvider) {
    return cachedAuthProvider;
  }

  const backendUrl = getServerBackendUrl();
  const candidateUrls: string[] = [];
  if (backendUrl.includes("localhost")) {
    candidateUrls.push(backendUrl.replace("localhost", "127.0.0.1") + "/api/v1/health");
    candidateUrls.push(backendUrl + "/api/v1/health");
  } else if (backendUrl.includes("127.0.0.1")) {
    candidateUrls.push(backendUrl + "/api/v1/health");
    candidateUrls.push(backendUrl.replace("127.0.0.1", "localhost") + "/api/v1/health");
  } else {
    candidateUrls.push(backendUrl + "/api/v1/health");
  }

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        cachedAuthProvider = (data.auth_provider as string) || 'local';
        return cachedAuthProvider;
      }
    } catch {
      // Try next candidate URL
    }
  }

  return 'local'; // Default to local in dev/OSS mode
}

export async function middleware(request: NextRequest) {
  // DEMO: entire app open — no auth check on any route.
  if (DEMO_OPEN_ROUTES) {
    return NextResponse.next();
  }

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
     * - public static assets (anything with a file extension, e.g. /icon.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf)).*)',
  ],
};
