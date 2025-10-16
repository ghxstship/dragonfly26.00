/**
 * Locale-aware formatting utilities for internationalization
 * Provides consistent date, number, and currency formatting across the application
 */

/**
 * Format currency with locale awareness
 * @param amount - The numeric amount to format
 * @param locale - The locale string (e.g., 'en-US', 'es-ES')
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format currency with decimals
 * @param amount - The numeric amount to format
 * @param locale - The locale string
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string with decimals
 */
export function formatCurrencyWithDecimals(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date in short format
 * @param date - Date string or Date object
 * @param locale - The locale string
 * @returns Formatted date string (e.g., "Jan 15")
 */
export function formatDate(
  date: string | Date,
  locale: string = 'en-US'
): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format date in long format
 * @param date - Date string or Date object
 * @param locale - The locale string
 * @returns Formatted date string (e.g., "January 15, 2025")
 */
export function formatDateLong(
  date: string | Date,
  locale: string = 'en-US'
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format date and time
 * @param date - Date string or Date object
 * @param locale - The locale string
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: string | Date,
  locale: string = 'en-US'
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Format number with locale awareness
 * @param value - The numeric value to format
 * @param locale - The locale string
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

/**
 * Format percentage
 * @param value - The numeric value (e.g., 0.15 for 15%)
 * @param locale - The locale string
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "15.0%")
 */
export function formatPercentage(
  value: number,
  locale: string = 'en-US',
  decimals: number = 1
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date string or Date object
 * @param locale - The locale string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  const absDiff = Math.abs(diffInSeconds)
  
  if (absDiff < 60) {
    return rtf.format(diffInSeconds, 'second')
  } else if (absDiff < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute')
  } else if (absDiff < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour')
  } else if (absDiff < 2592000) {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day')
  } else if (absDiff < 31536000) {
    return rtf.format(Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(Math.floor(diffInSeconds / 31536000), 'year')
  }
}

/**
 * Format compact number (e.g., 1.5K, 2.3M)
 * @param value - The numeric value to format
 * @param locale - The locale string
 * @returns Formatted compact number string
 */
export function formatCompactNumber(
  value: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}
