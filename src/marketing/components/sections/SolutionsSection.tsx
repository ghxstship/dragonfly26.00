"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { 
  Music, Palette, Sparkles, Theater, Film, Megaphone, 
  Building, Store, Heart
} from "lucide-react"

export function SolutionsSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  const industries = [
    {
      icon: Music,
      titleKey: 'concerts.title',
      descriptionKey: 'concerts.description',
      color: 'text-purple-600'
    },
    {
      icon: Palette,
      titleKey: 'festivals.title',
      descriptionKey: 'festivals.description',
      color: 'text-pink-600'
    },
    {
      icon: Sparkles,
      titleKey: 'immersive.title',
      descriptionKey: 'immersive.description',
      color: 'text-blue-600'
    },
    {
      icon: Theater,
      titleKey: 'theatrical.title',
      descriptionKey: 'theatrical.description',
      color: 'text-indigo-600'
    },
    {
      icon: Film,
      titleKey: 'filmTv.title',
      descriptionKey: 'filmTv.description',
      color: 'text-red-600'
    },
    {
      icon: Megaphone,
      titleKey: 'brandActivations.title',
      descriptionKey: 'brandActivations.description',
      color: 'text-orange-600'
    },
    {
      icon: Building,
      titleKey: 'corporate.title',
      descriptionKey: 'corporate.description',
      color: 'text-gray-600'
    },
    {
      icon: Store,
      titleKey: 'tradeShows.title',
      descriptionKey: 'tradeShows.description',
      color: 'text-green-600'
    },
    {
      icon: Heart,
      titleKey: 'wellness.title',
      descriptionKey: 'wellness.description',
      color: 'text-teal-600'
    }
  ]
  
  return (
    <div>
      {/* Hero Section */}
      <section className={cn("relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto text-center", container['6xl'])}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-title uppercase text-gray-900 dark:text-white mb-6 leading-tight">
            {tGen('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto">
            {tGen('hero.subtitle')}
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
    </div>
  )
}
