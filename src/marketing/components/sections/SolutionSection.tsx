import { Target, Users, Package, DollarSign } from "lucide-react"

export function SolutionSection(): JSX.Element {
  const solutions = [
    {
      icon: Target,
      emoji: "🎯",
      title: "Project Management That Scales",
      description: "From single activations to multi-city tours, manage every detail with hierarchical organization structures that mirror how you actually work.",
      features: [
        "5-level organizational hierarchy (Organization → Projects → Productions → Activations → Workspaces)",
        "Unlimited projects and productions",
        "Custom workflows and templates",
        "Real-time collaboration across distributed teams",
        "Milestone tracking and critical path management",
      ],
    },
    {
      icon: Users,
      emoji: "👥",
      title: "Workforce Management Simplified",
      description: "Know who's doing what, where, and when. Manage your entire crew—from core team to freelancers and vendors—with role-based access and permissions.",
      features: [
        "11 branded role types with granular permissions",
        "Team scheduling and availability tracking",
        "Skill-based resource allocation",
        "Automated onboarding workflows",
        "Performance tracking and certifications",
      ],
    },
    {
      icon: Package,
      emoji: "📦",
      title: "Asset Tracking & Logistics",
      description: "Never lose track of equipment again. From load-in to strike, know exactly where every asset is and who's responsible for it.",
      features: [
        "Complete asset lifecycle management",
        "Real-time location tracking",
        "Maintenance scheduling and history",
        "Barcode/QR code integration",
        "Multi-location inventory management",
        "Asset reservation and checkout systems",
      ],
    },
    {
      icon: DollarSign,
      emoji: "💰",
      title: "Financial Control & Transparency",
      description: "Stay on budget with real-time financial tracking, automated approvals, and predictive analytics that help you see problems before they become disasters.",
      features: [
        "Budget creation and tracking by department/zone",
        "Purchase order management",
        "Expense tracking and approvals",
        "Vendor invoice processing",
        "Real-time budget vs. actual reporting",
        "GL code integration and financial rollups",
      ],
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            One Platform. Complete Control. Flawless Execution.
          </h2>
          <p className="text-xl text-gray-600">
            ATLVS brings order to the chaos with purpose-built tools for live entertainment production management.
          </p>
        </div>

        <div className="space-y-16">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 items-center`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl" role="img" aria-label={solution.title}>
                    {solution.emoji}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900">{solution.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">{solution.description}</p>
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Key Features:</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
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
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center">
                  <solution.icon className="text-blue-600" size={120} strokeWidth={1} aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
