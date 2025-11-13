import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Protect /dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
