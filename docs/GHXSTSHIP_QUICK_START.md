# GHXSTSHIP Brand Quick Start Guide

**For rapid implementation of the GHXSTSHIP brand system**

---

## 🎯 Essential Brand Elements

### Logo Files You Need
```
✅ logo.svg           - Main gradient logo (use this 90% of the time)
✅ logo-dark.svg      - White logo for dark backgrounds
✅ logo-light.svg     - Dark logo for light backgrounds
✅ logo-icon.svg      - Square icon for favicons/app icons
```

### Core Typography
```css
font-title    → Anton SC (Hero headlines, uppercase)
font-heading  → Bebas Neue (Section titles, uppercase)
font-tech     → Share Tech (Body copy, descriptions)
font-pixel    → Press Start 2P (Logo, special accents)
```

### Primary Colors
```css
/* Light Mode */
--primary: #7C3AED (Purple)
--background: #FFFFFF (White)
--foreground: #0A0A0A (Near Black)

/* Dark Mode */
--primary: #7C3AED (Purple - same)
--background: #0F0F0F (Near Black)
--foreground: #FAFAFA (Off White)
```

---

## 🚀 Quick Implementation

### 1. Install Fonts (Next.js)
```tsx
import { Anton_SC, Bebas_Neue, Share_Tech, Press_Start_2P } from 'next/font/google'

const antonSC = Anton_SC({ weight: '400', subsets: ['latin'], variable: '--font-anton-sc' })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas-neue' })
const shareTech = Share_Tech({ weight: '400', subsets: ['latin'], variable: '--font-share-tech' })
const pressStart2P = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press-start-2p' })
```

### 2. Add to Tailwind Config
```ts
fontFamily: {
  pixel: ['var(--font-press-start-2p)', 'monospace'],
  title: ['var(--font-anton-sc)', 'sans-serif'],
  heading: ['var(--font-bebas-neue)', 'sans-serif'],
  tech: ['var(--font-share-tech)', 'sans-serif'],
}
```

### 3. Use in Components
```tsx
<h1 className="font-title uppercase text-6xl">GHXSTSHIP</h1>
<h2 className="font-heading uppercase text-4xl">Section Title</h2>
<p className="font-tech text-lg">Body copy goes here.</p>
```

---

## 📐 Layout Patterns

### Hero Section
```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-6xl mx-auto text-center">
    <h1 className="font-title uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
      Your Headline
    </h1>
    <p className="font-tech text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
      Your subheadline
    </p>
    <Button size="lg">Get Started</Button>
  </div>
</section>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="p-4 sm:p-6">
    <CardHeader>
      <CardTitle className="font-heading uppercase">Title</CardTitle>
    </CardHeader>
    <CardContent className="font-tech">
      Content here
    </CardContent>
  </Card>
</div>
```

---

## ✅ Quality Checklist

### Before Launch
- [ ] Logo displays correctly in light/dark mode
- [ ] All fonts load properly
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Touch targets are 44px minimum

---

## 🔗 Full Documentation
See `GHXSTSHIP_BRAND_GUIDE.md` for complete specifications.

---

**Need help?** design@ghxstship.com
