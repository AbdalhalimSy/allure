import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect manage account routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*'],
};
