# Country Selector Testing Guide

**Quick reference for validating all 27 locales work correctly**

---

## Quick Test Commands

```bash
# 1. Verify all locales configured
grep "export const locales" src/i18n/config.ts

# 2. Check translation files exist
ls src/i18n/messages/*.json | wc -l
# Expected: 27

# 3. Run audit
node scripts/audit-country-locale-mapping.js
# Expected: ✅ AUDIT PASSED

# 4. Start dev server
npm run dev
```

---

## Browser Testing Checklist

### Priority 1: Previously Broken Countries (CRITICAL)

These 6 countries were causing 404 errors - test first:

1. **🇮🇹 Italy → Italian (`it`)**
   - URL: `http://localhost:3000/it/dashboard`
   - Expected: Page loads, UI in Italian
   - Status: [ ]

2. **🇳🇱 Netherlands → Dutch (`nl`)**
   - URL: `http://localhost:3000/nl/dashboard`
   - Expected: Page loads, UI in Dutch
   - Status: [ ]

3. **🇵🇱 Poland → Polish (`pl`)**
   - URL: `http://localhost:3000/pl/dashboard`
   - Expected: Page loads, UI in Polish
   - Status: [ ]

4. **🇸🇪 Sweden → Swedish (`sv`)**
   - URL: `http://localhost:3000/sv/dashboard`
   - Expected: Page loads, UI in Swedish
   - Status: [ ]

5. **🇩🇰 Denmark → Danish (`da`)**
   - URL: `http://localhost:3000/da/dashboard`
   - Expected: Page loads, UI in Danish
   - Status: [ ]

6. **🇫🇮 Finland → Finnish (`fi`)**
   - URL: `http://localhost:3000/fi/dashboard`
   - Expected: Page loads, UI in Finnish
   - Status: [ ]

### Priority 2: Major Markets

7. **🇺🇸 United States → English (`en`)**
   - URL: `http://localhost:3000/en/dashboard`
   - Expected: Page loads, UI in English
   - Status: [ ]

8. **🇩🇪 Germany → German (`de`)**
   - URL: `http://localhost:3000/de/dashboard`
   - Expected: Page loads, UI in German
   - Status: [ ]

9. **🇫🇷 France → French (`fr`)**
   - URL: `http://localhost:3000/fr/dashboard`
   - Expected: Page loads, UI in French
   - Status: [ ]

10. **🇪🇸 Spain → Spanish (`es`)**
    - URL: `http://localhost:3000/es/dashboard`
    - Expected: Page loads, UI in Spanish
    - Status: [ ]

11. **🇯🇵 Japan → Japanese (`ja`)**
    - URL: `http://localhost:3000/ja/dashboard`
    - Expected: Page loads, UI in Japanese
    - Status: [ ]

12. **🇨🇳 China → Chinese (`zh`)**
    - URL: `http://localhost:3000/zh/dashboard`
    - Expected: Page loads, UI in Chinese
    - Status: [ ]

### Priority 3: RTL Languages (CRITICAL)

13. **🇸🇦 Saudi Arabia → Arabic (`ar`)**
    - URL: `http://localhost:3000/ar/dashboard`
    - Expected: Page loads, UI in Arabic, RTL layout
    - Status: [ ]

14. **🇵🇰 Pakistan → Urdu (`ur`)**
    - URL: `http://localhost:3000/ur/dashboard`
    - Expected: Page loads, UI in Urdu, RTL layout
    - Status: [ ]

### Priority 4: All Other Locales

15. **🇧🇷 Brazil → Portuguese (`pt`)**
    - URL: `http://localhost:3000/pt/dashboard`
    - Status: [ ]

16. **🇰🇷 South Korea → Korean (`ko`)**
    - URL: `http://localhost:3000/ko/dashboard`
    - Status: [ ]

17. **🇻🇳 Vietnam → Vietnamese (`vi`)**
    - URL: `http://localhost:3000/vi/dashboard`
    - Status: [ ]

18. **🇷🇺 Russia → Russian (`ru`)**
    - URL: `http://localhost:3000/ru/dashboard`
    - Status: [ ]

19. **🇮🇳 India → Hindi (`hi`)**
    - URL: `http://localhost:3000/hi/dashboard`
    - Status: [ ]

20. **🇮🇩 Indonesia → Indonesian (`id`)**
    - URL: `http://localhost:3000/id/dashboard`
    - Status: [ ]

21. **🇧🇩 Bangladesh → Bengali (`bn`)**
    - URL: `http://localhost:3000/bn/dashboard`
    - Status: [ ]

22. **🇮🇳 India → Tamil (`ta`)**
    - URL: `http://localhost:3000/ta/dashboard`
    - Status: [ ]

23. **🇮🇳 India → Telugu (`te`)**
    - URL: `http://localhost:3000/te/dashboard`
    - Status: [ ]

24. **🇮🇳 India → Marathi (`mr`)**
    - URL: `http://localhost:3000/mr/dashboard`
    - Status: [ ]

25. **🇹🇷 Turkey → Turkish (`tr`)**
    - URL: `http://localhost:3000/tr/dashboard`
    - Status: [ ]

26. **🇰🇪 Kenya → Swahili (`sw`)**
    - URL: `http://localhost:3000/sw/dashboard`
    - Status: [ ]

