/**
 * Invitation Sent Email Template
 * Sent when Legend approves waitlist entry and sends invitation
 */

interface InvitationSentEmailProps {
  fullName: string
  inviterName: string
  organizationName: string
  workspaceName: string
  roleName: string
  invitationToken: string
  expiresAt: string
  personalMessage?: string
}

export function InvitationSentEmail({
  fullName,
  inviterName,
  organizationName,
  workspaceName,
  roleName,
  invitationToken,
  expiresAt,
  personalMessage,
}: InvitationSentEmailProps) {
  const inviteUrl = `https://atlvs.com/invite/${invitationToken}`
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#10b981', padding: '32px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', fontSize: '32px', margin: '0', fontWeight: 'bold' }}>
          (ATLVS)
        </h1>
        <p style={{ color: '#ffffff', fontSize: '18px', margin: '8px 0 0 0' }}>
          Your Invitation is Ready!
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: '32px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#1f2937' }}>
          Welcome to ATLVS!
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '16px' }}>
          Hi {fullName},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '24px', color: '#4b5563', marginBottom: '24px' }}>
          Great news! You&apos;ve been approved for early access to ATLVS. {inviterName} has invited you to join their team.
        </p>

        {/* Personal Message */}
        {personalMessage && (
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            borderLeft: '4px solid #10b981',
            padding: '16px', 
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', fontWeight: '600' }}>
              Personal message from {inviterName}:
            </p>
            <p style={{ fontSize: '14px', color: '#047857', margin: '0', fontStyle: 'italic' }}>
              &ldquo;{personalMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Invitation Details */}
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#1f2937' }}>
            Invitation Details
          </h3>
          
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', width: '40%' }}>Organization:</td>
              <td style={{ padding: '8px 0', color: '#1f2937', fontWeight: '600' }}>{organizationName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Workspace:</td>
              <td style={{ padding: '8px 0', color: '#1f2937', fontWeight: '600' }}>{workspaceName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Your Role:</td>
              <td style={{ padding: '8px 0', color: '#1f2937', fontWeight: '600' }}>{roleName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Expires:</td>
              <td style={{ padding: '8px 0', color: '#dc2626', fontWeight: '600' }}>{expiryDate}</td>
            </tr>
          </table>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '24px' }}>
          <a 
            href={inviteUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '16px 48px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '700'
            }}
          >
            Accept Invitation
          </a>
        </div>

        <p style={{ fontSize: '14px', textAlign: 'center', color: '#6b7280', marginBottom: '8px' }}>
          Or copy and paste this link into your browser:
        </p>
        <p style={{ 
          fontSize: '12px', 
          textAlign: 'center', 
          color: '#7c3aed', 
          wordBreak: 'break-all',
          marginBottom: '24px'
        }}>
          {inviteUrl}
        </p>

        {/* Warning */}
        <div style={{ 
          backgroundColor: '#fef3c7', 
          borderLeft: '4px solid #f59e0b',
          padding: '12px', 
          marginTop: '24px'
        }}>
          <p style={{ fontSize: '14px', color: '#92400e', margin: '0' }}>
            ⚠️ This invitation expires on {expiryDate}. Accept it soon to secure your access!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
          ATLVS - Live Entertainment Production Management
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>
          You received this email because {inviterName} invited you to join ATLVS.
        </p>
      </div>
    </div>
  )
}

// Plain text version
export function InvitationSentEmailText({
  fullName,
  inviterName,
  organizationName,
  workspaceName,
  roleName,
  invitationToken,
  expiresAt,
  personalMessage,
}: InvitationSentEmailProps) {
  const inviteUrl = `https://atlvs.com/invite/${invitationToken}`
  const expiryDate = new Date(expiresAt).toLocaleDateString()

  return `
Your ATLVS Invitation is Ready!

Hi ${fullName},

Great news! You've been approved for early access to ATLVS. ${inviterName} has invited you to join their team.

${personalMessage ? `Personal message from ${inviterName}:\n"${personalMessage}"\n` : ''}
INVITATION DETAILS:
- Organization: ${organizationName}
- Workspace: ${workspaceName}
- Your Role: ${roleName}
- Expires: ${expiryDate}

ACCEPT YOUR INVITATION:
${inviteUrl}

⚠️ This invitation expires on ${expiryDate}. Accept it soon to secure your access!

Welcome aboard!
The ATLVS Team

---
ATLVS - Live Entertainment Production Management
You received this email because ${inviterName} invited you to join ATLVS.
  `.trim()
}
