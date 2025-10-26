import type { Metadata } from "next"
import { Inter, Anton_SC, Bebas_Neue, Share_Tech_Mono, Share_Tech } from "next/font/google"
import localFont from "next/font/local"
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

// Marketing Typography
// Coral Pixels - Logo (pixel font)
const coralPixels = localFont({
  src: [
    {
      path: '../../public/fonts/CoralPixels-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-coral-pixels',
  display: 'swap',
})

// Anton SC - Titles (capitalized)
const antonSC = Anton_SC({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-anton-sc',
})

// Bebas Neue - Headings (capitalized)
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-bebas-neue',
})

// Share Tech Mono - Monospace
const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-share-tech-mono',
})

// Share Tech - Body text
const shareTech = Share_Tech({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-share-tech',
})

export const metadata: Metadata = {
  title: "ATLVS - Experiential Production Management Platform",
  description: "The World's First Project Management System for Creative Industries",
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
      <body className={`${inter.variable} ${coralPixels.variable} ${antonSC.variable} ${bebasNeue.variable} ${shareTechMono.variable} ${shareTech.variable} ${inter.className}`}>
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
