import { Shield, Lock, Server, Eye, FileCheck, AlertTriangle, Database, Users } from "lucide-react"

export function SecuritySection(): JSX.Element {
  const features = [
    {
      icon: Lock,
      title: "Data Encryption",
      description: "End-to-end encryption for data in transit and at rest",
    },
    {
      icon: Shield,
      title: "SOC 2 Type II Certified",
      description: "Independently audited security controls",
    },
    {
      icon: FileCheck,
      title: "GDPR Compliant",
      description: "Full compliance with international data protection regulations",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Granular permissions and access controls",
    },
    {
      icon: Eye,
      title: "Audit Logs",
      description: "Complete activity tracking and compliance reporting",
    },
    {
      icon: Server,
      title: "SSO/SAML",
      description: "Enterprise single sign-on integration",
    },
    {
      icon: AlertTriangle,
      title: "2FA",
      description: "Two-factor authentication for all users",
    },
    {
      icon: Database,
      title: "Regular Backups",
      description: "Automated daily backups with point-in-time recovery",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Enterprise-Grade Security You Can Trust
          </h2>
          <p className="text-xl text-gray-600">
            Your data is protected with industry-leading security practices and certifications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <feature.icon className="text-blue-600" size={32} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            99.9% Uptime SLA • SOC 2 Type II • GDPR • ISO 27001
          </p>
        </div>
      </div>
    </section>
  )
}
