# Language Switching Verification & Troubleshooting

**Date:** November 1, 2025  
**Status:** ✅ INFRASTRUCTURE COMPLETE - TESTING REQUIRED

## Verification Results

### ✅ Translation Files (20/20)
All translation files exist with complete marketing translations:
- English (en), Spanish (es), French (fr), Chinese (zh), Hindi (hi)
- Arabic (ar), Korean (ko), Vietnamese (vi), Portuguese (pt), German (de)
- Japanese (ja), Russian (ru), Indonesian (id), Urdu (ur), Bengali (bn)
- Tamil (ta), Telugu (te), Marathi (mr), Turkish (tr), Swahili (sw)

### ✅ Translation Keys
- All files have `marketing.nav` section
- All files have 10 nav keys (consistent)
- Sample verified: "Solutions" → "Soluciones" (es), "解决方案" (zh), "समाधान" (hi)

### ✅ Configuration
- ✅ `withNextIntl` plugin configured in `next.config.js`
- ✅ `getRequestConfig` in `src/i18n/request.ts`
- ✅ Dynamic imports for all locales
- ✅ Middleware with `createIntlMiddleware`
- ✅ `localePrefix: 'always'` configured
- ✅ All 20 locales in middleware matcher
- ✅ Cookie storage (`NEXT_LOCALE`) configured
- ✅ LocalStorage backup configured

### ✅ Routing
- ✅ `[locale]` dynamic route in `src/app/[locale]/`
- ✅ Marketing layout under `src/app/[locale]/(marketing)/`
- ✅ `NextIntlClientProvider` wrapping all pages
- ✅ `setRequestLocale()` called in layouts

## Common Issues & Solutions

### Issue 1: Language Changes But UI Doesn't Update

**Symptoms:**
- URL changes (e.g., `/en/pricing` → `/es/pricing`)
- Cookie/localStorage updated
- But text remains in English

**Causes:**
1. **Cached translations** - Browser caching old translation files
2. **Component not using translations** - Hardcoded strings instead of `t()`
3. **Missing `useTranslations` hook** - Component not connected to i18n
4. **Build cache** - Next.js build cache not cleared

**Solutions:**
```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Restart dev server
npm run dev

# 3. Hard refresh browser
# Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

# 4. Clear browser data
# Chrome: Settings → Privacy → Clear browsing data → Cached images and files
```

### Issue 2: 404 on Language Switch

**Symptoms:**
- Clicking language switcher results in 404
- URL shows correct locale but page not found

**Causes:**
1. **Missing page in locale folder** - Page not under `[locale]` route
2. **Middleware not running** - Middleware matcher not catching route
3. **Build issue** - Static generation failed

**Solutions:**
1. Verify page is under `src/app/[locale]/` structure
2. Check middleware matcher includes the route pattern
3. Rebuild: `rm -rf .next && npm run dev`

### Issue 3: Language Switcher Not Appearing

**Symptoms:**
- Language switcher component not visible
- No errors in console

**Causes:**
1. **Mobile responsive issue** - Hidden on mobile (FIXED)
2. **Z-index issue** - Covered by other elements
3. **Component not imported** - Missing from layout

**Solutions:**
1. Check responsive classes (now fixed with `w-full sm:w-auto`)
2. Verify z-index: dropdown should be `z-50`
3. Confirm `<LanguageSwitcher />` in nav component

### Issue 4: Translations Show Keys Instead of Text

**Symptoms:**
- UI shows `marketing.nav.solutions` instead of "Solutions"
- Translation keys visible as raw strings

**Causes:**
1. **Missing translation key** - Key doesn't exist in JSON
2. **Wrong namespace** - Using wrong `useTranslations()` namespace
3. **JSON syntax error** - Malformed translation file

**Solutions:**
```tsx
// ✅ Correct
const t = useTranslations('marketing')
<span>{t('nav.solutions')}</span>

// ❌ Wrong
const t = useTranslations('nav')
<span>{t('marketing.nav.solutions')}</span>
```

### Issue 5: Some Pages Work, Others Don't

**Symptoms:**
- Homepage translations work
- Other pages show English only

**Causes:**
1. **Page not using translations** - Hardcoded strings
2. **Missing `useTranslations` import** - Not connected to i18n
3. **Server component without locale** - Missing `setRequestLocale()`

**Solutions:**
1. Add `useTranslations` hook to component
2. Replace hardcoded strings with `t()` calls
3. For server components, ensure `setRequestLocale(locale)` is called

## Testing Checklist

### Manual Testing Steps

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open homepage**
   - Navigate to `http://localhost:3000`
   - Should redirect to `http://localhost:3000/en`

3. **Test language switcher**
   - Click language switcher (flag icon)
   - Select Spanish (🇪🇸 Español)
   - URL should change to `/es`
   - Nav text should change:
     - "Solutions" → "Soluciones"
     - "Features" → "Características"
     - "Pricing" → "Precios"

