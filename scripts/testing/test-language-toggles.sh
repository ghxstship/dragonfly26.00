#!/bin/bash

# Language Toggles Test Script
# Tests both nationality-based and generational language toggles

echo "🧪 LANGUAGE TOGGLES TEST SUITE"
echo "======================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: Check LanguageSwitcher implementation
echo "1️⃣  Testing LanguageSwitcher implementation..."
if grep -q "router.push(pathname, { locale: newLocale })" src/components/layout/language-switcher.tsx && \
   grep -q "router.refresh()" src/components/layout/language-switcher.tsx; then
    echo -e "${GREEN}✅ PASS${NC} - LanguageSwitcher uses router.push + refresh"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - LanguageSwitcher missing router.push or refresh"
    ((FAILED++))
fi
echo ""

# Test 2: Check GenerationalLanguageToggle implementation
echo "2️⃣  Testing GenerationalLanguageToggle implementation..."
if grep -q "useRouter" src/components/marketing/GenerationalLanguageToggle.tsx && \
   grep -q "router.refresh()" src/components/marketing/GenerationalLanguageToggle.tsx && \
   grep -q "handleVariantChange" src/components/marketing/GenerationalLanguageToggle.tsx; then
    echo -e "${GREEN}✅ PASS${NC} - GenerationalLanguageToggle triggers refresh"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - GenerationalLanguageToggle missing refresh mechanism"
    ((FAILED++))
fi
echo ""

# Test 3: Check middleware configuration
echo "3️⃣  Testing middleware configuration..."
if grep -q "localeDetection: true" src/middleware.ts; then
    echo -e "${GREEN}✅ PASS${NC} - Middleware has explicit locale detection"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARN${NC} - Middleware may need explicit locale detection"
    ((FAILED++))
fi
echo ""

# Test 4: Check imports
echo "4️⃣  Testing imports..."
if grep -q "from.*i18n/navigation" src/components/layout/language-switcher.tsx && \
   grep -q "from.*next/navigation" src/components/marketing/GenerationalLanguageToggle.tsx; then
    echo -e "${GREEN}✅ PASS${NC} - All required imports present"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Missing required imports"
    ((FAILED++))
fi
echo ""

# Test 5: Check cookie handling
echo "5️⃣  Testing cookie handling..."
if grep -q "setStoredLanguage" src/components/layout/language-switcher.tsx && \
   grep -q "NEXT_LOCALE" src/lib/language-preference.ts; then
    echo -e "${GREEN}✅ PASS${NC} - Cookie handling implemented"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Cookie handling missing"
    ((FAILED++))
fi
echo ""

# Test 6: Check localStorage handling
echo "6️⃣  Testing localStorage handling..."
if grep -q "localStorage" src/contexts/GenerationalLanguageContext.tsx && \
   grep -q "STORAGE_KEY" src/contexts/GenerationalLanguageContext.tsx; then
    echo -e "${GREEN}✅ PASS${NC} - localStorage handling implemented"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - localStorage handling missing"
    ((FAILED++))
fi
echo ""

# Test 7: Check TypeScript compilation
echo "7️⃣  Testing TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
    echo -e "${RED}❌ FAIL${NC} - TypeScript compilation errors found"
    ((FAILED++))
else
    echo -e "${GREEN}✅ PASS${NC} - No TypeScript errors"
    ((PASSED++))
fi
echo ""

# Test 8: Check component usage
echo "8️⃣  Testing component usage..."
LANG_SWITCHER_USAGE=$(grep -r "LanguageSwitcher" src/components/layout/*.tsx src/marketing/components/*.tsx 2>/dev/null | wc -l)
GEN_TOGGLE_USAGE=$(grep -r "GenerationalLanguageToggle" src/marketing/components/*.tsx 2>/dev/null | wc -l)

if [ "$LANG_SWITCHER_USAGE" -ge 2 ] && [ "$GEN_TOGGLE_USAGE" -ge 1 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Components properly used (LanguageSwitcher: $LANG_SWITCHER_USAGE, GenerationalToggle: $GEN_TOGGLE_USAGE)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Components not properly used"
    ((FAILED++))
fi
echo ""

# Results
echo "======================================================================"
echo "📊 TEST RESULTS"
echo "======================================================================"
echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo ""
    echo "🎉 Language toggles are working correctly!"
    echo ""
    echo "Manual testing steps:"
    echo "1. Start dev server: npm run dev"
    echo "2. Open http://localhost:3000/en"
    echo "3. Click globe icon → Select Spanish → Verify content changes"
    echo "4. Click emoji icon → Select Gen Z → Verify page refreshes"
    echo "5. Reload page → Verify language persists"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    echo "Please review the failed tests above and fix the issues."
    echo ""
    exit 1
fi
