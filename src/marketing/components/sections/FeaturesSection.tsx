import { LayoutDashboard, Briefcase, Network, BarChart3, Settings } from "lucide-react"

export function FeaturesSection(): JSX.Element {
  const hubs = [
    {
      icon: LayoutDashboard,
      name: "Production Hub",
      description: "Manage the entire production lifecycle",
      features: [
        "Dashboard with personalized quick actions",
        "Project planning and timeline management",
        "Event scheduling and calendar views",
        "People management and crew tracking",
        "Asset inventory and logistics",
        "Location and venue management",
        "File storage and document management",
      ],
      color: "blue",
    },
    {
      icon: Briefcase,
      name: "Business Hub",
      description: "Run your production business efficiently",
      features: [
        "Company and vendor management",
        "Job postings and career opportunities",
        "Procurement and purchasing",
        "Financial management and budgeting",
        "Invoice and expense tracking",
        "GL code integration",
      ],
      color: "green",
    },
    {
      icon: Network,
      name: "Network Hub",
      description: "Connect and collaborate",
      features: [
        "Community discussions and forums",
        "Marketplace for services and equipment",
        "Resource library and best practices",
        "Industry guides and training materials",
        "Glossary and troubleshooting support",
      ],
      color: "purple",
    },
    {
      icon: BarChart3,
      name: "Intelligence Hub",
      description: "Make data-driven decisions",
      features: [
        "Advanced analytics and reporting",
        "Custom dashboards and insights",
        "Predictive resource planning",
        "Performance metrics and KPIs",
        "Executive summaries and exports",
      ],
      color: "orange",
    },
    {
      icon: Settings,
      name: "System Hub",
      description: "Complete administrative control",
      features: [
        "User and team management",
        "Role-based access controls (RBAC)",
        "API tokens and integrations",
        "Webhooks and automations",
        "Custom fields and workflows",
        "SSO and SAML integration (Enterprise)",
        "Audit logs and compliance tracking",
      ],
      color: "gray",
    },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      gray: "bg-gray-100 text-gray-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <p className="text-xl text-gray-600">
            Five powerful hubs designed specifically for live entertainment production management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hubs.map((hub) => (
            <div
              key={hub.name}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${getColorClasses(hub.color)}`}>
                <hub.icon size={28} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{hub.name}</h3>
              <p className="text-gray-600 mb-6 font-medium">{hub.description}</p>
              <ul className="space-y-2">
                {hub.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
