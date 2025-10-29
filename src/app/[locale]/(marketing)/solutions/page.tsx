import { SolutionsSection } from "@/marketing/components/sections/SolutionsSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Solutions by Industry | ATLVS",
  description: "Purpose-built solutions for concerts, festivals, immersive events, theatrical productions, film & TV, brand activations, corporate events, trade shows, and wellness experiences.",
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <SolutionsSection />
      <CTASection />
    </div>
  )
}
