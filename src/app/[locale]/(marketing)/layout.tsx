import { setRequestLocale } from 'next-intl/server'
import { MarketingNav } from "@/marketing/components/MarketingNav"
import { MarketingFooter } from "@/marketing/components/MarketingFooter"

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
    <>
      <MarketingNav />
      {children}
      <MarketingFooter />
    </>
  )
}
