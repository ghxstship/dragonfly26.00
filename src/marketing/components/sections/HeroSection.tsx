"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, padding, border, height, container } from "@/design-tokens"

export function HeroSection(): JSX.Element {
  const t = useTranslations('marketing.hero')
  return (
    <section className={cn("relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("text-center mx-auto", container['4xl'])}>
          {/* Headline */}
          <h1 className="text-5xl md:text-3xl md:text-5xl lg:text-6xl lg:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('headline')}{" "}
            <span className="text-blue-600">{t('headlineHighlight')}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-4 md:mb-6 lg:mb-8 leading-relaxed">
            {t('subheadline')}
          </p>

          {/* Supporting Copy */}
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-5 md:mb-8 lg:mb-10  mx-auto">
            {t('supportingCopy')}
          </p>

          {/* CTAs */}
          <div className={cn("flex flex-col sm:flex-row justify-center items-center", spacing.gap)}>
            <Link href="https://app.atlvs.one/en/signup">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                {t('ctaPrimary')}
                <ArrowRight className={cn("ml-2", height.icon)} aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t('ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
            {t('trustIndicators')}
          </div>
        </div>

        {/* Hero Image/Screenshot Placeholder */}
        <div className="mt-8 md:mt-12 lg:mt-16 relative">
          <div className={cn("aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl border-gray-200 flex items-center justify-center", border.default)} role="img" aria-label={t('platformScreenshot')}>
            <div className="text-gray-400 text-lg">{t('platformScreenshot')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
