import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 1. STOPS THE LOOP: If the user is ALREADY on the dashboard, do nothing.
  if (token && pathname.startsWith('/dashboard')) {
    return NextResponse.next(); 
  }

  // 2. Redirect logged-in users away from Auth pages
  if (token && (
    pathname === '/sign-in' || 
    pathname === '/sign-up' || 
    pathname === '/verify'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Redirect logged-out users trying to access protected routes
  if (!token &&( pathname.startsWith('/dashboard') || pathname === '/') ){
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/sign-in', '/sign-up', '/verify/:path*']
};