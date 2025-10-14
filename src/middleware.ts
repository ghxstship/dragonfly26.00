import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/navigation'

// Create the i18n middleware with locale detection from cookies
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request)
  
  // If i18n middleware returns a redirect, return it immediately
  if (intlResponse && intlResponse.status === 307) {
    return intlResponse
  }
  
  // Then handle Supabase session
  const supabaseResponse = await updateSession(request)
  
  // If there's an i18n response (locale was added to the path), merge with Supabase
  if (intlResponse) {
    // Copy Supabase session cookies to the i18n response
    supabaseResponse?.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie)
    })
    
    return intlResponse
  }
  
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
