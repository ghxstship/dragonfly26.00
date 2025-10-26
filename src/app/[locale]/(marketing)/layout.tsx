import { setRequestLocale } from 'next-intl/server'
import { MarketingNav } from "@/marketing/components/MarketingNav"
import { MarketingFooter } from "@/marketing/components/MarketingFooter"

// Force dynamic rendering for marketing pages to support client components with i18n
export const dynamic = 'force-dynamic'

export default async function MarketingLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Enable static rendering
  setRequestLocale(locale)
  
  return (
    <div className="font-tech">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  )
}
