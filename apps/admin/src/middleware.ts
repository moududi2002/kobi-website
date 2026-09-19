//apps/admin/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Server-side guard:
 * - If visiting /login while a refresh cookie exists → let client verify.
 * - For protected routes, we let the client AuthProvider do the actual
 *   verification (since refresh token is HTTP-only and needs API call).
 * - This middleware only handles a couple of quick redirects and noindex.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never index admin
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  // Redirect /admin/* → /* (all admin routes are root-level)
  if (pathname.startsWith('/admin/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/admin/, '');
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};