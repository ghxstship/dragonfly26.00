import { MarketingNav } from "@/marketing/components/MarketingNav"
import { MarketingFooter } from "@/marketing/components/MarketingFooter"
import { locales } from "@/i18n/config"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MarketingNav />
      {children}
      <MarketingFooter />
    </>
  )
}
