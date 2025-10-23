export const metadata = {
  title: "Schedule a Demo - ATLVS",
  description: "See ATLVS in action with a personalized demo.",
}

export default function DemoPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">See ATLVS in Action</h1>
          <p className="text-xl text-gray-600">
            Schedule a 30-minute personalized demo with our team.
          </p>
        </div>

        <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What to Expect</h2>
          <ul className="text-left max-w-2xl mx-auto space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-minute personalized demo</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>See features relevant to your workflow</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Ask questions in real-time</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No sales pressure</span>
            </li>
          </ul>

          <p className="text-gray-600 mb-6">
            Contact us at <a href="mailto:sales@atlvs.com" className="text-blue-600 hover:text-blue-700 font-semibold">sales@atlvs.com</a> to schedule your demo.
          </p>
        </div>
      </div>
    </div>
  )
}
