# 📧 ATLVS Email Templates

Professional email templates for authentication and user notifications, ready for **Resend** email service.

---

## 📁 Template Files

### Branded Templates (ATLVS)
1. `01-signup-confirmation.html` - Welcome & email verification
2. `02-team-invitation.html` - Workspace team invitations  
3. `03-magic-link.html` - Passwordless sign-in
4. `04-change-email.html` - Email address change confirmation
5. `05-reset-password.html` - Password reset request
6. `06-reauthentication.html` - Identity verification for sensitive actions

### White-Label Templates
- `white-label/` folder contains customizable versions
- Replace logo, colors, and company name with your own branding

---

## 🎨 Design Features

- **Modern gradient headers** with ATLVS branding
- **Mobile-responsive** design (max-width: 600px)
- **Clear call-to-action buttons** with gradients
- **Security warnings** and information boxes
- **Professional footer** with links
- **Accessible** with proper semantic HTML

---

## 🔧 Implementation with Resend

### Installation

```bash
npm install resend
```

### Basic Usage

```typescript
import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

// Load template
const template = fs.readFileSync(
  path.join(process.cwd(), 'email-templates/01-signup-confirmation.html'),
  'utf-8'
)

// Replace variables
const emailHtml = template
  .replace(/{{\.ConfirmationURL}}/g, confirmationUrl)
  .replace(/{{\.SiteURL}}/g, siteUrl)

// Send email
await resend.emails.send({
  from: 'ATLVS <noreply@yourdomain.com>',
  to: userEmail,
  subject: 'Confirm Your Email - ATLVS',
  html: emailHtml
})
```

---

## 📝 Template Variables

### 1. Signup Confirmation
- `{{.ConfirmationURL}}` - Email verification link
- `{{.SiteURL}}` - Base URL of your application

### 2. Team Invitation
- `{{.InviterName}}` - Name of person sending invitation
- `{{.WorkspaceName}}` - Name of workspace
- `{{.RoleName}}` - Role title (e.g., "Raider", "Navigator")
- `{{.RoleBadge}}` - Role badge text (e.g., "TEAM MEMBER")
- `{{.PersonalMessage}}` - Optional personal message
- `{{.InvitationURL}}` - Invitation acceptance link
- `{{.SiteURL}}` - Base URL

### 3. Magic Link
- `{{.MagicLinkURL}}` - One-time login link
- `{{.ExpiryDate}}` - Expiration date
- `{{.ExpiryTime}}` - Expiration time
- `{{.SiteURL}}` - Base URL

### 4. Change Email
- `{{.ConfirmationURL}}` - Email change confirmation link
- `{{.OldEmail}}` - Current email address
- `{{.NewEmail}}` - New email address
- `{{.SiteURL}}` - Base URL

### 5. Reset Password
- `{{.ResetURL}}` - Password reset link
- `{{.SiteURL}}` - Base URL

### 6. Reauthentication
- `{{.ReauthURL}}` - Reauthentication link
- `{{.ActionDescription}}` - Description of action requiring verification
- `{{.SiteURL}}` - Base URL

---

## 🚀 Integration Examples

### 1. Signup Confirmation Email

```typescript
// /api/auth/send-verification
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  
  const template = fs.readFileSync('./email-templates/01-signup-confirmation.html', 'utf-8')
  const html = template
    .replace(/{{\.ConfirmationURL}}/g, confirmationUrl)
    .replace(/{{\.SiteURL}}/g, process.env.NEXT_PUBLIC_APP_URL)

  await resend.emails.send({
    from: 'ATLVS <noreply@atlvs.com>',
    to: email,
    subject: 'Welcome to ATLVS! Confirm Your Email',
    html
  })
}
```

### 2. Team Invitation Email

