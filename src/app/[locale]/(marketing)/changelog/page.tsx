import { Calendar, Tag, Zap, Bug, Shield, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Changelog | ATLVS",
  description: "Latest updates, features, and improvements to the ATLVS platform.",
}

const releases = [
  {
    version: "2.6.0",
    date: "2025-01-23",
    type: "major",
    items: [
      {
        type: "feature",
        title: "Marketing Pages i18n",
        description: "Complete internationalization support for all 20 languages across marketing pages.",
        icon: Sparkles,
      },
      {
        type: "feature",
        title: "Organizational Hierarchy",
        description: "5-level hierarchy system: Organization → Projects → Productions → Activations → Workspace.",
        icon: Zap,
      },
      {
        type: "feature",
        title: "Branded RBAC System",
        description: "11 branded roles with hierarchy-aware permissions (Legend, Phantom, Aviator, Gladiator, Navigator, Deviator, Raider, Vendor, Visitor, Partner, Ambassador).",
        icon: Shield,
      },
    ],
  },
  {
    version: "2.5.0",
    date: "2025-01-20",
    type: "major",
    items: [
      {
        type: "feature",
        title: "Real-time Collaboration",
        description: "Live data updates across all 221 components with Supabase Realtime.",
        icon: Zap,
      },
      {
        type: "improvement",
        title: "Database Optimization",
        description: "40-60% faster queries, 30-50% faster writes, 15-25% storage reduction.",
        icon: Sparkles,
      },
      {
        type: "feature",
        title: "Type Safety Layer",
        description: "100% TypeScript coverage with strict type checking across all components.",
        icon: Shield,
      },
    ],
  },
  {
    version: "2.4.0",
    date: "2025-01-16",
    type: "minor",
    items: [
      {
        type: "feature",
        title: "Profile Module Complete",
        description: "12 profile tabs with full i18n and accessibility compliance.",
        icon: Sparkles,
      },
      {
        type: "improvement",
        title: "System Hub Remediation",
        description: "Complete i18n implementation for Admin, Settings, and Profile modules.",
        icon: Zap,
      },
      {
        type: "fix",
        title: "Accessibility Improvements",
        description: "WCAG 2.1 AA compliance across all 233 component files.",
        icon: Bug,
      },
    ],
  },
  {
    version: "2.3.0",
    date: "2024-10-25",
    type: "major",
    items: [
      {
        type: "feature",
        title: "Responsive Design System",
        description: "100% responsive design compliance with mobile-first patterns.",
        icon: Sparkles,
      },
      {
        type: "feature",
        title: "Design Tokens",
        description: "Centralized design system with semantic tokens for spacing, colors, and typography.",
        icon: Zap,
      },
      {
        type: "improvement",
        title: "Empty State Standardization",
        description: "Unified empty state component across all modules.",
        icon: Sparkles,
      },
    ],
  },
  {
    version: "2.2.0",
    date: "2024-10-19",
    type: "major",
    items: [
      {
        type: "feature",
        title: "Complete Supabase Stack",
        description: "147 tables, 801 RLS policies, 36 data hooks with live data integration.",
        icon: Zap,
      },
      {
        type: "feature",
        title: "Intelligence Hub",
        description: "29 tabs for Analytics, Reports, and Insights with full i18n.",
        icon: Sparkles,
      },
    ],
  },
]

const typeIcons = {
  feature: Sparkles,
  improvement: Zap,
  fix: Bug,
}

const typeColors = {
  feature: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200",
  improvement: "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200",
  fix: "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200",
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Changelog"
            subtitle="Latest updates, features, and improvements to ATLVS"
          />
        </div>
      </section>

      {/* Releases */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['4xl'])}>
          <div className="space-y-12">
            {releases.map((release) => (
              <div key={release.version} className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 ml-6" />

                {/* Release header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <Tag className="text-white" size={20} />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white">
                        Version {release.version}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        {new Date(release.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-full text-xs font-heading uppercase",
                      release.type === "major" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                      release.type === "minor" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    )}>
                      {release.type.toUpperCase()} RELEASE
                    </span>
                  </div>
                </div>

                {/* Release items */}
                <div className="ml-16 space-y-4">
                  {release.items.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={index}
                        className="mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-sm md:max-w-none"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                            typeColors[item.type as keyof typeof typeColors]
                          )}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-heading uppercase text-gray-900 dark:text-white">
                                {item.title}
                              </h3>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-heading uppercase",
                                typeColors[item.type as keyof typeof typeColors]
                              )}>
                                {item.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto text-center", container['4xl'])}>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Get notified about new features, improvements, and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="mx-auto flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white max-w-sm md:max-w-none"
              aria-label="Email address"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-heading uppercase hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
