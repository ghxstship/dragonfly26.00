export function HowItWorksSection(): JSX.Element {
  const steps = [
    {
      number: "1",
      title: "Structure Your Production",
      description: "Set up your organizational hierarchy—from the big picture down to individual workspaces. Define your projects, productions, and activations exactly how your team thinks about them.",
    },
    {
      number: "2",
      title: "Build Your Team",
      description: "Invite team members, assign roles, and set permissions. From Phantoms (super admins) to Raiders (view-only), everyone gets exactly the access they need.",
    },
    {
      number: "3",
      title: "Manage Everything in Real-Time",
      description: "Track tasks, assets, budgets, and timelines from a single dashboard. Collaborate seamlessly with automatic updates, notifications, and real-time data sync.",
    },
    {
      number: "4",
      title: "Deliver & Analyze",
      description: "Execute flawlessly with complete visibility. After the show, leverage powerful analytics to improve your next production.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From Planning to Strike in Four Simple Steps
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
