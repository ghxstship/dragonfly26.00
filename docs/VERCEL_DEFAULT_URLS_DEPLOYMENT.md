# ATLVS Deployment with Vercel Default URLs

**Use Case**: Deploy without purchasing custom domains (atlvs.xyz, app.atlvs.xyz)

---

## 🎯 What This Means

Instead of:
- ❌ `https://atlvs.xyz` (requires domain purchase)
- ❌ `https://app.atlvs.xyz` (requires domain purchase)

You'll use:
- ✅ `https://atlvs-marketing.vercel.app` (free Vercel subdomain)
- ✅ `https://atlvs-app.vercel.app` (free Vercel subdomain)

---

## ✅ What Changes

### **1. No DNS Configuration Required**
- ❌ Skip all domain registrar setup
- ❌ Skip DNS record configuration
- ❌ Skip SSL certificate setup
- ✅ Vercel handles everything automatically

### **2. Simplified Deployment**
- Same two-project setup
- Same GitHub repository
- Same build configurations
- Just different URLs

### **3. Environment Variables**
Both projects use `NEXT_PUBLIC_APP_URL` to configure cross-linking:

**Marketing Project** (`atlvs-marketing`):
```
NEXT_PUBLIC_APP_URL=https://atlvs-app.vercel.app
```

**App Project** (`atlvs-app`):
```
(No special env var needed - uses existing Supabase, Stripe, etc.)
```

---

## 📋 Deployment Steps

### **Step 1: Deploy Main Application**

1. **Go to Vercel Dashboard** → "Add New Project"
2. **Import** GitHub repo: `ghxstship/dragonfly26.00`
3. **Configure**:
   ```
   Project Name: atlvs-app
   Build Command: npm run build
   Output Directory: .next
   Root Directory: ./
   Framework: Next.js
   ```
4. **Environment Variables**: Add all your existing env vars:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   (etc.)
   ```
5. **Deploy** → Vercel assigns URL: `https://atlvs-app.vercel.app`

---

### **Step 2: Deploy Marketing Site**

1. **Go to Vercel Dashboard** → "Add New Project"
2. **Import** same GitHub repo: `ghxstship/dragonfly26.00`
3. **Configure**:
   ```
   Project Name: atlvs-marketing
   Build Command: npm run build:marketing
   Output Directory: .next-marketing
   Root Directory: ./
   Framework: Next.js
   ```
4. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://atlvs-app.vercel.app
   ```
5. **Deploy** → Vercel assigns URL: `https://atlvs-marketing.vercel.app`

---

## 🔗 How Cross-Linking Works

### **From Marketing to App**:
```tsx
// Marketing Nav component
<Link href={marketingConfig.signupUrl}>
  <Button>Start Free</Button>
</Link>
// Links to: https://atlvs-app.vercel.app/en/signup
```

### **From App to Marketing**:
```tsx
// App component (if needed)
<Link href="https://atlvs-marketing.vercel.app">
  Back to Home
</Link>
```

---

## 📝 Configuration Files

