import { FeaturesSection } from "@/marketing/components/sections/FeaturesSection"
import { RolesSection } from "@/marketing/components/sections/RolesSection"
import { HowItWorksSection } from "@/marketing/components/sections/HowItWorksSection"
import { IntegrationsSection } from "@/marketing/components/sections/IntegrationsSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Features",
  description: "Everything you need to manage live entertainment production. Five powerful hubs designed specifically for experiential production teams.",
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function FeaturesPage({ params }: PageProps) {
  await params // Consume params to satisfy Next.js
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
