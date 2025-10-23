import { Database, MessageSquare, FolderOpen, Calendar, Briefcase, Code } from "lucide-react"

export function IntegrationsSection(): JSX.Element {
  const categories = [
    {
      icon: Database,
      name: "Accounting",
      tools: ["QuickBooks", "Xero", "NetSuite"],
    },
    {
      icon: MessageSquare,
      name: "Communication",
      tools: ["Slack", "Microsoft Teams", "Discord"],
    },
    {
      icon: FolderOpen,
      name: "File Storage",
      tools: ["Google Drive", "Dropbox", "Box"],
    },
    {
      icon: Calendar,
      name: "Calendar",
      tools: ["Google Calendar", "Outlook", "Apple Calendar"],
    },
    {
      icon: Briefcase,
      name: "Project Management",
      tools: ["Asana", "Monday.com", "Trello"],
    },
    {
      icon: Code,
      name: "Custom Integrations",
      tools: ["Full REST API access"],
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Plays Well With Your Existing Tools
          </h2>
          <p className="text-xl text-gray-600">
            Connect ATLVS with the tools you already use through our open API, webhooks, and pre-built integrations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <category.icon className="text-blue-600" size={24} aria-hidden="true" />
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
              </div>
              <ul className="space-y-2">
                {category.tools.map((tool) => (
                  <li key={tool} className="text-gray-600 text-sm">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
