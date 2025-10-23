import { Quote } from "lucide-react"

export function TestimonialsSection(): JSX.Element {
  const testimonials = [
    {
      quote: "ATLVS transformed how we manage our festival circuit. We went from chaos to complete clarity in weeks. The hierarchical structure mirrors exactly how we think about our productions.",
      author: "Sarah Chen",
      title: "Production Director",
      company: "Major Festival Producer",
    },
    {
      quote: "The asset tracking alone paid for itself in the first month. No more lost equipment, no more double-bookings. Our load-in and strike times improved by 40%.",
      author: "Marcus Rodriguez",
      title: "Technical Director",
      company: "Live Events Company",
    },
    {
      quote: "Finally, a platform built by people who actually understand production. The role-based access means our vendors and freelancers get exactly what they need—nothing more, nothing less.",
      author: "Jennifer Park",
      title: "Operations Manager",
      company: "Corporate Events Agency",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by Production Professionals
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <Quote className="text-blue-600 mb-4" size={32} aria-hidden="true" />
              <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
