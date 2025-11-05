import { countries } from '@/config/countries'
import type { CountryConfig, PriceDisplay } from '@/types/country'

/**
 * Get country configuration by country code
 */
export function getCountryConfig(countryCode: string): CountryConfig | null {
  return countries[countryCode] || null
}

/**
 * Calculate tax for a given country and base price
 */
export function calculateTax(countryCode: string, basePrice: number, stateOrProvince?: string): number {
  const config = getCountryConfig(countryCode)
  if (!config) return 0

  const { taxSystem, taxRates } = config

  switch (taxSystem) {
    case 'vat':
    case 'gst':
    case 'iva':
    case 'consumption_tax':
      return basePrice * (taxRates.standard || 0)

    case 'sales_tax':
      if (stateOrProvince && taxRates.state) {
        const stateTax = taxRates.state[stateOrProvince] || 0
        return basePrice * stateTax
      }
      return 0

    case 'gst_pst':
      const federal = basePrice * (taxRates.federal || 0)
      const provincial = stateOrProvince && taxRates.provincial
        ? basePrice * (taxRates.provincial[stateOrProvince] || 0)
        : 0
      return federal + provincial

    case 'complex':
      // Brazil's complex tax system
      const federalTax = basePrice * (taxRates.federal || 0)
      const municipalTax = basePrice * (taxRates.municipal || 0)
      return federalTax + municipalTax

    default:
      return 0
  }
}

/**
 * Calculate price with tax included or excluded based on country
 */
export function calculatePriceWithTax(
  countryCode: string,
  basePrice: number,
  stateOrProvince?: string
): PriceDisplay {
  const config = getCountryConfig(countryCode)
  if (!config) {
    return {
      basePrice,
      taxAmount: 0,
      totalPrice: basePrice,
      currency: 'USD',
      formatted: formatCurrency(basePrice, 'USD')
    }
  }

  const taxAmount = calculateTax(countryCode, basePrice, stateOrProvince)
  const totalPrice = basePrice + taxAmount

  return {
    basePrice,
    taxAmount,
    totalPrice,
    currency: config.currency,
    formatted: formatCurrency(totalPrice, config.currency)
  }
}

/**
 * Format currency according to locale
 */
export function formatCurrency(amount: number, currencyCode: string, locale?: string): string {
  try {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
    }).format(amount)
  } catch (error) {
    return `${currencyCode} ${amount.toFixed(2)}`
  }
}

/**
 * Format date according to country format
 */
export function formatDate(date: Date, countryCode: string): string {
  const config = getCountryConfig(countryCode)
  if (!config) return date.toLocaleDateString()

  const { dateFormat } = config
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return dateFormat
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
}

/**
 * Format time according to country format
 */
export function formatTime(date: Date, countryCode: string): string {
  const config = getCountryConfig(countryCode)
  if (!config) return date.toLocaleTimeString()

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: config.timeFormat === '12h'
  }

  return date.toLocaleTimeString(undefined, options)
}

/**
 * Format phone number according to country format
 */
export function formatPhoneNumber(phone: string, countryCode: string): string {
  const config = getCountryConfig(countryCode)
  if (!config) return phone

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Apply country-specific formatting
  // This is a simplified version - production would need more robust formatting
  return config.phoneFormat.replace(/X/g, () => digits.charAt(0) || 'X')
}

/**
 * Validate postal code for a country
 */
export function validatePostalCode(postalCode: string, countryCode: string): boolean {
  const config = getCountryConfig(countryCode)
  if (!config) return true

  const pattern = new RegExp(config.addressFormat.postalCodePattern)
  return pattern.test(postalCode)
}

/**
 * Convert measurement units
 */
export function convertMeasurement(
  value: number,
  fromSystem: 'metric' | 'imperial',
  toSystem: 'metric' | 'imperial',
  unit: 'length' | 'weight' | 'temperature'
): number {
  if (fromSystem === toSystem) return value

  if (unit === 'length') {
    // Miles to kilometers or vice versa
    return fromSystem === 'imperial' ? value * 1.60934 : value / 1.60934
  }

  if (unit === 'weight') {
    // Pounds to kilograms or vice versa
    return fromSystem === 'imperial' ? value * 0.453592 : value / 0.453592
  }

  if (unit === 'temperature') {
    // Fahrenheit to Celsius or vice versa
    return fromSystem === 'imperial' 
      ? (value - 32) * 5/9 
      : (value * 9/5) + 32
  }

  return value
}

/**
 * Get appropriate language for country
 */
export function getCountryLanguage(countryCode: string): string {
  const config = getCountryConfig(countryCode)
  return config?.language || 'en'
}

/**
 * Check if country requires GDPR compliance
 */
export function requiresGDPR(countryCode: string): boolean {
  const config = getCountryConfig(countryCode)
  return config?.compliance.gdprRequired || false
}

/**
 * Check if country requires CCPA compliance
 */
export function requiresCCPA(countryCode: string): boolean {
  const config = getCountryConfig(countryCode)
  return config?.compliance.ccpaRequired || false
}

/**
 * Get age restriction for country
 */
export function getAgeRestriction(countryCode: string): number {
  const config = getCountryConfig(countryCode)
  return config?.compliance.ageRestriction || 13
}

/**
 * Get allowed payment methods for country
 */
export function getAllowedPaymentMethods(countryCode: string): string[] {
  const config = getCountryConfig(countryCode)
  return config?.compliance.allowedPaymentMethods || []
}
