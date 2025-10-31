"use client"

import { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { locales, languageNames, type Locale } from "@/i18n/config"
import { setStoredLanguage } from "@/lib/language-preference"

export function LanguageSwitcher() {
  const t = useTranslations("language")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languageNames[locale as Locale]

  const changeLanguage = (newLocale: Locale) => {
    // Save user's language preference
    setStoredLanguage(newLocale)
    setIsOpen(false)
    
    // Use window.location for full page reload to ensure translations update
    // This is necessary because client components don't automatically re-render
    // when the locale changes via router.push()
    const currentPath = pathname
    
    // Ensure path starts with / for proper URL construction
    const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
    
    // Build new URL with locale prefix
    const newUrl = `/${newLocale}${normalizedPath}`
    
    // Force full page reload to ensure all translations update
    window.location.href = newUrl
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-tech text-sm"
        disabled={isPending}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-base" aria-hidden="true">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.native}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden"
            role="menu"
            aria-label="Language options"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-heading text-sm uppercase text-gray-900 dark:text-gray-100">
                {t("selectLanguage")}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Choose your preferred language
              </p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {locales.map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  disabled={isPending}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    locale === lang ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                  }`}
                  role="menuitem"
                  aria-label={`Switch to ${languageNames[lang].english}`}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                    {languageNames[lang].flag}
                  </span>
                  
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm uppercase text-gray-900 dark:text-gray-100">
                        {languageNames[lang].native}
                      </span>
                      {locale === lang && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-label="Currently selected" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {languageNames[lang].english}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your language preference is saved locally
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
