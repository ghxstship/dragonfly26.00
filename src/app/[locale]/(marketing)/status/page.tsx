import { CheckCircle2, AlertTriangle, XCircle, Clock, Activity } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { StatusBadge } from "@/marketing/components/atoms/StatusBadge"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "System Status | ATLVS",
  description: "Real-time status of ATLVS services and infrastructure.",
}

const services = [
  { name: "API", status: "operational" as const, uptime: "99.99%" },
  { name: "Web Application", status: "operational" as const, uptime: "99.98%" },
  { name: "Database", status: "operational" as const, uptime: "99.99%" },
  { name: "Real-time Services", status: "operational" as const, uptime: "99.97%" },
  { name: "File Storage", status: "operational" as const, uptime: "99.99%" },
  { name: "Authentication", status: "operational" as const, uptime: "100%" },
]

const incidents = [
  {
    date: "2025-01-20",
    title: "Database Performance Optimization",
    status: "resolved" as const,
    description: "Scheduled maintenance to optimize database queries. All services remained operational.",
    duration: "30 minutes",
  },
  {
    date: "2025-01-15",
    title: "API Rate Limiting Update",
    status: "resolved" as const,
    description: "Updated rate limiting configuration to improve performance.",
    duration: "15 minutes",
  },
]

const metrics = [
  { label: "Uptime (30 days)", value: "99.98%", icon: Activity },
  { label: "Avg Response Time", value: "145ms", icon: Clock },
  { label: "Incidents (30 days)", value: "0", icon: CheckCircle2 },
]

export default async function StatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="System Status"
            subtitle="Real-time status of all ATLVS services"
          />

          {/* Overall Status */}
          <div className="text-center mt-8">
            <StatusBadge status="operational" label="All Systems Operational" className="text-lg px-6 py-3" />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'])}>
          <div className={grid.stats3}>
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.label}
                  className="mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 text-center max-w-sm md:max-w-none"
                >
                  <Icon className="mx-auto text-blue-600 mb-3" size={32} />
                  <div className="text-3xl md:text-4xl font-title uppercase text-gray-900 dark:text-white mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-2xl md:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-8">
            Service Status
          </h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between max-w-sm md:max-w-none"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-heading uppercase text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uptime: {service.uptime}
                    </p>
                  </div>
                </div>
                <StatusBadge status={service.status} label="Operational" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-2xl md:text-3xl font-heading uppercase text-gray-900 dark:text-white mb-8">
            Recent Incidents
          </h2>
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <div
                  key={index}
                  className="mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 max-w-sm md:max-w-none"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                      <h3 className="font-heading uppercase text-gray-900 dark:text-white">
                        {incident.title}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(incident.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {incident.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Duration: {incident.duration}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs ">
                      Resolved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="mx-auto text-green-600 mb-4" size={48} />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No incidents in the last 30 days
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto text-center", container['4xl'])}>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
            Get Status Updates
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to receive notifications about service status changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="mx-auto flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white max-w-sm md:max-w-none"
              aria-label="Email address"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-heading uppercase hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
