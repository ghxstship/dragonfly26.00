import { DetailedFeaturesSection } from "@/marketing/components/sections/DetailedFeaturesSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Features | ATLVS",
  description: "Everything you need to manage live entertainment production. Six powerful hubs with comprehensive modules designed specifically for experiential production teams.",
}

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <DetailedFeaturesSection />
      <CTASection />
    </div>
  )
}
