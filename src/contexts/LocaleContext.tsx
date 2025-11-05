"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { LocaleState, CountryConfig } from '@/types/country'
import { getCountryConfig, getCountryLanguage } from '@/utils/localization'
import { countries } from '@/config/countries'

interface LocaleContextType {
  localeState: LocaleState
  setCountry: (countryCode: string, stateOrProvince?: string) => void
  countryConfig: CountryConfig | null
  stateOrProvince?: string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

const STORAGE_KEY = 'user_country_preference'

interface LocaleProviderProps {
  children: ReactNode
  defaultCountry?: string
}

export function LocaleProvider({ children, defaultCountry = 'US' }: LocaleProviderProps): JSX.Element {
  const [stateOrProvince, setStateOrProvince] = useState<string | undefined>()
  
  const [localeState, setLocaleState] = useState<LocaleState>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    // Default state
    const config = getCountryConfig(defaultCountry)
    if (!config) {
      return {
        selectedCountry: 'US',
        language: 'en',
        currency: 'USD',
        taxRate: 0,
        complianceRules: countries.US.compliance,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        measurementSystem: 'imperial'
      }
    }

    return {
      selectedCountry: defaultCountry,
      language: config.language,
      currency: config.currency,
      taxRate: config.taxRates.standard || config.taxRates.federal || 0,
      complianceRules: config.compliance,
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
      measurementSystem: config.measurementSystem
    }
  })

  const setCountry = (countryCode: string, newStateOrProvince?: string) => {
    const config = getCountryConfig(countryCode)
    if (!config) return

    setStateOrProvince(newStateOrProvince)

    // Calculate tax rate based on country and state/province
    let taxRate = config.taxRates.standard || config.taxRates.federal || 0
    if (newStateOrProvince) {
      if (config.taxRates.state && config.taxRates.state[newStateOrProvince]) {
        taxRate = config.taxRates.state[newStateOrProvince]
      } else if (config.taxRates.provincial && config.taxRates.provincial[newStateOrProvince]) {
        taxRate = (config.taxRates.federal || 0) + config.taxRates.provincial[newStateOrProvince]
      }
    }

    const newState: LocaleState = {
      selectedCountry: countryCode,
      language: config.language,
      currency: config.currency,
      taxRate,
      complianceRules: config.compliance,
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
      measurementSystem: config.measurementSystem
    }

    setLocaleState(newState)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      if (newStateOrProvince) {
        localStorage.setItem(`${STORAGE_KEY}_state`, newStateOrProvince)
      }
    }

    // Optionally trigger language change
    // This would integrate with your existing i18n system
    const newLanguage = getCountryLanguage(countryCode)
    if (newLanguage !== localeState.language) {
      // Trigger language change in your i18n system
      // window.location.href = `/${newLanguage}${window.location.pathname.substring(3)}`
    }
  }

  const countryConfig = getCountryConfig(localeState.selectedCountry)

  return (
    <LocaleContext.Provider value={{ localeState, setCountry, countryConfig, stateOrProvince }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
