"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"

export function HowItWorksSection(): JSX.Element {
  const t = useTranslations('marketing.howItWorks')
  
  return (
    <section className={cn("py-20 bg-white", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mx-auto mb-4" aria-hidden="true">1</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('step1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('step1Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mx-auto mb-4" aria-hidden="true">2</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('step2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('step2Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mx-auto mb-4" aria-hidden="true">3</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('step3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('step3Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mx-auto mb-4" aria-hidden="true">4</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('step4Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('step4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
