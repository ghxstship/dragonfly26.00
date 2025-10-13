# Stripe Quick Start Reference

## 🚀 Quick Setup (5 Steps)

### 1. Get Stripe Keys
```
Dashboard → Developers → API keys
```
- Copy **Publishable key** (`pk_test_...`)
- Copy **Secret key** (`sk_test_...`)

### 2. Create Price IDs
```
Dashboard → Products → Add product
```
Create 5 products (Crew, Team, Pro, Core, Executive)  
Copy each **Price ID** (`price_...`)

### 3. Set Up Webhook
```
Dashboard → Developers → Webhooks → Add endpoint
```
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
- Copy **Signing secret** (`whsec_...`)

### 4. Add Environment Variables

**Vercel Dashboard → Settings → Environment Variables**

```bash
# Required
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs
NEXT_PUBLIC_STRIPE_PRICE_CREW=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_TEAM=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_CORE=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_EXECUTIVE=price_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 5. Test
- Select a paid plan in onboarding
- Use test card: `4242 4242 4242 4242`
- Expiry: `12/34`, CVC: `123`

---

## 💳 Test Cards

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Decline |
| `4000 0025 0000 3155` | 🔐 3D Secure |

---

## 🔗 Quick Links

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Full Implementation Guide](./STRIPE_IMPLEMENTATION_GUIDE.md)
- [Stripe Docs](https://stripe.com/docs)
- [Test Cards](https://stripe.com/docs/testing)

---

## ⚠️ Before Going Live

- [ ] Switch to Live mode
- [ ] Create products in Live mode
- [ ] Update webhook to production URL
- [ ] Update env vars with live keys
- [ ] Complete account verification
