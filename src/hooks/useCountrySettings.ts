"use client"

import { useLocale } from '@/contexts/LocaleContext'
import { 
  calculatePriceWithTax,
  formatCurrency,
  formatDate,
  formatTime,
  validatePostalCode,
  requiresGDPR,
  requiresCCPA,
  getAgeRestriction,
  getAllowedPaymentMethods
} from '@/utils/localization'
import type { PriceDisplay } from '@/types/country'

export function useCountrySettings() {
  const { localeState, setCountry, countryConfig, stateOrProvince } = useLocale()

  /**
   * Calculate price with appropriate tax for current country
   */
  const calculatePrice = (basePrice: number): PriceDisplay => {
    return calculatePriceWithTax(localeState.selectedCountry, basePrice, stateOrProvince)
  }

  /**
   * Format amount in local currency
   */
  const formatAmount = (amount: number): string => {
    return formatCurrency(amount, localeState.currency)
  }

  /**
   * Format date in local format
   */
  const formatLocalDate = (date: Date): string => {
    return formatDate(date, localeState.selectedCountry)
  }

  /**
   * Format time in local format
   */
  const formatLocalTime = (date: Date): string => {
    return formatTime(date, localeState.selectedCountry)
  }

  /**
   * Validate postal code for current country
   */
  const validatePostal = (postalCode: string): boolean => {
    return validatePostalCode(postalCode, localeState.selectedCountry)
  }

  /**
   * Check if GDPR compliance is required
   */
  const isGDPRRequired = (): boolean => {
    return requiresGDPR(localeState.selectedCountry)
  }

  /**
   * Check if CCPA compliance is required
   */
  const isCCPARequired = (): boolean => {
    return requiresCCPA(localeState.selectedCountry)
  }

  /**
   * Get minimum age requirement
   */
  const getMinimumAge = (): number => {
    return getAgeRestriction(localeState.selectedCountry)
  }

  /**
   * Get available payment methods
   */
  const getPaymentMethods = (): string[] => {
    return getAllowedPaymentMethods(localeState.selectedCountry)
  }

  /**
   * Check if payment method is allowed
   */
  const isPaymentMethodAllowed = (method: string): boolean => {
    return localeState.complianceRules.allowedPaymentMethods.includes(method)
  }

  /**
   * Get tax display info
   */
  const getTaxInfo = () => {
    return {
      taxInclusive: countryConfig?.taxInclusive || false,
      taxRate: localeState.taxRate,
      taxSystem: countryConfig?.taxSystem || 'vat'
    }
  }

  return {
    // State
    localeState,
    countryConfig,
    stateOrProvince,
    
    // Actions
    setCountry,
    
    // Formatting
    calculatePrice,
    formatAmount,
    formatLocalDate,
    formatLocalTime,
    
    // Validation
    validatePostal,
    
    // Compliance
    isGDPRRequired,
    isCCPARequired,
    getMinimumAge,
    
    // Payments
    getPaymentMethods,
    isPaymentMethodAllowed,
    
    // Tax
    getTaxInfo
  }
}
