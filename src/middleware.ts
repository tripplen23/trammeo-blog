import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Add pathname header for layout to determine footer visibility
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  // Match only internationalized pathnames, exclude /studio
  matcher: ['/', '/(vi|en)/:path*', '/((?!_next|_vercel|studio|.*\\..*).*)'],
};