import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle uploads directory requests with aggressive no-cache headers
  if (pathname.startsWith('/uploads/')) {
    const response = NextResponse.next()
    
    // Add aggressive no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  }

  // Continue with other requests
  return NextResponse.next()
}

export const config = {
  matcher: '/uploads/:path*',
}