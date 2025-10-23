# ATLVS.ONE Domain Setup Guide

**Domain**: atlvs.one (registered on Vercel)  
**Marketing Site**: https://atlvs.one  
**Application**: https://app.atlvs.one

---

## ✅ Complete Setup Checklist

### **Step 1: Add Domains to Vercel Projects**

#### **Marketing Site** (`atlvs-marketing`):
- [ ] Go to Vercel Dashboard → Select `atlvs-marketing` project
- [ ] Settings → Domains → Add Domain
- [ ] Add: `atlvs.one` → Click **Add**
- [ ] Add: `www.atlvs.one` → Select "Redirect to atlvs.one" → Click **Add**
- [ ] Wait for SSL certificate (automatic, ~1-2 minutes)

#### **Main Application** (`atlvs-app`):
- [ ] Go to Vercel Dashboard → Select `atlvs-app` project
- [ ] Settings → Domains → Add Domain
- [ ] Add: `app.atlvs.one` → Click **Add**
- [ ] Wait for SSL certificate (automatic, ~1-2 minutes)

---

### **Step 2: Verify DNS Configuration**

Since domain is registered **on Vercel**, DNS should be automatic!

**Verify in Vercel Dashboard** → Domains → `atlvs.one`:

```
✅ A Record
   Name: @
   Value: 76.76.21.21
   
✅ CNAME Record
   Name: www
   Value: cname.vercel-dns.com
   
✅ CNAME Record
   Name: app
   Value: cname.vercel-dns.com
```

**Status**: Should show "Valid Configuration" with green checkmark ✅

---

### **Step 3: Update Environment Variables**

#### **Marketing Project** (`atlvs-marketing`):

Go to Settings → Environment Variables → **Edit** `NEXT_PUBLIC_APP_URL`:

```bash
# OLD VALUE:
NEXT_PUBLIC_APP_URL=https://atlvs-app.vercel.app

# NEW VALUE:
NEXT_PUBLIC_APP_URL=https://app.atlvs.one
```

**Apply to**: Production, Preview, Development (all)  
**Click**: Save

#### **Main App Project** (`atlvs-app`):

Go to Settings → Environment Variables → **Edit** these:

```bash
# Update these two variables:
NEXT_PUBLIC_SITE_URL=https://app.atlvs.one
NEXT_PUBLIC_APP_URL=https://app.atlvs.one

# Keep all other variables the same (Supabase, Stripe, etc.)
```

**Apply to**: Production, Preview, Development (all)  
**Click**: Save

---

### **Step 4: Trigger Redeployment**

After updating environment variables, Vercel will **automatically redeploy** both projects.

**Monitor deployments**:
- [ ] Marketing project: Check Deployments tab → Wait for "Ready"
- [ ] App project: Check Deployments tab → Wait for "Ready"

**Typical deployment time**: 2-5 minutes each

---

### **Step 5: Update Supabase Allowed URLs**

Your Supabase project needs to allow the new domain:

