import { Building2, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Case Studies | ATLVS",
  description: "See how production companies use ATLVS to manage festivals, tours, and experiential events.",
}

const caseStudies = [
  {
    id: "festival-production",
    company: "Major Festival Production",
    industry: "Music Festivals",
    image: "/screenshots/desktop-1.png",
    logo: "/logo-dark.png",
    challenge: "Managing 15+ stages across 3-day festival with 200+ crew members",
    solution: "Centralized production management with real-time updates",
    results: [
      { metric: "40%", label: "Time Saved" },
      { metric: "99.8%", label: "On-Time Execution" },
      { metric: "$250K", label: "Cost Savings" },
    ],
    testimonial: "ATLVS transformed how we coordinate our festival production. Real-time updates kept our entire team synchronized across all stages.",
    author: "Production Director",
    tags: ["Festivals", "Multi-Stage", "Large Crew"],
  },
  {
    id: "touring-production",
    company: "Global Touring Company",
    industry: "Concert Tours",
    image: "/screenshots/desktop-1.png",
    logo: "/logo-dark.png",
    challenge: "Coordinating 50-city tour with varying venue requirements",
    solution: "Standardized workflows with location-specific customization",
    results: [
      { metric: "60%", label: "Faster Load-In" },
      { metric: "100%", label: "Venue Compliance" },
      { metric: "35%", label: "Reduced Errors" },
    ],
    testimonial: "The ability to template our production workflows while adapting to each venue saved us countless hours.",
    author: "Tour Manager",
    tags: ["Tours", "Multi-Venue", "Logistics"],
  },
  {
    id: "corporate-events",
    company: "Enterprise Experiential Agency",
    industry: "Corporate Events",
    image: "/screenshots/desktop-1.png",
    logo: "/logo-dark.png",
    challenge: "Managing 100+ simultaneous corporate activations nationwide",
    solution: "Hierarchical organization structure with role-based access",
    results: [
      { metric: "75%", label: "Better Visibility" },
      { metric: "50%", label: "Faster Approvals" },
      { metric: "90%", label: "Client Satisfaction" },
    ],
    testimonial: "ATLVS's organizational hierarchy lets us manage multiple clients and projects without losing track of details.",
    author: "VP of Operations",
    tags: ["Corporate", "Multi-Client", "Nationwide"],
  },
]

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Success Stories"
            subtitle="See how production companies use ATLVS to deliver flawless events"
          />
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'], "space-y-16 md:space-y-24")}>
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={cn(
                "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
                index % 2 === 1 && "md:grid-flow-dense"
              )}
            >
              {/* Image */}
              <div className={cn(index % 2 === 1 && "md:col-start-2")}>
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={study.image}
                    alt={study.company}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={cn(index % 2 === 1 && "md:col-start-1 md:row-start-1")}>
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="text-blue-600" size={24} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {study.industry}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                  {study.company}
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-heading uppercase text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                      Challenge
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {study.challenge}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-heading uppercase text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                      Solution
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {study.solution}
                    </p>
                  </div>

                  {/* Results */}
                  <div className={grid.stats3}>
                    {study.results.map((result) => (
                      <div key={result.label} className="text-center">
                        <div className="text-3xl md:text-4xl font-title uppercase text-blue-600 mb-1">
                          {result.metric}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <blockquote className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="text-gray-700 dark:text-gray-300 italic mb-2">
                      &ldquo;{study.testimonial}&rdquo;
                    </p>
                    <cite className="text-sm text-gray-600 dark:text-gray-400 not-italic">
                      — {study.author}
                    </cite>
                  </blockquote>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto text-center", container['4xl'])}>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Production?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join hundreds of production companies using ATLVS to deliver flawless events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-heading uppercase hover:bg-blue-700 transition-colors"
            >
              Schedule a Demo
            </Link>
            <Link
              href="/pricing"
              className="mx-auto px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg font-heading uppercase hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors max-w-sm md:max-w-none"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
