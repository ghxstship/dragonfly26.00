import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"
import { jobs } from "@/data/jobs"

export const metadata: Metadata = {
  title: "Careers | ATLVS",
  description: "Join our team and help build the future of live event production management.",
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className={cn("mx-auto py-8 px-4 sm:px-6 lg:px-8", container['6xl'])}>
          <h1 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-2">
            Careers at ATLVS
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join our team and help build the future of live event production management
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="mb-6">
            <h2 className="text-xl font-heading uppercase text-gray-900 dark:text-white mb-1">
              {jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All positions are hybrid and based in Tampa, FL
            </p>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.id}`}
                className="mx-auto block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 md:p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group max-w-sm md:max-w-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} className="flex-shrink-0" />
                        <span className="truncate">{job.department}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="flex-shrink-0" />
                        <span className="truncate">{job.type}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="flex-shrink-0 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1" 
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className={cn("mx-auto text-center", container['4xl'])}>
          <h2 className="text-2xl md:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-3">
            Don&apos;t See a Perfect Fit?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We&apos;re always looking for talented people. Send us your resume and let&apos;s talk.
          </p>
          <a
            href="mailto:julian.clarkson@ghxstship.pro"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-heading uppercase hover:bg-blue-700 transition-colors text-sm"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}
