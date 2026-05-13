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

  // Localhost handling (e.g., schoolos.localhost:3000)
  if (hostname.includes('localhost')) {
    if (parts.length >= 2 && !parts[0].includes('localhost')) {
      subdomain = parts[0];
    }
  } 
  // Vercel handling (e.g., schoolos.cognis-platform.vercel.app)
  else if (hostname.includes('vercel.app')) {
    // If it has 4 or more parts, the first part is a subdomain
    // e.g., app.name.vercel.app -> parts.length is 4
    if (parts.length >= 4) {
      subdomain = parts[0];
    }
  }
  // Custom Domain handling (e.g., schoolos.cognis.in)
  else if (parts.length >= 3) {
    subdomain = parts[0];
  }

  // 3. Special Subdomain Rewrites
  if (subdomain.toLowerCase() === 'admin') {
    const rewriteUrl = new URL(`/admin${url.pathname === '/' ? '' : url.pathname}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // 4. Traffic Redirection
  // If we found a subdomain AND it's not a reserved keyword
  if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
    
    // Avoid infinite loops if we are already in the internal path
    if (!url.pathname.startsWith('/app-sites') && !url.pathname.startsWith('/_next')) {
      
      // Rewrite the URL to the app-sites dynamic route
      // e.g. schoolos.cognis.in/download -> /app-sites/schoolos/download
      const rewriteUrl = new URL(`/app-sites/${subdomain}${url.pathname}`, request.url);
      console.log(`[Middleware] Rewriting ${hostname}${url.pathname} -> ${rewriteUrl.pathname}`);
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
