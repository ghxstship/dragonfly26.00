"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, Check, Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCountrySettings } from "@/hooks/useCountrySettings"
import { countryList, regionGroups } from "@/config/countries"

export function CountrySelector(): JSX.Element {
  const t = useTranslations("common")
  const { localeState, setCountry } = useCountrySettings()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const currentCountry = countryList.find(c => c.code === localeState.selectedCountry)

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countryList

    const query = searchQuery.toLowerCase()
    return countryList.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query) ||
      country.region.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const groupedCountries = useMemo(() => {
    const groups: Record<string, typeof countryList> = {}
    
    filteredCountries.forEach(country => {
      if (!groups[country.region]) {
        groups[country.region] = []
      }
      groups[country.region].push(country)
    })

    return groups
  }, [filteredCountries])

  const handleCountryChange = (countryCode: string) => {
    const country = countryList.find(c => c.code === countryCode)
    if (!country) return

    // Update country settings
    setCountry(countryCode)
    setIsOpen(false)
    setSearchQuery("")

    // Auto-change language to country's primary language
    const newLanguage = country.language
    if (newLanguage !== localeState.language) {
      // Get current path without locale prefix
      const currentPath = window.location.pathname
      const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '')
      
      // Redirect to new locale
      window.location.href = `/${newLanguage}${pathWithoutLocale}`
    }
  }

  return (
    <div className="relative w-full sm:w-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 font-tech text-xs sm:text-sm w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] justify-between px-2 sm:px-3 h-8 sm:h-9"
        aria-label="Change country/region"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-1.5 min-w-0 flex-1">
          <Globe aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="text-sm sm:text-base flex-shrink-0" aria-hidden="true">{currentCountry?.flag}</span>
          <span className="hidden sm:inline truncate">{currentCountry?.name}</span>
          <span className="sm:hidden truncate">{currentCountry?.code}</span>
        </span>
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
             role="button" tabIndex={0} onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden"
            role="menu"
            aria-label="Country/region options"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-heading text-sm uppercase text-gray-900 dark:text-gray-100 mb-2">
                Country & Language
              </h3>
              
              {/* Search */}
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                  aria-label="Search countries"
                />
              </div>

              {/* Current Selection Info */}
              {currentCountry && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <span className="text-lg" aria-hidden="true">{currentCountry.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{currentCountry.name}</div>
                      <div className="text-blue-700 dark:text-blue-300">
                        {currentCountry.currency} • {currentCountry.language.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Country List */}
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {Object.keys(groupedCountries).length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Globe aria-hidden="true" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No countries found</p>
                </div>
              ) : (
                Object.entries(groupedCountries).map(([region, countries]) => (
                  <div key={region}>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                      <h4 className="font-heading text-xs uppercase text-gray-600 dark:text-gray-400">
                        {region}
                      </h4>
                    </div>
                    
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryChange(country.code)}
                        className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          localeState.selectedCountry === country.code ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                        }`}
                        role="menuitem"
                        aria-label={`Switch to ${country.name}`}
                      >
                        <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                          {country.flag}
                        </span>
                        
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-sm uppercase text-gray-900 dark:text-gray-100 truncate">
                              {country.name}
                            </span>
                            {localeState.selectedCountry === country.code && (
                              <Check aria-hidden="true" className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-label="Currently selected" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {country.currency}
                            </span>
                            <span className="text-xs text-gray-400" aria-hidden="true">•</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {country.language.toUpperCase()}
                            </span>
                            {country.compliance.gdprRequired && (
                              <>
                                <span className="text-xs text-gray-400" aria-hidden="true">•</span>
                                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                  GDPR
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Selecting a country automatically sets language, currency, tax rates, and compliance requirements
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
