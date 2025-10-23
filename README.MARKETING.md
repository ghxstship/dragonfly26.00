# ATLVS Marketing Site - Quick Start Guide

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies (if not already done)
npm install

# Run marketing site on port 3001
npm run dev:marketing

# Visit http://localhost:3001
```

### Production Build

```bash
# Build marketing site
npm run build:marketing

# Start production server
npm run start:marketing
```

---

## 📁 Project Structure

```
src/marketing/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with nav/footer
│   ├── page.tsx           # Homepage
│   ├── pricing/           # Pricing page
│   ├── features/          # Features page
│   ├── about/             # About page
│   └── blog/              # Blog page
└── components/
    ├── MarketingNav.tsx   # Navigation
    ├── MarketingFooter.tsx # Footer
    └── sections/          # Homepage sections
        ├── HeroSection.tsx
        ├── TrustBar.tsx
        ├── ProblemSection.tsx
        ├── SolutionSection.tsx
        └── ...
```

---

## 🎨 Using Shared Components

The marketing site uses the same atomic design system as the main app:

```typescript
// Import shared components
import { Button } from "../../components/atoms/Button"
import { Card } from "../../components/molecules/Card"

// Use in your marketing pages
<Button variant="primary">Start Free Today</Button>
```

**Shared Resources:**
- `src/components/` - Atomic design system
- `src/design-tokens/` - Colors, spacing, typography
- `src/app/globals.css` - Global styles

---

## 🌐 Domains

- **Marketing**: https://atlvs.xyz
- **Application**: https://app.atlvs.xyz

### Automatic Redirects

These paths automatically redirect to the app:
- `/app` → `https://app.atlvs.xyz/app`
- `/signup` → `https://app.atlvs.xyz/auth/signup`
- `/signin` → `https://app.atlvs.xyz/auth/signin`

---

## 📝 Adding New Pages

### 1. Create Page File

```bash
# Create new page directory
mkdir -p src/marketing/app/your-page

# Create page component
touch src/marketing/app/your-page/page.tsx
```

### 2. Add Page Content

```typescript
// src/marketing/app/your-page/page.tsx
export const metadata = {
  title: "Your Page - ATLVS",
  description: "Page description for SEO",
}

export default function YourPage(): JSX.Element {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your Page Title
        </h1>
        {/* Your content */}
      </div>
    </div>
  )
}
```

### 3. Add to Navigation

```typescript
// src/marketing/components/MarketingNav.tsx
<Link href="/your-page" className="text-gray-700 hover:text-gray-900">
  Your Page
</Link>
```

---

## 🎯 Content Guidelines

### Empty State Messaging

For pages without content yet, use:

```typescript
<div className="bg-gray-50 rounded-xl p-12 text-center">
  <p className="text-2xl font-semibold text-gray-900 mb-2">
    NO CONTENT AVAILABLE
  </p>
  <p className="text-gray-600">
    Check back soon for updates.
  </p>
</div>
```

### SEO Best Practices

Always include metadata:

```typescript
export const metadata = {
  title: "Page Title - ATLVS",
  description: "Compelling description under 160 characters",
  openGraph: {
    title: "Page Title",
    description: "Description for social sharing",
    images: ["/og-image.png"],
  },
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Create Vercel Project**
   ```bash
   vercel
   ```

2. **Configure Build Settings**
   - Build Command: `npm run build:marketing`
   - Output Directory: `.next-marketing`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_APP_URL=https://app.atlvs.xyz
   NEXT_PUBLIC_MARKETING_URL=https://atlvs.xyz
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

See `docs/MARKETING_SITE_DEPLOYMENT.md` for complete guide.

---

## 📚 Documentation

- **Full Deployment Guide**: `docs/MARKETING_SITE_DEPLOYMENT.md`
- **Implementation Summary**: `docs/MARKETING_SITE_IMPLEMENTATION_SUMMARY.md`
- **Landing Page Copy**: `docs/ATLVS_LANDING_PAGE_COPY.md`
- **Resource Pages**: `docs/ATLVS_MARKETING_SITE_RESOURCES.md`

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
npm run dev:marketing -- -p 3002
```

### Build Errors

```bash
# Clean build cache
rm -rf .next-marketing

# Rebuild
npm run build:marketing
```

### Import Errors

Make sure you're using correct relative paths:

```typescript
// ✅ Correct - from marketing to shared components
import { Button } from "../../components/atoms/Button"

// ❌ Wrong - absolute path won't work
import { Button } from "@/components/atoms/Button"
```

---

## 🎨 Styling

The marketing site uses **Tailwind CSS** with the same configuration as the main app.

### Common Patterns

```typescript
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Section spacing
<section className="py-20 px-4 sm:px-6 lg:px-8">

// Heading
<h1 className="text-5xl font-bold text-gray-900 mb-6">

// Body text
<p className="text-xl text-gray-600">
```

---

## ✅ Checklist for New Pages

- [ ] Create page file in `src/marketing/app/`
- [ ] Add metadata for SEO
- [ ] Use shared components from `src/components/`
- [ ] Add to navigation if needed
- [ ] Test locally with `npm run dev:marketing`
- [ ] Build successfully with `npm run build:marketing`
- [ ] Add to footer if appropriate
- [ ] Test responsive design (mobile, tablet, desktop)

---

## 🆘 Need Help?

- Check `docs/MARKETING_SITE_DEPLOYMENT.md` for detailed guides
- Review existing pages for examples
- Test locally before deploying

---

**Last Updated**: October 23, 2025
