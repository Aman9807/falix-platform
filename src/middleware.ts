import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Define reserved subdomains
  const reservedSubdomains = ['www', 'admin', 'login', 'api'];

  // Extract subdomain (e.g., schoolos.falix.in -> schoolos)
  // For local development, this handles schoolos.localhost:3000
  const parts = hostname.split('.');
  let subdomain = '';

  if (parts.length >= 3) {
    // If it's something like schoolos.falix.in
    subdomain = parts[0];
  } else if (parts.length === 2 && parts[1].includes('localhost')) {
    // If it's something like schoolos.localhost
    subdomain = parts[0];
  }

  // If there's a subdomain and it's not reserved
  if (subdomain && !reservedSubdomains.includes(subdomain)) {
    // Check if we are already in the app-sites path to avoid infinite loops
    if (!url.pathname.startsWith('/app-sites')) {
      // Rewrite to the internal dynamic route
      // e.g., schoolos.falix.in/ -> /app-sites/schoolos
      // e.g., schoolos.falix.in/download -> /app-sites/schoolos/download
      return NextResponse.rewrite(new URL(`/app-sites/${subdomain}${url.pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
