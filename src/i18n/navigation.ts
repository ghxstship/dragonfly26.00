import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Default locale (en) doesn't need prefix, others do
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
