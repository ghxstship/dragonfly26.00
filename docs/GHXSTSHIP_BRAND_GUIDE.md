# GHXSTSHIP Brand Guide

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**Extracted From:** ATLVS Platform (Dragonfly26.00)

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Logo System](#logo-system)
3. [Typography](#typography)
4. [Color System](#color-system)
5. [Design Tokens](#design-tokens)
6. [Voice & Tone](#voice--tone)
7. [Visual Style](#visual-style)
8. [Component Patterns](#component-patterns)
9. [Accessibility Standards](#accessibility-standards)
10. [International Support](#international-support)

---

## Brand Overview

### Company Positioning
GHXSTSHIP is the parent company of ATLVS, representing the broader vision of empowering creative and experiential industries through innovative technology platforms.

### Brand Personality
- **Innovative**: Cutting-edge technology meets creative workflows
- **Empowering**: Tools that amplify human creativity and collaboration
- **Professional**: Enterprise-grade reliability with approachable design
- **Global**: Built for international teams and diverse communities
- **Transparent**: Clear communication and honest relationships

### Target Audience
- Creative industry leaders and executives
- Technology partners and investors
- Enterprise clients seeking platform solutions
- Industry innovators and early adopters

---

## Logo System

### Primary Logo Files

#### Vector (SVG) - Preferred Format
```
logo.svg           → Full color gradient logo
logo-dark.svg      → White logo (for dark backgrounds)
logo-light.svg     → Dark logo (for light backgrounds)
logo-icon.svg      → Square icon with first letter
```

#### Raster (PNG) - Generated Sizes
```
Logo Sizes:
- logo-sm.png      → 200px wide
- logo-md.png      → 400px wide
- logo-lg.png      → 800px wide
- logo-xl.png      → 1200px wide

Icon Sizes (PWA/Favicon):
- icon-32.png through icon-512.png
- favicon.png (32×32)
- favicon.ico (multi-size)
```

### Logo Specifications

#### Dimensions
- **Full Logo**: 400×100px (4:1 ratio)
- **Icon**: 100×100px (1:1 ratio)

#### Minimum Sizes
- **Full Logo**: 150px wide minimum
- **Icon**: 24px × 24px minimum

#### Clear Space
- Maintain minimum 20px padding around logo
- Never place logo on busy backgrounds without sufficient contrast

#### Typography
- **Font**: Silkscreen (Google Fonts)
- **Weight**: 700 (Bold)
- **Letter Spacing**: 2px
- **Fallback**: 'Courier New', monospace

#### Color Gradient (6-Color System)
```css
1. #FF6B35 - Orange Red
2. #F7931E - Orange
3. #FDC830 - Yellow
4. #4ECDC4 - Cyan
5. #7C3AED - Purple
6. #C44569 - Pink
```

### Usage Guidelines

#### DO:
✅ Use SVG files for web and digital applications  
✅ Use PNG files for email signatures and presentations  
✅ Maintain aspect ratio when scaling  
✅ Use logo-dark.svg on dark backgrounds  
✅ Use logo-light.svg on light backgrounds  
✅ Export to PDF for print materials  

#### DON'T:
❌ Stretch or distort the logo  
❌ Change the gradient colors  
❌ Add effects (shadows, outlines, glows)  
❌ Place on low-contrast backgrounds  
❌ Rotate or skew the logo  
❌ Use outdated logo versions  

---

## Typography

### Font System

#### Marketing Typography (ATLVS Pattern)

**Display/Title Font**
- **Name**: Anton SC
- **Usage**: Hero headlines, major section titles
- **Style**: Uppercase, bold, high-impact
- **CSS Class**: `font-title`
- **Variable**: `--font-anton-sc`
- **Fallback**: sans-serif

**Heading Font**
- **Name**: Bebas Neue
- **Usage**: Section headings, subheadings, card titles
- **Style**: Uppercase, condensed, modern
- **CSS Class**: `font-heading`
- **Variable**: `--font-bebas-neue`
- **Fallback**: sans-serif

**Body Font**
- **Name**: Share Tech
- **Usage**: Body copy, descriptions, general text
- **Style**: Clean, technical, readable
- **CSS Class**: `font-tech`
- **Variable**: `--font-share-tech`
- **Fallback**: sans-serif

**Monospace Font**
- **Name**: Share Tech Mono
- **Usage**: Code, technical specs, data display
- **Style**: Monospaced, technical
- **CSS Class**: `font-tech-mono`
- **Variable**: `--font-share-tech-mono`
- **Fallback**: monospace

**Accent/Pixel Font**
- **Name**: Press Start 2P
- **Usage**: Logos, special callouts, retro elements
- **Style**: Pixel/retro aesthetic
- **CSS Class**: `font-pixel`
- **Variable**: `--font-press-start-2p`
- **Fallback**: monospace

### Type Scale

#### Display Styles (Hero/Landing Pages)
```css
display-2xl: 4.5rem (72px)   - Line height: 1.1, Letter spacing: -0.02em, Weight: 700
display-xl:  3.75rem (60px)  - Line height: 1.1, Letter spacing: -0.02em, Weight: 700
display-lg:  3rem (48px)     - Line height: 1.2, Letter spacing: -0.01em, Weight: 700
display-md:  2.25rem (36px)  - Line height: 1.2, Letter spacing: -0.01em, Weight: 700
display-sm:  1.875rem (30px) - Line height: 1.3, Letter spacing: -0.01em, Weight: 600
```

#### Heading Styles (Content Sections)
```css
heading-xl: 1.5rem (24px)    - Line height: 1.4, Letter spacing: -0.01em, Weight: 600
heading-lg: 1.25rem (20px)   - Line height: 1.4, Letter spacing: -0.005em, Weight: 600
heading-md: 1.125rem (18px)  - Line height: 1.5, Weight: 600
heading-sm: 1rem (16px)      - Line height: 1.5, Weight: 600
heading-xs: 0.875rem (14px)  - Line height: 1.5, Weight: 600
```

#### Body Styles (Content Text)
```css
body-xl: 1.125rem (18px)     - Line height: 1.6, Weight: 400
body-lg: 1rem (16px)         - Line height: 1.6, Weight: 400
body-md: 0.875rem (14px)     - Line height: 1.5, Weight: 400
body-sm: 0.8125rem (13px)    - Line height: 1.5, Weight: 400
body-xs: 0.75rem (12px)      - Line height: 1.5, Weight: 400
```

#### Label Styles (UI Elements)
```css
label-lg: 0.875rem (14px)    - Line height: 1.4, Weight: 500
label-md: 0.8125rem (13px)   - Line height: 1.4, Weight: 500
label-sm: 0.75rem (12px)     - Line height: 1.4, Weight: 500
label-xs: 0.6875rem (11px)   - Line height: 1.4, Weight: 500
```

### Font Weights
```css
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Typography Best Practices

#### Hierarchy
- Use `font-title` for hero headlines (uppercase)
- Use `font-heading` for section titles (uppercase)
- Use `font-tech` for body copy and descriptions
- Use `font-tech-mono` for technical/data content
- Use `font-pixel` sparingly for brand accent moments

#### Readability
- Maintain 1.5-1.6 line height for body text
- Use tighter line height (1.1-1.3) for display text
- Apply negative letter spacing to large display text
- Keep line length between 50-75 characters for optimal readability

#### Responsive Typography
```css
/* Mobile-first approach */
h1: text-4xl sm:text-5xl md:text-6xl lg:text-7xl
h2: text-3xl sm:text-4xl md:text-5xl
h3: text-2xl sm:text-3xl md:text-4xl
body: text-base sm:text-lg
```

---

## Color System

### Primary Colors (HSL Format)

#### Light Mode
```css
--background: 0 0% 100%           /* White */
--foreground: 222.2 84% 4.9%      /* Near Black */
--primary: 262.1 83.3% 57.8%      /* Purple */
--primary-foreground: 210 40% 98% /* Off White */
```

#### Dark Mode
```css
--background: 240 10% 3.9%        /* Near Black */
--foreground: 0 0% 98%            /* Off White */
--primary: 262.1 83.3% 57.8%      /* Purple (same) */
--primary-foreground: 210 40% 98% /* Off White */
```

### Semantic Colors

#### Light Mode
```css
--secondary: 210 40% 96.1%        /* Light Gray */
--secondary-foreground: 222.2 47.4% 11.2% /* Dark Gray */
--muted: 210 40% 96.1%            /* Light Gray */
--muted-foreground: 215.4 16.3% 46.9% /* Medium Gray */
--accent: 210 40% 96.1%           /* Light Gray */
--accent-foreground: 222.2 47.4% 11.2% /* Dark Gray */
--destructive: 0 84.2% 60.2%      /* Red */
--destructive-foreground: 210 40% 98% /* Off White */
```

#### Dark Mode
```css
--secondary: 240 3.7% 15.9%       /* Dark Gray */
--secondary-foreground: 0 0% 98%  /* Off White */
--muted: 240 3.7% 15.9%           /* Dark Gray */
--muted-foreground: 240 5% 64.9%  /* Medium Gray */
--accent: 240 3.7% 15.9%          /* Dark Gray */
--accent-foreground: 0 0% 98%     /* Off White */
--destructive: 0 62.8% 30.6%      /* Dark Red */
--destructive-foreground: 0 0% 98% /* Off White */
```

### UI Element Colors
```css
--card: var(--background)
--card-foreground: var(--foreground)
--popover: var(--background)
--popover-foreground: var(--foreground)
--border: 214.3 31.8% 91.4% (light) / 240 3.7% 15.9% (dark)
--input: 214.3 31.8% 91.4% (light) / 240 3.7% 15.9% (dark)
--ring: 262.1 83.3% 57.8% (focus ring - matches primary)
--radius: 0.5rem (8px border radius)
```

### Gradient Utilities

#### Text Gradients
```css
.text-gradient-primary {
  background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-blue {
  background: linear-gradient(to right, #2563eb, #0891b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-green {
  background: linear-gradient(to right, #16a34a, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-orange {
  background: linear-gradient(to right, #ea580c, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### Background Gradients
```css
/* Hero sections */
bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950

/* Card highlights */
bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20

/* Subtle accents */
bg-gradient-to-r from-primary/10 to-primary/5
```

### Color Usage Guidelines

#### Backgrounds
- Use `--background` for main page backgrounds
- Use `--card` for elevated surfaces (cards, modals)
- Use `--popover` for floating elements (dropdowns, tooltips)
- Use `--muted` for subtle backgrounds and disabled states

#### Text
- Use `--foreground` for primary text
- Use `--muted-foreground` for secondary/helper text
- Use `--primary` for links and interactive elements
- Use `--destructive` for errors and warnings

#### Borders & Dividers
- Use `--border` for standard borders
- Use `--input` for form field borders
- Use `--ring` for focus states

#### Contrast Requirements
- Maintain WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Test all color combinations in both light and dark modes
- Ensure interactive elements have sufficient contrast in all states

---

## Design Tokens

### Spacing Scale
```css
/* Consistent spacing throughout the application */
spacing.gap: gap-4 sm:gap-6 md:gap-8
spacing.section: space-y-8 sm:space-y-12 md:space-y-16
```

### Padding Scale
```css
padding.sectionX: px-4 sm:px-6 lg:px-8
padding.sectionY: py-12 sm:py-16 md:py-20 lg:py-24
padding.card: p-4 sm:p-6 md:p-8
padding.compact: p-2 sm:p-3 md:p-4
```

### Container Widths
```css
container['4xl']: max-w-4xl
container['6xl']: max-w-6xl
container['7xl']: max-w-7xl
```

### Border Radius
```css
--radius: 0.5rem (8px)
border.default: border
border.rounded: rounded-lg (0.5rem)
border.rounded-xl: rounded-xl (0.75rem)
border.rounded-2xl: rounded-2xl (1rem)
```

### Touch Targets
```css
min-height: 44px (minimum touch target)
min-width: 44px (minimum touch target)
```

### Responsive Breakpoints
```css
sm: 640px   /* Small devices (tablets) */
md: 768px   /* Medium devices (small laptops) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* Ultra-wide displays */
```

---

## Voice & Tone

### Brand Voice Attributes

#### Professional Yet Approachable
- Use clear, direct language
- Avoid jargon unless industry-specific
- Be confident without being arrogant
- Maintain warmth and humanity

#### Empowering & Supportive
- Focus on user success and capabilities
- Use active voice and action-oriented language
- Celebrate achievements and milestones
- Provide clear guidance and next steps

#### Transparent & Honest
- Be upfront about limitations and challenges
- Provide realistic timelines and expectations
- Admit mistakes and communicate fixes
- Share roadmap and decision-making process

### Tone by Context

#### Marketing & Sales
- **Tone**: Confident, inspiring, benefit-focused
- **Example**: "Transform your production workflow with enterprise-grade tools built for creative teams."

#### Product & Features
- **Tone**: Clear, instructional, helpful
- **Example**: "Manage your entire production lifecycle from a single dashboard. Track tasks, assets, and budgets in real-time."

#### Support & Documentation
- **Tone**: Patient, thorough, solution-oriented
- **Example**: "Let's walk through this step-by-step. First, navigate to Settings > Team Management."

#### Error Messages
- **Tone**: Apologetic, constructive, actionable
- **Example**: "We couldn't save your changes. Please check your connection and try again."

### Writing Guidelines

#### Headlines
- Use sentence case for body content
- Use title case or uppercase for marketing headlines (with `font-title` or `font-heading`)
- Keep headlines under 10 words when possible
- Lead with benefits, not features

#### Body Copy
- Use short paragraphs (2-3 sentences)
- Break up long content with subheadings
- Use bullet points for lists and features
- Write at an 8th-grade reading level for accessibility

#### Calls to Action
- Use action verbs (Start, Create, Explore, Discover)
- Be specific about what happens next
- Create urgency without pressure
- Examples: "Start Free Today", "Schedule a Demo", "Get Started"

#### Microcopy
- Button labels: 2-3 words maximum
- Form labels: Clear and descriptive
- Placeholder text: Provide examples, not instructions
- Tooltips: Concise explanations (1 sentence)

---

## Visual Style

### Design Principles

#### Clarity First
- Prioritize content hierarchy
- Use whitespace generously
- Maintain consistent alignment
- Reduce visual noise

#### Modern & Technical
- Clean lines and geometric shapes
- Subtle shadows and depth
- Smooth animations and transitions
- Technical aesthetic without being cold

#### Responsive & Adaptive
- Mobile-first design approach
- Fluid layouts that adapt to screen size
- Touch-friendly interactive elements
- Optimized for all devices

### Layout Patterns

#### Grid Systems
```css
/* Marketing cards */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

/* Dashboard layouts */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Content sections */
grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12
```

#### Card Patterns
```css
/* Marketing cards - centered on mobile */
mx-auto w-full max-w-sm md:max-w-none

/* Dashboard cards - left-aligned */
w-full

/* Padding */
p-4 sm:p-6 md:p-8
```

#### Section Spacing
```css
/* Section padding */
py-12 sm:py-16 md:py-20 lg:py-24

/* Section margins */
space-y-8 sm:space-y-12 md:space-y-16
```

### Animation & Motion

#### Timing Functions
```css
transition-timing-function: {
  spring: cubic-bezier(0.16, 1, 0.3, 1)
  elegant: cubic-bezier(0.4, 0, 0.2, 1)
}
```

#### Keyframe Animations
```css
/* Fade effects */
fade-in: 0.2s ease-out
fade-out: 0.2s ease-out

/* Scale effects */
scale-in: 0.2s cubic-bezier(0.16, 1, 0.3, 1)
scale-out: 0.15s cubic-bezier(0.16, 1, 0.3, 1)

/* Slide effects */
slide-in-from-top/bottom/left/right: 0.3s cubic-bezier(0.16, 1, 0.3, 1)

/* Utility animations */
shimmer: 2s infinite
pulse-subtle: 2s ease-in-out infinite
bounce-subtle: 0.5s ease-in-out
glow: 2s ease-in-out infinite
```

#### Motion Guidelines
- Keep animations under 300ms for UI interactions
- Use subtle motion (2-5px movement)
- Respect `prefers-reduced-motion` for accessibility
- Animate only transform and opacity for performance

### Imagery & Graphics

#### Photography Style
- High-quality, professional images
- Authentic production/event environments
- Diverse representation of people and settings
- Consistent color grading and lighting

#### Iconography
- Use Lucide icons for consistency
- 24px standard size, scalable as needed
- Stroke width: 2px
- Apply `aria-hidden="true"` to decorative icons

#### Illustrations
- Geometric, technical style
- Limited color palette (2-3 colors max)
- Clean lines and shapes
- Support both light and dark modes

---

## Component Patterns

### Buttons

#### Variants
```tsx
<Button variant="default">    {/* Primary action */}
<Button variant="secondary">  {/* Secondary action */}
<Button variant="outline">    {/* Tertiary action */}
<Button variant="ghost">      {/* Minimal action */}
<Button variant="destructive"> {/* Dangerous action */}
```

#### Sizes
```tsx
<Button size="sm">  {/* Compact */}
<Button size="default"> {/* Standard */}
<Button size="lg">  {/* Prominent */}
```

#### Best Practices
- Use `default` variant for primary CTAs
- Limit to one primary button per section
- Include icons for clarity (ArrowRight, Plus, etc.)
- Maintain 44px minimum touch target
- Add loading states for async actions

### Cards

#### Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

#### Responsive Padding
```css
/* Marketing cards */
p-4 sm:p-6 md:p-8

/* Dashboard cards */
p-4 sm:p-6
```

### Forms

#### Field Structure
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Label</Label>
  <Input 
    id="field" 
    placeholder="Example input"
    aria-describedby="field-description"
  />
  <p id="field-description" className="text-sm text-muted-foreground">
    Helper text
  </p>
</div>
```

#### Validation States
- Show errors inline below fields
- Use `destructive` variant for error messages
- Provide clear, actionable error messages
- Validate on blur, not on every keystroke

### Navigation

#### Header Pattern
```tsx
<header className="sticky top-0 z-50 backdrop-blur-lg border-b">
  <nav className="container flex items-center justify-between h-16">
    <Logo />
    <MainNav />
    <Actions />
  </nav>
</header>
```

#### Footer Pattern
```tsx
<footer className="border-t bg-background">
  <div className="container py-12 md:py-16">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* Footer columns */}
    </div>
  </div>
</footer>
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text** (18pt+): 3:1 minimum contrast ratio
- **UI components**: 3:1 minimum contrast ratio
- Test all color combinations in light and dark modes

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators on all focusable elements
- Logical tab order following visual layout
- Skip links for main content navigation

#### Screen Reader Support
- Semantic HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Alt text for all meaningful images
- `aria-hidden="true"` for decorative elements

#### Form Accessibility
- Associated labels for all form fields
- Error messages linked with `aria-describedby`
- Required fields indicated visually and programmatically
- Clear validation feedback

### Implementation Checklist

✅ All text meets contrast requirements  
✅ Focus visible on all interactive elements  
✅ Keyboard navigation works throughout  
✅ Screen reader announces all content correctly  
✅ Forms have proper labels and error handling  
✅ Images have descriptive alt text  
✅ Headings follow logical hierarchy  
✅ Touch targets are minimum 44px  
✅ Motion respects `prefers-reduced-motion`  
✅ Color is not the only indicator of meaning  

---

## International Support

### Supported Languages (20 Total)
```
en - English
zh - Chinese (Simplified)
hi - Hindi
es - Spanish
fr - French
ar - Arabic (RTL)
bn - Bengali
ru - Russian
pt - Portuguese
id - Indonesian
ur - Urdu (RTL)
de - German
ja - Japanese
sw - Swahili
mr - Marathi
te - Telugu
tr - Turkish
ta - Tamil
vi - Vietnamese
ko - Korean
```

### RTL (Right-to-Left) Support

#### Languages
- Arabic (ar)
- Urdu (ur)

#### Implementation
```css
[dir="rtl"] {
  direction: rtl;
  text-align: start;
}

/* Flip margins */
[dir="rtl"] .ml-auto { margin-left: unset; margin-right: auto; }
[dir="rtl"] .mr-auto { margin-right: unset; margin-left: auto; }

/* Flip flex directions */
[dir="rtl"] .flex-row { flex-direction: row-reverse; }

/* Flip icons */
[dir="rtl"] .lucide { transform: scaleX(-1); }
```

### Internationalization Best Practices

#### Text
- Use translation keys, never hardcode strings
- Provide context for translators
- Account for text expansion (up to 30% longer in some languages)
- Use ICU message format for plurals and variables

#### Dates & Times
- Use locale-aware date formatting
- Display times in user's timezone
- Use ISO 8601 format for data storage

#### Numbers & Currency
- Format numbers according to locale (1,000 vs 1.000)
- Display currency with proper symbols and placement
- Use locale-aware number formatting libraries

#### Images & Media
- Avoid text in images when possible
- Provide translated versions of text-heavy graphics
- Use culturally appropriate imagery

---

## Implementation Resources

### Code Examples

#### Next.js Font Setup
```tsx
import { Anton_SC, Bebas_Neue, Share_Tech, Share_Tech_Mono, Press_Start_2P } from 'next/font/google'

const antonSC = Anton_SC({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton-sc'
})

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue'
})

const shareTech = Share_Tech({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech'
})

const shareTechMono = Share_Tech_Mono({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono'
})

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p'
})

// Apply to layout
<body className={`${antonSC.variable} ${bebasNeue.variable} ${shareTech.variable} ${shareTechMono.variable} ${pressStart2P.variable}`}>
```

#### Tailwind Config
```ts
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      pixel: ['var(--font-press-start-2p)', 'monospace'],
      title: ['var(--font-anton-sc)', 'sans-serif'],
      heading: ['var(--font-bebas-neue)', 'sans-serif'],
      'tech-mono': ['var(--font-share-tech-mono)', 'monospace'],
      'tech': ['var(--font-share-tech)', 'sans-serif'],
    }
  }
}
```

#### CSS Variables
```css
/* globals.css */
@layer base {
  .font-pixel { font-family: var(--font-press-start-2p), monospace; }
  .font-title { font-family: var(--font-anton-sc), sans-serif; }
  .font-heading { font-family: var(--font-bebas-neue), sans-serif; }
  .font-tech { font-family: var(--font-share-tech), sans-serif; }
  .font-tech-mono { font-family: var(--font-share-tech-mono), monospace; }
}
```

### File Generation Scripts

#### Logo PNG Generation
```bash
# Install dependencies
npm install --save-dev sharp

# Run generation script
node scripts/generate-logo-pngs.js
```

### Quality Assurance

#### Pre-Launch Checklist
- [ ] All logos exported in required formats
- [ ] Typography loads correctly on all pages
- [ ] Color contrast meets WCAG AA standards
- [ ] Dark mode works throughout
- [ ] Responsive layouts tested on all breakpoints
- [ ] Keyboard navigation works completely
- [ ] Screen reader testing completed
- [ ] RTL layouts tested for Arabic/Urdu
- [ ] All 20 languages display correctly
- [ ] Performance metrics meet targets (LCP < 2.5s)

---

## Brand Evolution

### Version History
- **v1.0** (Nov 2025): Initial brand guide extracted from ATLVS platform

### Future Considerations
- Custom icon system development
- Motion design system expansion
- 3D/spatial design guidelines
- Video/multimedia brand standards
- Voice/audio branding guidelines

---

## Contact & Support

For questions about brand implementation or to request additional assets:

- **Design Team**: design@ghxstship.com
- **Brand Assets**: brand.ghxstship.com
- **Developer Docs**: docs.ghxstship.com

---

**© 2025 GHXSTSHIP. All rights reserved.**

This brand guide is a living document and will be updated as the brand evolves.
