import { PricingSection } from "@/marketing/components/sections/PricingSection"
import { FAQSection } from "@/marketing/components/sections/FAQSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing that scales with you. From solo contractors to enterprise producers.",
}

export default function PricingPage()
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing That Scales With You
          </h1>
          <p className="text-xl text-gray-600">
            From solo contractors to enterprise producers, we have a plan that fits your needs.
          </p>
        </div>
      </div>
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
