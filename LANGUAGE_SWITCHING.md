# Language Switching Implementation

This document describes the internationalization (i18n) system implemented in Dragonfly, supporting 20 of the world's most spoken languages.

## Supported Languages

The application supports the following 20 languages:

1. **English** (en) - English
2. **Chinese** (zh) - 中文
3. **Hindi** (hi) - हिन्दी
4. **Spanish** (es) - Español
5. **French** (fr) - Français
6. **Arabic** (ar) - العربية
7. **Bengali** (bn) - বাংলা
8. **Russian** (ru) - Русский
9. **Portuguese** (pt) - Português
10. **Indonesian** (id) - Bahasa Indonesia
11. **Urdu** (ur) - اردو
12. **German** (de) - Deutsch
13. **Japanese** (ja) - 日本語
14. **Swahili** (sw) - Kiswahili
15. **Marathi** (mr) - मराठी
16. **Telugu** (te) - తెలుగు
17. **Turkish** (tr) - Türkçe
18. **Tamil** (ta) - தமிழ்
19. **Vietnamese** (vi) - Tiếng Việt
20. **Korean** (ko) - 한국어

## Architecture

### Technology Stack
- **next-intl**: Production-ready internationalization library for Next.js
- **Locale-based routing**: URLs include the language code (e.g., `/en/dashboard`, `/es/dashboard`)
- **Server-side translations**: Messages are loaded on the server for optimal performance

### File Structure

```
src/
├── i18n/
│   ├── config.ts              # Language configuration and definitions
│   ├── request.ts             # Server-side translation loader
│   └── messages/
│       ├── en.json           # English translations
│       ├── zh.json           # Chinese translations
│       ├── hi.json           # Hindi translations
│       └── ... (18 more language files)
├── components/
│   └── layout/
│       └── language-switcher.tsx  # Language switcher UI component
├── middleware.ts              # Combined i18n + Supabase middleware
└── app/
    ├── layout.tsx            # Root layout with i18n provider
    ├── page.tsx              # Root redirect to default locale
    └── [locale]/             # Locale-specific routes
        ├── layout.tsx        # Locale validation
        ├── (auth)/           # Auth routes
        ├── (dashboard)/      # Dashboard routes
        └── ...
```

## How It Works

### 1. URL Structure
All application routes are prefixed with a locale code:
- English: `https://app.example.com/en/dashboard`
- Spanish: `https://app.example.com/es/dashboard`
- Chinese: `https://app.example.com/zh/dashboard`

### 2. Middleware
The middleware (`src/middleware.ts`) handles:
- **Locale detection**: Detects the user's preferred language from the URL
- **Locale routing**: Redirects users to the appropriate locale-prefixed URL
- **Session management**: Integrates with Supabase authentication

### 3. Language Switcher
The language switcher component is located in the top navigation bar and allows users to:
- View all 20 supported languages with both native and English names
- Switch languages with a single click
- See the currently selected language highlighted

### 4. Translation Loading
Translations are loaded on the server using the `getMessages()` function from next-intl, ensuring:
- Optimal performance (no client-side loading delay)
- SEO-friendly (content is available on first render)
- Type-safe translations

## Usage in Components

### Client Components
```tsx
'use client'

import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('common.search')}</h1>
      <p>{t('nav.profile')}</p>
    </div>
  )
}
```

### Server Components
```tsx
import { useTranslations } from 'next-intl'

export default function MyServerComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('common.search')}</h1>
    </div>
  )
}
```

### With Specific Namespace
```tsx
const t = useTranslations('nav')
// Now use t('profile') instead of t('nav.profile')
```

## Adding New Translations

### 1. Add to Translation Files
Edit each language file in `src/i18n/messages/`:

```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Feature description"
  }
}
```

### 2. Use in Components
```tsx
const t = useTranslations('myFeature')
return <h1>{t('title')}</h1>
```

## Adding a New Language

To add support for a new language:

1. **Update config** (`src/i18n/config.ts`):
```ts
export const locales = [
  // ... existing languages
  'hi', // Add new language code
] as const

export const languageNames = {
  // ... existing languages
  hi: { native: 'नई भाषा', english: 'New Language' },
}
```

2. **Create translation file** (`src/i18n/messages/hi.json`):
```json
{
  "common": { "search": "खोजें", ... },
  "nav": { "profile": "प्रोफ़ाइल", ... },
  ...
}
```

3. **Restart the dev server** for changes to take effect

## Translation Keys Structure

Current translation namespaces:

- **common**: General UI elements (search, save, cancel, etc.)
- **nav**: Navigation items (profile, settings, logout, etc.)
- **status**: Status messages (synced, offline, focus mode, etc.)
- **create**: Create new item labels (task, project, doc, etc.)
- **language**: Language switcher labels

## Best Practices

1. **Always use translations**: Never hardcode user-facing text
2. **Organize by feature**: Group related translations under a namespace
3. **Keep keys descriptive**: Use clear, self-documenting key names
4. **Test RTL languages**: Verify layout works for Arabic and Urdu
5. **Update all languages**: When adding new keys, update all language files

## Performance Considerations

- **Server-side rendering**: Translations are loaded on the server
- **Lazy loading**: Only the active language's translations are loaded
- **Caching**: Next.js caches translated pages for optimal performance
- **Bundle size**: Each language file is ~2-3KB gzipped

## Troubleshooting

### Language not switching
1. Check that the locale code is in the `locales` array in `config.ts`
2. Verify the translation file exists in `src/i18n/messages/`
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### Missing translations
1. Check that the key exists in all language files
2. Verify the namespace is correct
3. Look for typos in the translation key

### Build errors
1. Ensure all translation files have valid JSON syntax
2. Check that `next-intl` is properly installed: `npm install next-intl`
3. Verify `next.config.js` includes the `withNextIntl` wrapper

## Future Enhancements

Potential improvements for the i18n system:

- [ ] Add language detection based on browser settings
- [ ] Store user's language preference in the database
- [ ] Add missing translations warnings in development
- [ ] Implement translation management UI for admins
- [ ] Add pluralization support for complex messages
- [ ] Support for regional variants (e.g., en-US, en-GB)
- [ ] Translation coverage reports
- [ ] Auto-translation suggestions for new keys

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)
