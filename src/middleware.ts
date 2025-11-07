import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/navigation'
import { defaultLocale } from '@/i18n/config'

// Create the i18n middleware with locale detection from cookies
const intlMiddleware = createIntlMiddleware({
  ...routing,
  localeDetection: true, // Enable automatic locale detection
  localePrefix: 'always' as const,
  defaultLocale, // Explicitly set default locale
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for auth callback - it doesn't need locale prefix
  if (pathname === '/auth/callback') {
    return await updateSession(request)
  }
  
  // Handle root path explicitly - redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }
  
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
    supabaseResponse?.cookies.getAll().forEach((cookie: any) => {
      intlResponse.cookies.set(cookie)
    })
    
    return intlResponse
  }
  
  return supabaseResponse
}

export const config = {
  matcher: [
    // Match all paths including root
    '/',
    // Match auth callback (needs to be handled separately)
    '/auth/callback',
    // Match all locale-prefixed paths (all 27 supported locales)
    '/(en|es|fr|zh|hi|ar|ko|vi|pt|de|ja|ru|id|ur|bn|ta|te|mr|tr|sw|no|da|fi|sv|it|nl|pl)/:path*',
    /*
     * Match all other request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - static files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
