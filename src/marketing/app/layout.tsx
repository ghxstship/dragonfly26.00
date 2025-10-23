import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { MarketingNav } from "../components/MarketingNav"
import { MarketingFooter } from "../components/MarketingFooter"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ATLVS - Live Entertainment Production Management Platform",
    template: "%s | ATLVS",
  },
  description: "The project management system for experiential production teams. Unify your projects, workforce, assets, and finances in one powerful platform.",
  keywords: ["production management", "event management", "live entertainment", "project management", "workforce management"],
  authors: [{ name: "ATLVS" }],
  creator: "ATLVS",
  publisher: "ATLVS",
  metadataBase: new URL("https://atlvs.one"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://atlvs.one",
    title: "ATLVS - Live Entertainment Production Management Platform",
    description: "The project management system for experiential production teams.",
    siteName: "ATLVS",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLVS - Live Entertainment Production Management Platform",
    description: "The project management system for experiential production teams.",
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MarketingNav />
        <main className="min-h-screen">
          {children}
        </main>
        <MarketingFooter />
      </body>
    </html>
  )
}
