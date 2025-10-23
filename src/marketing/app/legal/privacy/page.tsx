export const metadata = {
  title: "Privacy Policy - ATLVS",
  description: "ATLVS Privacy Policy - How we collect, use, and protect your data.",
}

export default function PrivacyPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1>Privacy Policy</h1>
        <p className="text-gray-600">Last Updated: [Date]</p>

        <h2>Introduction</h2>
        <p>
          ATLVS (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>

        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
          <li>Name, email address, and contact information</li>
          <li>Account credentials and authentication data</li>
          <li>Profile information and preferences</li>
          <li>Payment and billing information</li>
        </ul>

        <h3>Usage Information</h3>
        <ul>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Log data and analytics</li>
          <li>Feature usage and interaction data</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Respond to inquiries and provide customer support</li>
          <li>Monitor and analyze usage patterns and trends</li>
        </ul>

        <h2>Data Security</h2>
        <ul>
          <li>End-to-end encryption for data in transit and at rest</li>
          <li>SOC 2 Type II certified infrastructure</li>
          <li>Regular security audits and penetration testing</li>
        </ul>

        <h2>Your Rights</h2>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data</li>
        </ul>

        <h2>Contact Us</h2>
        <p>For privacy-related questions: privacy@atlvs.com</p>
      </div>
    </div>
  )
}
