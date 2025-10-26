# Marketing Typography System

## Overview

The marketing pages use a custom typography system with specialized fonts from Google Fonts to create a distinctive, tech-forward brand identity.

## Font Stack

### 1. **Coral Pixels** - Logo
- **Usage:** ATLVS logo only
- **Tailwind Class:** `font-pixel`
- **CSS Variable:** `--font-coral-pixels`
- **Style:** Pixel/retro font
- **Source:** Google Fonts (local file)
- **Example:** `<div className="font-pixel">ATLVS</div>`

### 2. **Anton SC** - Titles
- **Usage:** Main page titles (h1)
- **Tailwind Class:** `font-title`
- **CSS Variable:** `--font-anton-sc`
- **Style:** Bold, condensed, capitalized
- **Transform:** Always use with `uppercase`
- **Example:** `<h1 className="font-title uppercase">Title</h1>`

### 3. **Bebas Neue** - Headings
- **Usage:** Section headings (h2, h3, h4)
- **Tailwind Class:** `font-heading`
- **CSS Variable:** `--font-bebas-neue`
- **Style:** Tall, narrow, capitalized
- **Transform:** Always use with `uppercase`
- **Example:** `<h2 className="font-heading uppercase">Heading</h2>`

### 4. **Share Tech Mono** - Monospace
- **Usage:** Code snippets, technical data
- **Tailwind Class:** `font-tech-mono`
- **CSS Variable:** `--font-share-tech-mono`
- **Style:** Monospace, technical
- **Example:** `<code className="font-tech-mono">code</code>`

### 5. **Share Tech** - Body
- **Usage:** Body text, paragraphs, descriptions
- **Tailwind Class:** `font-tech`
- **CSS Variable:** `--font-share-tech`
- **Style:** Clean, technical, readable
- **Default:** Applied to all marketing pages via layout
- **Example:** `<p className="font-tech">Body text</p>`

## Implementation

### Root Layout (`src/app/layout.tsx`)
All fonts are loaded and configured with CSS variables:

```tsx
import { Inter, Anton_SC, Bebas_Neue, Share_Tech_Mono, Share_Tech } from "next/font/google"
import localFont from "next/font/local"

const coralPixels = localFont({ ... })
const antonSC = Anton_SC({ ... })
const bebasNeue = Bebas_Neue({ ... })
const shareTechMono = Share_Tech_Mono({ ... })
const shareTech = Share_Tech({ ... })
```

### Marketing Layout (`src/app/[locale]/(marketing)/layout.tsx`)
Share Tech is applied as the default body font:

```tsx
<div className="font-tech">
  <MarketingNav />
  {children}
  <MarketingFooter />
</div>
```

### Tailwind Config (`tailwind.config.ts`)
Font families are registered for easy usage:

```ts
fontFamily: {
  pixel: ['var(--font-coral-pixels)', 'monospace'],
  title: ['var(--font-anton-sc)', 'sans-serif'],
  heading: ['var(--font-bebas-neue)', 'sans-serif'],
  'tech-mono': ['var(--font-share-tech-mono)', 'monospace'],
  'tech': ['var(--font-share-tech)', 'sans-serif'],
}
```

## Usage Guidelines

### Typography Hierarchy

```tsx
// Logo
<div className="font-pixel">ATLVS</div>

// Page Title (h1)
<h1 className="font-title uppercase text-4xl md:text-6xl">
  Main Title
</h1>

// Section Heading (h2)
<h2 className="font-heading uppercase text-3xl md:text-5xl">
  Section Heading
</h2>

// Subsection Heading (h3)
<h3 className="font-heading uppercase text-xl md:text-3xl">
  Subsection
</h3>

// Body Text (p)
<p className="font-tech text-base md:text-lg">
  Body paragraph text
</p>

// Code/Technical
<code className="font-tech-mono">
  Technical content
</code>
```

### Best Practices

1. **Always capitalize titles and headings** - Use `uppercase` class
2. **Logo is pixel font only** - Don't use Coral Pixels for other text
3. **Body text uses Share Tech** - Applied by default in marketing layout
4. **Maintain hierarchy** - Title > Heading > Body
5. **Responsive sizing** - Use responsive text classes (text-base md:text-lg)

## Component Examples

### Hero Section
```tsx
<h1 className="font-title uppercase text-7xl">
  Transform Your Production
</h1>
<p className="font-heading uppercase text-2xl">
  All-in-one platform for live events
</p>
<p className="font-tech text-lg">
  Supporting copy with details
</p>
```

### Feature Cards
```tsx
<h3 className="font-heading uppercase text-xl">
  Feature Title
</h3>
<p className="font-tech text-base">
  Feature description
</p>
```

### Pricing Section
```tsx
<h2 className="font-title uppercase text-5xl">
  Pricing
</h2>
<h3 className="font-heading uppercase text-3xl">
  Pro Plan
</h3>
<p className="font-tech text-base">
  Plan details
</p>
```

## Files Modified

1. `/src/app/layout.tsx` - Font imports and configuration
2. `/src/app/[locale]/(marketing)/layout.tsx` - Default body font
3. `/tailwind.config.ts` - Font family utilities
4. `/src/marketing/components/MarketingNav.tsx` - Logo font
5. `/src/marketing/components/sections/HeroSection.tsx` - Title/heading fonts
6. `/src/marketing/components/sections/FeaturesSection.tsx` - Heading fonts
7. Additional marketing sections (to be updated)

## Accessibility

- All fonts maintain WCAG 2.1 AA contrast ratios
- Font sizes are responsive and scale appropriately
- Letter spacing adjusted for readability
- Uppercase text uses proper semantic HTML

## Performance

- Fonts use `display: 'swap'` for optimal loading
- Coral Pixels is preloaded as local font
- Google Fonts are optimized via Next.js font loader
- CSS variables enable efficient font switching

## License

All fonts are licensed under SIL Open Font License 1.1 and are free for commercial use.
