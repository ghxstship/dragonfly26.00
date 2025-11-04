/**
 * Waitlist Confirmation Email Template
 * Sent when user successfully joins the waitlist
 */

interface WaitlistConfirmationEmailProps {
  fullName: string
  email: string
  position?: number
  estimatedWaitDays?: number
}

export function WaitlistConfirmationEmail({
  fullName,
  email,
  position,
  estimatedWaitDays,
}: WaitlistConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#7c3aed', padding: '32px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>
          (ATLVS)
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: '32px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>
          You&apos;re on the Waitlist!
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '16px' }}>
          Hi {fullName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '24px' }}>
          Thanks for your interest in ATLVS! We&apos;ve received your request and you&apos;re now on our waitlist.
        </p>

        {/* Position Card */}
        {position && (
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '24px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
              Your position in queue
            </p>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#7c3aed', margin: '0' }}>
              #{position}
            </p>
            {estimatedWaitDays && (
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
                Estimated wait: ~{estimatedWaitDays} days
              </p>
            )}
          </div>
        )}

        {/* What's Next */}
        <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>
          What happens next?
        </h3>

        <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
          <li style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '8px' }}>
            We&apos;ll review your application
          </li>
          <li style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '8px' }}>
            You&apos;ll receive an email invitation when approved
          </li>
          <li style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '8px' }}>
            Check your email regularly for updates
          </li>
        </ul>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a 
            href={`https://atlvs.com/waitlist/status?email=${encodeURIComponent(email)}`}
            style={{
              display: 'inline-block',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              padding: '12px 32px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Check Your Status
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
          ATLVS - Live Entertainment Production Management
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>
          You received this email because you joined our waitlist.
        </p>
      </div>
    </div>
  )
}

// Plain text version
export function WaitlistConfirmationEmailText({
  fullName,
  position,
  estimatedWaitDays,
}: WaitlistConfirmationEmailProps) {
  return `
You're on the Waitlist!

Hi ${fullName},

Thanks for your interest in ATLVS! We've received your request and you're now on our waitlist.

${position ? `Your position in queue: #${position}` : ''}
${estimatedWaitDays ? `Estimated wait: ~${estimatedWaitDays} days` : ''}

What happens next?
- We'll review your application
- You'll receive an email invitation when approved
- Check your email regularly for updates

Thanks for your patience!
The ATLVS Team

---
ATLVS - Live Entertainment Production Management
You received this email because you joined our waitlist.
  `.trim()
}
