import { Briefcase, MapPin, Clock, Users, Heart, Zap, Globe, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Careers | ATLVS",
  description: "Join our team and help build the future of live event production management.",
}

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build scalable features for our production management platform using Next.js, TypeScript, and Supabase.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design intuitive interfaces for complex production workflows. Experience with design systems required.",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Help production companies succeed with ATLVS. Experience in live events industry preferred.",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Manage infrastructure, CI/CD, and monitoring for our AWS-based platform.",
  },
]

const benefits = [
  {
    icon: Globe,
    title: "Remote-First",
    description: "Work from anywhere in the world",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Work when you're most productive",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description: "Learn and advance your career",
  },
  {
    icon: Users,
    title: "Great Team",
    description: "Work with talented, passionate people",
  },
  {
    icon: Zap,
    title: "Latest Tech",
    description: "Use cutting-edge tools and frameworks",
  },
]

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Join Our Team"
            subtitle="Help us build the future of live event production management"
          />
        </div>
      </section>

      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-2xl md:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-8 text-center">
            Why Work at ATLVS?
          </h2>
          <div className={grid.cards3}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
                >
                  <Icon className="mx-auto text-blue-600 mb-3" size={32} />
                  <h3 className="font-heading uppercase text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-2xl md:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-8">
            Open Positions
          </h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/careers/${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Apply Now
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto text-center", container['4xl'])}>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
            Don&apos;t See a Perfect Fit?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We&apos;re always looking for talented people. Send us your resume and let&apos;s talk.
          </p>
          <a
            href="mailto:careers@atlvs.one"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}
