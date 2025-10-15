#!/bin/bash

# Typography Verification Script
# Checks for hardcoded styles and typography violations

echo "🔍 Verifying Typography Standards..."
echo ""

ERRORS=0

# Check 1: No inline font-size
echo "1️⃣  Checking for inline font-size..."
if grep -r "fontSize:" src/components/ src/app/ 2>/dev/null; then
  echo "   ❌ Found inline fontSize"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No inline fontSize found"
fi
echo ""

# Check 2: No inline font styles in style props
echo "2️⃣  Checking for inline font styles..."
if grep -r "style={{.*font" src/components/ src/app/ 2>/dev/null | grep -v "font-mono\|fontFamily\|// style={{"; then
  echo "   ❌ Found inline font styles"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No problematic inline font styles"
fi
echo ""

# Check 3: No inline gradients (except in CSS files)
echo "3️⃣  Checking for inline gradient styles..."
if grep -r "style={{.*gradient" src/components/ src/app/ 2>/dev/null | grep -v ".css:"; then
  echo "   ❌ Found inline gradient styles"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No inline gradients found"
fi
echo ""

# Check 4: No WebkitBackgroundClip in inline styles
echo "4️⃣  Checking for WebkitBackgroundClip in inline styles..."
if grep -r "WebkitBackgroundClip\|backgroundClip" src/components/ src/app/ 2>/dev/null | grep "style={{" | grep -v ".css:"; then
  echo "   ❌ Found WebkitBackgroundClip in inline styles"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No WebkitBackgroundClip in inline styles"
fi
echo ""

# Check 5: Warn about tab headers (informational)
echo "5️⃣  Checking for potential tab header violations..."
TAB_HEADERS=$(grep -r "text-2xl\|text-3xl" src/components/ 2>/dev/null | grep -i "tab.tsx" | grep "h2\|h1" | wc -l | tr -d ' ')
if [ "$TAB_HEADERS" -gt 0 ]; then
  echo "   ⚠️  Found $TAB_HEADERS potential tab headers with text-2xl/3xl"
  echo "   📝 Review: Tab components should not have large headers"
else
  echo "   ✅ No obvious tab header violations"
fi
echo ""

# Check 6: Verify typography config exists
echo "6️⃣  Verifying typography config..."
if grep -q "'display-2xl'" tailwind.config.ts 2>/dev/null; then
  echo "   ✅ Typography system configured"
else
  echo "   ❌ Typography system not found in config"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 7: Verify gradient utilities exist
echo "7️⃣  Verifying gradient text utilities..."
if grep -q "text-gradient-purple" src/app/globals.css 2>/dev/null; then
  echo "   ✅ Gradient utilities configured"
else
  echo "   ❌ Gradient utilities not found"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo "✅ All typography checks passed!"
  echo ""
  echo "Typography system is properly configured and"
  echo "no hardcoded styles were detected."
  exit 0
else
  echo "❌ Found $ERRORS typography violation(s)"
  echo ""
  echo "Please review the errors above and fix them."
  echo "See docs/developer/TYPOGRAPHY_SYSTEM.md for guidance."
  exit 1
fi
