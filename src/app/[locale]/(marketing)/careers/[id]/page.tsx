import { Briefcase, MapPin, Clock, DollarSign, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { notFound } from "next/navigation"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"
import { jobs, getJobBySlug } from "@/data/jobs"

export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const job = getJobBySlug(id)
  
  if (!job) {
    return {
      title: "Job Not Found | ATLVS",
    }
  }

  return {
    title: `${job.title} | Careers | ATLVS`,
    description: job.description,
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const job = getJobBySlug(id)

  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className={cn("mx-auto py-4 px-4 sm:px-6 lg:px-8", container['6xl'])}>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all jobs
          </Link>
        </div>
      </div>

      {/* Job Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className={cn("mx-auto py-8 px-4 sm:px-6 lg:px-8", container['6xl'])}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <Briefcase size={18} className="flex-shrink-0" />
                  <span>{job.department}</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={18} className="flex-shrink-0" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={18} className="flex-shrink-0" />
                  <span>{job.type}</span>
                </span>
                {job.salary && (
                  <span className="flex items-center gap-2">
                    <DollarSign size={18} className="flex-shrink-0" />
                    <span>{job.salary}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <a
                href={`mailto:julian.clarkson@ghxstship.pro?subject=Application for ${job.title}&body=Hi, I'm interested in applying for the ${job.title} position.`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-heading uppercase hover:bg-blue-700 transition-colors"
              >
                <Mail size={18} />
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Job Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['4xl'])}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
            {/* About the Role */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                About the Role
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                Qualifications
              </h2>
              <ul className="space-y-3">
                {job.qualifications.map((qualification, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <span className="text-gray-700 dark:text-gray-300">{qualification}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to Have */}
            {job.niceToHave.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                  Nice to Have
                </h2>
                <ul className="space-y-3">
                  {job.niceToHave.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-2" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                Benefits
              </h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply CTA */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-1">
                    Ready to Apply?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send us your resume and let&apos;s start the conversation
                  </p>
                </div>
                <a
                  href={`mailto:julian.clarkson@ghxstship.pro?subject=Application for ${job.title}&body=Hi, I'm interested in applying for the ${job.title} position.`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-heading uppercase hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <Mail size={18} />
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Positions */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-2xl font-heading uppercase text-gray-900 dark:text-white mb-6">
            Other Open Positions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs
              .filter((j) => j.id !== job.id)
              .slice(0, 3)
              .map((otherJob) => (
                <Link
                  key={otherJob.id}
                  href={`/careers/${otherJob.id}`}
                  className="mx-auto block bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all max-w-sm md:max-w-none"
                >
                  <h3 className="font-heading uppercase text-gray-900 dark:text-white mb-2 text-sm">
                    {otherJob.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={12} />
                      {otherJob.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {otherJob.location}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
