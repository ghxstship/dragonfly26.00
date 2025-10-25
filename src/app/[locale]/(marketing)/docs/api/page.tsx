import { setRequestLocale } from 'next-intl/server'
import { APIDocsClient } from './api-docs-client'

export default async function APIDocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <APIDocsClient />
}
