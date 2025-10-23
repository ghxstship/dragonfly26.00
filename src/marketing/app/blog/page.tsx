export const metadata = {
  title: "Blog - ATLVS",
  description: "Insights, updates, and industry trends from the ATLVS team.",
}

export default function BlogPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Insights, Updates, and Industry Trends
          </h1>
        </div>

        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-2xl font-semibold text-gray-900 mb-2">NO ARTICLES PUBLISHED</p>
          <p className="text-gray-600">Check back soon for the latest articles and insights.</p>
        </div>
      </div>
    </div>
  )
}
