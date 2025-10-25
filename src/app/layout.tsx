import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Dragonfly - Project Management Platform",
  description: "Multi-tenant project management platform with universal data architecture",
  icons: {
    icon: [
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}

// Web Vitals tracking for performance monitoring
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric.name, Math.round(metric.value), metric.rating)
  }
  
  // Track metrics: LCP, FID, CLS, TTFB, FCP
  // Target: LCP < 2.5s, FID < 100ms, CLS < 0.1, TTFB < 600ms
  // In production, send to analytics service
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
