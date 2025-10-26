"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { Quote } from "lucide-react"

export function TestimonialsSection(): JSX.Element {
  const t = useTranslations('marketing.testimonials')
  
  return (
    <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {t('title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
        
        <div className={cn("grid md:grid-cols-3", spacing.gapLoose)}>
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.section)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{t('testimonial1Quote')}</p>
            <div>
              <p className="font-heading uppercase text-gray-900 dark:text-white">{t('testimonial1Author')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('testimonial1Role')}</p>
            </div>
          </div>
          
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.section)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{t('testimonial2Quote')}</p>
            <div>
              <p className="font-heading uppercase text-gray-900 dark:text-white">{t('testimonial2Author')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('testimonial2Role')}</p>
            </div>
          </div>
          
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.section)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{t('testimonial3Quote')}</p>
            <div>
              <p className="font-heading uppercase text-gray-900 dark:text-white">{t('testimonial3Author')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('testimonial3Role')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
