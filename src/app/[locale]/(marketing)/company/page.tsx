import { TestimonialsSection } from "@/marketing/components/sections/TestimonialsSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Company | ATLVS",
  description: "Built by production professionals, for production professionals. Learn about our mission to transform live entertainment production management.",
}

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title uppercase text-gray-900 dark:text-white mb-6">
            Built by Production Professionals,<br />for Production Professionals
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            We understand the chaos of live entertainment production because we&apos;ve lived it. ATLVS was born from the frustration of juggling spreadsheets, emails, and disconnected tools across massive productions.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              After years of managing multi-city tours, massive festivals, and complex corporate events, we knew there had to be a better way. Traditional project management tools weren&apos;t built for the unique challenges of live entertainment—the distributed teams, the asset logistics, the vendor coordination, the budget complexity.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              So we built ATLVS: a platform that understands the 5-level organizational hierarchy of production work, supports 11 branded role types for precise access control, and unifies projects, workforce, assets, and finances in one powerful system.
            </p>

            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6 mt-12">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To empower unconventional industries with the tools to create unimaginable experiences.
            </p>

            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6 mt-12">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Venture Beyond Limits
            </p>

            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6 mt-12">Our Values</h2>
            <ul className="space-y-2 mb-8">
              <li className="text-gray-600 dark:text-gray-400">Innovation</li>
              <li className="text-gray-600 dark:text-gray-400">Diversity</li>
              <li className="text-gray-600 dark:text-gray-400">Education</li>
              <li className="text-gray-600 dark:text-gray-400">Accessibility</li>
              <li className="text-gray-600 dark:text-gray-400">Sustainability</li>
            </ul>

            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6 mt-12">How We Interact</h2>
            <ul className="space-y-2 mb-8">
              <li className="text-gray-600 dark:text-gray-400">Authenticity</li>
              <li className="text-gray-600 dark:text-gray-400">Transparency</li>
              <li className="text-gray-600 dark:text-gray-400">Camaraderie</li>
            </ul>

            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6 mt-12">How We Operate</h2>
            <ul className="space-y-2 mb-8">
              <li className="text-gray-600 dark:text-gray-400">Preparation</li>
              <li className="text-gray-600 dark:text-gray-400">Organization</li>
              <li className="text-gray-600 dark:text-gray-400">Communication</li>
            </ul>

            <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-6 mt-12">How We Create</h2>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">Modularity</li>
              <li className="text-gray-600 dark:text-gray-400">Flexibility</li>
              <li className="text-gray-600 dark:text-gray-400">Scalability</li>
            </ul>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
