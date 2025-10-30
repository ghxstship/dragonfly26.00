"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, container } from "@/design-tokens"
import { Ghost, Plane, Sword, Compass, Target, Shield, Handshake, Eye, Users, Star } from "lucide-react"

export function RolesSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  return (
    <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("text-center mb-16 mx-auto", container['2xl'])}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {tGen('title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {tGen('subtitle')}
          </p>
        </div>
        
        <div className={grid.cards3}>
          {/* Phantom */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Ghost className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('phantom.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('phantom.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('phantom.description')}</p>
          </div>

          {/* Aviator */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Plane className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('aviator.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('aviator.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('aviator.description')}</p>
          </div>

          {/* Gladiator */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Sword className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('gladiator.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('gladiator.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('gladiator.description')}</p>
          </div>

          {/* Navigator */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Compass className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('navigator.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('navigator.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('navigator.description')}</p>
          </div>

          {/* Deviator */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Target className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('deviator.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('deviator.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('deviator.description')}</p>
          </div>

          {/* Raider */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Shield className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('raider.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('raider.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('raider.description')}</p>
          </div>

          {/* Partner */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white">
              <Handshake className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('partner.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('partner.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('partner.description')}</p>
          </div>

          {/* Visitor */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white">
              <Eye className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('visitor.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('visitor.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('visitor.description')}</p>
          </div>

          {/* Vendor */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white">
              <Users className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('vendor.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('vendor.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('vendor.description')}</p>
          </div>

          {/* Ambassador */}
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors", padding.section)}>
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white">
              <Star className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('ambassador.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{tGen('ambassador.level')}</p>
            <p className="text-gray-600 dark:text-gray-400">{tGen('ambassador.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
