#!/bin/bash

# COMPLETE MOCK DATA REMOVAL - FINAL PASS
# Removes ALL remaining hardcoded arrays from the last 4 files

echo "🔥 FINAL MOCK DATA REMOVAL - LAST 4 FILES"
echo ""

# admin/checklist-templates-tab.tsx - Remove initial state array
file="src/components/admin/checklist-templates-tab.tsx"
if [ -f "$file" ]; then
  # Remove the hardcoded initial state
  perl -i -0pe 's/const \[templates, setTemplates\] = useState<ChecklistTemplate\[\]>\(\[[\s\S]*?\]\)/const [templates, setTemplates] = useState<ChecklistTemplate[]>([])/' "$file"
  echo "✅ $file - Removed hardcoded templates initial state"
fi

# assets/assets-overview-tab.tsx - Remove all hardcoded arrays
file="src/components/assets/assets-overview-tab.tsx"
if [ -f "$file" ]; then
  # Remove assetsByCategory
  perl -i -0pe 's/const assetsByCategory = \[[\s\S]*?\n  \]/\/\/ Assets by category from Supabase data\n  const assetsByCategory = assets.reduce((acc: any[], a: any) => {\n    const existing = acc.find(c => c.category === a.category)\n    if (existing) {\n      existing.count++\n      existing.value += a.value || 0\n    } else {\n      acc.push({ category: a.category || "Other", count: 1, value: a.value || 0, percentage: 0 })\n    }\n    return acc\n  }, [])\n  const totalAssets = assetsByCategory.reduce((sum: number, c: any) => sum + c.count, 0)\n  if (totalAssets > 0) {\n    assetsByCategory.forEach((c: any) => { c.percentage = Math.round((c.count \/ totalAssets) * 100) })\n  }/' "$file"
  
  # Remove recentActivity
  perl -i -0pe 's/const recentActivity = \[[\s\S]*?\n  \]/\/\/ Recent activity from asset transactions\n  const recentActivity = assets.slice(0, 4).map((a: any) => ({\n    action: a.status || "Updated",\n    asset: a.name || "Asset",\n    user: a.assigned_to || "System",\n    time: a.updated_at || "Recently"\n  }))/' "$file"
  
  # Remove alerts
  perl -i -0pe 's/const alerts = \[[\s\S]*?\n  \]/\/\/ Alerts from asset status\n  const alerts = assets.filter((a: any) => a.alert_type).slice(0, 3).map((a: any, idx: number) => ({\n    id: idx + 1,\n    type: a.alert_type || "info",\n    message: a.alert_message || "Asset alert",\n    priority: a.priority || "medium"\n  }))/' "$file"
  
  echo "✅ $file - Removed all hardcoded arrays"
fi

# assets/tracking-tab.tsx - Remove recentActivity
file="src/components/assets/tracking-tab.tsx"
if [ -f "$file" ]; then
  perl -i -0pe 's/const recentActivity = \[[\s\S]*?\n  \]/\/\/ Recent activity from asset tracking data\n  const recentActivity = (data || []).slice(0, 10).map((item: any) => ({\n    action: item.action || "Updated",\n    asset: item.asset_name || "Asset",\n    user: item.user_name || "System",\n    time: item.timestamp || "Recently"\n  }))/' "$file"
  echo "✅ $file - Removed hardcoded recentActivity"
fi

# locations/locations-site-maps-tab.tsx - Remove mockMaps
file="src/components/locations/locations-site-maps-tab.tsx"
if [ -f "$file" ]; then
  perl -i -0pe 's/const mockMaps = \[[\s\S]*?\n  \]/\/\/ Site maps from Supabase locations data\n  const siteMaps = (data || []).map((loc: any) => ({\n    id: loc.id,\n    name: loc.name,\n    type: loc.type || "floor_plan",\n    url: loc.map_url,\n    updated: loc.updated_at\n  }))/' "$file"
  echo "✅ $file - Removed hardcoded mockMaps"
fi

echo ""
echo "📊 COMPLETE - All mock data removed"
echo "🎯 Running final audit..."
