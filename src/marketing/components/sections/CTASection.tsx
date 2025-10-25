"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { spacing, padding, container, height } from "@/design-tokens"

export function CTASection(): JSX.Element {
  const t = useTranslations('marketing.cta')
  
  return (
    <section className={cn("py-20 bg-gradient-to-br from-blue-600 to-purple-600", padding.sectionX)}>
      <div className={cn("mx-auto text-center", container['4xl'])}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          {t('title')}
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-4 md:mb-6 lg:mb-8">
          {t('subtitle')}
        </p>
        
        <div className={cn("flex flex-col sm:flex-row justify-center items-center", spacing.gap)}>
          <Link href="https://app.atlvs.one/en/signup">
            <Button variant="default" size="lg" className="w-full sm:w-auto bg-white dark:bg-gray-900 text-blue-600 hover:bg-gray-100">
              {t('ctaPrimary')}
              <ArrowRight className={cn("ml-2", height.icon)} aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white dark:bg-gray-900 hover:text-blue-600">
              {t('ctaSecondary')}
            </Button>
          </Link>
        </div>
        
        <div className="mt-4 md:mt-6 lg:mt-8 text-sm text-blue-100">
          {t('trustIndicators')}
        </div>
      </div>
    </section>
  )
}
