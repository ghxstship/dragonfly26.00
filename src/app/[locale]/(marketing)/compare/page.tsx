import { Check, X } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { setRequestLocale } from 'next-intl/server'
import { SectionHeading } from "@/marketing/components/atoms/SectionHeading"
import { container } from "@/design-tokens"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Compare ATLVS | ATLVS",
  description: "See how ATLVS compares to other project management tools.",
}

const comparisons = [
  { name: "Monday.com", slug: "monday" },
  { name: "Asana", slug: "asana" },
  { name: "Smartsheet", slug: "smartsheet" },
  { name: "Trello", slug: "trello" },
]

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="pt-20">
      <section className="py-10 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className={cn("mx-auto", container['6xl'])}>
          <SectionHeading
            title="Compare ATLVS"
            subtitle="See how ATLVS stacks up against other tools"
          />
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-heading uppercase text-gray-900 dark:text-white">
                  ATLVS vs {comp.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
