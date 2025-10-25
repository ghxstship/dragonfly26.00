import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always include locale prefix to prevent redirect loops
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
