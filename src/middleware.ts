import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/config'

// Create the i18n middleware with locale detection from cookies
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
})

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request)
  
  // Then handle Supabase session
  const supabaseResponse = await updateSession(request)
  
  // Merge headers if both middlewares return responses
  if (intlResponse && supabaseResponse) {
    const response = NextResponse.next({
      request: {
        headers: intlResponse.headers,
      },
    })
    
    // Copy Supabase session cookies to the response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie)
    })
    
    return response
  }
  
  return intlResponse || supabaseResponse
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
