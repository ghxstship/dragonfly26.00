import { TestimonialsSection } from "@/marketing/components/sections/TestimonialsSection"
import { CTASection } from "@/marketing/components/sections/CTASection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Built by production professionals, for production professionals. Learn about our mission to transform live entertainment production management.",
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: PageProps) {
  await params // Consume params to satisfy Next.js
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Built by Production Professionals,<br />for Production Professionals
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We understand the chaos of live entertainment production because we&apos;ve lived it. ATLVS was born from the frustration of juggling spreadsheets, emails, and disconnected tools across massive productions.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-6">
              After years of managing multi-city tours, massive festivals, and complex corporate events, we knew there had to be a better way. Traditional project management tools weren&apos;t built for the unique challenges of live entertainment—the distributed teams, the asset logistics, the vendor coordination, the budget complexity.
            </p>
            <p className="text-gray-600 mb-6">
              So we built ATLVS: a platform that understands the 5-level organizational hierarchy of production work, supports 11 branded role types for precise access control, and unifies projects, workforce, assets, and finances in one powerful system.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To empower production teams with professional-grade management tools that eliminate chaos, improve collaboration, and deliver unforgettable experiences—without the headaches.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              A world where every production team—from independent contractors to enterprise producers—has access to the tools they need to succeed, regardless of size or budget.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">User-First:</span>
                <span className="text-gray-600">We build for production professionals, not investors.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Excellence:</span>
                <span className="text-gray-600">We ship quality, not just features.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Transparency:</span>
                <span className="text-gray-600">We communicate openly and honestly.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Collaboration:</span>
                <span className="text-gray-600">We win as a team.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-gray-900 mr-2">Innovation:</span>
                <span className="text-gray-600">We challenge the status quo.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
