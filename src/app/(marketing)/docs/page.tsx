import { Book, Video, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation",
  description: "Comprehensive guides, tutorials, and API documentation for ATLVS platform.",
}

export default function DocsPage() {
  return (
    <div className="pt-20">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to get started and master ATLVS.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Book className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-600 text-sm mb-4">Quick start guides and tutorials</p>
              <Link href="https://app.atlvs.one" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Guides →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 text-sm mb-4">Step-by-step video walkthroughs</p>
              <Link href="https://app.atlvs.one" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Watch Videos →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
              <p className="text-gray-600 text-sm mb-4">Complete API documentation</p>
              <Link href="https://app.atlvs.one" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View API Docs →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <HelpCircle className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Help Center</h3>
              <p className="text-gray-600 text-sm mb-4">FAQs and troubleshooting</p>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Get Help →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
