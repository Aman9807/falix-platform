import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Define reserved paths/subdomains
  const reservedSubdomains = ['www', 'admin', 'login', 'api', 'profile', 'about', 'pricing', 'reviews', 'downloads'];

  // 2. Extract subdomain logic
  const parts = hostname.split('.');
  let subdomain = '';

  // Handle different environments
  if (hostname.includes('localhost')) {
    if (parts.length >= 2 && !parts[0].includes('localhost')) {
      subdomain = parts[0];
    }
  } else if (hostname.includes('vercel.app')) {
    if (parts.length >= 4) subdomain = parts[0];
  } else {
    // Custom Domain (e.g., admin.flynx.site)
    // If we have admin.flynx.site, parts.length is 3
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  const sub = subdomain.toLowerCase();
  console.log(`[Middleware] Host: ${hostname}, Subdomain: ${sub || '(none)'}, Path: ${url.pathname}`);

  // 3. Special Subdomain Rewrites
  if (sub === 'admin') {
    const rewriteUrl = new URL(`/admin${url.pathname === '/' ? '' : url.pathname}`, request.url);
    console.log(`[Middleware] Admin Routing -> ${rewriteUrl.pathname}`);
    return NextResponse.rewrite(rewriteUrl);
  }

  // 4. Traffic Redirection for dynamic app sites
  if (sub && !reservedSubdomains.includes(sub)) {
    if (!url.pathname.startsWith('/app-sites') && !url.pathname.startsWith('/_next')) {
      const rewriteUrl = new URL(`/app-sites/${sub}${url.pathname}`, request.url);
      console.log(`[Middleware] App-Site Routing -> ${rewriteUrl.pathname}`);
      return NextResponse.rewrite(rewriteUrl);
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
