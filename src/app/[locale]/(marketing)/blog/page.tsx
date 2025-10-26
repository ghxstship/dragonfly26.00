import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Blog | ATLVS",
  description: "Insights, updates, and best practices for live entertainment production management.",
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-title uppercase text-gray-900 dark:text-white mb-6">
              Insights & Updates
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
              Best practices, industry trends, and product updates for production professionals.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-8 lg:p-12 text-center">
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-heading uppercase text-gray-900 dark:text-white mb-2">Coming Soon</p>
            <p className="text-gray-600 dark:text-gray-400">We&apos;re preparing valuable content for you. Check back soon!</p>
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
