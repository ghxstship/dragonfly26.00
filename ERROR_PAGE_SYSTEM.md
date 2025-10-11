# Error Page System Documentation

## Overview

A comprehensive error page system has been implemented for the Dragonfly application. This system provides beautiful, user-friendly error pages with full internationalization support across all 20 languages.

## Architecture

### Error Pages Structure

```
src/
├── app/
│   ├── not-found.tsx           # Root 404 page (non-localized routes)
│   ├── global-error.tsx        # Global error boundary (critical errors)
│   └── [locale]/
│       ├── not-found.tsx       # Localized 404 page
│       └── error.tsx           # Localized error boundary
└── components/
    └── shared/
        └── error-display.tsx   # Reusable error display component
```

## Error Pages

### 1. Root Not Found (`/src/app/not-found.tsx`)
- **Purpose**: Handles 404 errors for non-localized routes
- **Features**:
  - Clean, centered design with animated error icon
  - Error code display
  - Direct link to home page (default locale)
  - Responsive layout

### 2. Localized Not Found (`/src/app/[locale]/not-found.tsx`)
- **Purpose**: Handles 404 errors within localized routes
- **Features**:
  - Full i18n support using `next-intl`
  - Translated error messages in user's selected language
  - Helpful suggestions list (check URL, go back, visit homepage)
  - Locale-aware home link
  - SEO-optimized metadata

### 3. Localized Error Boundary (`/src/app/[locale]/error.tsx`)
- **Purpose**: Catches runtime errors within localized routes
- **Features**:
  - Client-side error boundary
  - Displays error digest for tracking
  - "Try Again" button to attempt recovery
  - Link to home page
  - Development-only technical details
  - Automatic error logging

### 4. Global Error Boundary (`/src/app/global-error.tsx`)
- **Purpose**: Catches critical errors in root layout
- **Features**:
  - Must include `<html>` and `<body>` tags
  - Hardcoded English text (no i18n available at this level)
  - Inline styles for reliability
  - Recovery options
  - Development-only stack traces

## Internationalization

### Added Error Translations

All error messages are stored in `/src/i18n/messages/{locale}.json` under the `errors` namespace:

```json
{
  "errors": {
    "error404Title": "404 - Page Not Found",
    "error404Description": "Sorry, we couldn't find the page...",
    "error500Title": "500 - Server Error",
    "errorGenericTitle": "Something Went Wrong",
    "errorGenericDescription": "An unexpected error occurred...",
    "goBackHome": "Go Back Home",
    "reloadPage": "Reload Page",
    "contactSupport": "Contact Support",
    "errorCode": "Error Code",
    "whatHappened": "What Happened?",
    "whatYouCanDo": "What You Can Do:",
    "checkUrl": "Check if the URL is correct",
    "goBack": "Go back to the previous page",
    "visitHomepage": "Visit our homepage",
    "reportProblem": "Report this problem",
    "technicalDetails": "Technical Details"
  }
}
```

**Status**: ✅ **Complete** - All 20 language files have been updated with error page translations.

## Design Features

### Visual Design
- **Gradient Background**: Subtle gradient from background to muted colors
- **Animated Icon**: Pulsing glow effect with primary/destructive colors
- **Typography**: Clear hierarchy with 4xl title and lg description
- **Spacing**: Generous whitespace for readability

### Animations
- **Icon**: Scale-in animation with pulse effect
- **Content**: Fade-in transitions (when using framer-motion)
- **Hover States**: Smooth color transitions on buttons

### Accessibility
- **Semantic HTML**: Proper heading hierarchy
- **Focus Indicators**: Visible focus rings on interactive elements
- **Color Contrast**: Meets WCAG standards
- **Screen Reader Support**: Descriptive text and labels

## Error Handling Flow

```
User Action → Error Occurs
        ↓
1. Is it a 404?
   → Yes: Show not-found.tsx (localized if in [locale] route)
   → No: Continue to step 2

2. Is it within [locale] routes?
   → Yes: Show [locale]/error.tsx
   → No: Continue to step 3

3. Is it in root layout?
   → Yes: Show global-error.tsx
   → No: Propagate to parent
```

## Development vs Production

### Development Mode
- Shows full technical details
- Displays error stack traces
- Console error logging

### Production Mode
- Hides technical details
- Shows user-friendly messages only
- Error tracking (ready for services like Sentry)

## Customization

### Changing Colors
The error pages use Tailwind CSS classes and CSS variables:
- Primary errors: `bg-primary`, `text-primary`
- Destructive errors: `bg-destructive`, `text-destructive`
- Update in `src/app/globals.css` or component files

### Adding Custom Actions
In localized error pages, you can add more buttons:

```tsx
<button
  onClick={customAction}
  className="inline-flex items-center..."
>
  <Icon className="w-4 h-4" />
  Custom Action
</button>
```

### Adding Error Tracking
In error.tsx and global-error.tsx, add your error tracking service:

```tsx
useEffect(() => {
  // Example: Sentry
  // Sentry.captureException(error)
  
  // Example: Custom API
  // fetch('/api/log-error', { method: 'POST', body: JSON.stringify(error) })
}, [error])
```

## Testing Error Pages

### Test 404 Page
1. Navigate to a non-existent route: `http://localhost:3000/en/non-existent-page`
2. Should show localized 404 page

### Test Error Boundary
1. Create a component that throws an error
2. Render it in a route
3. Should show the error boundary page

### Test Global Error
1. Throw an error in the root layout
2. Should show the global error page

## Best Practices

1. **Always log errors**: Use the `useEffect` hook in error boundaries
2. **Provide recovery options**: Always give users a way to recover
3. **Keep messages user-friendly**: Avoid technical jargon in production
4. **Test in all languages**: Ensure translations are accurate
5. **Monitor error rates**: Track which errors occur most frequently

## Future Enhancements

Potential improvements to consider:

1. **Error Analytics Dashboard**: Track error frequency and types
2. **Smart Error Recovery**: Attempt automatic recovery for specific errors
3. **Offline Support**: Special error pages for offline scenarios
4. **Error Reporting**: Built-in form for users to report issues
5. **Custom Error Pages**: Per-module custom error pages
6. **A/B Testing**: Test different error message variations
7. **Animated Illustrations**: Custom error illustrations instead of icons

## Related Files

- `/src/app/globals.css` - Theme and color definitions
- `/src/i18n/config.ts` - Locale configuration
- `/src/i18n/messages/*.json` - Translation files
- `/src/components/ui/button.tsx` - Button component used in error pages

## Support

For questions or issues with the error page system, please:
1. Check this documentation
2. Review the implementation files
3. Test in multiple locales
4. Check browser console for logs
