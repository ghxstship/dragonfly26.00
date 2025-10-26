import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { HeroSection } from "@/marketing/components/sections/HeroSection"
import { TrustBar } from "@/marketing/components/sections/TrustBar"
import { ProblemSection } from "@/marketing/components/sections/ProblemSection"
import { SolutionSection } from "@/marketing/components/sections/SolutionSection"
import { FeaturesOverviewSection } from "@/marketing/components/sections/FeaturesOverviewSection"
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
  
  // Check if we're on the app subdomain
  const headersList = await headers()
  const host = headersList.get('host') || ''
  
  // If on app.atlvs.one subdomain, redirect to login
  if (host.startsWith('app.')) {
    redirect(`/${locale}/login`)
  }
  
  // Otherwise, show marketing page (for atlvs.one)
  return (
    <>
      <MarketingNav />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <FeaturesOverviewSection />
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