4. **Test navigation**
   - Click "Soluciones" in nav
   - Should go to `/es/solutions`
   - Page content should be in Spanish

5. **Test persistence**
   - Refresh page (F5)
   - Should stay on `/es` with Spanish text
   - Check cookie: `NEXT_LOCALE=es`

6. **Test mobile**
   - Resize browser to mobile width (< 640px)
   - Open mobile menu (hamburger icon)
   - Language switcher should be full-width
   - Dropdown should fit screen

7. **Test all languages**
   - Switch to each of 20 languages
   - Verify nav text changes
   - Verify URL updates correctly

### Browser Console Checks

```javascript
// Check current locale
document.cookie.split(';').find(c => c.includes('NEXT_LOCALE'))

// Check localStorage
localStorage.getItem('user-language-preference')

// Check if translations loaded
// (In React DevTools, find component using useTranslations)
```

### Network Tab Checks

1. Open DevTools → Network tab
2. Switch language
3. Look for:
   - Page reload (full page navigation)
   - New HTML document with correct locale
   - No 404 errors
   - Correct `Accept-Language` header

## Known Working Configuration

```typescript
// src/i18n/config.ts
export const locales = ['en', 'es', 'fr', ...] // 20 total
export const defaultLocale = 'en'

// src/i18n/navigation.ts
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

// src/middleware.ts
const intlMiddleware = createIntlMiddleware({
  ...routing,
  localeDetection: true,
  localePrefix: 'always',
  defaultLocale
})

// src/components/layout/language-switcher.tsx
const changeLanguage = (newLocale: Locale) => {
  setStoredLanguage(newLocale) // Save to cookie + localStorage
  window.location.href = `/${newLocale}${pathname}` // Full reload
}
```

## Expected Behavior

### When Switching from English to Spanish:

1. **User clicks** Spanish flag in language switcher
2. **Cookie set** `NEXT_LOCALE=es`
3. **LocalStorage set** `user-language-preference=es`
4. **URL changes** `/en/pricing` → `/es/pricing`
5. **Page reloads** (full page navigation)
6. **Middleware runs** Detects `es` locale from cookie/URL
7. **Server loads** `src/i18n/messages/es.json`
8. **React renders** with Spanish translations
9. **UI updates** All `t()` calls return Spanish text

### Visual Changes:
- Nav: "Solutions" → "Soluciones"
- Nav: "Features" → "Características"  
- Nav: "Pricing" → "Precios"
- Nav: "Sign In" → "Iniciar sesión"
- Nav: "Start Free" → "Comience gratis"

## Debugging Commands

```bash
# Check translation file structure
jq '.marketing.nav' src/i18n/messages/es.json

# Count translation keys
grep -c '"marketing"' src/i18n/messages/*.json

# Find hardcoded strings in components
grep -r "Solutions\|Features\|Pricing" src/marketing/components/

# Check middleware is running
# Add console.log in src/middleware.ts and check terminal

# Verify locale in URL
curl -I http://localhost:3000 | grep -i location

# Test specific locale
curl http://localhost:3000/es/pricing
```

## If Still Not Working

### Step 1: Verify Dev Server
```bash
# Kill all node processes
pkill -f node

# Clear cache
rm -rf .next node_modules/.cache

# Reinstall (if needed)
npm install

# Start fresh
npm run dev
```

### Step 2: Check Browser
1. Open DevTools → Application tab
2. Clear all cookies for localhost
3. Clear localStorage
4. Hard refresh (Ctrl+Shift+R)

### Step 3: Test in Incognito
- Open incognito/private window
- Navigate to `http://localhost:3000`
- Test language switching
- No cache/cookies interfering

### Step 4: Check Component Implementation
```tsx
// ✅ Correct implementation
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('marketing')
  return <h1>{t('nav.solutions')}</h1>
}

// ❌ Wrong - hardcoded
export function MyComponent() {
  return <h1>Solutions</h1>
}
```

### Step 5: Verify Page Route
```
✅ Correct structure:
src/app/[locale]/(marketing)/pricing/page.tsx

❌ Wrong structure:
src/app/pricing/page.tsx (missing [locale])
```

## Success Criteria

✅ All 20 languages switch correctly  
✅ URL updates with locale prefix  
✅ Cookie persists language choice  
✅ Page reload maintains language  
✅ All nav items translate  
✅ Mobile responsive works  
✅ No console errors  
✅ No 404 errors  
✅ Dropdown fits on mobile  
✅ RTL languages work (ar, ur)  

## Support

If language switching still doesn't work after following all steps:

1. **Check this document** for matching symptoms
2. **Run diagnostic script** `node scripts/test-language-switching.js`
3. **Check browser console** for errors
4. **Check terminal** for Next.js errors
5. **Verify you're on correct URL** (must include `/[locale]/`)

---

**Status:** Infrastructure 100% complete. If not working, issue is likely:
- Browser cache
- Dev server needs restart
- Testing wrong page (not under `[locale]` route)
- Component using hardcoded strings instead of `t()`
