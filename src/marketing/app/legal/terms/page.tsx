export const metadata = {
  title: "Terms of Service - ATLVS",
  description: "ATLVS Terms of Service - Legal terms and conditions for using our platform.",
}

export default function TermsPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1>Terms of Service</h1>
        <p className="text-gray-600">Last Updated: [Date]</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using ATLVS, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          ATLVS provides cloud-based production management software for experiential entertainment professionals.
        </p>

        <h2>3. Account Registration</h2>
        <ul>
          <li>You must provide accurate, current, and complete information</li>
          <li>You are responsible for maintaining account security</li>
          <li>You must be at least 16 years old to create an account</li>
        </ul>

        <h2>4. Acceptable Use Policy</h2>
        <p>You agree NOT to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Upload malicious code or viruses</li>
          <li>Interfere with service operation</li>
        </ul>

        <h2>5. Subscription and Billing</h2>
        <ul>
          <li>Subscription fees are billed in advance</li>
          <li>Prices may change with 30 days notice</li>
          <li>Cancellation takes effect at end of billing period</li>
        </ul>

        <h2>6. Contact</h2>
        <p>For legal questions: legal@atlvs.com</p>
      </div>
    </div>
  )
}
