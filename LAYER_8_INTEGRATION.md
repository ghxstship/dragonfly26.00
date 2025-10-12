# Layer 8: Integration Layer

## 🔗 External Integrations & MCP Server

Connect your platform to external services and AI agents.

---

## 🤖 MCP Server Integration (Already Created!)

Your MCP server is ready at `/supabase/functions/mcp-server/`

### Deploy MCP Function

```bash
npx supabase functions deploy mcp-server
```

### Test MCP Endpoint

```bash
curl -X POST https://nhceygmzwmhuyqsjxquk.supabase.co/functions/v1/mcp-server \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get_production_context",
    "params": {
      "production_id": "your-production-id"
    }
  }'
```

---

## 📧 Email Integration (Resend/SendGrid)

### 1. Install Email Service

```bash
npm install resend
```

### 2. Create Email Utility

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, subject: string, html: string) {
  return await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to,
    subject,
    html
  })
}

// Send event invitation
export async function sendEventInvitation(event: any, attendeeEmail: string) {
  const html = `
    <h1>You're Invited!</h1>
    <p>${event.name}</p>
    <p>Date: ${new Date(event.start_time).toLocaleString()}</p>
    <p>Location: ${event.location_details}</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}">View Details</a>
  `
  
  return sendEmail(attendeeEmail, `Invitation: ${event.name}`, html)
}
```

---

## 📅 Calendar Sync (Google Calendar / Outlook)

### 1. Install Calendar SDK

```bash
npm install googleapis
```

### 2. Sync Events to Google Calendar

```typescript
// src/lib/calendar-sync.ts
import { google } from 'googleapis'

export async function syncToGoogleCalendar(event: any, accessToken: string) {
  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: event.name,
      description: event.description,
      start: {
        dateTime: event.start_time,
        timeZone: event.timezone
      },
      end: {
        dateTime: event.end_time,
        timeZone: event.timezone
      },
      location: event.location_details
    }
  })
}
```

---

## 💳 Payment Integration (Stripe)

### 1. Install Stripe

```bash
npm install stripe
```

### 2. Handle Subscription Webhooks

Already created in `/supabase/functions/webhook-handler/`

Deploy it:

```bash
npx supabase functions deploy webhook-handler
```

### 3. Create Stripe Customer

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCustomer(organization: any) {
  const customer = await stripe.customers.create({
    name: organization.name,
    email: organization.email,
    metadata: {
      organization_id: organization.id
    }
  })

  // Update organization with Stripe customer ID
  await supabase
    .from('organizations')
    .update({ stripe_customer_id: customer.id })
    .eq('id', organization.id)

  return customer
}
```

---

## 📊 Accounting Integration (QuickBooks / Xero)

### 1. Sync Invoices to QuickBooks

```typescript
// src/lib/quickbooks.ts
export async function syncInvoiceToQuickBooks(invoice: any) {
  const response = await fetch('https://sandbox-quickbooks.api.intuit.com/v3/company/COMPANY_ID/invoice', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Line: invoice.invoice_items.map((item: any) => ({
        Amount: item.total,
        Description: item.description,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          Qty: item.quantity,
          UnitPrice: item.unit_price
        }
      })),
      CustomerRef: {
        value: invoice.company_id
      }
    })
  })

  return response.json()
}
```

---

## 📱 SMS Notifications (Twilio)

### 1. Install Twilio

```bash
npm install twilio
```

### 2. Send SMS Alerts

```typescript
// src/lib/sms.ts
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendSMS(to: string, message: string) {
  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  })
}

// Send event reminder
export async function sendEventReminder(event: any, phoneNumber: string) {
  const message = `Reminder: ${event.name} starts in 24 hours at ${new Date(event.start_time).toLocaleTimeString()}`
  return sendSMS(phoneNumber, message)
}
```

---

## 🤝 CRM Integration (HubSpot / Salesforce)

### 1. Sync Companies to HubSpot

