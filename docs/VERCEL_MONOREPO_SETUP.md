# Vercel Monorepo Setup Guide

This repository is deployed as **TWO separate Vercel projects** from a single monorepo.

---

## 🏗️ Architecture

```
Repository: ghxstship/dragonfly26.00
├── Marketing Project → atlvs.one
└── App Project → app.atlvs.one
```

---

## 📦 Project 1: Marketing Site

**Vercel Project Name**: `atlvs-marketing`  
**Domain**: `atlvs.one`, `www.atlvs.one`  
**Purpose**: Marketing website (landing page, pricing, features, etc.)

### Vercel Configuration

**Settings → General**:
- **Framework Preset**: Next.js
- **Root Directory**: `.` (or specify if marketing is in subfolder)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**Settings → Environment Variables**:
```bash
NEXT_PUBLIC_APP_URL=https://app.atlvs.one
NODE_ENV=production
```

**Settings → Domains**:
- `atlvs.one` (primary)
- `www.atlvs.one` → Redirect to `atlvs.one`

### Build Settings (vercel.json for marketing)

If you want to isolate marketing build, create a separate config or use Vercel's UI settings.

---

## 📦 Project 2: Main Application

**Vercel Project Name**: `atlvs-app`  
**Domain**: `app.atlvs.one`  
**Purpose**: Main SaaS application

### Vercel Configuration

**Settings → General**:
- **Framework Preset**: Next.js
- **Root Directory**: `.` (root of repo)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**Settings → Environment Variables**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nhceygmzwmhuyqsjxquk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email
RESEND_API_KEY=your_resend_key

# App URLs
NEXT_PUBLIC_APP_URL=https://app.atlvs.one
NEXT_PUBLIC_SITE_URL=https://app.atlvs.one
NODE_ENV=production
```

**Settings → Domains**:
- `app.atlvs.one` (primary)

---

## 🚀 Deployment Flow

### Current Behavior

**Both projects deploy from the same repository** but serve different purposes:

1. **Marketing Project** (`atlvs-marketing`)
   - Deploys: `/src/app/(marketing)/*` pages
   - Root: Shows marketing home page
   - Routes: `/pricing`, `/features`, `/about`, etc.

2. **App Project** (`atlvs-app`)
   - Deploys: Full application
   - Root: Redirects to `/en/login` (unauthenticated) or `/en/workspace/personal/dashboard/overview` (authenticated)
   - Routes: `/en/login`, `/en/workspace/*`, etc.

### How It Works

- **Same codebase**, different entry points
- Marketing pages in `(marketing)` route group
- App pages in `[locale]` route
- Vercel builds both from same repo but serves different domains

---

## 🔧 Setup Steps

### Step 1: Create Two Vercel Projects

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import `ghxstship/dragonfly26.00` repository
4. Name it `atlvs-marketing`
5. Configure as shown above
6. Click **Deploy**

Repeat for second project:
1. Click **Add New** → **Project**
2. Import same repository `ghxstship/dragonfly26.00`
3. Name it `atlvs-app`
4. Configure as shown above
5. Click **Deploy**

### Step 2: Configure Domains

**Marketing Project** (`atlvs-marketing`):
- Settings → Domains → Add `atlvs.one`
- Settings → Domains → Add `www.atlvs.one` → Redirect to `atlvs.one`

**App Project** (`atlvs-app`):
- Settings → Domains → Add `app.atlvs.one`

### Step 3: Update Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Settings → Authentication
4. **Site URL**: `https://app.atlvs.one`
5. **Redirect URLs**: Add both:
   - `https://app.atlvs.one/**`
   - `https://atlvs.one/**`

### Step 4: Update Stripe (if using)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → Webhooks
3. Update endpoint URL: `https://app.atlvs.one/api/webhooks/stripe`

---

## ✅ Verification

### Test Marketing Site
```bash
curl -I https://atlvs.one
# Should return: HTTP/2 200
# Should show: Marketing home page

curl -I https://www.atlvs.one
# Should return: HTTP/2 307 or 308
# Should redirect to: https://atlvs.one
```

### Test App Site
```bash
curl -I https://app.atlvs.one
# Should return: HTTP/2 307 (redirect to login)
# Location: https://app.atlvs.one/en/login
```

### Test Cross-Domain Navigation
1. Visit `https://atlvs.one`
2. Click "Sign Up" or "Login" button
3. Should redirect to `https://app.atlvs.one/en/signup` or `/en/login`

---

## 🎯 Current Status

**Root Page Behavior**:

- ✅ `atlvs.one/` → Marketing home page
- ✅ `app.atlvs.one/` → Redirects to login (if not authenticated)
- ✅ `app.atlvs.one/` → Redirects to dashboard (if authenticated)

**Locale Prefix**: `always` (all routes include locale, e.g., `/en/login`)

---

## 📝 Notes

- Both projects deploy from the **same Git repository**
- Marketing and app share the same codebase but serve different domains
- No code duplication needed
- Changes to shared components affect both projects
- Each project can have different environment variables
- Each project deploys independently when you push to main

---

## 🔗 Links

- **Marketing Site**: https://atlvs.one
- **App Site**: https://app.atlvs.one
- **Repository**: https://github.com/ghxstship/dragonfly26.00
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Last Updated**: October 23, 2025
