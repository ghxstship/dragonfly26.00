import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, updates, and best practices for live entertainment production management.",
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: PageProps) {
  await params // Consume params to satisfy Next.js
  return (
    <div className="pt-20">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Insights & Updates
            </h1>
            <p className="text-xl text-gray-600">
              Best practices, industry trends, and product updates for production professionals.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</p>
            <p className="text-gray-600">We&apos;re preparing valuable content for you. Check back soon!</p>
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
