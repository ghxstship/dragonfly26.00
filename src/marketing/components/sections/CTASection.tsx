import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection(): JSX.Element {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Production Workflow?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of production professionals who have already made the switch to ATLVS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="https://app.atlvs.xyz/auth/signup">
            <Button variant="default" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
              Start Free Today
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
              Schedule a Demo
            </Button>
          </Link>
        </div>

        <p className="text-sm text-blue-100">
          No credit card required • 14-day free trial on paid plans • Cancel anytime
        </p>
      </div>
    </section>
  )
}
