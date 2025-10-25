import { DetailedPricingSection } from "@/marketing/components/sections/DetailedPricingSection"
import { FAQSection } from "@/marketing/components/sections/FAQSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing that scales with you. From solo contractors to enterprise producers.",
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <DetailedPricingSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
