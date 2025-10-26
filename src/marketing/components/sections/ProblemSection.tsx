"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { AlertCircle, FileX, DollarSign, MessageSquareX } from "lucide-react"

export function ProblemSection(): JSX.Element {
  const t = useTranslations('marketing.problem')
  
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {t('title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
        
        <div className={grid.cards4}>
          <div className="text-center">
            <AlertCircle className={cn("mx-auto mb-4 text-red-500", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{t('pain1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('pain1Description')}</p>
          </div>
          <div className="text-center">
            <FileX className={cn("mx-auto mb-4 text-red-500", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{t('pain2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('pain2Description')}</p>
          </div>
          <div className="text-center">
            <DollarSign className={cn("mx-auto mb-4 text-red-500", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{t('pain3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('pain3Description')}</p>
          </div>
          <div className="text-center">
            <MessageSquareX className={cn("mx-auto mb-4 text-red-500", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{t('pain4Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('pain4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
