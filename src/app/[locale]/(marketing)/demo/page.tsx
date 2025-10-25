import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Schedule a Demo",
  description: "See ATLVS in action. Schedule a personalized demo with our team to learn how ATLVS can transform your production workflows.",
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              See ATLVS in Action
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Schedule a personalized demo to learn how ATLVS can transform your production workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
            <div>
              <h2 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-gray-900 mb-6">What You&apos;ll Learn</h2>
              <ul className="space-y-4">
                {[
                  "How the 5-level organizational hierarchy works for your productions",
                  "Role-based access control with 11 branded roles",
                  "Project, workforce, asset, and finance management in action",
                  "Real-time collaboration features",
                  "Integration capabilities with your existing tools",
                  "Custom workflows and automation",
                  "Reporting and analytics dashboards",
                  "Mobile app features for on-site teams",
                ].map((item) => (
                  <li key={item} className="flex flex-wrap flex-col md:flex-row items-start">
                    <Check className="text-green-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 md:p-8 rounded-xl border-2 border-gray-200">
              <h2 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-gray-900 mb-6">Request Your Demo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-full" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-full" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-full" placeholder="Company Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-full">
                    <option>Just me</option>
                    <option>2-10 people</option>
                    <option>11-50 people</option>
                    <option>51-200 people</option>
                    <option>200+ people</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-full" placeholder="Tell us about your production needs..."></textarea>
                </div>
                <Button className="w-full max-w-full" size="lg">Schedule Demo</Button>
                <p className="text-sm text-gray-500 text-center">
                  Or <Link href="https://app.atlvs.one/en/signup" className="text-blue-600 hover:text-blue-700">start your free trial</Link> now
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
