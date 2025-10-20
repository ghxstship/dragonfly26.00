import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect as nextRedirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error: any) {
            // Handle cookie setTing errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error: any) {
            // Handle cookie removal errors
          }
        },
      },
    }
  )
}

/**
 * Get the currently authenticated user or redirect to login
 */
export const requireAuth = async () => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    const locale = await getLocale()
    nextRedirect(`/${locale}/login`)
  }

  return user
}

/**
 * Check if user has completed onboarding
 */
export const checkOnboardingStatus = async (userId: string) => {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, onboarding_completed')
    .eq('id', userId)
    .single()

  return {
    hasProfile: !!profile,
    hasName: !!profile?.full_name,
    isOnboarded: profile?.onboarding_completed === true
  }
}

/**
 * Require authenticated user with completed onboarding or redirect
 */
export const requireOnboarding = async () => {
  const user = await requireAuth()
  const status = await checkOnboardingStatus(user.id)

  if (!status.isOnboarded || !status.hasName) {
    const locale = await getLocale()
    nextRedirect(`/${locale}/onboarding/welcome`)
  }

  return user
}
