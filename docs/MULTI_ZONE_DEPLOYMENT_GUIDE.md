# ATLVS Multi-Zone Deployment Guide

**Goal**: 
- `https://atlvs.xyz` → Marketing Site (Landing Page)
- `https://app.atlvs.xyz` → Full Application

---

## 🎯 Architecture Overview

This setup uses **Next.js Multi-Zones** with **two separate Vercel projects**:

1. **Marketing Zone** (atlvs.xyz)
   - Serves marketing pages only
   - Static site (no authentication)
   - Lightweight and fast
   
2. **App Zone** (app.atlvs.xyz)
   - Full ATLVS application
   - Authentication, database, all features
   - Current main application

---

## 📋 Deployment Steps

### **Step 1: Deploy the Main Application (app.atlvs.xyz)**

This is your current deployment - no changes needed!

1. **Vercel Project**: Keep your existing project
2. **Domain**: Add custom domain `app.atlvs.xyz`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Root Directory**: `./`

**Vercel Settings**:
```
Project Name: atlvs-app
Domain: app.atlvs.xyz
Build Command: npm run build
Output Directory: .next
Root Directory: ./
Framework Preset: Next.js
Node Version: 18.x or higher
```

**Environment Variables**: Keep all your existing env vars (Supabase, Stripe, etc.)

---

### **Step 2: Create New Marketing Site Project**

Create a **separate** Vercel project for the marketing site.

1. **Go to Vercel Dashboard** → Add New Project
2. **Import** the same GitHub repository (`ghxstship/dragonfly26.00`)
3. **Configure** as follows:

**Vercel Settings**:
```
Project Name: atlvs-marketing
Domain: atlvs.xyz
Build Command: npm run build:marketing
Output Directory: .next-marketing
Root Directory: ./
Framework Preset: Next.js
Node Version: 18.x or higher
```

**Environment Variables** (minimal - no Supabase/Stripe needed):
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
```

---

### **Step 3: Configure Custom Domains**

#### **For Marketing Project (atlvs.xyz)**:
1. Go to Project Settings → Domains
2. Add domain: `atlvs.xyz`
3. Add domain: `www.atlvs.xyz` (redirect to atlvs.xyz)
4. Update DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### **For App Project (app.atlvs.xyz)**:
1. Go to Project Settings → Domains
2. Add domain: `app.atlvs.xyz`
3. Update DNS:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

---

### **Step 4: Update package.json Scripts**

Your `package.json` should have these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:marketing": "next dev -p 3001 --config next.config.marketing.js",
    "build": "next build",
    "build:marketing": "next build --config next.config.marketing.js",
    "start": "next start",
    "start:marketing": "next start -p 3001 --dir .next-marketing"
  }
}
```

---

### **Step 5: Verify Routing**

After deployment, test these URLs:

#### **Marketing Site (atlvs.xyz)**:
- ✅ `https://atlvs.xyz` → Homepage
- ✅ `https://atlvs.xyz/pricing` → Pricing page
- ✅ `https://atlvs.xyz/features` → Features page
- ✅ `https://atlvs.xyz/about` → About page
- ✅ `https://atlvs.xyz/contact` → Contact page

#### **App Site (app.atlvs.xyz)**:
- ✅ `https://app.atlvs.xyz` → Sign in page (current behavior)
- ✅ `https://app.atlvs.xyz/en` → Localized app
- ✅ `https://app.atlvs.xyz/en/dashboard` → Dashboard (after login)

#### **Cross-Zone Links**:
- ✅ Click "Get Started" on marketing → Redirects to `app.atlvs.xyz`
- ✅ Click "Sign In" on marketing → Redirects to `app.atlvs.xyz/en/login`

---

## 🔧 Configuration Files

### **next.config.js** (Main App)
Keep as-is. This is for `app.atlvs.xyz`.

