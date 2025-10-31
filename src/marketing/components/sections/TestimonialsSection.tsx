"use client"

import { useGenerationalMarketing } from '@/hooks/use-generational-marketing'
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height, cards } from "@/design-tokens"
import { Quote } from "lucide-react"
import { useTranslations } from "next-intl"

export function TestimonialsSection(): JSX.Element {
  const t = useTranslations('marketing')

  const { tGen } = useGenerationalMarketing()
  
  return (
    <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {tGen('testimonials.title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {tGen('testimonials.subtitle')}
          </p>
        </div>
        
        <div className={cn(cards.grid1to3)}>
          {/* Captain Picard */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.captainPicardQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainPicardAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainPicardRole')}</p>
            </div>
          </div>
          
          {/* Zheng Yi Sao */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.zhengYiSaoQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.zhengYiSaoAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.zhengYiSaoRole')}</p>
            </div>
          </div>
          
          {/* Captain Ahab */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.captainAhabQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainAhabAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainAhabRole')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