```typescript
// /api/invitations/send
export async function sendInvitationEmail(invitation: Invitation) {
  const template = fs.readFileSync('./email-templates/02-team-invitation.html', 'utf-8')
  
  let html = template
    .replace(/{{\.InviterName}}/g, invitation.inviterName)
    .replace(/{{\.WorkspaceName}}/g, invitation.workspaceName)
    .replace(/{{\.RoleName}}/g, invitation.roleName)
    .replace(/{{\.RoleBadge}}/g, invitation.roleBadge)
    .replace(/{{\.InvitationURL}}/g, invitation.invitationUrl)
    .replace(/{{\.SiteURL}}/g, process.env.NEXT_PUBLIC_APP_URL)

  // Handle optional personal message
  if (invitation.personalMessage) {
    html = html.replace(/{{if \.PersonalMessage}}[\s\S]*?{{end}}/g, (match) =>
      match
        .replace(/{{if \.PersonalMessage}}/g, '')
        .replace(/{{end}}/g, '')
        .replace(/{{\.PersonalMessage}}/g, invitation.personalMessage)
    )
  } else {
    html = html.replace(/{{if \.PersonalMessage}}[\s\S]*?{{end}}/g, '')
  }

  await resend.emails.send({
    from: `${invitation.inviterName} via ATLVS <noreply@atlvs.com>`,
    to: invitation.email,
    subject: `You've been invited to join ${invitation.workspaceName} on ATLVS`,
    html
  })
}
```

### 3. Password Reset Email

```typescript
// /api/auth/forgot-password
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
  
  const template = fs.readFileSync('./email-templates/05-reset-password.html', 'utf-8')
  const html = template
    .replace(/{{\.ResetURL}}/g, resetUrl)
    .replace(/{{\.SiteURL}}/g, process.env.NEXT_PUBLIC_APP_URL)

  await resend.emails.send({
    from: 'ATLVS Security <security@atlvs.com>',
    to: email,
    subject: 'Reset Your ATLVS Password',
    html
  })
}
```

---

## 🎨 White-Label Customization

For white-label versions, replace these variables:

- `{{.CompanyName}}` - Your company name
- `{{.LogoURL}}` - URL to your logo image
- `{{.PrimaryColor}}` - Your brand color (hex code)
- `{{.SiteURL}}` - Your domain

### Example:

```typescript
const html = template
  .replace(/{{\.CompanyName}}/g, 'Acme Corp')
  .replace(/{{\.LogoURL}}/g, 'https://cdn.acme.com/logo.png')
  .replace(/{{\.PrimaryColor}}/g, '#3b82f6')
  .replace(/{{\.SiteURL}}/g, 'https://acme.com')
```

---

## 🔒 Security Best Practices

1. **Token Expiration**
   - Signup confirmation: 24 hours
   - Magic links: 1 hour
   - Password reset: 1 hour
   - Reauthentication: 15 minutes

2. **One-Time Use**
   - Magic links should be invalidated after use
   - Password reset tokens should be single-use

3. **HTTPS Only**
   - All links must use HTTPS in production

4. **Rate Limiting**
   - Implement rate limiting on email sending endpoints

---

## 📧 Resend Configuration

### Domain Setup

1. Add your domain to Resend
2. Configure DNS records (SPF, DKIM, DMARC)
3. Verify domain ownership

### Recommended "From" Addresses

- `noreply@yourdomain.com` - General notifications
- `security@yourdomain.com` - Security-related emails
- `team@yourdomain.com` - Team invitations
- `[Name] via ATLVS <noreply@yourdomain.com>` - Personal invitations

---

## 🧪 Testing

### Test Mode

```typescript
// Use Resend test mode during development
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'ATLVS <onboarding@resend.dev>', // Test email
  to: 'delivered@resend.dev', // Test recipient
  subject: 'Test Email',
  html: emailHtml
})
```

### Email Preview

```typescript
// Save HTML to file for preview
fs.writeFileSync('preview.html', emailHtml)
```

---

## 📋 Checklist for Production

- [ ] Configure Resend API key
- [ ] Set up domain and DNS records
- [ ] Test all email templates
- [ ] Verify token expiration logic
- [ ] Implement rate limiting
- [ ] Add email delivery monitoring
- [ ] Set up bounce/complaint handling
- [ ] Test spam score (use mail-tester.com)
- [ ] Verify mobile responsiveness
- [ ] Test across email clients (Gmail, Outlook, Apple Mail)

---

## 🎯 Email Client Compatibility

Templates are tested and compatible with:
- ✅ Gmail (Desktop & Mobile)
- ✅ Apple Mail (iOS & macOS)
- ✅ Outlook (Desktop & Web)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

---

## 📊 Analytics (Optional)

Add tracking pixels or UTM parameters:

```typescript
const trackingUrl = `${url}?utm_source=email&utm_medium=transactional&utm_campaign=signup`
```

---

## 🆘 Troubleshooting

### Emails not sending
- Check Resend API key
- Verify domain is verified
- Check rate limits
- Review Resend logs

### Emails going to spam
- Configure SPF, DKIM, DMARC
- Use authenticated "from" address
- Avoid spam trigger words
- Test spam score

### Template not rendering
- Check variable replacements
- Validate HTML syntax
- Test in email client preview tools

---

## 📞 Support

- **Resend Docs:** https://resend.com/docs
- **Email Testing:** https://www.mail-tester.com
- **Template Issues:** Check console logs for variable mismatches

---

**© 2025 ATLVS. Email templates ready for production use with Resend.**
