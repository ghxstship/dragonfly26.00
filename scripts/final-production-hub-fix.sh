#!/bin/bash

# Final comprehensive i18n fix for all remaining Production Hub violations
# Targets specific remaining hardcoded strings

BASE="/Users/julianclarkson/Documents/Dragonfly26.00/src/components"

# Dashboard remaining
for file in dashboard-my-orders-tab.tsx dashboard-my-reports-tab.tsx; do
  sed -i '' 's/>Processing</>{{t(\x27processing\x27)}}</g' "$BASE/dashboard/$file"
  sed -i '' 's/>In Transit</>{{t(\x27inTransit\x27)}}</g' "$BASE/dashboard/$file"
  sed -i '' 's/>Assets Report</>{{t(\x27assetsReport\x27)}}</g' "$BASE/dashboard/$file"
  sed -i '' 's/>Time Report</>{{t(\x27timeReport\x27)}}</g' "$BASE/dashboard/$file"
done

echo "Fixed $(basename $file) in dashboard"

echo "All remaining files fixed"
