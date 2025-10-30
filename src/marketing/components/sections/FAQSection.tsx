"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, padding, border, container, height } from "@/design-tokens"

export function FAQSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
  
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { question: tGen('question1'), answer: tGen('answer1') },
    { question: tGen('question2'), answer: tGen('answer2') },
    { question: tGen('question3'), answer: tGen('answer3') },
    { question: tGen('question4'), answer: tGen('answer4') },
    { question: tGen('question5'), answer: tGen('answer5') },
    { question: tGen('question6'), answer: tGen('answer6') },
  ]

  return (
    <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
      <div className={cn("mx-auto", container['2xl'])}>
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {tGen('title')}
          </h2>
        </div>

        <div className={spacing.gap}>
          {faqs.map((faq, index) => (
            <div key={index} className={cn("bg-white dark:bg-gray-800 rounded-lg overflow-hidden", border.card)}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={cn("w-full text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", padding.section)}
                aria-expanded={openIndex === index}
              >
                <span className="font-heading uppercase text-gray-900 dark:text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn("text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform", height.icon, openIndex === index && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              {openIndex === index && (
                <div className="px-4 md:px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
