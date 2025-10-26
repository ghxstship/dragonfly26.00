import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Privacy Policy | ATLVS",
  description: "ATLVS Privacy Policy - How we collect, use, and protect your data.",
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h1 className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-title uppercase text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 lg:mb-8">Last updated: October 23, 2025</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="font-heading uppercase">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including when you create an account, use our services, or communicate with us.
            </p>

            <h2 className="font-heading uppercase">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.
            </p>

            <h2 className="font-heading uppercase">3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf.
            </p>

            <h2 className="font-heading uppercase">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="font-heading uppercase">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.
            </p>

            <h2 className="font-heading uppercase">6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@atlvs.one" className="text-blue-600 hover:text-blue-700">privacy@atlvs.one</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