27. **🇳🇴 Norway → Norwegian (`no`)**
    - URL: `http://localhost:3000/no/dashboard`
    - Status: [ ]

---

## Country Selector UI Testing

### Test Procedure

1. **Open Country Selector**
   - Click globe icon in navigation
   - Expected: Dropdown opens without errors
   - Status: [ ]

2. **Search Functionality**
   - Type "Italy" in search box
   - Expected: Italy appears in results
   - Status: [ ]

3. **Select Country**
   - Click on Italy (🇮🇹)
   - Expected: 
     - Dropdown closes
     - URL changes to `/it/...`
     - UI translates to Italian
     - No 404 error
   - Status: [ ]

4. **Persistence**
   - Refresh page
   - Expected: Still on Italian locale
   - Status: [ ]

5. **Region Grouping**
   - Open selector
   - Expected: Countries grouped by region
   - Regions: North America, Europe, Asia, Middle East, South America, Oceania, Africa
   - Status: [ ]

---

## Automated Test Script

Create a test file: `test-locales.sh`

```bash
#!/bin/bash

echo "Testing all 27 locales..."

LOCALES=(en es fr zh hi ar ko vi pt de ja ru id ur bn ta te mr tr sw no da fi sv it nl pl)
BASE_URL="http://localhost:3000"

for locale in "${LOCALES[@]}"; do
  echo -n "Testing $locale... "
  
  # Test if URL returns 200
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$locale/dashboard")
  
  if [ "$status" -eq 200 ]; then
    echo "✅ OK"
  else
    echo "❌ FAILED (HTTP $status)"
  fi
done

echo "Testing complete!"
```

Run with:
```bash
chmod +x test-locales.sh
./test-locales.sh
```

---

## Common Issues & Solutions

### Issue: 404 Error on Locale
**Symptoms:** URL shows 404 Not Found
**Causes:**
1. Locale not in middleware matcher
2. Translation file missing
3. Locale not in i18n config

**Fix:**
```bash
# Check locale in config
grep "'$LOCALE'" src/i18n/config.ts

# Check translation file exists
ls src/i18n/messages/$LOCALE.json

# Check middleware matcher
grep "'$LOCALE'" src/middleware.ts
```

### Issue: UI Not Translating
**Symptoms:** Page loads but stays in English
**Causes:**
1. Translation file empty or invalid
2. Translation keys missing
3. Component not using `useTranslations`

**Fix:**
```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/$LOCALE.json'))"

# Check key count
node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('src/i18n/messages/$LOCALE.json'))).length)"
```

### Issue: RTL Not Working
**Symptoms:** Arabic/Urdu display left-to-right
**Causes:**
1. Locale not in rtlLocales array
2. RTL styles not applied

**Fix:**
```bash
# Check RTL config
grep "rtlLocales" src/i18n/config.ts
```

### Issue: Redirect Loop
**Symptoms:** Page keeps redirecting
**Causes:**
1. Middleware configuration issue
2. Default locale not set

**Fix:**
```bash
# Check middleware config
grep "localePrefix" src/middleware.ts
# Should be: localePrefix: 'always'
```

---

## Success Criteria

### All Tests Pass When:

✅ **Routing**
- All 27 locale URLs return HTTP 200
- No 404 errors
- No redirect loops

✅ **Translation**
- UI elements translate correctly
- Navigation translates
- Form labels translate
- Error messages translate

✅ **Country Selector**
- Opens without errors
- Shows all countries
- Search works
- Selection changes locale
- Persistence works

✅ **RTL**
- Arabic displays RTL
- Urdu displays RTL
- Layout mirrors correctly

✅ **Performance**
- Page loads < 2 seconds
- No console errors
- No network errors

---

## Reporting Issues

If you find issues, report with:

1. **Locale Code:** e.g., `it`
2. **Country:** e.g., Italy 🇮🇹
3. **URL:** e.g., `http://localhost:3000/it/dashboard`
4. **Expected:** What should happen
5. **Actual:** What actually happened
6. **Console Errors:** Any JavaScript errors
7. **Network Tab:** Any failed requests
8. **Screenshot:** If visual issue

---

## Quick Validation

**Fastest way to verify everything works:**

```bash
# 1. Run audit
node scripts/audit-country-locale-mapping.js

# 2. Test the 6 previously broken locales
curl -I http://localhost:3000/it/dashboard  # Should be 200
curl -I http://localhost:3000/nl/dashboard  # Should be 200
curl -I http://localhost:3000/pl/dashboard  # Should be 200
curl -I http://localhost:3000/sv/dashboard  # Should be 200
curl -I http://localhost:3000/da/dashboard  # Should be 200
curl -I http://localhost:3000/fi/dashboard  # Should be 200

# 3. Test RTL
curl -I http://localhost:3000/ar/dashboard  # Should be 200
curl -I http://localhost:3000/ur/dashboard  # Should be 200

# 4. Test invalid locale (should redirect)
curl -I http://localhost:3000/xx/dashboard  # Should be 307 or 302
```

**Expected Results:**
- All valid locales: HTTP 200
- Invalid locale: HTTP 307/302 (redirect)
- No HTTP 404 errors

---

## Done! 🎉

Once all tests pass, the country selector is 100% functional with:
- ✅ 27 locales supported
- ✅ 30+ countries configured
- ✅ Zero 404 errors
- ✅ Seamless language switching
- ✅ RTL support
- ✅ Production ready
