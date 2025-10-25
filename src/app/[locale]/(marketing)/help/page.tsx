import { Book, Video, MessageCircle, FileText } from "lucide-react"
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
