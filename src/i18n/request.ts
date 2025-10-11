import { getRequestConfig } from 'next-intl/server'
import { locales } from './config'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locale || 'en'
  
  if (!locales.includes(validLocale as any)) {
    return {
      locale: 'en',
      messages: (await import(`./messages/en.json`)).default,
    }
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  }
})
