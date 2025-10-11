/**
 * Language Preference Storage
 * Manages user's preferred language across sessions
 */

import { Locale, defaultLocale } from '@/i18n/config'
import Cookies from 'js-cookie'

const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE'
const LANGUAGE_STORAGE_KEY = 'user-language-preference'
const COOKIE_MAX_AGE = 365 // days

/**
 * Get the user's preferred language from storage
 */
export function getStoredLanguage(): Locale | null {
  // Try cookie first (SSR-compatible)
  if (typeof document !== 'undefined') {
    const cookieValue = Cookies.get(LANGUAGE_COOKIE_NAME)
    if (cookieValue) return cookieValue as Locale
  }
  
  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored) return stored as Locale
  }
  
  return null
}

/**
 * Save the user's language preference
 */
export function setStoredLanguage(locale: Locale): void {
  // Set cookie (SSR-compatible, accessible from middleware)
  if (typeof document !== 'undefined') {
    Cookies.set(LANGUAGE_COOKIE_NAME, locale, {
      expires: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    })
  }
  
  // Also set in localStorage as backup
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
  }
}

/**
 * Clear the user's language preference
 */
export function clearStoredLanguage(): void {
  if (typeof document !== 'undefined') {
    Cookies.remove(LANGUAGE_COOKIE_NAME)
  }
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  }
}

/**
 * Get the user's preferred language or default
 */
export function getUserLanguage(): Locale {
  return getStoredLanguage() || defaultLocale
}

/**
 * Detect browser language and return supported locale
 */
export function detectBrowserLanguage(supportedLocales: readonly Locale[]): Locale {
  if (typeof navigator === 'undefined') return defaultLocale
  
  // Get browser languages
  const browserLanguages = navigator.languages || [navigator.language]
  
  // Find first matching locale
  for (const lang of browserLanguages) {
    // Try exact match first
    const exactMatch = supportedLocales.find(locale => locale === lang)
    if (exactMatch) return exactMatch
    
    // Try language code match (e.g., 'en-US' -> 'en')
    const langCode = lang.split('-')[0]
    const codeMatch = supportedLocales.find(locale => locale === langCode)
    if (codeMatch) return codeMatch
  }
  
  return defaultLocale
}
