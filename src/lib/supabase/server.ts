import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
          } catch (error) {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
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
export const requireAuth = async (locale: string = 'en') => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect(`/${locale}/login`)
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
    .select('name, onboarding_completed')
    .eq('id', userId)
    .single()

  return {
    hasProfile: !!profile,
    hasName: !!profile?.name,
    isOnboarded: profile?.onboarding_completed === true
  }
}

/**
 * Require authenticated user with completed onboarding or redirect
 */
export const requireOnboarding = async (locale: string = 'en') => {
  const user = await requireAuth(locale)
  const status = await checkOnboardingStatus(user.id)

  if (!status.isOnboarded || !status.hasName) {
    redirect(`/${locale}/onboarding/welcome`)
  }

  return user
}
