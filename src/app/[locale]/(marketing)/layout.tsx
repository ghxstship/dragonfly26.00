import { MarketingNav } from "@/marketing/components/MarketingNav"
import { MarketingFooter } from "@/marketing/components/MarketingFooter"

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
