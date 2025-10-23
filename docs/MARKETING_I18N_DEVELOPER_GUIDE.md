# Marketing i18n Developer Guide

Quick reference for using internationalization in marketing pages.

---

## 🚀 Quick Start

### 1. Import the Hook

```tsx
import { useTranslations } from 'next-intl'
```

### 2. Use in Component

```tsx
export default function MarketingPage() {
  const t = useTranslations('marketing')
  
  return (
    <div>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subheadline')}</p>
    </div>
  )
}
```

---

## 📋 Available Translation Keys

### Navigation
```tsx
t('nav.logo')          // "ATLVS"
t('nav.features')      // "Features"
t('nav.pricing')       // "Pricing"
t('nav.docs')          // "Docs"
t('nav.blog')          // "Blog"
t('nav.about')         // "About"
t('nav.signIn')        // "Sign In"
t('nav.startFree')     // "Start Free"
```

### Hero Section
```tsx
t('hero.headline')           // "The Project Management System for"
t('hero.headlineHighlight')  // "Experiential Production Teams"
t('hero.subheadline')        // Full subheadline text
t('hero.ctaPrimary')         // "Start Free Today"
t('hero.ctaSecondary')       // "Schedule a Demo"
```

### Features
```tsx
t('features.production.title')        // "Production Hub"
t('features.production.description')  // Description text
t('features.production.feature1')     // "Project & event planning"
```

### Roles
```tsx
t('roles.gladiator.title')        // "Gladiator"
t('roles.gladiator.description')  // Role description
```

### Pricing
```tsx
t('pricing.starter.name')      // "Starter"
t('pricing.starter.price')     // "$29"
t('pricing.starter.feature1')  // Feature text
```

### Footer
```tsx
t('footer.tagline')    // Tagline text
t('footer.features')   // "Features"
t('footer.copyright')  // "© 2025 ATLVS. All rights reserved."
```

---

## 🌍 Supported Languages

All 20 languages from main app:

| Code | Language | Native Name | RTL |
|------|----------|-------------|-----|
| en | English | English | No |
| zh | Chinese | 中文 | No |
| hi | Hindi | हिन्दी | No |
| es | Spanish | Español | No |
| fr | French | Français | No |
| ar | Arabic | العربية | **Yes** |
| bn | Bengali | বাংলা | No |
| ru | Russian | Русский | No |
| pt | Portuguese | Português | No |
| id | Indonesian | Bahasa Indonesia | No |
| ur | Urdu | اردو | **Yes** |
| de | German | Deutsch | No |
| ja | Japanese | 日本語 | No |
| sw | Swahili | Kiswahili | No |
| mr | Marathi | मराठी | No |
| te | Telugu | తెలుగు | No |
| tr | Turkish | Türkçe | No |
| ta | Tamil | தமிழ் | No |
| vi | Vietnamese | Tiếng Việt | No |
| ko | Korean | 한국어 | No |

---

## 🎨 Complete Key Structure

```
marketing
├── nav (11 keys)
├── hero (11 keys)
├── trustBar (1 key)
├── problem (9 keys)
├── solution (9 keys)
├── howItWorks (10 keys)
├── features (30 keys)
│   ├── production (6 keys)
│   ├── business (6 keys)
│   ├── network (6 keys)
│   ├── intelligence (6 keys)
│   └── system (6 keys)
├── roles (25 keys)
│   ├── legend (2 keys)
│   ├── phantom (2 keys)
│   ├── aviator (2 keys)
│   ├── gladiator (2 keys)
│   ├── navigator (2 keys)
│   ├── deviator (2 keys)
│   ├── raider (2 keys)
│   ├── vendor (2 keys)
│   ├── visitor (2 keys)
│   ├── partner (2 keys)
│   └── ambassador (2 keys)
├── security (14 keys)
├── testimonials (8 keys)
├── pricing (40+ keys)
│   ├── starter (9 keys)
│   ├── professional (10 keys)
│   └── enterprise (9 keys)
├── faq (14 keys)
├── cta (5 keys)
├── footer (21 keys)
└── integrations (3 keys)

Total: 212 translation keys
```

