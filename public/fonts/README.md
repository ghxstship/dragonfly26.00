# Fonts Directory

## Coral Pixels

**Source:** [Google Fonts - Coral Pixels](https://fonts.google.com/specimen/Coral+Pixels)

**License:** SIL Open Font License 1.1

**Usage:** Used for the ATLVS logo and pixel-style branding elements.

**File:** `CoralPixels-Regular.woff2`

### Implementation

The font is loaded via Next.js `localFont` in `src/app/layout.tsx` and made available through:
- CSS Variable: `--font-coral-pixels`
- Tailwind Class: `font-pixel`

### Example Usage

```tsx
<div className="font-pixel">ATLVS</div>
```

### Re-downloading

If you need to re-download the font:

```bash
curl -o public/fonts/CoralPixels-Regular.woff2 "https://fonts.gstatic.com/s/coralpixels/v1/xn7gYHE41Ti1AJmMdI8_Cg.woff2"
```
