import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect account routes only (jobs are now public)
  const path = request.nextUrl.pathname;
  if (path.startsWith('/account')) {
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
