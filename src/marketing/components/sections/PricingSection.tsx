import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection(): JSX.Element {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transparent Pricing That Scales With You
          </h2>
          <p className="text-xl text-gray-600">
            From solo contractors to enterprise producers, we have a plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Community */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Community</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">Free</span>
              <span className="text-gray-600"> forever</span>
            </div>
            <p className="text-gray-600 mb-6">Perfect for getting started</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Community access and resources</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Basic project management</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Single user seat</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.xyz/auth/signup">
              <Button variant="outline" className="w-full">Start Free</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$12</span>
              <span className="text-gray-600">/month</span>
              <p className="text-sm text-gray-500">$10/month annual</p>
            </div>
            <p className="text-gray-600 mb-6">Independent Contractor</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Everything in Community, plus:</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Advanced project tools</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Priority email support</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.xyz/auth/signup?plan=pro">
              <Button variant="outline" className="w-full">Start Pro Trial</Button>
            </Link>
          </div>

          {/* Team */}
          <div className="border-2 border-blue-600 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Team</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$120</span>
              <span className="text-gray-600">/month</span>
              <p className="text-sm text-gray-500">$100/month annual</p>
            </div>
            <p className="text-gray-600 mb-6">Vendor • 2-10 Seats</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Everything in Pro, plus:</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Team collaboration hub</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Unlimited API integrations</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.xyz/auth/signup?plan=team">
              <Button variant="default" className="w-full">Start Team Trial</Button>
            </Link>
          </div>

          {/* Enterprise */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$1,200</span>
              <span className="text-gray-600">/month</span>
              <p className="text-sm text-gray-500">$1,000/month annual</p>
            </div>
            <p className="text-gray-600 mb-6">Producer • 2-20 Seats</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>Everything in Team, plus:</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>SSO & SAML integration</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span>24/7 priority support</span>
              </li>
            </ul>
            <Link href="/demo">
              <Button variant="outline" className="w-full">Schedule Demo</Button>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold">
            View detailed pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