1. **Go to** [supabase.com](https://supabase.com) → Your project
2. **Click** Settings → Authentication
3. **Find** "Site URL" → Update to: `https://app.atlvs.one`
4. **Find** "Redirect URLs" → Add:
   ```
   https://app.atlvs.one/**
   https://atlvs.one/**
   ```
5. **Click** Save

---

### **Step 6: Update Stripe Webhook**

Update your Stripe webhook to use the new domain:

1. **Go to** [Stripe Dashboard](https://dashboard.stripe.com)
2. **Click** Developers → Webhooks
3. **Find** your existing webhook or create new
4. **Update** Endpoint URL to: `https://app.atlvs.one/api/webhooks/stripe`
5. **Events to send**: Select relevant events (checkout.session.completed, etc.)
6. **Click** Save

---

### **Step 7: Test Everything**

#### **Marketing Site Tests**:
- [ ] Visit `https://atlvs.one` → Homepage loads
- [ ] Visit `https://www.atlvs.one` → Redirects to `https://atlvs.one`
- [ ] Visit `https://atlvs.one/pricing` → Pricing page loads
- [ ] Visit `https://atlvs.one/features` → Features page loads
- [ ] Check SSL certificate (🔒 in browser) → Valid

#### **App Tests**:
- [ ] Visit `https://app.atlvs.one` → App loads (redirects to login if not authenticated)
- [ ] Visit `https://app.atlvs.one/en/login` → Login page loads
- [ ] Check SSL certificate (🔒 in browser) → Valid

#### **Cross-Zone Navigation Tests**:
- [ ] On `https://atlvs.one` → Click "Start Free" → Redirects to `https://app.atlvs.one/en/signup`
- [ ] On `https://atlvs.one` → Click "Sign In" → Redirects to `https://app.atlvs.one/en/login`
- [ ] On `https://atlvs.one` → Click "Schedule Demo" → Goes to demo page

#### **Authentication Tests**:
- [ ] Sign up new account → Works
- [ ] Log in existing account → Works
- [ ] Password reset → Email sends with correct domain
- [ ] Magic link → Email sends with correct domain

#### **Stripe Tests** (if applicable):
- [ ] Start checkout → Stripe loads correctly
- [ ] Complete payment → Webhook receives event
- [ ] Check Stripe dashboard → Payment recorded

---

## 🔍 Troubleshooting

### **Issue**: Domain shows "Invalid Configuration"
**Solution**: 
- Wait 5-10 minutes for DNS propagation
- Check DNS records in Vercel dashboard
- Verify domain is using Vercel nameservers

### **Issue**: SSL certificate not working
**Solution**:
- Wait up to 24 hours for SSL provisioning
- Vercel automatically provisions Let's Encrypt certificates
- Check domain status in Vercel dashboard

### **Issue**: Marketing site loads but app doesn't
**Solution**:
- Verify `app.atlvs.one` is added to app project (not marketing project)
- Check environment variables are updated
- Trigger manual redeploy

### **Issue**: Cross-zone links don't work
**Solution**:
- Verify `NEXT_PUBLIC_APP_URL=https://app.atlvs.one` in marketing project
- Check browser console for errors
- Clear browser cache and try again

### **Issue**: Supabase auth fails
**Solution**:
- Add `https://app.atlvs.one/**` to Supabase redirect URLs
- Update Site URL in Supabase settings
- Check browser console for CORS errors

### **Issue**: Stripe webhook fails
**Solution**:
- Update webhook URL to `https://app.atlvs.one/api/webhooks/stripe`
- Verify webhook secret in environment variables
- Check Stripe dashboard for webhook delivery attempts

---

## 📊 Final Configuration Summary

### **Domains**:
```
Marketing:  https://atlvs.one
            https://www.atlvs.one (redirects to atlvs.one)
App:        https://app.atlvs.one
```

### **Vercel Projects**:
```
atlvs-marketing → atlvs.one
atlvs-app       → app.atlvs.one
```

### **Environment Variables**:

**Marketing** (`atlvs-marketing`):
```bash
NEXT_PUBLIC_APP_URL=https://app.atlvs.one
NODE_ENV=production
```

**App** (`atlvs-app`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_SITE_URL=https://app.atlvs.one
NEXT_PUBLIC_APP_URL=https://app.atlvs.one
NODE_ENV=production
```

### **DNS Records** (Automatic via Vercel):
```
A      @    → 76.76.21.21
CNAME  www  → cname.vercel-dns.com
CNAME  app  → cname.vercel-dns.com
```

---

## ✅ Verification Commands

### **Check DNS Propagation**:
```bash
# Check A record
dig atlvs.one +short
# Should return: 76.76.21.21

# Check CNAME records
dig www.atlvs.one +short
dig app.atlvs.one +short
# Should return: cname.vercel-dns.com
```

### **Check SSL Certificates**:
```bash
# Check marketing site
curl -I https://atlvs.one
# Should return: HTTP/2 200

# Check app site
curl -I https://app.atlvs.one
# Should return: HTTP/2 200 or 307 (redirect to login)
```

### **Check Cross-Zone Linking**:
```bash
# Test redirect
curl -I https://atlvs.one/login
# Should return: HTTP/2 307 or 308
# Location: https://app.atlvs.one/en/login
```

---

## 🎉 Success Criteria

Your setup is complete when:

- ✅ `https://atlvs.one` loads marketing homepage
- ✅ `https://www.atlvs.one` redirects to `https://atlvs.one`
- ✅ `https://app.atlvs.one` loads application
- ✅ SSL certificates valid on all domains (🔒 green lock)
- ✅ Cross-zone navigation works (marketing → app)
- ✅ Authentication works (signup, login, password reset)
- ✅ Stripe payments work (if applicable)
- ✅ No console errors in browser
- ✅ All tests pass

---

## 📝 Post-Setup Tasks

After everything is working:

- [ ] Update marketing materials with new domain
- [ ] Update social media links
- [ ] Update email signatures
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (if not already done)
- [ ] Configure monitoring/alerts
- [ ] Update documentation with new URLs
- [ ] Notify team of new domain
- [ ] Archive old `.vercel.app` URLs (still work but redirect)

---

## 🚀 You're Live!

**Marketing Site**: https://atlvs.one  
**Application**: https://app.atlvs.one

**Status**: Production Ready ✅  
**SSL**: Automatic via Vercel ✅  
**DNS**: Managed by Vercel ✅  
**Deployment**: Continuous via GitHub ✅

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Stripe Support: https://support.stripe.com

**Documentation**:
- Multi-Zone Guide: `docs/MULTI_ZONE_DEPLOYMENT_GUIDE.md`
- Default URLs Guide: `docs/VERCEL_DEFAULT_URLS_DEPLOYMENT.md`
