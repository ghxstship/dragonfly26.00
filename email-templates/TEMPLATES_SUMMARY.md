# 📧 Email Templates Summary

**Brand:** ATLVS  
**Total Templates:** 6 + 1 White-Label  
**Status:** Production Ready ✅

---

## 📬 Template List

| # | Template | Purpose | Variables | File |
|---|----------|---------|-----------|------|
| 1 | **Signup Confirmation** | Verify new user email | ConfirmationURL, SiteURL | `01-signup-confirmation.html` |
| 2 | **Team Invitation** | Invite users to workspace | InviterName, WorkspaceName, RoleName, InvitationURL | `02-team-invitation.html` |
| 3 | **Magic Link** | Passwordless sign-in | MagicLinkURL, ExpiryDate, ExpiryTime | `03-magic-link.html` |
| 4 | **Change Email** | Confirm email address change | OldEmail, NewEmail, ConfirmationURL | `04-change-email.html` |
| 5 | **Reset Password** | Password reset request | ResetURL, SiteURL | `05-reset-password.html` |
| 6 | **Reauthentication** | Verify identity for sensitive actions | ReauthURL, ActionDescription | `06-reauthentication.html` |

---

## 🎨 Design System

### Colors
- **Primary Gradient:** `#667eea` → `#764ba2`
- **Background:** `#f9fafb`
- **Text Primary:** `#111827`
- **Text Secondary:** `#6b7280`
- **Success:** `#10b981`
- **Warning:** `#f59e0b`
- **Danger:** `#ef4444`

### Typography
- **Font:** System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)
- **Title:** 24px, font-weight 600
- **Body:** 16px, line-height 1.6
- **Footer:** 14px

### Components
- **Button:** Gradient background, 14px 32px padding, 8px border-radius
- **Info Box:** Light blue background with left border
- **Warning Box:** Light red background with left border
- **Message Box:** Light yellow background

---

## 🔧 Quick Integration

### 1. Install Resend

```bash
npm install resend
```

### 2. Add Environment Variable

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 3. Create Email Service

```typescript
// /lib/email/service.ts
import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendSignupConfirmation(email: string, token: string) {
  const template = fs.readFileSync(
    path.join(process.cwd(), 'email-templates/01-signup-confirmation.html'),
    'utf-8'
  )
  
  const html = template
    .replace(/{{\.ConfirmationURL}}/g, `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`)
    .replace(/{{\.SiteURL}}/g, process.env.NEXT_PUBLIC_APP_URL)

  return await resend.emails.send({
    from: 'ATLVS <noreply@atlvs.com>',
    to: email,
    subject: 'Welcome to ATLVS! Confirm Your Email',
    html
  })
}

export async function sendTeamInvitation(data: {
  email: string
  inviterName: string
  workspaceName: string
  roleName: string
  roleBadge: string
  token: string
  personalMessage?: string
}) {
  const template = fs.readFileSync(
    path.join(process.cwd(), 'email-templates/02-team-invitation.html'),
    'utf-8'
  )
  
  let html = template
    .replace(/{{\.InviterName}}/g, data.inviterName)
    .replace(/{{\.WorkspaceName}}/g, data.workspaceName)
    .replace(/{{\.RoleName}}/g, data.roleName)
    .replace(/{{\.RoleBadge}}/g, data.roleBadge)
    .replace(/{{\.InvitationURL}}/g, `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.token}`)
    .replace(/{{\.SiteURL}}/g, process.env.NEXT_PUBLIC_APP_URL)

  // Handle optional personal message
  if (data.personalMessage) {
    html = html.replace(/{{if \.PersonalMessage}}[\s\S]*?{{end}}/g, (match) =>
      match
        .replace(/{{if \.PersonalMessage}}/g, '')
        .replace(/{{end}}/g, '')
        .replace(/{{\.PersonalMessage}}/g, data.personalMessage)
    )
  } else {
    html = html.replace(/{{if \.PersonalMessage}}[\s\S]*?{{end}}/g, '')
  }

  return await resend.emails.send({
    from: `${data.inviterName} via ATLVS <noreply@atlvs.com>`,
    to: data.email,
    subject: `You've been invited to join ${data.workspaceName} on ATLVS`,
    html
  })
}

