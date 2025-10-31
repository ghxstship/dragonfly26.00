"use client"

import { 
import { useTranslations } from "next-intl"useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height, cards } from "@/design-tokens"
import { 
  Music, Palette, Sparkles, Theater, Film, Megaphone, 
  Building, Store, Heart, Quote
} from "lucide-react"

export function SolutionsSection(): JSX.Element {
  const t = useTranslations('marketing')

  const { tGen } = useGenerationalMarketing()
    
  const industries = [
    {
      icon: Music,
      titleKey: 'solutions.concerts.title',
      descriptionKey: 'solutions.concerts.description',
      color: 'text-purple-600'
    },
    {
      icon: Palette,
      titleKey: 'solutions.festivals.title',
      descriptionKey: 'solutions.festivals.description',
      color: 'text-pink-600'
    },
    {
      icon: Sparkles,
      titleKey: 'solutions.immersive.title',
      descriptionKey: 'solutions.immersive.description',
      color: 'text-blue-600'
    },
    {
      icon: Theater,
      titleKey: 'solutions.theatrical.title',
      descriptionKey: 'solutions.theatrical.description',
      color: 'text-indigo-600'
    },
    {
      icon: Film,
      titleKey: 'solutions.filmTv.title',
      descriptionKey: 'solutions.filmTv.description',
      color: 'text-red-600'
    },
    {
      icon: Megaphone,
      titleKey: 'solutions.brandActivations.title',
      descriptionKey: 'solutions.brandActivations.description',
      color: 'text-orange-600'
    },
    {
      icon: Building,
      titleKey: 'solutions.corporate.title',
      descriptionKey: 'solutions.corporate.description',
      color: 'text-gray-600'
    },
    {
      icon: Store,
      titleKey: 'solutions.tradeShows.title',
      descriptionKey: 'solutions.tradeShows.description',
      color: 'text-green-600'
    },
    {
      icon: Heart,
      titleKey: 'solutions.wellness.title',
      descriptionKey: 'solutions.wellness.description',
      color: 'text-teal-600'
    }
  ]
  
  return (
    <div>
      {/* Hero Section */}
      <section className={cn("relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto text-center", container['6xl'])}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-title uppercase text-gray-900 dark:text-white mb-6 leading-tight">
            {tGen('solutions.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto">
            {tGen('solutions.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className={cn(grid.cards3, "gap-8")}>
            {industries.map((industry, index) => {
              const Icon = industry.icon
              return (
                <div 
                  key={index}
                  className={cn(
                    "bg-gray-50 dark:bg-gray-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    padding.card,
                    border.card
                  )}
                >
                  <Icon className={cn("mb-4", height.iconLg, industry.color)} aria-hidden="true" />
                  <h2 className="text-xl sm:text-2xl font-heading uppercase text-gray-900 dark:text-white mb-3">
                    {tGen(industry.titleKey)}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {tGen(industry.descriptionKey)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4 font-heading uppercase">
              Proven Across Every Industry
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From strategic planning to risk management
            </p>
          </div>
          
          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8")}>
            {/* Grace O'Malley */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.graceOMalleyQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.graceOMalleyAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.graceOMalleyRole')}</p>
              </div>
            </div>
            
            {/* Sinbad */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.sinbadQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.sinbadAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.sinbadRole')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
