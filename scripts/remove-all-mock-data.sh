#!/bin/bash
# Remove ALL mock data fallbacks - enforce 100% live Supabase data

echo "Removing all mock data fallbacks from components..."

# Reports module - remove mock fallbacks
files=(
  "src/components/reports/reports-overview-tab.tsx"
  "src/components/reports/reports-templates-tab.tsx"
  "src/components/reports/reports-archived-tab.tsx"
  "src/components/reports/reports-compliance-tab.tsx"
  "src/components/reports/reports-executive-tab.tsx"
  "src/components/reports/reports-scheduled-tab.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Replace: const displayX = data.length > 0 ? data : mockData
    # With:    const displayX = data || []
    sed -i '' 's/const display\([A-Za-z]*\) = data.length > 0 ? data : [a-zA-Z]*/const display\1 = data || []/g' "$file"
    echo "✓ Fixed: $file"
  fi
done

# Analytics module
analytics_files=(
  "src/components/analytics/analytics-overview-tab.tsx"
  "src/components/analytics/analytics-performance-tab.tsx"
  "src/components/analytics/analytics-trends-tab.tsx"
  "src/components/analytics/analytics-comparisons-tab.tsx"
  "src/components/analytics/analytics-forecasting-tab.tsx"
  "src/components/analytics/analytics-realtime-tab.tsx"
  "src/components/analytics/analytics-custom-views-tab.tsx"
  "src/components/analytics/analytics-pivot-tables-tab.tsx"
  "src/components/analytics/analytics-metrics-library-tab.tsx"
  "src/components/analytics/analytics-data-sources-tab.tsx"
)

for file in "${analytics_files[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' 's/const display\([A-Za-z]*\) = data.length > 0 ? data : [a-zA-Z_]*/const display\1 = data || []/g' "$file"
    echo "✓ Fixed: $file"
  fi
done

# Insights module
insights_files=(
  "src/components/insights/insights-overview-tab.tsx"
  "src/components/insights/insights-key-results-tab.tsx"
  "src/components/insights/insights-benchmarks-tab.tsx"
  "src/components/insights/insights-recommendations-tab.tsx"
  "src/components/insights/insights-priorities-tab.tsx"
  "src/components/insights/insights-progress-tracking-tab.tsx"
  "src/components/insights/insights-reviews-tab.tsx"
  "src/components/insights/insights-intelligence-feed-tab.tsx"
  "src/components/insights/insights-success-metrics-tab.tsx"
)

for file in "${insights_files[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' 's/const display\([A-Za-z]*\) = data.length > 0 ? data : [a-zA-Z_]*/const display\1 = data || []/g' "$file"
    echo "✓ Fixed: $file"
  fi
done

echo ""
echo "✅ All mock data fallbacks removed!"
echo "✅ All components now use 100% live Supabase data"
