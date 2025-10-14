import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const locale = await getLocale()
  const cookieStore = await cookies()
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Check authentication status
  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated - redirect to login
  if (!user) {
    redirect(`/login`)
  }

  // Check if user has completed onboarding by checking their profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, onboarding_completed')
    .eq('id', user.id)
    .single()

  // New user or incomplete onboarding - redirect to onboarding
  if (!profile || !profile.full_name || profile.onboarding_completed === false) {
    redirect(`/onboarding/welcome`)
  }

  // Authenticated and onboarded - redirect to dashboard
  redirect(`/workspace/personal/dashboard/overview`)
}
