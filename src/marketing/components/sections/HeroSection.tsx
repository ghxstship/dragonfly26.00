import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection(): JSX.Element {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The Project Management System for{" "}
            <span className="text-blue-600">Experiential Production Teams</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Unify your projects, workforce, assets, and finances in one powerful platform designed specifically for experiential entertainment production.
          </p>

          {/* Supporting Copy */}
          <p className="text-lg text-gray-500 mb-10 max-w-3xl mx-auto">
            From festivals to corporate events, concerts to immersive experiences—ATLVS gives production teams the clarity, control, and collaboration they need to deliver unforgettable moments.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="https://app.atlvs.xyz/auth/signup">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                Start Free Today
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Schedule a Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-sm text-gray-500">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>

        {/* Hero Image/Screenshot Placeholder */}
        <div className="mt-16 relative">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl border border-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-lg">Platform Screenshot</div>
          </div>
        </div>
      </div>
    </section>
  )
}
