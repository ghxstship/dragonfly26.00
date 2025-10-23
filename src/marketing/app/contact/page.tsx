import { Mail, MessageSquare, Users, Briefcase } from "lucide-react"

export const metadata = {
  title: "Contact Us - ATLVS",
  description: "Get in touch with the ATLVS team.",
}

export default function ContactPage(): JSX.Element {
  const contacts = [
    {
      icon: Mail,
      title: "General Inquiries",
      email: "hello@atlvs.com",
      description: "For general questions and information",
    },
    {
      icon: Briefcase,
      title: "Sales",
      email: "sales@atlvs.com",
      description: "Interested in ATLVS for your team?",
    },
    {
      icon: MessageSquare,
      title: "Support",
      email: "support@atlvs.com",
      description: "Need help with your account?",
    },
    {
      icon: Users,
      title: "Partnerships",
      email: "partnerships@atlvs.com",
      description: "Interested in partnering with us?",
    },
  ]

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            We would love to hear from you. Choose the best way to reach us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {contacts.map((contact) => (
            <div key={contact.title} className="bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <contact.icon className="text-blue-600" size={24} aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h2>
                  <p className="text-gray-600 mb-3">{contact.description}</p>
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Office</h2>
          <p className="text-gray-600 text-lg font-semibold mb-2">NO PHYSICAL OFFICE</p>
          <p className="text-gray-500">We are a fully remote company.</p>
        </div>
      </div>
    </div>
  )
}
