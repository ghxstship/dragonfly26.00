import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Terms of Service | ATLVS",
  description: "ATLVS Terms of Service - Legal terms and conditions for using our platform.",
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title uppercase text-gray-900 dark:text-white mb-6">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 lg:mb-8">Last updated: October 23, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="font-heading uppercase">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ATLVS, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="font-heading uppercase">2. Use License</h2>
            <p>
              Permission is granted to temporarily use ATLVS for personal or commercial use. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="font-heading uppercase">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h2 className="font-heading uppercase">4. Prohibited Uses</h2>
            <p>
              You may not use ATLVS for any illegal purpose or to violate any laws. You may not attempt to gain unauthorized access to any portion of the service.
            </p>

            <h2 className="font-heading uppercase">5. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by ATLVS and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="font-heading uppercase">6. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2 className="font-heading uppercase">7. Limitation of Liability</h2>
            <p>
              In no event shall ATLVS be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
            </p>

            <h2 className="font-heading uppercase">8. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at <a href="mailto:legal@atlvs.one" className="text-blue-600 hover:text-blue-700">legal@atlvs.one</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
