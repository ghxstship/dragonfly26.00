export const locales = [
  'en', // English
  'zh', // Mandarin Chinese
  'hi', // Hindi
  'es', // Spanish
  'fr', // French
  'ar', // Arabic
  'bn', // Bengali
  'ru', // Russian
  'pt', // Portuguese
  'id', // Indonesian
  'ur', // Urdu
  'de', // German
  'ja', // Japanese
  'sw', // Swahili
  'mr', // Marathi
  'te', // Telugu
  'tr', // Turkish
  'ta', // Tamil
  'vi', // Vietnamese
  'ko', // Korean
] as const

export type Locale = (typeof locales)[number]

export const languageNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  zh: { native: '中文', english: 'Chinese' },
  hi: { native: 'हिन्दी', english: 'Hindi' },
  es: { native: 'Español', english: 'Spanish' },
  fr: { native: 'Français', english: 'French' },
  ar: { native: 'العربية', english: 'Arabic' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  ru: { native: 'Русский', english: 'Russian' },
  pt: { native: 'Português', english: 'Portuguese' },
  id: { native: 'Bahasa Indonesia', english: 'Indonesian' },
  ur: { native: 'اردو', english: 'Urdu' },
  de: { native: 'Deutsch', english: 'German' },
  ja: { native: '日本語', english: 'Japanese' },
  sw: { native: 'Kiswahili', english: 'Swahili' },
  mr: { native: 'मराठी', english: 'Marathi' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  tr: { native: 'Türkçe', english: 'Turkish' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  vi: { native: 'Tiếng Việt', english: 'Vietnamese' },
  ko: { native: '한국어', english: 'Korean' },
}

export const defaultLocale: Locale = 'en'

// RTL languages
export const rtlLocales: Locale[] = ['ar', 'ur']

// Helper to check if locale is RTL
export function isRTL(locale: string): boolean {
  return rtlLocales.includes(locale as Locale)
}
