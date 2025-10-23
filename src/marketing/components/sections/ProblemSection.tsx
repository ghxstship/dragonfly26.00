import { AlertCircle, MessageSquareX, TrendingUp, Package, FileWarning, Clock } from "lucide-react"

export function ProblemSection(): JSX.Element {
  const painPoints = [
    {
      icon: AlertCircle,
      title: "Scattered Information",
      description: "Critical data trapped in emails, spreadsheets, and disconnected tools",
    },
    {
      icon: MessageSquareX,
      title: "Communication Breakdowns",
      description: "Teams working in silos without real-time visibility",
    },
    {
      icon: TrendingUp,
      title: "Budget Overruns",
      description: "No centralized financial tracking or predictive insights",
    },
    {
      icon: Package,
      title: "Asset Chaos",
      description: "Lost equipment, double-bookings, and inventory nightmares",
    },
    {
      icon: FileWarning,
      title: "Compliance Risks",
      description: "Missing documentation and audit trails when you need them most",
    },
    {
      icon: Clock,
      title: "Onboarding Delays",
      description: "Weeks to get new team members and vendors up to speed",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Production Chaos Doesn&apos;t Have to Be Your Reality
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Live entertainment production is complex. You&apos;re juggling multiple vendors, managing distributed teams across locations, tracking thousands of assets, and keeping budgets in check—all while racing against impossible deadlines.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {painPoints.map((point) => (
            <div key={point.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <point.icon className="text-red-600" size={24} aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                  <p className="text-gray-600">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
