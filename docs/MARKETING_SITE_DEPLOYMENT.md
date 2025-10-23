# ATLVS Marketing Site - Multi-Zone Deployment Guide

## Architecture Overview

The ATLVS platform uses a **multi-zone Next.js architecture** with two separate deployments:

- **Marketing Site**: `https://atlvs.xyz` (Public-facing marketing pages)
- **Application**: `https://app.atlvs.xyz` (Authenticated SaaS application)

Both sites share the same atomic design system and components but are deployed independently for optimal performance and scalability.

---

## Directory Structure

```
dragonfly26.00/
├── src/
│   ├── marketing/              # Marketing site (atlvs.xyz)
│   │   ├── app/
│   │   │   ├── layout.tsx     # Marketing layout
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── pricing/
│   │   │   ├── features/
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   └── docs/
│   │   └── components/
│   │       ├── MarketingNav.tsx
│   │       ├── MarketingFooter.tsx
│   │       └── sections/      # Homepage sections
│   ├── app/                    # Main application (app.atlvs.xyz)
│   └── components/             # SHARED atomic design system
│       ├── atoms/
│       ├── molecules/
│       ├── organisms/
│       └── templates/
```

---

## Vercel Deployment

### Project Setup

#### 1. Marketing Site (atlvs.xyz)

**Create New Vercel Project:**
```bash
vercel --prod
```

**Project Settings:**
- **Framework Preset**: Next.js
- **Root Directory**: `/`
- **Build Command**: `npm run build:marketing`
- **Output Directory**: `.next-marketing`
- **Install Command**: `npm install`

**Environment Variables:**
```
NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
NEXT_PUBLIC_MARKETING_URL=https://atlvs.xyz
NODE_ENV=production
```

**Domain Configuration:**
- Primary Domain: `atlvs.xyz`
- Add Domain: `www.atlvs.xyz` (redirect to `atlvs.xyz`)

---

#### 2. Application (app.atlvs.xyz)

**Create Separate Vercel Project:**
```bash
vercel --prod
```

**Project Settings:**
- **Framework Preset**: Next.js
- **Root Directory**: `/`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**Environment Variables:**
```
NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
NEXT_PUBLIC_MARKETING_URL=https://atlvs.xyz
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

**Domain Configuration:**
- Primary Domain: `app.atlvs.xyz`

---

## DNS Configuration

### Vercel DNS Settings

**For atlvs.xyz (Marketing):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For app.atlvs.xyz (Application):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

---

## Local Development

### Running Both Sites Locally

**Terminal 1 - Application (port 3000):**
```bash
npm run dev
```
Access at: `http://localhost:3000`

**Terminal 2 - Marketing (port 3001):**
```bash
npm run dev:marketing
```
Access at: `http://localhost:3001`

### Testing Multi-Zone Locally

Add to `/etc/hosts`:
```
127.0.0.1 atlvs.local
127.0.0.1 app.atlvs.local
```

Then access:
- Marketing: `http://atlvs.local:3001`
- Application: `http://app.atlvs.local:3000`

---

## Build Commands

### Marketing Site
```bash
# Development
npm run dev:marketing

# Production build
npm run build:marketing

# Start production server
npm run start:marketing
```

### Application
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

---

## Deployment Workflow

### Option 1: Automatic Deployment (Recommended)

**Setup Git Integration:**

1. Connect both Vercel projects to the same GitHub repository
2. Configure deployment branches:
   - Marketing: Deploy from `main` branch
   - Application: Deploy from `main` branch

3. Configure build settings in Vercel dashboard:
   - Marketing project: Use `build:marketing` command
   - Application project: Use `build` command

