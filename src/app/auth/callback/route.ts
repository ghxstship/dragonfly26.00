import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Auth Callback Route Handler
 * 
 * Handles authentication callbacks from Supabase including:
 * - OAuth provider redirects (Google, GitHub, etc.)
 * - Email confirmation links
 * - Magic link sign-ins
 * - Password reset confirmations
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? ''
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Get locale from cookie or default to 'en'
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')
  const locale = localeCookie?.value || 'en'

  // Handle authentication errors
  if (error) {
    console.error('Auth callback error:', error, error_description)
    return NextResponse.redirect(
      `${requestUrl.origin}/${locale}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  // Exchange code for session
  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(
        `${requestUrl.origin}/${locale}/login?error=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, onboarding_completed')
        .eq('id', user.id)
        .single()

      // Determine redirect destination
      let redirectPath: string

      // ALWAYS check onboarding status first - never skip onboarding
      // regardless of the 'next' parameter
      if (!profile?.onboarding_completed || !profile?.full_name) {
        // User hasn't completed onboarding - send them there
        redirectPath = `/${locale}/onboarding/welcome`
      } else if (next && !next.includes('/onboarding/')) {
        // User is onboarded and has a next parameter - honor it
        // Ensure the next path includes locale if it doesn't already
        if (!next.startsWith(`/${locale}`)) {
          redirectPath = `/${locale}${next.startsWith('/') ? '' : '/'}${next}`
        } else {
          redirectPath = next
        }
      } else {
        // User is fully onboarded, no valid next path - send to dashboard
        redirectPath = `/${locale}/workspace/personal/dashboard/overview`
      }

      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
    }
  }

  // If no code or user, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/${locale}/login`)
}
