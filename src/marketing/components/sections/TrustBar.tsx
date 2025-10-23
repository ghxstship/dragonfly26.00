import { Users, Globe, Activity, Zap } from "lucide-react"

export function TrustBar(): JSX.Element {
  const stats = [
    { icon: Activity, label: "Productions Managed", value: "10,000+" },
    { icon: Users, label: "Active Users", value: "50,000+" },
    { icon: Globe, label: "Countries", value: "100+" },
    { icon: Zap, label: "Uptime", value: "99.9%" },
  ]

  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
          Trusted by Production Teams Worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="text-blue-600" size={32} aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
