import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import "../../app/globals.css"
import { MarketingNav } from "../components/MarketingNav"
import { MarketingFooter } from "../components/MarketingFooter"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ATLVS - Experiential Entertainment Production Management Platform",
  description: "Unify your projects, workforce, assets, and finances in one powerful platform. Purpose-built for experiential entertainment production teams. Start free today.",
  keywords: "live entertainment production management, event production software, festival management platform, production workflow tools, asset tracking for events, production budget management, crew management software, live event logistics, experiential entertainment platform",
  openGraph: {
    title: "ATLVS - Experiential Entertainment Production Management Platform",
    description: "Unify your projects, workforce, assets, and finances in one powerful platform designed specifically for experiential entertainment production.",
    url: "https://atlvs.xyz",
    siteName: "ATLVS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ATLVS Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLVS - Experiential Entertainment Production Management Platform",
    description: "Unify your projects, workforce, assets, and finances in one powerful platform.",
    images: ["/og-image.png"],
  },
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <MarketingNav />
          <main className="min-h-screen">
            {children}
          </main>
          <MarketingFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