### **next.config.marketing.js** (Marketing Site)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-marketing',
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/app',
        destination: 'https://app.atlvs.xyz',
      },
      {
        source: '/app/:path*',
        destination: 'https://app.atlvs.xyz/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/signup',
        destination: 'https://app.atlvs.xyz/en/signup',
        permanent: false,
      },
      {
        source: '/login',
        destination: 'https://app.atlvs.xyz/en/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
```

### **vercel.json** (Main App - app.atlvs.xyz)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### **vercel.marketing.json** (Marketing Site - atlvs.xyz)
```json
{
  "buildCommand": "npm run build:marketing",
  "outputDirectory": ".next-marketing",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## 🚀 Deployment Workflow

### **When to Deploy Marketing Site**:
```bash
# Make changes to src/marketing/*
git add .
git commit -m "Update marketing content"
git push origin main

# Vercel automatically deploys to atlvs.xyz
```

### **When to Deploy Main App**:
```bash
# Make changes to src/app/* or src/components/*
git add .
git commit -m "Update application features"
git push origin main

# Vercel automatically deploys to app.atlvs.xyz
```

---

## 📊 Project Structure

```
dragonfly26.00/
├── src/
│   ├── app/                    # Main application (app.atlvs.xyz)
│   │   ├── [locale]/          # Localized routes
│   │   ├── api/               # API routes
│   │   └── auth/              # Auth pages
│   │
│   ├── marketing/             # Marketing site (atlvs.xyz)
│   │   ├── app/               # Marketing pages
│   │   └── components/        # Marketing components
│   │
│   └── components/            # Shared UI components
│
├── next.config.js             # App config (app.atlvs.xyz)
├── next.config.marketing.js   # Marketing config (atlvs.xyz)
├── vercel.json                # App deployment
└── vercel.marketing.json      # Marketing deployment
```

---

## ✅ Benefits of This Approach

1. **Independent Deployments**
   - Marketing changes don't affect the app
   - App changes don't affect marketing
   - Faster build times for each

2. **Performance**
   - Marketing site is static (super fast)
   - App has full dynamic features
   - Optimized for each use case

3. **Security**
   - Marketing site has no access to database
   - Reduced attack surface
   - Separate environment variables

4. **Scalability**
   - Each zone can scale independently
   - Different caching strategies
   - Optimized resource allocation

5. **Maintenance**
   - Clear separation of concerns
   - Easier to update marketing content
   - No risk of breaking the app

---

## 🔍 Troubleshooting

### **Issue**: Marketing site shows 404
**Solution**: Ensure `build:marketing` script uses `--config next.config.marketing.js`

### **Issue**: Links to app don't work
**Solution**: Check redirects in `next.config.marketing.js` point to `https://app.atlvs.xyz`

### **Issue**: Both sites deploy to same domain
**Solution**: Create **two separate Vercel projects** with different domains

### **Issue**: Shared components not found
**Solution**: Both configs should use the same `src/components` directory

---

## 📝 Checklist

### **Before Deployment**:
- ✅ Two separate Vercel projects created
- ✅ Custom domains configured (atlvs.xyz and app.atlvs.xyz)
- ✅ DNS records updated
- ✅ Build scripts in package.json
- ✅ Environment variables set for each project
- ✅ next.config.marketing.js configured
- ✅ All marketing pages complete

### **After Deployment**:
- ✅ Test marketing site homepage
- ✅ Test all marketing pages
- ✅ Test app login flow
- ✅ Test cross-zone navigation
- ✅ Verify SSL certificates
- ✅ Check performance metrics
- ✅ Test mobile responsiveness

---

## 🎉 Summary

**Two Vercel Projects**:
1. **atlvs-marketing** → `atlvs.xyz` (marketing site)
2. **atlvs-app** → `app.atlvs.xyz` (full application)

**Same GitHub Repo**: Both projects deploy from the same repository but use different build configurations.

**Result**: 
- Marketing site at root domain (atlvs.xyz)
- Application at subdomain (app.atlvs.xyz)
- No loss of functionality
- Clean separation of concerns

---

**Ready to Deploy!** 🚀
