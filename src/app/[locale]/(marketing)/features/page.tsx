import { FeaturesSection } from "@/marketing/components/sections/FeaturesSection"
import { RolesSection } from "@/marketing/components/sections/RolesSection"
import { HowItWorksSection } from "@/marketing/components/sections/HowItWorksSection"
import { IntegrationsSection } from "@/marketing/components/sections/IntegrationsSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Features | ATLVS",
  description: "Everything you need to manage live entertainment production. Five powerful hubs designed specifically for experiential production teams.",
}

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
      <IntegrationsSection />
      <CTASection />
    </div>
  )
}
