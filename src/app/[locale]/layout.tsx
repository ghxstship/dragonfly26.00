import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Inter, Anton_SC, Bebas_Neue, Share_Tech_Mono, Share_Tech, Press_Start_2P } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { locales, isRTL } from '@/i18n/config'
import { GenerationalLanguageClientProvider } from '@/components/providers/generational-language-provider'
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import "../globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true,
})

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-press-start-2p',
})

const antonSC = Anton_SC({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-anton-sc',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-bebas-neue',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-share-tech-mono',
})

const shareTech = Share_Tech({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-share-tech',
})

export function generateStaticParams() {
  return locales.map((locale: any) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for this locale
  const messages = await getMessages({ locale })
  
  // Check if locale is RTL
  const dir = isRTL(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${pressStart2P.variable} ${antonSC.variable} ${bebasNeue.variable} ${shareTechMono.variable} ${shareTech.variable} font-tech`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider locale={locale} messages={messages}>
              <GenerationalLanguageClientProvider>
                {children}
                <Toaster />
              </GenerationalLanguageClientProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
