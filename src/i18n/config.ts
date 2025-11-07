// Ordered by usage in North America
export const locales = [
  'en', // English - Primary
  'es', // Spanish - Second most common
  'fr', // French - Canada
  'zh', // Chinese - Large communities
  'hi', // Hindi - Growing population
  'ar', // Arabic - Significant communities
  'ko', // Korean - Major communities
  'vi', // Vietnamese - Major communities
  'pt', // Portuguese - Growing
  'de', // German - Historical communities
  'ja', // Japanese - Business/tech
  'ru', // Russian - Communities
  'id', // Indonesian - Growing
  'ur', // Urdu - South Asian communities
  'bn', // Bengali - South Asian communities
  'ta', // Tamil - South Asian communities
  'te', // Telugu - South Asian communities
  'mr', // Marathi - South Asian communities
  'tr', // Turkish - Communities
  'sw', // Swahili - African diaspora
  'no', // Norwegian - Nordic communities
  'da', // Danish - Nordic communities
  'fi', // Finnish - Nordic communities
  'sv', // Swedish - Nordic communities
  'it', // Italian - European communities
  'nl', // Dutch - European communities
  'pl', // Polish - European communities
] as const

export type Locale = (typeof locales)[number]

export const languageNames: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: 'English', english: 'English', flag: '🇺🇸' },
  zh: { native: '中文', english: 'Chinese', flag: '🇨🇳' },
  hi: { native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳' },
  es: { native: 'Español', english: 'Spanish', flag: '🇪🇸' },
  fr: { native: 'Français', english: 'French', flag: '🇫🇷' },
  ar: { native: 'العربية', english: 'Arabic', flag: '🇸🇦' },
  bn: { native: 'বাংলা', english: 'Bengali', flag: '🇧🇩' },
  ru: { native: 'Русский', english: 'Russian', flag: '🇷🇺' },
  pt: { native: 'Português', english: 'Portuguese', flag: '🇧🇷' },
  id: { native: 'Bahasa Indonesia', english: 'Indonesian', flag: '🇮🇩' },
  ur: { native: 'اردو', english: 'Urdu', flag: '🇵🇰' },
  de: { native: 'Deutsch', english: 'German', flag: '🇩🇪' },
  ja: { native: '日本語', english: 'Japanese', flag: '🇯🇵' },
  sw: { native: 'Kiswahili', english: 'Swahili', flag: '🇰🇪' },
  mr: { native: 'मराठी', english: 'Marathi', flag: '🇮🇳' },
  te: { native: 'తెలుగు', english: 'Telugu', flag: '🇮🇳' },
  tr: { native: 'Türkçe', english: 'Turkish', flag: '🇹🇷' },
  ta: { native: 'தமிழ்', english: 'Tamil', flag: '🇮🇳' },
  vi: { native: 'Tiếng Việt', english: 'Vietnamese', flag: '🇻🇳' },
  ko: { native: '한국어', english: 'Korean', flag: '🇰🇷' },
  no: { native: 'Norsk', english: 'Norwegian', flag: '🇳🇴' },
  da: { native: 'Dansk', english: 'Danish', flag: '🇩🇰' },
  fi: { native: 'Suomi', english: 'Finnish', flag: '🇫🇮' },
  sv: { native: 'Svenska', english: 'Swedish', flag: '🇸🇪' },
  it: { native: 'Italiano', english: 'Italian', flag: '🇮🇹' },
  nl: { native: 'Nederlands', english: 'Dutch', flag: '🇳🇱' },
  pl: { native: 'Polski', english: 'Polish', flag: '🇵🇱' },
}

export const defaultLocale: Locale = 'en'

// RTL languages
export const rtlLocales: Locale[] = ['ar', 'ur']

// Helper to check if locale is RTL
export function isRTL(locale: string): boolean {
  return rtlLocales.includes(locale as Locale)
}
