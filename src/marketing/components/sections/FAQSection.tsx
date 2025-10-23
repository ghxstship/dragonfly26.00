import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQSection(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What makes ATLVS different from other project management tools?",
      answer: "ATLVS is purpose-built for live entertainment production. Unlike generic PM tools, we understand the unique challenges of managing distributed teams, complex logistics, vendor relationships, and tight budgets in the events industry. Our 5-level organizational hierarchy, 11 branded roles, and specialized modules for assets, locations, and production workflows are designed specifically for how you work.",
    },
    {
      question: "Can I try ATLVS before committing?",
      answer: "Absolutely! Our Community plan is free forever—no credit card required. Pro, Team, and Enterprise plans offer 14-day free trials so you can experience the full power of ATLVS risk-free.",
    },
    {
      question: "How long does implementation take?",
      answer: "Most teams are up and running in less than a day. Our intuitive interface, pre-built templates, and standardized workflows mean you can start managing productions immediately. Enterprise customers receive dedicated onboarding and custom training.",
    },
    {
      question: "What kind of support do you offer?",
      answer: "Community: Forum-based community support. Pro: Priority email support (48hr response). Team: Premium support (24hr response). Enterprise: 24/7 priority support with dedicated account manager.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes. We take security seriously with end-to-end encryption, SOC 2 Type II certification, GDPR compliance, and enterprise-grade infrastructure. Your data is backed up daily with 99.9% uptime guaranteed for Enterprise plans.",
    },
    {
      question: "Can I integrate ATLVS with my existing tools?",
      answer: "Yes! ATLVS offers a full REST API, webhook support, and pre-built integrations with popular tools like QuickBooks, Slack, Google Drive, and more. Team and Enterprise plans include unlimited API access.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={20}
                  aria-hidden="true"
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
