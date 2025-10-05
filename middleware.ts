import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle uploads directory requests
  if (pathname.startsWith('/uploads/')) {
    // Allow the request to proceed to static file serving
    return NextResponse.next()
  }

  // Continue with other requests
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/uploads/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}