import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params
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
    redirect(`/${locale}/login`)
  }

  // Check if user has completed onboarding by checking their profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, onboarding_completed')
    .eq('id', user.id)
    .single()

  // New user or incomplete onboarding - redirect to onboarding
  if (!profile || !profile.full_name || profile.onboarding_completed === false) {
    redirect(`/${locale}/onboarding/welcome`)
  }

  // Authenticated and onboarded - redirect to dashboard
  redirect(`/${locale}/workspace/personal/dashboard/overview`)
}
