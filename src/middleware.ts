import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect account and jobs routes
  const path = request.nextUrl.pathname;
  if (path.startsWith('/account') || path.startsWith('/jobs')) {
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/jobs', '/jobs/:path*'],
};
