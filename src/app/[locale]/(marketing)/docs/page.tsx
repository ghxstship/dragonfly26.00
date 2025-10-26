import { Book, Video, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Documentation | ATLVS",
  description: "Comprehensive guides, tutorials, and API documentation for ATLVS platform.",
}

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-title uppercase text-gray-900 dark:text-white mb-6">
              Documentation
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
              Everything you need to get started and master ATLVS.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-wrap items-center justify-center mb-4">
                <Book className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">Getting Started</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Quick start guides and tutorials</p>
              <Link href="https://app.atlvs.one" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                View Guides →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex flex-wrap items-center justify-center mb-4">
                <Video className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">Video Tutorials</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Step-by-step video walkthroughs</p>
              <Link href="https://app.atlvs.one" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Watch Videos →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-wrap items-center justify-center mb-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">API Reference</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Complete API documentation</p>
              <Link href="https://app.atlvs.one" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                View API Docs →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex flex-wrap items-center justify-center mb-4">
                <HelpCircle className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">Help Center</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">FAQs and troubleshooting</p>
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Get Help →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
