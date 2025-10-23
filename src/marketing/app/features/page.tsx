import { FeaturesSection } from "../../components/sections/FeaturesSection"
import { IntegrationsSection } from "../../components/sections/IntegrationsSection"

export const metadata = {
  title: "Features - ATLVS",
  description: "Everything you need to manage live entertainment production. Nothing you don't.",
}

export default function FeaturesPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Everything You Need. Nothing You Don&apos;t.
          </h1>
          <p className="text-xl text-gray-600">
            Purpose-built features for live entertainment production management.
          </p>
        </div>
      </div>

      <FeaturesSection />
      <IntegrationsSection />
    </div>
  )
}
