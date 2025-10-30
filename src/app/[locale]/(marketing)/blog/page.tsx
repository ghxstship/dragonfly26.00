"use client"

import { CTASection } from "@/marketing/components/sections/CTASection"
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { cards, height, padding } from "@/design-tokens"
import { Quote } from "lucide-react"

export default function BlogPage() {
  const { tGen } = useGenerationalMarketing()

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title uppercase text-gray-900 dark:text-white mb-6">
              Insights & Updates
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
              Best practices, industry trends, and product updates for production professionals.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-8 lg:p-12 text-center mb-12">
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-heading uppercase text-gray-900 dark:text-white mb-2">Coming Soon</p>
            <p className="text-gray-600 dark:text-gray-400">We&apos;re preparing valuable content for you. Check back soon!</p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Captain Jack Sparrow */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.captainJackSparrowQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainJackSparrowAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainJackSparrowRole')}</p>
              </div>
            </div>

            {/* Popeye */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.popeyeQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.popeyeAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.popeyeRole')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
