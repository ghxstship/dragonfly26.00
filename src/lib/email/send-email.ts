/**
 * Email Sending Utility
 * 
 * Integrates with Resend for transactional emails
 * Can be easily swapped for SendGrid or other providers
 */

// Note: Install @react-email/render for production use
// npm install @react-email/render react-email
// For now, using direct HTML strings

import { 
  WaitlistConfirmationEmailText 
} from './templates/waitlist-confirmation'
import { 
  InvitationSentEmailText 
} from './templates/invitation-sent'

// Email service configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'ATLVS <noreply@atlvs.com>'
const RESEND_API_KEY = process.env.RESEND_API_KEY

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

/**
 * Send email using Resend API
 */
async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent:', { to, subject })
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Email send error:', error)
      return { success: false, error: error.message || 'Failed to send email' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    console.error('Email send exception:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send waitlist confirmation email
 */
export async function sendWaitlistConfirmationEmail(
  email: string,
  fullName: string,
  position?: number,
  estimatedWaitHours?: number
) {
  const estimatedWaitDays = estimatedWaitHours 
    ? Math.round(estimatedWaitHours / 24) 
    : undefined

  // Simple HTML template (use React Email in production)
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #7c3aed; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0;">(ATLVS)</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <h2 style="font-size: 24px; margin-bottom: 16px;">You're on the Waitlist!</h2>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">Hi ${fullName},</p>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">
          Thanks for your interest in ATLVS! We've received your request and you're now on our waitlist.
        </p>
        ${position ? `
        <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin: 24px 0; text-align: center;">
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">Your position in queue</p>
          <p style="font-size: 48px; font-weight: bold; color: #7c3aed; margin: 0;">#${position}</p>
          ${estimatedWaitDays ? `<p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0;">Estimated wait: ~${estimatedWaitDays} days</p>` : ''}
        </div>
        ` : ''}
        <h3 style="font-size: 18px; margin-bottom: 12px;">What happens next?</h3>
        <ul style="padding-left: 20px;">
          <li style="font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 8px;">We'll review your application</li>
          <li style="font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 8px;">You'll receive an email invitation when approved</li>
          <li style="font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 8px;">Check your email regularly for updates</li>
        </ul>
        <div style="text-align: center; margin-top: 32px;">
          <a href="https://atlvs.com/waitlist/status?email=${encodeURIComponent(email)}" 
             style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">
            Check Your Status
          </a>
        </div>
      </div>
      <div style="padding: 24px; background-color: #f9fafb; text-align: center;">
        <p style="font-size: 14px; color: #6b7280; margin: 0;">ATLVS - Live Entertainment Production Management</p>
      </div>
    </div>
  `

  const text = WaitlistConfirmationEmailText({ 
    fullName, 
    email, 
    position, 
    estimatedWaitDays 
  })

  return sendEmail({
    to: email,
    subject: "You're on the ATLVS Waitlist!",
    html,
    text,
  })
}

/**
 * Send invitation email
 */
export async function sendInvitationEmail(
  email: string,
  fullName: string,
  inviterName: string,
  organizationName: string,
  workspaceName: string,
  roleName: string,
  invitationToken: string,
  expiresAt: string,
  personalMessage?: string
) {
  const inviteUrl = `https://atlvs.com/invite/${invitationToken}`
  const expiryDate = new Date(expiresAt).toLocaleDateString()

  // Simple HTML template (use React Email in production)
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #10b981; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0;">(ATLVS)</h1>
        <p style="color: #ffffff; font-size: 18px; margin: 8px 0 0 0;">Your Invitation is Ready!</p>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <h2 style="font-size: 24px; margin-bottom: 16px;">Welcome to ATLVS!</h2>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">Hi ${fullName},</p>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">
          Great news! You've been approved for early access to ATLVS. ${inviterName} has invited you to join their team.
        </p>
        ${personalMessage ? `
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0;">
          <p style="font-size: 14px; color: #065f46; margin: 0 0 8px 0; font-weight: 600;">Personal message from ${inviterName}:</p>
          <p style="font-size: 14px; color: #047857; margin: 0; font-style: italic;">"${personalMessage}"</p>
        </div>
        ` : ''}
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <h3 style="font-size: 16px; margin-bottom: 12px;">Invitation Details</h3>
          <p style="font-size: 14px; color: #6b7280; margin: 8px 0;"><strong>Organization:</strong> ${organizationName}</p>
          <p style="font-size: 14px; color: #6b7280; margin: 8px 0;"><strong>Workspace:</strong> ${workspaceName}</p>
          <p style="font-size: 14px; color: #6b7280; margin: 8px 0;"><strong>Your Role:</strong> ${roleName}</p>
          <p style="font-size: 14px; color: #dc2626; margin: 8px 0;"><strong>Expires:</strong> ${expiryDate}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteUrl}" 
             style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 16px 48px; border-radius: 6px; text-decoration: none; font-size: 18px; font-weight: 700;">
            Accept Invitation
          </a>
        </div>
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 24px;">
          <p style="font-size: 14px; color: #92400e; margin: 0;">⚠️ This invitation expires on ${expiryDate}. Accept it soon to secure your access!</p>
        </div>
      </div>
      <div style="padding: 24px; background-color: #f9fafb; text-align: center;">
        <p style="font-size: 14px; color: #6b7280; margin: 0;">ATLVS - Live Entertainment Production Management</p>
      </div>
    </div>
  `

  const text = InvitationSentEmailText({
    fullName,
    inviterName,
    organizationName,
    workspaceName,
    roleName,
    invitationToken,
    expiresAt,
    personalMessage,
  })

  return sendEmail({
    to: email,
    subject: 'Your ATLVS Invitation is Ready!',
    html,
    text,
  })
}

/**
 * Send waitlist rejection email (optional)
 */
export async function sendWaitlistRejectionEmail(
  email: string,
  fullName: string,
  reason?: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 32px; margin: 0;">(ATLVS)</h1>
      </div>
      <div style="padding: 32px; background-color: #ffffff;">
        <h2 style="font-size: 24px; margin-bottom: 16px;">Update on Your Application</h2>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">Hi ${fullName},</p>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">
          Thank you for your interest in ATLVS. Unfortunately, we're unable to offer you access at this time.
        </p>
        ${reason ? `<p style="font-size: 16px; line-height: 24px; color: #4b5563;">${reason}</p>` : ''}
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">
          You're welcome to reapply in the future.
        </p>
        <p style="font-size: 16px; line-height: 24px; color: #4b5563;">Best regards,<br>The ATLVS Team</p>
      </div>
      <div style="padding: 24px; background-color: #f9fafb; text-align: center;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          ATLVS - Live Entertainment Production Management
        </p>
      </div>
    </div>
  `

  const text = `
Update on Your ATLVS Application

Hi ${fullName},

Thank you for your interest in ATLVS. Unfortunately, we're unable to offer you access at this time.

${reason || ''}

You're welcome to reapply in the future.

Best regards,
The ATLVS Team

---
ATLVS - Live Entertainment Production Management
  `.trim()

  return sendEmail({
    to: email,
    subject: 'Update on Your ATLVS Application',
    html,
    text,
  })
}
