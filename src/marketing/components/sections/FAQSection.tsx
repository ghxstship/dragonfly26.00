"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

export function FAQSection(): JSX.Element {
  const t = useTranslations('marketing.faq')

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { question: t('question1'), answer: t('answer1') },
    { question: t('question2'), answer: t('answer2') },
    { question: t('question3'), answer: t('answer3') },
    { question: t('question4'), answer: t('answer4') },
    { question: t('question5'), answer: t('answer5') },
    { question: t('question6'), answer: t('answer6') },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
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
