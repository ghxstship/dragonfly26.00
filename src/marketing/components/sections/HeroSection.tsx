"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { spacing, padding, border, height, container } from "@/design-tokens"
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { useTranslations } from "next-intl"

export function HeroSection(): JSX.Element {
  const t = useTranslations('marketing')

  const { tGen } = useGenerationalMarketing()
  return (
    <section className={cn("relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("text-center mx-auto", container['4xl'])}>
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-title uppercase text-gray-900 dark:text-white mb-6 leading-tight">
            {tGen('hero.headline')}{" "}
            {tGen('hero.headlineHighlightPrefix') && (
              <span className="text-gray-900 dark:text-white">{tGen('hero.headlineHighlightPrefix')}{" "}</span>
            )}
            <span className="text-blue-600">{tGen('hero.headlineHighlightMain') || tGen('hero.headlineHighlight')}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed">
            {tGen('hero.subheadline')}
          </p>

          {/* Supporting Copy */}
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-5 md:mb-8 lg:mb-10  mx-auto">
            {tGen('hero.supportingCopy')}
          </p>

          {/* CTAs */}
          <div className={cn("flex flex-col sm:flex-row justify-center items-center", spacing.gap)}>
            <Link href="/signup">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                {tGen('hero.ctaPrimary')}
                <ArrowRight className={cn("ml-2", height.icon)} aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {tGen('hero.ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
            {tGen('hero.trustIndicators')}
          </div>
        </div>

        {/* Hero Image/Screenshot Placeholder */}
        <div className="mt-8 md:mt-12 lg:mt-16 relative">
          <div className={cn("aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-2xl border-gray-200 dark:border-gray-700 flex items-center justify-center", border.default)} role="img" aria-label={tGen('hero.platformScreenshot')}>
            <div className="text-gray-400 dark:text-gray-600 text-lg">{tGen('hero.platformScreenshot')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
