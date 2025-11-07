"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { CountrySelector } from "@/components/layout/country-selector"
import { TooltipProvider } from "@/components/ui/tooltip"
import { GenerationalLanguageToggle } from "@/components/marketing/GenerationalLanguageToggle"

export function MarketingNav(): JSX.Element {
  const t = useTranslations('marketing.nav')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <TooltipProvider>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className={cn("mx-auto px-3 sm:px-4 md:px-6 lg:px-8", container['6xl'])}>
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center py-2 -ml-2 pl-2">
              <div className="text-xl sm:text-2xl font-pixel text-gray-900 dark:text-white tracking-wider">{t('logo')}</div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link href="/solutions" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase text-sm">
                {t('solutions')}
              </Link>
              <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase text-sm">
                {t('features')}
              </Link>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase text-sm">
                {t('pricing')}
              </Link>
              <Link href="/docs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase text-sm">
                {t('docs')}
              </Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase text-sm">
                {t('blog')}
              </Link>
              <Link href="/company" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase text-sm">
                {t('company')}
              </Link>
            </div>

            {/* CTA Buttons + Country/Theme Toggles */}
            <div className="hidden md:flex items-center gap-2">
              <CountrySelector />
              <GenerationalLanguageToggle />
              <ThemeToggle />
              <div className="hidden lg:block w-px h-6 bg-gray-300 dark:bg-gray-700" />
              <Link href="/login" className="hidden lg:inline-block">
                <Button variant="ghost">{t('signIn')}</Button>
              </Link>
              <Link href="/access" className="hidden lg:inline-block">
                <Button variant="default">{t('startFree')}</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t('toggleMenu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className={height.iconLg} aria-hidden="true" /> : <Menu className={height.iconLg} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-4 py-4 space-y-3">
              {/* Primary CTAs - Top (Most Important) */}
              <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-800">
                <Link href="/access" className="block">
                  <Button variant="default" className="w-full">{t('startFree')}</Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">{t('signIn')}</Button>
                </Link>
              </div>

              {/* Navigation Links */}
              <Link
                href="/solutions"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-heading uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('solutions')}
              </Link>
              <Link
                href="/features"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-heading uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('features')}
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-heading uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('pricing')}
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-heading uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('docs')}
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-heading uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('blog')}
              </Link>
              <Link
                href="/company"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-heading uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('company')}
              </Link>
              
              {/* Secondary Settings - Bottom (iOS/Android Pattern) */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
                  <CountrySelector />
                  <GenerationalLanguageToggle />
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </TooltipProvider>
  )
}
