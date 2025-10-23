import { Resend } from 'resend'

// Lazy-load Resend client to avoid build-time initialization
let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export interface SendInvitationEmailParams {
  to: string
  inviterName: string
  workspaceName: string
  invitationLink: string
  message?: string
}

/**
 * Send team invitation email
 */
export async function sendInvitationEmail({
  to,
  inviterName,
  workspaceName,
  invitationLink,
  message,
}: SendInvitationEmailParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'ATLVS <noreply@atlvs.one>',
      to: [to],
      subject: `${inviterName} invited you to join ${workspaceName} on ATLVS`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>You're invited to join ${workspaceName}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">ATLVS</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Production Management Platform</p>
            </div>
            
            <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">You've been invited!</h2>
              
              <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
                <strong>${inviterName}</strong> has invited you to join <strong>${workspaceName}</strong> on ATLVS.
              </p>
              
              ${message ? `
                <div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 16px; margin: 0 0 24px 0; border-radius: 4px;">
                  <p style="color: #374151; margin: 0; font-size: 14px; font-style: italic;">"${message}"</p>
                </div>
              ` : ''}
              
              <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px;">
                ATLVS is a powerful project management platform designed specifically for experiential production teams. Collaborate on projects, manage your workforce, track assets, and control finances—all in one place.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${invitationLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Accept Invitation
                </a>
              </div>
              
              <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 14px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #667eea; margin: 8px 0 0 0; font-size: 14px; word-break: break-all;">
                ${invitationLink}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              
              <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 8px 0;">© 2025 ATLVS. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="https://atlvs.one" style="color: #667eea; text-decoration: none;">Website</a> • 
                <a href="https://atlvs.one/docs" style="color: #667eea; text-decoration: none;">Documentation</a> • 
                <a href="https://atlvs.one/contact" style="color: #667eea; text-decoration: none;">Support</a>
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: data?.id }
  } catch (error: any) {
    console.error('Send invitation email error:', error)
    throw error
  }
}

export interface SendWelcomeEmailParams {
  to: string
  name: string
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail({ to, name }: SendWelcomeEmailParams) {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'ATLVS <noreply@atlvs.one>',
      to: [to],
      subject: 'Welcome to ATLVS!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ATLVS</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">ATLVS</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Production Management Platform</p>
            </div>
            
            <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome to ATLVS, ${name}!</h2>
              
              <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
                We're excited to have you on board. ATLVS is your all-in-one platform for managing experiential production projects.
              </p>
              
              <h3 style="color: #111827; margin: 24px 0 12px 0; font-size: 18px; font-weight: 600;">Get Started:</h3>
              <ul style="color: #4b5563; margin: 0 0 24px 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Complete your profile</li>
                <li style="margin-bottom: 8px;">Create your first project</li>
                <li style="margin-bottom: 8px;">Invite your team members</li>
                <li style="margin-bottom: 8px;">Explore the 5 integrated hubs</li>
              </ul>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://app.atlvs.one" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              
              <p style="color: #6b7280; margin: 0 0 12px 0; font-size: 14px;">
                <strong>Need help?</strong>
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Check out our <a href="https://atlvs.one/docs" style="color: #667eea; text-decoration: none;">documentation</a> or <a href="https://atlvs.one/contact" style="color: #667eea; text-decoration: none;">contact support</a>.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 8px 0;">© 2025 ATLVS. All rights reserved.</p>
              <p style="margin: 0;">
                <a href="https://atlvs.one" style="color: #667eea; text-decoration: none;">Website</a> • 
                <a href="https://atlvs.one/docs" style="color: #667eea; text-decoration: none;">Documentation</a> • 
                <a href="https://atlvs.one/contact" style="color: #667eea; text-decoration: none;">Support</a>
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: data?.id }
  } catch (error: any) {
    console.error('Send welcome email error:', error)
    throw error
  }
}