**Automatic Deployment Triggers:**
- Push to `main` → Both sites rebuild
- Marketing changes only → Only marketing rebuilds (via Vercel's smart detection)
- App changes only → Only app rebuilds

---

### Option 2: Manual Deployment

**Deploy Marketing Site:**
```bash
# Build locally
npm run build:marketing

# Deploy to Vercel
vercel --prod --cwd . --build-env NEXT_BUILD_DIR=.next-marketing
```

**Deploy Application:**
```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod
```

---

## Routing & Redirects

### Marketing → App Redirects

The marketing site automatically redirects these paths to the application:

- `/app` → `https://app.atlvs.xyz/app`
- `/app/*` → `https://app.atlvs.xyz/app/*`
- `/signup` → `https://app.atlvs.xyz/auth/signup`
- `/signin` → `https://app.atlvs.xyz/auth/signin`
- `/login` → `https://app.atlvs.xyz/auth/signin`

Configured in: `vercel.marketing.json`

---

## Performance Optimization

### Marketing Site (Static)

The marketing site is optimized for static generation:

```typescript
// src/marketing/app/page.tsx
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour
```

**Benefits:**
- ✅ Instant page loads
- ✅ Global CDN distribution
- ✅ SEO optimized
- ✅ Lower costs

### Application (Dynamic)

The application remains fully dynamic for authenticated users:

```typescript
// src/app/(app)/dashboard/page.tsx
export const dynamic = 'force-dynamic'
```

---

## Shared Components

Both sites use the same atomic design system from `src/components/`:

```typescript
// Marketing site
import { Button } from "../../components/atoms/Button"

// Application
import { Button } from "../components/atoms/Button"
```

**Shared Resources:**
- Design tokens (`src/design-tokens/`)
- Atomic components (`src/components/`)
- Styles (`src/app/globals.css`)
- Utilities (`src/lib/`)

---

## Environment Variables

### Marketing Site (.env.local)
```bash
NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
NEXT_PUBLIC_MARKETING_URL=https://atlvs.xyz
```

### Application (.env.local)
```bash
NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
NEXT_PUBLIC_MARKETING_URL=https://atlvs.xyz
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Monitoring & Analytics

### Vercel Analytics

Enable for both projects:
- Marketing: Track page views, conversions
- Application: Track user engagement

### Performance Monitoring

**Marketing Site Metrics:**
- Lighthouse Score: Target 95+
- First Contentful Paint: < 1s
- Time to Interactive: < 2s

**Application Metrics:**
- Time to First Byte: < 200ms
- Core Web Vitals: All green

---

## Troubleshooting

### Common Issues

**Issue: Marketing site shows 404**
- Check Vercel domain configuration
- Verify DNS propagation (can take up to 48 hours)
- Check build logs in Vercel dashboard

**Issue: Redirects not working**
- Verify `vercel.marketing.json` is deployed
- Check Vercel project settings → Redirects
- Clear browser cache

**Issue: Shared components not found**
- Verify import paths are correct
- Check that components exist in `src/components/`
- Run `npm install` to ensure dependencies are installed

**Issue: Build fails**
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test build locally: `npm run build:marketing`

---

## Security

### Headers

Both sites include security headers:

```json
{
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### HTTPS

- Both sites enforce HTTPS
- Automatic SSL certificates via Vercel
- HSTS enabled

---

## Maintenance

### Updating Marketing Content

1. Edit files in `src/marketing/app/`
2. Test locally: `npm run dev:marketing`
3. Commit and push to trigger deployment
4. Verify at `https://atlvs.xyz`

### Updating Shared Components

1. Edit files in `src/components/`
2. Test both sites locally
3. Commit and push
4. Both sites will rebuild automatically

---

## Cost Optimization

### Vercel Pricing

**Marketing Site:**
- Likely stays within free tier (static site)
- Minimal bandwidth usage
- No serverless functions

**Application:**
- Pro plan recommended for production
- Serverless functions for API routes
- Higher bandwidth usage

**Estimated Monthly Cost:**
- Marketing: $0 (Free tier)
- Application: $20/month (Pro plan)
- **Total: ~$20/month**

---

## Next Steps

1. ✅ Set up Vercel projects for both domains
2. ✅ Configure DNS settings
3. ✅ Set environment variables
4. ✅ Enable automatic deployments
5. ⏳ Add custom domain SSL certificates
6. ⏳ Configure analytics and monitoring
7. ⏳ Set up staging environments

---

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Multi-Zones: https://nextjs.org/docs/advanced-features/multi-zones
- ATLVS Internal: Contact DevOps team

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0
