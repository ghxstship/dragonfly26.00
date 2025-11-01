import type { Metadata } from "next"
import { Inter, Anton_SC, Bebas_Neue, Share_Tech_Mono, Share_Tech, Press_Start_2P } from "next/font/google"
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
// Press Start 2P - Logo (pixel font from Google Fonts)
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-press-start-2p',
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

// Since we have locale-based routing with [locale], the root layout
// just passes children through. The [locale]/layout.tsx handles <html> and <body>.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