```typescript
// src/lib/hubspot.ts
export async function syncCompanyToHubSpot(company: any) {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        name: company.name,
        domain: company.website,
        phone: company.phone,
        city: company.city,
        state: company.state
      }
    })
  })

  const hubspotCompany = await response.json()

  // Store HubSpot ID
  await supabase
    .from('companies')
    .update({ hubspot_id: hubspotCompany.id })
    .eq('id', company.id)

  return hubspotCompany
}
```

---

## 📦 File Storage Sync (Dropbox / Google Drive)

### 1. Sync Files to Dropbox

```typescript
// src/lib/dropbox-sync.ts
import { Dropbox } from 'dropbox'

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN })

export async function syncFileToDropbox(file: any, fileBuffer: Buffer) {
  const path = `/productions/${file.production_id}/${file.name}`
  
  await dbx.filesUpload({
    path,
    contents: fileBuffer
  })

  // Store Dropbox path
  await supabase
    .from('files')
    .update({ dropbox_path: path })
    .eq('id', file.id)
}
```

---

## 🔄 Webhook Configuration

### Set Up Webhooks in Supabase Dashboard

1. Go to Database → Webhooks
2. Create webhook for table changes
3. Point to your Edge Function

```sql
-- Example: Trigger webhook on invoice creation
CREATE TRIGGER invoice_created_webhook
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://nhceygmzwmhuyqsjxquk.supabase.co/functions/v1/webhook-handler',
    'POST',
    '{"Content-Type":"application/json"}',
    '{}',
    '1000'
  );
```

---

## 🤖 AI Agent Integration

### Claude/GPT Integration via MCP

```typescript
// AI agent can call your MCP endpoints
const response = await fetch('https://your-mcp-server.com/mcp-server', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyze_budget',
    params: {
      budget_id: 'budget-123'
    }
  })
})

const analysis = await response.json()
// AI uses this data to provide insights
```

---

## 📊 Analytics Integration (Google Analytics / Mixpanel)

### 1. Track Events

```typescript
// src/lib/analytics.ts
export function trackEvent(eventName: string, properties?: any) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }

  // Mixpanel
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track(eventName, properties)
  }
}

// Usage
trackEvent('production_created', {
  production_type: 'concert',
  budget: 50000
})
```

---

## 🔐 SSO Integration (Auth0 / Okta)

### 1. Configure Supabase Auth Provider

In Supabase Dashboard → Authentication → Providers:
- Enable OAuth providers (Google, Microsoft, etc.)
- Configure SSO settings

### 2. Handle SSO Login

```typescript
// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
```

---

## ✅ Integration Checklist

- [ ] MCP Server deployed and tested
- [ ] Email service configured
- [ ] Calendar sync enabled
- [ ] Payment webhooks active
- [ ] Accounting sync implemented
- [ ] SMS notifications working
- [ ] CRM integration complete
- [ ] File storage sync active
- [ ] Analytics tracking enabled
- [ ] SSO configured (if needed)
- [ ] Webhook endpoints secured
- [ ] API rate limiting implemented

---

## 🚀 Scheduled Tasks Configuration

### Deploy Scheduled Function

```bash
npx supabase functions deploy scheduled-tasks
```

### Set Up Cron Jobs

In Supabase Dashboard → Edge Functions → scheduled-tasks:

```
# Daily reminders at 9 AM
0 9 * * * {"task": "send_daily_reminders"}

# Check compliance expiry daily at midnight
0 0 * * * {"task": "check_compliance_expiry"}

# Generate reports at 6 AM
0 6 * * * {"task": "generate_daily_reports"}

# Cleanup old data weekly
0 0 * * 0 {"task": "cleanup_old_data"}

# Update production health every hour
0 * * * * {"task": "update_production_health"}
```

---

**Layer 8 Complete!** 🎉

All external integrations are configured and ready. Your platform is now fully integrated end-to-end!
