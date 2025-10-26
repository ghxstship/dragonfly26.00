import { Shield, Lock, Eye, Server, FileCheck, Users, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { FeatureCard } from "@/marketing/components/atoms/FeatureCard"
import { container, grid } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Security | ATLVS",
  description: "Enterprise-grade security, compliance, and data protection for your production operations.",
}

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data encrypted in transit (TLS 1.3) and at rest (AES-256).",
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
  },
  {
    icon: Shield,
    title: "SOC 2 Type II Compliant",
    description: "Independently audited security controls and processes.",
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
  },
  {
    icon: Users,
    title: "Role-Based Access Control",
    description: "11 branded roles with granular permissions and hierarchy-aware access.",
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
  },
  {
    icon: Eye,
    title: "Audit Logging",
    description: "Complete audit trail of all user actions and system changes.",
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
  },
  {
    icon: Server,
    title: "Infrastructure Security",
    description: "Hosted on AWS with 99.99% uptime SLA and automatic failover.",
    iconColor: "text-red-600",
    iconBgColor: "bg-red-100",
  },
  {
    icon: FileCheck,
    title: "Regular Security Audits",
    description: "Quarterly penetration testing and vulnerability assessments.",
    iconColor: "text-teal-600",
    iconBgColor: "bg-teal-100",
  },
]

const compliance = [
  { name: "SOC 2 Type II", status: "Certified" },
  { name: "GDPR", status: "Compliant" },
  { name: "CCPA", status: "Compliant" },
  { name: "ISO 27001", status: "In Progress" },
]

const dataProtection = [
  {
    title: "Data Encryption",
    items: [
      "TLS 1.3 for data in transit",
      "AES-256 encryption for data at rest",
      "Encrypted database backups",
      "Secure key management with AWS KMS",
    ],
  },
  {
    title: "Access Controls",
    items: [
      "Multi-factor authentication (MFA)",
      "Single sign-on (SSO) support",
      "IP whitelisting",
      "Session management and timeout",
    ],
  },
  {
    title: "Data Backup & Recovery",
    items: [
      "Automated daily backups",
      "Point-in-time recovery",
      "Geographic redundancy",
      "Disaster recovery plan with 4-hour RTO",
    ],
  },
  {
    title: "Monitoring & Response",
    items: [
      "24/7 security monitoring",
      "Automated threat detection",
      "Incident response team",
      "Security incident notification within 72 hours",
    ],
  },
]

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Enterprise-Grade Security"
            subtitle="Your data is protected with industry-leading security measures"
          />
        </div>
      </section>

      {/* Security Features */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'])}>
          <div className={grid.cards3}>
            {securityFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-8 text-center">
            Compliance & Certifications
          </h2>
          <div className={grid.cards4}>
            {compliance.map((item) => (
              <div
                key={item.name}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
              >
                <CheckCircle2 className="mx-auto text-green-600 mb-3" size={32} />
                <h3 className="font-heading uppercase text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm ">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Details */}
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className={cn("mx-auto", container['6xl'])}>
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-12 text-center">
            Data Protection Measures
          </h2>
          <div className={grid.cards2}>
            {dataProtection.map((section) => (
              <div
                key={section.title}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <h3 className="text-xl font-heading uppercase text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Contact */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto text-center", container['4xl'])}>
          <AlertTriangle className="mx-auto text-orange-600 mb-4" size={48} />
          <h2 className="text-3xl md:text-4xl font-heading uppercase text-gray-900 dark:text-white mb-4">
            Report a Security Issue
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            If you discover a security vulnerability, please report it to our security team immediately.
          </p>
          <a
            href="mailto:security@atlvs.one"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Security Team
          </a>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            security@atlvs.one
          </p>
        </div>
      </section>
    </div>
  )
}
