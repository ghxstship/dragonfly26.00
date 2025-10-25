import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone } from "lucide-react"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the ATLVS team. We're here to help with questions, demos, and enterprise inquiries.",
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-4 md:px-6 lg:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Have questions? Want to schedule a demo? We&apos;re here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 md:gap-3 md:gap-4 lg:gap-6 lg:gap-8 max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto px-4 md:px-6">
            <div className="bg-white p-4 md:p-8 rounded-xl border-2 border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-wrap items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">General inquiries and support</p>
              <a href="mailto:hello@atlvs.one" className="text-blue-600 hover:text-blue-700">
                hello@atlvs.one
              </a>
            </div>

            <div className="bg-white p-4 md:p-8 rounded-xl border-2 border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-wrap items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our team</p>
              <Button variant="outline">Start Chat</Button>
            </div>

            <div className="bg-white p-4 md:p-8 rounded-xl border-2 border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-wrap items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Demo</h3>
              <p className="text-gray-600 mb-4">See ATLVS in action</p>
              <a href="/demo">
                <Button variant="default">Book Demo</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
