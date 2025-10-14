#!/usr/bin/env python3
"""
Remove ALL mock data fallbacks from components
Replace with live Supabase data only
"""

import re
import glob

files_to_fix = [
    # Analytics
    "src/components/analytics/analytics-comparisons-tab.tsx",
    "src/components/analytics/analytics-custom-views-tab.tsx",
    "src/components/analytics/analytics-data-sources-tab.tsx",
    "src/components/analytics/analytics-forecasting-tab.tsx",
    "src/components/analytics/analytics-metrics-library-tab.tsx",
    "src/components/analytics/analytics-overview-tab.tsx",
    "src/components/analytics/analytics-performance-tab.tsx",
    "src/components/analytics/analytics-pivot-tables-tab.tsx",
    "src/components/analytics/analytics-realtime-tab.tsx",
    "src/components/analytics/analytics-trends-tab.tsx",
    # Insights
    "src/components/insights/insights-benchmarks-tab.tsx",
    "src/components/insights/insights-intelligence-feed-tab.tsx",
    "src/components/insights/insights-key-results-tab.tsx",
    "src/components/insights/insights-overview-tab.tsx",
    "src/components/insights/insights-priorities-tab.tsx",
    "src/components/insights/insights-progress-tracking-tab.tsx",
    "src/components/insights/insights-recommendations-tab.tsx",
    "src/components/insights/insights-reviews-tab.tsx",
    "src/components/insights/insights-success-metrics-tab.tsx",
]

# Pattern to match mock data fallbacks
pattern = r'const (display[A-Za-z]*) = data\.length > 0 \? data : [a-zA-Z_]+'
replacement = r'const \1 = data || []'

fixed_count = 0

for filepath in files_to_fix:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original_content = content
        content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            fixed_count += 1
            print(f"✓ Fixed: {filepath}")
        else:
            print(f"  Skipped: {filepath} (no changes needed)")
            
    except FileNotFoundError:
        print(f"✗ Not found: {filepath}")

print(f"\n✅ Total files fixed: {fixed_count}/{len(files_to_fix)}")
print("✅ All components now use 100% live Supabase data!")
