import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient as createClientServer } from '@/utils/supabase/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password'];

// OAuth related paths that should be accessible without authentication
const oauthRelatedPaths = ['/auth/callback', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for OAuth-related paths
  if (oauthRelatedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Create supabase server client
  const supabase = await createClientServer();

  // Get authenticated user - this revalidates the auth token every time
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Skip authentication for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.match(/\.(jpg|png|svg|css|js|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Check if the path is a public route and if the user is authenticated
  if (publicRoutes.includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no user and trying to access a protected route, redirect to login
  if (!user && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
