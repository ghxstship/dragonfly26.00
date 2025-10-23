export const metadata = {
  title: "About Us - ATLVS",
  description: "Built by production professionals, for production professionals.",
}

export default function AboutPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Built by Production Professionals, for Production Professionals
          </h1>
        </div>

        <div className="prose prose-lg mx-auto">
          <h2>Our Story</h2>
          <p>
            ATLVS was born from frustration. As production professionals, we were tired of juggling spreadsheets, emails, and disconnected tools. We knew there had to be a better way.
          </p>
          <p>
            In [Year], we set out to build the platform we wished existed—one that understood the unique challenges of live entertainment production. Today, ATLVS powers productions worldwide, from intimate events to massive festivals.
          </p>

          <h2>Our Mission</h2>
          <p>
            To empower production teams with the tools they need to deliver unforgettable experiences, without the chaos.
          </p>

          <h2>Our Vision</h2>
          <p>
            A world where every production team has access to professional-grade management tools, regardless of size or budget.
          </p>

          <h2>Our Values</h2>
          <ul>
            <li><strong>User-First</strong>: We build for production professionals</li>
            <li><strong>Excellence</strong>: We ship quality, not just features</li>
            <li><strong>Transparency</strong>: We communicate openly and honestly</li>
            <li><strong>Collaboration</strong>: We win as a team</li>
            <li><strong>Innovation</strong>: We challenge the status quo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
