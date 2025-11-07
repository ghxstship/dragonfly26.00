#!/bin/bash

# COMPREHENSIVE HOOK AUDIT - ALL COMPONENTS INCLUDING DRAWERS

echo "🔍 COMPREHENSIVE HOOK AUDIT - ALL COMPONENT TYPES"
echo "=================================================="
echo ""

echo "📊 CHECKING ALL COMPONENT TYPES..."
echo ""

# Check for useModuleData (should only be in workspace wrappers)
echo "1️⃣ useModuleData Usage:"
echo "   Files using useModuleData:"
grep -r "useModuleData" src/components --include="*.tsx" -l | while read file; do
  echo "   - $file"
done
echo ""

# Check for generic CRUD hooks (should not exist)
echo "2️⃣ Generic CRUD Hooks (useCreateItem, useUpdateItem, useDeleteItem):"
count=$(grep -r "useCreateItem\|useUpdateItem\|useDeleteItem" src/components --include="*.tsx" | wc -l)
if [ "$count" -eq 0 ]; then
  echo "   ✅ NONE FOUND (correct)"
else
  echo "   ❌ FOUND $count instances:"
  grep -r "useCreateItem\|useUpdateItem\|useDeleteItem" src/components --include="*.tsx" -l
fi
echo ""

# Check drawer components specifically
echo "3️⃣ Drawer Components:"
echo "   Checking all drawer files..."
for file in src/components/**/*drawer*.tsx src/components/**/*Drawer*.tsx; do
  if [ -f "$file" ]; then
    echo "   📄 $(basename $file)"
    # Check if it uses any hooks
    hooks=$(grep -o "use[A-Z][a-zA-Z]*" "$file" | sort -u | grep -v "useState\|useEffect\|useCallback\|useMemo\|useRef\|useContext\|useTranslations\|useLocale\|useParams\|useRouter\|usePathname\|useSearchParams")
    if [ -z "$hooks" ]; then
      echo "      ✅ No data hooks (receives props)"
    else
      echo "      Hooks found:"
      echo "$hooks" | while read hook; do
        echo "      - $hook"
      done
    fi
  fi
done
echo ""

# Check action components
echo "4️⃣ Action Components:"
find src/components -name "*action*.tsx" -o -name "*Action*.tsx" | while read file; do
  echo "   📄 $(basename $file)"
  hooks=$(grep -o "use[A-Z][a-zA-Z]*Data" "$file" | sort -u)
  if [ -z "$hooks" ]; then
    echo "      ✅ No data hooks or using props"
  else
    echo "      Hooks: $hooks"
  fi
done
echo ""

# Check detail components
echo "5️⃣ Detail Components:"
find src/components -name "*detail*.tsx" -o -name "*Detail*.tsx" | head -10 | while read file; do
  echo "   📄 $(basename $file)"
  hooks=$(grep -o "use[A-Z][a-zA-Z]*Data" "$file" | sort -u)
  if [ -z "$hooks" ]; then
    echo "      ✅ No data hooks or using props"
  else
    echo "      Hooks: $hooks"
  fi
done
echo ""

# Check form components
echo "6️⃣ Form Components:"
find src/components -name "*form*.tsx" -o -name "*Form*.tsx" | head -10 | while read file; do
  echo "   📄 $(basename $file)"
  hooks=$(grep -o "use[A-Z][a-zA-Z]*Data" "$file" | sort -u)
  if [ -z "$hooks" ]; then
    echo "      ✅ No data hooks or using props"
  else
    echo "      Hooks: $hooks"
  fi
done
echo ""

# Check dialog components
echo "7️⃣ Dialog Components:"
find src/components -name "*dialog*.tsx" -o -name "*Dialog*.tsx" | head -10 | while read file; do
  echo "   📄 $(basename $file)"
  hooks=$(grep -o "use[A-Z][a-zA-Z]*Data" "$file" | sort -u)
  if [ -z "$hooks" ]; then
    echo "      ✅ No data hooks or using props"
  else
    echo "      Hooks: $hooks"
  fi
done
echo ""

# Summary of correct hook usage by module
echo "8️⃣ Module-Specific Hook Usage Summary:"
echo ""
modules=("assets" "events" "files" "finance" "locations" "people" "projects" "companies" "jobs" "procurement" "community" "marketplace" "resources" "analytics" "reports" "insights" "admin" "settings" "profile" "dashboard")

for module in "${modules[@]}"; do
  if [ -d "src/components/$module" ]; then
    count=$(find "src/components/$module" -name "*.tsx" -exec grep -l "use.*Data" {} \; | wc -l)
    if [ "$count" -gt 0 ]; then
      echo "   ✅ $module: $count files using hooks"
    fi
  fi
done

echo ""
echo "=================================================="
echo "🎯 AUDIT COMPLETE"
echo "=================================================="
