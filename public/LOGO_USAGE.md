# ATLVS Logo Usage Guide

This document describes the ATLVS logo files and their intended usage.

## Logo Files

### SVG Files (Vector - Use These When Possible)

#### Primary Logos
- **`logo.svg`** - Main colorful gradient logo
  - **Use for:** Headers, landing pages, marketing materials
  - **Colors:** Vibrant gradient (orange → yellow → cyan → purple → pink)
  - **Dimensions:** 400×100px (4:1 ratio)

- **`logo-dark.svg`** - White logo for dark backgrounds
  - **Use for:** Dark mode, dark hero sections, dark footers
  - **Color:** White (#ffffff)

- **`logo-light.svg`** - Dark logo for light backgrounds  
  - **Use for:** Light mode, light backgrounds, documents
  - **Color:** Dark gray (#1a1a1a)

#### Icon/Favicon
- **`logo-icon.svg`** - Square "A" icon with gradient
  - **Use for:** Favicons, app icons, social media avatars
  - **Dimensions:** 100×100px (1:1 ratio)

### PNG Files (Raster - Generated)

#### Full Logos
- `logo-sm.png` (200px wide)
- `logo-md.png` (400px wide) 
- `logo-lg.png` (800px wide)
- `logo-xl.png` (1200px wide)

#### Icons/Favicons (PWA & Browser)
- `icon-32.png` through `icon-512.png` - Various sizes for PWA
- `favicon.png` - 32×32 favicon
- `favicon.ico` - Multi-size ICO (generated separately)

## Font Information

The ATLVS logo uses the **Silkscreen** font family from Google Fonts, which provides a pixel/retro aesthetic similar to Coral Pixels.

- **Font:** Silkscreen
- **Weight:** 700 (Bold)
- **Import:** `@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');`
- **Fallback:** 'Courier New', monospace

## Regenerating Logo PNGs

If you update the SVG files and need new PNG versions:

```bash
# Install dependencies (first time only)
npm install --save-dev sharp

# Generate all PNG versions
node scripts/generate-logo-pngs.js
```

## Usage in Code

### Next.js / React

```tsx
// SVG (recommended)
import Image from 'next/image';

<Image 
  src="/logo.svg" 
  alt="ATLVS" 
  width={400} 
  height={100}
  priority
/>

// Or as a regular img
<img src="/logo.svg" alt="ATLVS" className="h-12" />
```

### HTML

```html
<!-- SVG -->
<img src="/logo.svg" alt="ATLVS" width="400" height="100">

<!-- PNG -->
<img src="/logo-md.png" alt="ATLVS" width="400" height="100">
```

### CSS Background

```css
.logo {
  background-image: url('/logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 400px;
  height: 100px;
}
```

## File Locations

All logo files are stored in `/public/`:

```
public/
├── logo.svg              # Main color gradient logo
├── logo-dark.svg         # White logo (dark backgrounds)
├── logo-light.svg        # Dark logo (light backgrounds)  
├── logo-icon.svg         # Square icon/favicon
├── logo-*.png           # Generated PNG logos
├── icon-*.png           # Generated PWA icons
├── favicon.png          # Browser favicon
└── favicon.ico          # Multi-size ICO favicon
```

## Design Specifications

### Colors (Gradient)
The main logo uses a 6-color gradient:
1. `#FF6B35` - Orange red
2. `#F7931E` - Orange  
3. `#FDC830` - Yellow
4. `#4ECDC4` - Cyan
5. `#7C3AED` - Purple
6. `#C44569` - Pink

### Spacing
- Letter spacing: 2px
- Recommended padding: 20px minimum around logo

### Minimum Sizes
- Full logo: 150px wide minimum
- Icon: 24px × 24px minimum

## Future Formats

If additional formats are needed in the future:

### WebP (Web Performance)
```bash
# Using sharp or imagemagick
sharp logo.svg -o logo.webp
```

### AVIF (Next-gen format)
```bash
sharp logo.svg -o logo.avif
```

### PDF (Print)
Export directly from the SVG using a tool like Inkscape or Illustrator.

## Notes

- SVG files are preferred for web use (scalable, small file size)
- PNG files are auto-generated from SVGs using the generation script
- The icon uses just the letter "A" from ATLVS for compact representation
- All files use transparent backgrounds by default
