import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { HeroSection } from "@/marketing/components/sections/HeroSection"
import { TrustBar } from "@/marketing/components/sections/TrustBar"
import { ProblemSection } from "@/marketing/components/sections/ProblemSection"
import { SolutionSection } from "@/marketing/components/sections/SolutionSection"
import { FeaturesSection } from "@/marketing/components/sections/FeaturesSection"
import { HowItWorksSection } from "@/marketing/components/sections/HowItWorksSection"
import { RolesSection } from "@/marketing/components/sections/RolesSection"
import { TestimonialsSection } from "@/marketing/components/sections/TestimonialsSection"
import { PricingSection } from "@/marketing/components/sections/PricingSection"
import { SecuritySection } from "@/marketing/components/sections/SecuritySection"
import { FAQSection } from "@/marketing/components/sections/FAQSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import { MarketingNav } from "@/marketing/components/MarketingNav"
import { MarketingFooter } from "@/marketing/components/MarketingFooter"
import { setRequestLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  // Try to check authentication, but fall back to marketing page if it fails
  try {
    const cookieStore = await cookies()
    
    // Only check auth if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Create Supabase client
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

      // If authenticated, check onboarding and redirect accordingly
      if (user) {
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
    }
  } catch (error) {
    // If auth check fails, just show marketing page
    console.error('Auth check failed:', error)
  }

  // Not authenticated - show marketing home page
  return (
    <>
      <MarketingNav />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RolesSection />
        <TestimonialsSection />
        <PricingSection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </>
  )
}