---

## 💡 Best Practices

### 1. Always Use Translation Keys

❌ **Don't:**
```tsx
<h1>Features</h1>
```

✅ **Do:**
```tsx
<h1>{t('nav.features')}</h1>
```

### 2. Use Semantic Key Names

```tsx
// Good - descriptive and hierarchical
t('pricing.starter.feature1')
t('roles.gladiator.description')

// Bad - unclear
t('text1')
t('p2')
```

### 3. Handle Plurals

```tsx
// If needed, add plural keys
t('users.count', { count: 5 })  // "5 users"
```

### 4. RTL Language Support

For Arabic and Urdu, ensure your CSS supports RTL:

```tsx
import { isRTL } from '@/i18n/config'
import { useLocale } from 'next-intl'

export default function Component() {
  const locale = useLocale()
  const rtl = isRTL(locale)
  
  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      {/* Content */}
    </div>
  )
}
```

---

## 🔧 Adding New Translation Keys

### 1. Add to English File

Edit `src/i18n/messages/en.json`:

```json
{
  "marketing": {
    "newSection": {
      "title": "New Section Title",
      "description": "Description text"
    }
  }
}
```

### 2. Propagate to All Languages

Run the script:

```bash
node scripts/add-marketing-i18n-to-all-languages.js
```

This will add your new keys to all 20 language files.

### 3. Get Professional Translations

For production, replace English placeholders with professional translations in each language file.

---

## 🧪 Testing

### Verify All Languages Have Marketing

```bash
node scripts/verify-marketing-i18n.js
```

### Check Specific Language

```bash
# Count marketing keys in Spanish
node -e "console.log(Object.keys(require('./src/i18n/messages/es.json').marketing).length)"
```

### Test in Browser

1. Switch language in UI
2. Navigate to marketing pages
3. Verify translations load correctly
4. Test RTL languages (ar, ur)

---

## 📚 Related Files

- **Config:** `src/i18n/config.ts`
- **Navigation:** `src/i18n/navigation.ts`
- **Request:** `src/i18n/request.ts`
- **Middleware:** `src/middleware.ts`
- **Messages:** `src/i18n/messages/*.json`

---

## 🆘 Troubleshooting

### Translation Not Showing

1. Check key exists in `en.json`
2. Verify `useTranslations('marketing')` is called
3. Check browser console for errors
4. Verify locale is set correctly

### RTL Layout Issues

1. Add `dir` attribute to container
2. Use logical CSS properties (margin-inline-start vs margin-left)
3. Test with Arabic/Urdu locales

### Missing Keys

Run verification:
```bash
node scripts/verify-marketing-i18n.js
```

---

## ✅ Checklist for New Marketing Pages

- [ ] Import `useTranslations` from 'next-intl'
- [ ] Call `const t = useTranslations('marketing')`
- [ ] Replace all hardcoded text with `t('key')`
- [ ] Test with multiple languages
- [ ] Test RTL languages (ar, ur)
- [ ] Verify accessibility (ARIA labels)
- [ ] Run verification script

---

## 🎯 Quick Reference

```tsx
// Basic usage
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('marketing')
  return <h1>{t('hero.headline')}</h1>
}

// With locale detection
import { useLocale } from 'next-intl'
import { isRTL } from '@/i18n/config'

export default function Page() {
  const t = useTranslations('marketing')
  const locale = useLocale()
  const rtl = isRTL(locale)
  
  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <h1>{t('hero.headline')}</h1>
    </div>
  )
}

// With language switcher
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  
  const switchLanguage = (locale: string) => {
    router.replace(pathname, { locale })
  }
  
  return (
    <select onChange={(e) => switchLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      {/* ... */}
    </select>
  )
}
```

---

**For complete documentation, see:** `MARKETING_I18N_COMPLETE_2025_01_23.md`
