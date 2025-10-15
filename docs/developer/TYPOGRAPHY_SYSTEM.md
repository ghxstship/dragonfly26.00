# Typography System

## Overview

This document defines the standardized typography system for the application. All typography uses Tailwind CSS utility classes - **no hardcoded styles are permitted**.

## Typography Scale

### Display Styles
Used for hero sections, marketing pages, and large promotional content.

- `text-display-2xl` - 72px / 4.5rem - Ultra-large display (line-height: 1.1, tracking: -0.02em, weight: 700)
- `text-display-xl` - 60px / 3.75rem - Extra-large display (line-height: 1.1, tracking: -0.02em, weight: 700)
- `text-display-lg` - 48px / 3rem - Large display (line-height: 1.2, tracking: -0.01em, weight: 700)
- `text-display-md` - 36px / 2.25rem - Medium display (line-height: 1.2, tracking: -0.01em, weight: 700)
- `text-display-sm` - 30px / 1.875rem - Small display (line-height: 1.3, tracking: -0.01em, weight: 600)

### Heading Styles
Used for section headers, card titles, and content hierarchy.

- `text-heading-xl` - 24px / 1.5rem - Page titles (line-height: 1.4, tracking: -0.01em, weight: 600)
- `text-heading-lg` - 20px / 1.25rem - Section headers (line-height: 1.4, tracking: -0.005em, weight: 600)
- `text-heading-md` - 18px / 1.125rem - Subsection headers (line-height: 1.5, weight: 600)
- `text-heading-sm` - 16px / 1rem - Card titles (line-height: 1.5, weight: 600)
- `text-heading-xs` - 14px / 0.875rem - Small headers (line-height: 1.5, weight: 600)

### Body Styles
Used for primary content, paragraphs, and general text.

- `text-body-xl` - 18px / 1.125rem - Large body text (line-height: 1.6, weight: 400)
- `text-body-lg` - 16px / 1rem - Default body text (line-height: 1.6, weight: 400)
- `text-body-md` - 14px / 0.875rem - Small body text (line-height: 1.5, weight: 400)
- `text-body-sm` - 13px / 0.8125rem - Captions (line-height: 1.5, weight: 400)
- `text-body-xs` - 12px / 0.75rem - Fine print (line-height: 1.5, weight: 400)

### Label Styles
Used for form labels, badges, tags, and UI elements.

- `text-label-lg` - 14px / 0.875rem - Large labels (line-height: 1.4, weight: 500)
- `text-label-md` - 13px / 0.8125rem - Default labels (line-height: 1.4, weight: 500)
- `text-label-sm` - 12px / 0.75rem - Small labels (line-height: 1.4, weight: 500)
- `text-label-xs` - 11px / 0.6875rem - Tiny labels (line-height: 1.4, weight: 500)

## Font Families

### Sans Serif (Default)
```tsx
className="font-sans"
```
System font stack: SF Pro, Segoe UI, Roboto, Helvetica Neue, Arial

### Monospace
```tsx
className="font-mono"
```
Used for code, timestamps, and technical data.

## Gradient Text Utilities

For special emphasis and visual hierarchy:

```tsx
// Purple gradient (primary brand)
className="text-gradient-purple"

// Primary color gradient
className="text-gradient-primary"

// Blue gradient
className="text-gradient-blue"

// Green gradient
className="text-gradient-green"

// Orange gradient
className="text-gradient-orange"
```

## Text Truncation

```tsx
// Single line
className="truncate"

// Two lines
className="line-clamp-2"

// Three lines
className="line-clamp-3"
```

## Best Practices

### ✅ DO

```tsx
// Use semantic typography classes
<h1 className="text-display-lg">Hero Title</h1>
<h2 className="text-heading-xl">Page Title</h2>
<p className="text-body-lg text-muted-foreground">Description text</p>

// Combine with Tailwind utilities
<div className="text-heading-md font-bold tracking-tight">
  Card Title
</div>

// Use color utilities
<p className="text-body-md text-muted-foreground">
  Secondary text
</p>
```

### ❌ DON'T

```tsx
// Never use inline styles for typography
<div style={{ fontSize: '18px', fontWeight: 600 }}>Bad</div>

// Never hardcode font sizes
<div className="text-[18px]">Bad</div>

// Don't use arbitrary line heights
<div style={{ lineHeight: '1.4' }}>Bad</div>
```

## Component Usage Examples

### Card Headers
```tsx
<CardHeader>
  <CardTitle className="text-heading-sm">Card Title</CardTitle>
  <CardDescription className="text-body-sm">
    Card description text
  </CardDescription>
</CardHeader>
```

### Page Headers (Module-Level Only)
```tsx
// Module headers only - not in tab components
<div className="mb-6">
  <h1 className="text-heading-xl mb-2">Module Name</h1>
  <p className="text-body-md text-muted-foreground">
    Module description
  </p>
</div>
```

### Tab Components
**Important:** Tab components should NOT have large headers (text-2xl/text-3xl). The module-level navigation already displays the tab name. Tab components should start directly with their content or action buttons.

```tsx
// ✅ CORRECT - No redundant header
export function MyTab() {
  return (
    <div className="space-y-6">
      {/* Optional: Actions only */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Tab description</p>
        <Button>Add Item</Button>
      </div>

      {/* Content starts immediately */}
      <div className="grid gap-4">
        ...
      </div>
    </div>
  )
}

// ❌ INCORRECT - Redundant large header
export function MyTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Tab</h2> {/* Don't do this! */}
      ...
    </div>
  )
}
```

### Buttons and Form Elements
```tsx
<Button className="text-label-md">
  Action Button
</Button>

<Label className="text-label-md">
  Form Label
</Label>
```

### Data Display
```tsx
// Metrics
<div className="text-display-md font-bold">
  1,234
</div>
<p className="text-body-sm text-muted-foreground">
  Total Users
</p>

// Monospace for technical data
<code className="text-body-sm font-mono">
  API_KEY_12345
</code>
```

## Migration Guide

When updating existing components:

1. **Identify the text element's purpose** (display, heading, body, label)
2. **Select appropriate class** from the typography scale
3. **Remove any inline styles** or arbitrary values
4. **Test across breakpoints** to ensure readability
5. **Remove tab headers** that duplicate navigation

### Common Replacements

| Old | New |
|-----|-----|
| `text-xs` | `text-body-xs` or `text-label-xs` |
| `text-sm` | `text-body-sm` or `text-label-sm` |
| `text-base` | `text-body-lg` |
| `text-lg` | `text-heading-sm` |
| `text-xl` | `text-heading-md` |
| `text-2xl` | `text-heading-lg` or `text-display-sm` |
| `text-3xl` | `text-display-md` |
| `text-4xl` | `text-display-lg` |
| `style={{ fontSize: 'X' }}` | Use appropriate text class |

## RTL Support

All typography classes support RTL languages (Arabic, Urdu) automatically through the global RTL utilities in `globals.css`.

## Accessibility

- Maintain proper heading hierarchy (h1 → h2 → h3)
- Use semantic HTML elements
- Ensure sufficient color contrast (test with Tailwind's color utilities)
- Don't rely solely on text size for meaning
- Use `text-balance` for improved readability on headings

## File References

- Configuration: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- Component examples: `src/components/ui/card.tsx`
