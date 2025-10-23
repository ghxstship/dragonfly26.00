import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export const metadata = {
  title: "Pricing - ATLVS",
  description: "Transparent pricing that scales with you. From solo contractors to enterprise producers.",
}

export default function PricingPage(): JSX.Element {
  const plans = [
    {
      name: "Community",
      price: "Free",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Community access and resources",
        "Basic project management",
        "Single user seat",
        "Community support forum",
      ],
      role: "Raider",
      hubAccess: "Network Hub",
      cta: "Start Free",
      ctaLink: "https://app.atlvs.xyz/auth/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per month",
      annualPrice: "$10/month billed annually",
      description: "Independent Contractor",
      features: [
        "Everything in Community, plus:",
        "Standardized datasets and workflows",
        "Transparent reporting",
        "Advanced project tools",
        "Priority email support",
        "Enhanced analytics",
      ],
      roles: "Deviator, Raider",
      hubAccess: "Network Hub, Production Hub",
      cta: "Start Pro Trial",
      ctaLink: "https://app.atlvs.xyz/auth/signup?plan=pro",
      highlighted: false,
    },
    {
      name: "Team",
      price: "$120",
      period: "per month",
      annualPrice: "$100/month billed annually",
      description: "Vendor • 2-10 Seats",
      features: [
        "Everything in Pro, plus:",
        "Tiered access controls",
        "Global templates",
        "Team collaboration hub",
        "Unlimited API integrations",
        "Open source automations",
        "Webhook support",
        "Premium support (24hr response)",
      ],
      roles: "Gladiator, Navigator, Deviator, Raider, Visitor, Vendor, Ambassador",
      hubAccess: "Network Hub, Production Hub, Business Hub, System Hub",
      cta: "Start Team Trial",
      ctaLink: "https://app.atlvs.xyz/auth/signup?plan=team",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$1,200",
      period: "per month",
      annualPrice: "$1,000/month billed annually",
      description: "Producer • 2-20 Seats",
      features: [
        "Everything in Team, plus:",
        "Advanced permissions",
        "Custom data fields",
        "Personalized views",
        "SSO & SAML integration",
        "AI agents & insights",
        "Smart recommendations",
        "Predictive resource planning",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom onboarding & training",
      ],
      roles: "All 11 roles (Phantom, Aviator, Gladiator, Navigator, Deviator, Raider, Partner, Visitor, Vendor, Ambassador)",
      hubAccess: "All Hubs (Network, Production, Business, System, Intelligence)",
      cta: "Schedule Demo",
      ctaLink: "/demo",
      highlighted: false,
    },
  ]

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing That Scales With You
          </h1>
          <p className="text-xl text-gray-600">
            From solo contractors to enterprise producers, we have a plan that fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.highlighted
                  ? "border-blue-600 shadow-xl scale-105"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                {plan.annualPrice && (
                  <p className="text-sm text-gray-500 mt-1">{plan.annualPrice}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 mb-6 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">Roles: </span>
                  <span className="text-gray-600">{plan.roles || plan.role}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Hub Access: </span>
                  <span className="text-gray-600">{plan.hubAccess}</span>
                </div>
              </div>

              <Link href={plan.ctaLink} className="block">
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Seats */}
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need More Seats?</h3>
          <p className="text-gray-600">
            Additional seats available for <span className="font-semibold">$12/month</span> ($10/month when billed annually)
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I try ATLVS before committing?
              </h3>
              <p className="text-gray-600">
                Absolutely! Our Community plan is free forever—no credit card required. Pro, Team, and Enterprise plans offer 14-day free trials.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and ACH transfers for Enterprise plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
