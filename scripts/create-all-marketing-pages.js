#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const marketingDir = '/Users/julianclarkson/Documents/Dragonfly26.00/src/app/[locale]/(marketing)';

// Create help page
const helpPage = `import { Book, Video, MessageCircle, FileText } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { FeatureCard } from "@/marketing/components/atoms/FeatureCard"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Help Center | ATLVS",
  description: "Get help with ATLVS - guides, tutorials, FAQs, and support resources.",
}

const helpCategories = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn the basics and set up your first production",
    link: "/docs",
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides for all features",
    link: "/docs",
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Complete reference for all ATLVS features",
    link: "/docs",
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
  },
  {
    icon: MessageCircle,
    title: "Contact Support",
    description: "Get help from our support team",
    link: "/contact",
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
  },
]

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Help Center"
            subtitle="Find answers, learn features, and get support"
          />
        </div>
      </section>

      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'])}>
          <div className={grid.cards2}>
            {helpCategories.map((category) => (
              <Link key={category.title} href={category.link}>
                <FeatureCard {...category} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
`;

// Create community page
const communityPage = `import { Users, MessageSquare, Heart, Trophy } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Community | ATLVS",
  description: "Join the ATLVS community of production professionals.",
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Community"
            subtitle="Connect with production professionals worldwide"
          />
        </div>
      </section>
    </div>
  )
}
`;

// Create integrations page
const integrationsPage = `import { Zap } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Integrations | ATLVS",
  description: "Connect ATLVS with your favorite tools and services.",
}

export default async function IntegrationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Integrations"
            subtitle="Connect with the tools you already use"
          />
        </div>
      </section>
    </div>
  )
}
`;

// Create templates page
const templatesPage = `import { FileText } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Templates | ATLVS",
  description: "Production templates, checklists, and workflows to get started faster.",
}

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Templates & Resources"
            subtitle="Production templates to accelerate your workflow"
          />
        </div>
      </section>
    </div>
  )
}
`;

// Write files
const pages = [
  { dir: 'help', content: helpPage },
  { dir: 'community', content: communityPage },
  { dir: 'integrations', content: integrationsPage },
  { dir: 'templates', content: templatesPage },
];

pages.forEach(({ dir, content }) => {
  const dirPath = path.join(marketingDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  console.log(`Created ${dir}/page.tsx`);
});

console.log('All Priority 2 pages created successfully!');
