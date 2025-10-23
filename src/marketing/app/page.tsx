import { HeroSection } from "../components/sections/HeroSection"
import { TrustBar } from "../components/sections/TrustBar"
import { ProblemSection } from "../components/sections/ProblemSection"
import { SolutionSection } from "../components/sections/SolutionSection"
import { HowItWorksSection } from "../components/sections/HowItWorksSection"
import { FeaturesSection } from "../components/sections/FeaturesSection"
import { RolesSection } from "../components/sections/RolesSection"
import { SecuritySection } from "../components/sections/SecuritySection"
import { TestimonialsSection } from "../components/sections/TestimonialsSection"
import { PricingSection } from "../components/sections/PricingSection"
import { FAQSection } from "../components/sections/FAQSection"
import { CTASection } from "../components/sections/CTASection"

export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function HomePage(): JSX.Element {
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
