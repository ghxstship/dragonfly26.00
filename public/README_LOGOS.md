# ATLVS Logos - Quick Reference

## 🎯 Which Logo Should I Use?

| Use Case | File | Notes |
|----------|------|-------|
| **Website header** | `logo.svg` | Colorful gradient version |
| **Dark mode header** | `logo-dark.svg` | White text for dark backgrounds |
| **Light mode header** | `logo-light.svg` | Dark text for light backgrounds |
| **Favicon/App Icon** | `logo-icon.svg` | Square "A" icon |
| **Email signature** | `logo-md.png` | 400px PNG version |
| **Print materials** | `logo.svg` | Vector scales to any size |
| **Social media profile** | `icon-512.png` | Large square icon |
| **Browser tab** | `favicon.png` or `favicon.ico` | Small icon |

## 📁 All Available Files

### Vector (SVG) - Preferred
```
logo.svg           → Full color gradient logo
logo-dark.svg      → White logo (for dark backgrounds)
logo-light.svg     → Black logo (for light backgrounds)  
logo-icon.svg      → Square icon with "A"
```

### Raster (PNG) - Auto-generated
```
Logo sizes:
- logo-sm.png      → 200px wide
- logo-md.png      → 400px wide
- logo-lg.png      → 800px wide
- logo-xl.png      → 1200px wide

Icon sizes (PWA/Favicon):
- icon-32.png through icon-512.png
- favicon.png (32×32)
```

## ⚡ Quick Commands

```bash
# Preview all logos in browser
npm run dev
# Then open: http://localhost:3000/logo-preview.html

# Regenerate PNG files (if SVGs are updated)
npm run generate-logos
```

## 💻 Code Examples

### React/Next.js
```tsx
<Image src="/logo.svg" alt="ATLVS" width={400} height={100} />
```

### HTML
```html
<img src="/logo.svg" alt="ATLVS" width="400" height="100">
```

### Favicon in HTML
```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.png" type="image/png">
```

## 📖 Full Documentation

- **`LOGO_USAGE.md`** - Complete usage guide with specifications
- **`logo-preview.html`** - Visual preview of all logo variants
- **`LOGO_IMPLEMENTATION.md`** - Implementation details and summary

## 🎨 Font

**Silkscreen** (Google Fonts) - Bold 700
- Pixel/retro aesthetic matching the reference design
- Letter spacing: 2px

---

**Need help?** Check `LOGO_USAGE.md` for detailed information.
