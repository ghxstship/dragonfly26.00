export function RolesSection(): JSX.Element {
  const internalRoles = [
    {
      emoji: "👻",
      name: "Phantom",
      subtitle: "Supreme Authority",
      description: "Complete system administration and unrestricted access to all operations. Shape platform direction and maintain enterprise oversight.",
    },
    {
      emoji: "✈️",
      name: "Aviator",
      subtitle: "Strategic Leadership",
      description: "Cross-project visibility, resource allocation, and executive analytics. Navigate high-level production direction at scale.",
    },
    {
      emoji: "⚔️",
      name: "Gladiator",
      subtitle: "Project Leadership",
      description: "Full project creation and editing rights. Lead productions from concept to completion with complete control.",
    },
    {
      emoji: "🧭",
      name: "Navigator",
      subtitle: "Coordination",
      description: "Project coordination, task assignment, and team guidance. Chart the course through complex workflows.",
    },
    {
      emoji: "🎯",
      name: "Deviator",
      subtitle: "Execution",
      description: "Focused task completion within established frameworks. Deliver high-quality work on assigned responsibilities.",
    },
    {
      emoji: "🗡️",
      name: "Raider",
      subtitle: "Learning & Observation",
      description: "View-only access to learn and grow. Perfect for newcomers and community members building their skills.",
    },
  ]

  const externalRoles = [
    {
      emoji: "🤜🤛",
      name: "Partner",
      subtitle: "Strategic Collaboration",
      description: "Deep integration for trusted external collaborators. Two-way data sharing and joint workflow management.",
    },
    {
      emoji: "👁️",
      name: "Visitor",
      subtitle: "Limited Visibility",
      description: "Temporary, read-only access for external stakeholders. Stay informed without interfering with workflows.",
    },
    {
      emoji: "🤝",
      name: "Vendor",
      subtitle: "Scoped Delivery",
      description: "Targeted access for external service providers. Upload deliverables and fulfill contracted responsibilities.",
    },
    {
      emoji: "🌟",
      name: "Ambassador",
      subtitle: "Community Champions",
      description: "Represent ATLVS, support users, and foster collaboration. Host events, create content, and grow the ecosystem.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Precision Access Control for Every Team Member
          </h2>
          <p className="text-xl text-gray-600">
            11 branded roles designed for live entertainment production workflows—from executive oversight to external vendors.
          </p>
        </div>

        {/* Internal Roles */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Internal Roles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internalRoles.map((role) => (
              <div
                key={role.name}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl flex-shrink-0" role="img" aria-label={role.name}>
                    {role.emoji}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{role.name}</h4>
                    <p className="text-sm font-semibold text-blue-600 mb-3">{role.subtitle}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Roles */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">External Roles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {externalRoles.map((role) => (
              <div
                key={role.name}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3" role="img" aria-label={role.name}>
                    {role.emoji}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{role.name}</h4>
                  <p className="text-sm font-semibold text-purple-600 mb-3">{role.subtitle}</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed text-center">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