### **next.config.marketing.js**
```javascript
async rewrites() {
  return [
    {
      source: '/app',
      destination: process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app',
    },
    {
      source: '/app/:path*',
      destination: `${process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app'}/:path*`,
    },
  ]
}
```

### **src/marketing/config.ts**
```typescript
export const marketingConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app',
  signupUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app'}/en/signup`,
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://atlvs-app.vercel.app'}/en/login',
}
```

---

## 🎨 Vercel Project Names

Vercel will suggest URLs based on your project name:

**Good Project Names**:
- `atlvs-app` → `atlvs-app.vercel.app`
- `atlvs-marketing` → `atlvs-marketing.vercel.app`

**Alternative Names** (if taken):
- `atlvs-application` → `atlvs-application.vercel.app`
- `atlvs-website` → `atlvs-website.vercel.app`
- `atlvs-platform` → `atlvs-platform.vercel.app`

---

## ✅ Benefits of Default URLs

### **Advantages**:
1. **Free** - No domain purchase required
2. **Instant** - No DNS propagation wait (24-48 hours)
3. **Automatic SSL** - Vercel provides HTTPS automatically
4. **Easy Testing** - Perfect for staging/development
5. **No Configuration** - Zero DNS setup needed

### **Limitations**:
1. **Branding** - URLs include `.vercel.app`
2. **SEO** - Less professional for production
3. **Marketing** - Harder to remember/share
4. **Perception** - May appear less established

---

## 🚀 Upgrade Path to Custom Domains

When you're ready to purchase domains:

### **Step 1: Purchase Domains**
- Buy `atlvs.xyz` from registrar (Namecheap, GoDaddy, etc.)

### **Step 2: Add to Vercel**
- Marketing project: Add domain `atlvs.xyz`
- App project: Add domain `app.atlvs.xyz`

### **Step 3: Update DNS**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### **Step 4: Update Environment Variables**
```
NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
```

### **Step 5: Redeploy**
- Both projects automatically use new domains
- Old `.vercel.app` URLs still work (redirect to custom domain)

---

## 🔍 Testing Your Deployment

### **Marketing Site**:
```
https://atlvs-marketing.vercel.app
https://atlvs-marketing.vercel.app/pricing
https://atlvs-marketing.vercel.app/features
```

### **App Site**:
```
https://atlvs-app.vercel.app
https://atlvs-app.vercel.app/en/login
https://atlvs-app.vercel.app/en/dashboard
```

### **Cross-Zone Navigation**:
1. Visit marketing site
2. Click "Start Free" button
3. Should redirect to: `https://atlvs-app.vercel.app/en/signup`

---

## 📊 Comparison: Default URLs vs Custom Domains

| Feature | Default URLs | Custom Domains |
|---------|-------------|----------------|
| **Cost** | Free | $10-15/year |
| **Setup Time** | Instant | 24-48 hours |
| **SSL Certificate** | Automatic | Automatic |
| **DNS Configuration** | None | Required |
| **Branding** | `.vercel.app` | Your domain |
| **SEO** | Good | Better |
| **Professional** | Staging/Dev | Production |
| **Easy to Share** | Moderate | Easy |

---

## 💡 Recommendations

### **Use Default URLs For**:
- ✅ Development and testing
- ✅ Staging environments
- ✅ Internal demos
- ✅ MVP validation
- ✅ Pre-launch testing

### **Use Custom Domains For**:
- ✅ Production deployment
- ✅ Public launch
- ✅ Marketing campaigns
- ✅ Professional branding
- ✅ SEO optimization

---

## 🎯 Quick Start Checklist

### **Without Custom Domains** (Default URLs):
- [ ] Deploy app project → Get `atlvs-app.vercel.app`
- [ ] Deploy marketing project → Get `atlvs-marketing.vercel.app`
- [ ] Set `NEXT_PUBLIC_APP_URL=https://atlvs-app.vercel.app` in marketing project
- [ ] Test cross-linking between sites
- [ ] ✅ Done! Both sites live and working

### **With Custom Domains** (Later):
- [ ] Purchase `atlvs.xyz` domain
- [ ] Add `atlvs.xyz` to marketing project in Vercel
- [ ] Add `app.atlvs.xyz` to app project in Vercel
- [ ] Configure DNS records
- [ ] Update `NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz`
- [ ] Redeploy both projects
- [ ] ✅ Done! Custom domains active

---

## 📝 Summary

**Default Vercel URLs** are perfect for:
- Getting started quickly
- Testing the multi-zone setup
- Validating functionality
- Internal use

**No changes to code or architecture** - just different URLs. When you're ready for production, adding custom domains is a simple configuration change in Vercel's dashboard.

---

**Current Status**: ✅ Configured for both default URLs and custom domains  
**Ready to Deploy**: Yes - works with either approach  
**Upgrade Path**: Simple - just add domains in Vercel when ready