export async function sendPasswordReset(email: string, token: string) {
  const template = fs.readFileSync(
    path.join(process.cwd(), 'email-templates/05-reset-password.html'),
    'utf-8'
  )
  
  const html = template
    .replace(/{{\.ResetURL}}/g, `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`)
    .replace(/{{\.SiteURL}}/g, process.env.NEXT_PUBLIC_APP_URL)

  return await resend.emails.send({
    from: 'ATLVS Security <security@atlvs.com>',
    to: email,
    subject: 'Reset Your ATLVS Password',
    html
  })
}
```

---

## 🔄 Update API Routes

### Update Signup API

```typescript
// /api/auth/signup/route.ts
import { sendSignupConfirmation } from '@/lib/email/service'

export async function POST(request: Request) {
  // ... signup logic ...
  
  // Send confirmation email
  await sendSignupConfirmation(email, confirmationToken)
  
  return NextResponse.json({ success: true })
}
```

### Update Invitation API

```typescript
// /api/invitations/send/route.ts (line 78-80)
import { sendTeamInvitation } from '@/lib/email/service'

// Replace TODO comment with:
for (const inv of createdInvites) {
  await sendTeamInvitation({
    email: inv.email,
    inviterName: inviterName,
    workspaceName: workspace.name,
    roleName: BRANDED_ROLES[inv.role_slug].name,
    roleBadge: BRANDED_ROLES[inv.role_slug].badge,
    token: inv.token,
    personalMessage: inv.message
  })
}
```

### Update Password Reset API

```typescript
// /api/auth/forgot-password/route.ts
import { sendPasswordReset } from '@/lib/email/service'

export async function POST(request: Request) {
  // ... reset logic ...
  
  // Send password reset email
  await sendPasswordReset(email, resetToken)
  
  return NextResponse.json({ success: true })
}
```

---

## ✅ Testing Checklist

- [ ] Test signup confirmation email
- [ ] Test team invitation email (with and without personal message)
- [ ] Test magic link email
- [ ] Test change email confirmation
- [ ] Test password reset email
- [ ] Test reauthentication email
- [ ] Verify mobile responsiveness
- [ ] Test in Gmail, Outlook, Apple Mail
- [ ] Check spam score (mail-tester.com)
- [ ] Verify all links work
- [ ] Test variable replacements
- [ ] Confirm branding is correct

---

## 🚀 Production Deployment

1. **Configure Resend Domain**
   - Add domain to Resend
   - Set up DNS records (SPF, DKIM, DMARC)
   - Verify domain

2. **Set Environment Variables**
   ```env
   RESEND_API_KEY=re_live_xxxxxxxxxxxxx
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Update "From" Addresses**
   - Replace `@atlvs.com` with your actual domain
   - Use appropriate sender names

4. **Monitor Email Delivery**
   - Check Resend dashboard for delivery status
   - Monitor bounce rates
   - Handle complaints appropriately

---

## 📊 Email Performance Metrics

Track these metrics in Resend dashboard:
- **Delivery Rate:** Should be >95%
- **Open Rate:** Typical 40-60% for transactional emails
- **Click Rate:** Depends on email type
- **Bounce Rate:** Should be <2%
- **Spam Rate:** Should be <0.1%

---

## 🎯 Next Steps

1. ✅ Templates created and ready
2. ⏳ Integrate email service (`/lib/email/service.ts`)
3. ⏳ Update API routes to send emails
4. ⏳ Configure Resend domain and DNS
5. ⏳ Test all email flows
6. ⏳ Deploy to production

---

**🎉 All email templates are ready for production use!**

Simply integrate the email service and update your API routes to start sending beautiful, branded emails.
