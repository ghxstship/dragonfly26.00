#!/bin/bash

# FIX ALL 18 FILES MISSING CORRECT SUPABASE HOOKS

echo "🔧 FIXING ALL 18 FILES WITH MISSING HOOKS"
echo "=========================================="
echo ""

fixed=0

# ASSETS MODULE (3 files)
echo "📦 ASSETS MODULE..."

# catalog-tab.tsx - Add useAssets hook
file="src/components/assets/catalog-tab.tsx"
if [ -f "$file" ]; then
  # Add import after other imports
  if ! grep -q "useAssets" "$file"; then
    sed -i '' '/import { useUIStore } from/a\
import { useAssets } from "@/hooks/use-assets-data"
' "$file"
    echo "✅ $file - Added useAssets import"
    ((fixed++))
  fi
fi

# inventory-tab.tsx - Add useAssets hook
file="src/components/assets/inventory-tab.tsx"
if [ -f "$file" ]; then
  if ! grep -q "useAssets" "$file"; then
    sed -i '' '/import { useUIStore } from/a\
import { useAssets } from "@/hooks/use-assets-data"
' "$file"
    echo "✅ $file - Added useAssets import"
    ((fixed++))
  fi
fi

# counts-tab.tsx - Add useAssets hook
file="src/components/assets/counts-tab.tsx"
if [ -f "$file" ]; then
  if ! grep -q "useAssets" "$file"; then
    sed -i '' '/import { useToast } from/a\
import { useAssets } from "@/hooks/use-assets-data"
' "$file"
    echo "✅ $file - Added useAssets import"
    ((fixed++))
  fi
fi

echo ""
echo "📊 DASHBOARD MODULE..."

# Fix all 10 dashboard files
for file in src/components/dashboard/dashboard-my-*.tsx; do
  if [ -f "$file" ] && ! grep -q "useDashboardData" "$file"; then
    # Add import after useState
    sed -i '' '/^import { useState } from/a\
import { useDashboardData } from "@/hooks/use-dashboard-data"
' "$file"
    echo "✅ $(basename $file) - Added useDashboardData import"
    ((fixed++))
  fi
done

echo ""
echo "💰 FINANCE MODULE..."

# finance-scenarios-tab.tsx
file="src/components/finance/finance-scenarios-tab.tsx"
if [ -f "$file" ] && ! grep -q "useFinanceData" "$file"; then
  sed -i '' '/^import { useState } from/a\
import { useFinanceData } from "@/hooks/use-finance-data"
' "$file"
  echo "✅ $(basename $file) - Added useFinanceData import"
  ((fixed++))
fi

# finance-cash-flow-tab.tsx
file="src/components/finance/finance-cash-flow-tab.tsx"
if [ -f "$file" ] && ! grep -q "useFinanceData" "$file"; then
  sed -i '' '/^import { useState } from/a\
import { useFinanceData } from "@/hooks/use-finance-data"
' "$file"
  echo "✅ $(basename $file) - Added useFinanceData import"
  ((fixed++))
fi

# finance-approvals-tab.tsx
file="src/components/finance/finance-approvals-tab.tsx"
if [ -f "$file" ] && ! grep -q "useFinanceData" "$file"; then
  sed -i '' '/^import { useState } from/a\
import { useFinanceData } from "@/hooks/use-finance-data"
' "$file"
  echo "✅ $(basename $file) - Added useFinanceData import"
  ((fixed++))
fi

# finance-policies-tab.tsx
file="src/components/finance/finance-policies-tab.tsx"
if [ -f "$file" ] && ! grep -q "useFinanceData" "$file"; then
  sed -i '' '/^import { useState } from/a\
import { useFinanceData } from "@/hooks/use-finance-data"
' "$file"
  echo "✅ $(basename $file) - Added useFinanceData import"
  ((fixed++))
fi

# finance-variance-tab.tsx
file="src/components/finance/finance-variance-tab.tsx"
if [ -f "$file" ] && ! grep -q "useFinanceData" "$file"; then
  sed -i '' '/^import { useState } from/a\
import { useFinanceData } from "@/hooks/use-finance-data"
' "$file"
  echo "✅ $(basename $file) - Added useFinanceData import"
  ((fixed++))
fi

echo ""
echo "=========================================="
echo "📊 SUMMARY: Fixed $fixed/18 files"
echo "=========================================="
