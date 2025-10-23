import { HeroSection } from '@/marketing/components/sections/HeroSection'
import { TrustBar } from '@/marketing/components/sections/TrustBar'
import { ProblemSection } from '@/marketing/components/sections/ProblemSection'
import { SolutionSection } from '@/marketing/components/sections/SolutionSection'
import { HowItWorksSection } from '@/marketing/components/sections/HowItWorksSection'
import { FeaturesSection } from '@/marketing/components/sections/FeaturesSection'
import { RolesSection } from '@/marketing/components/sections/RolesSection'
import { SecuritySection } from '@/marketing/components/sections/SecuritySection'
import { TestimonialsSection } from '@/marketing/components/sections/TestimonialsSection'
import { PricingSection } from '@/marketing/components/sections/PricingSection'
import { FAQSection } from '@/marketing/components/sections/FAQSection'
import { CTASection } from '@/marketing/components/sections/CTASection'

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <RolesSection />
      <SecuritySection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
