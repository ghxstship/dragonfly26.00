#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const marketingDir = '/Users/julianclarkson/Documents/Dragonfly26.00/src/app/[locale]/(marketing)';

// Priority 3 pages
const pages = {
  customers: `import { Star, Quote } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Customers | ATLVS",
  description: "Trusted by production companies worldwide.",
}

export default async function CustomersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Trusted by Production Professionals"
            subtitle="See what our customers are saying"
          />
        </div>
      </section>
    </div>
  )
}`,

  partners: `import { Handshake } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Partners | ATLVS",
  description: "Partner with ATLVS to grow your business.",
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Partner Program"
            subtitle="Grow your business with ATLVS"
          />
        </div>
      </section>
    </div>
  )
}`,

  events: `import { Calendar, Video } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Events & Webinars | ATLVS",
  description: "Join our upcoming webinars and events.",
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Events & Webinars"
            subtitle="Learn from industry experts and ATLVS team"
          />
        </div>
      </section>
    </div>
  )
}`,

  'roi-calculator': `import { Calculator, TrendingUp } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "ROI Calculator | ATLVS",
  description: "Calculate your return on investment with ATLVS.",
}

export default async function ROICalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="ROI Calculator"
            subtitle="See how much time and money you can save with ATLVS"
          />
        </div>
      </section>
    </div>
  )
}`,

  press: `import { Newspaper, Download } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Press & Media | ATLVS",
  description: "Press releases, media kit, and company information.",
}

export default async function PressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Press & Media"
            subtitle="Media resources and company information"
          />
        </div>
      </section>
    </div>
  )
}`,
};

Object.entries(pages).forEach(([dir, content]) => {
  const dirPath = path.join(marketingDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  console.log(`Created ${dir}/page.tsx`);
});

console.log('All Priority 3 pages created successfully!');
