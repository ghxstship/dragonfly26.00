export const metadata = {
  title: "Documentation - ATLVS",
  description: "Everything you need to master ATLVS.",
}

export default function DocsPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to master ATLVS.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-2xl font-semibold text-gray-900 mb-2">NO DOCUMENTATION AVAILABLE</p>
          <p className="text-gray-600">Check back soon for comprehensive guides and tutorials.</p>
        </div>
      </div>
    </div>
  )
}
