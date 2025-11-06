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
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", container['6xl'])}>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center py-2 -ml-2 pl-2">
              <div className="text-xl sm:text-2xl font-pixel text-gray-900 dark:text-white tracking-wider">{t('logo')}</div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-wrap md:flex-nowrap items-center space-x-2 md:space-x-4 lg:space-x-4 md:space-x-6 lg:space-x-8">
              <Link href="/solutions" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase">
                {t('solutions')}
              </Link>
              <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase">
                {t('features')}
              </Link>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase">
                {t('pricing')}
              </Link>
              <Link href="/docs" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase">
                {t('docs')}
              </Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase">
                {t('blog')}
              </Link>
              <Link href="/company" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-heading uppercase">
                {t('company')}
              </Link>
            </div>

            {/* CTA Buttons + Country/Theme Toggles */}
            <div className="hidden md:flex flex-wrap md:flex-nowrap items-center space-x-2">
              <CountrySelector />
              <GenerationalLanguageToggle />
              <ThemeToggle />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
              <Link href="/login">
                <Button variant="ghost">{t('signIn')}</Button>
              </Link>
              <Link href="/access">
                <Button variant="default">{t('startFree')}</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={t('toggleMenu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className={height.iconLg} aria-hidden="true" /> : <Menu className={height.iconLg} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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
