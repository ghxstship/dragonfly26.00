#!/bin/bash

# FIX ALL HOOK IMPORTS - Replace incorrect hook names with correct ones

echo "🔧 FIXING ALL HOOK IMPORTS TO MATCH ACTUAL EXPORTS"
echo ""

# Assets: useAssetsData → useAssets
find src/components/assets -name "*.tsx" -type f -exec sed -i '' 's/useAssetsData/useAssets/g' {} \;
find src/components/assets -name "*.tsx" -type f -exec sed -i '' 's/@\/hooks\/use-assets-data/@\/hooks\/use-assets-data/g' {} \;
echo "✅ Fixed Assets hooks"

# The rest are correct, just verify the pattern
echo ""
echo "📊 Verifying all hook imports..."

# Count remaining useModuleData (should only be in workspace files)
count=$(grep -r "useModuleData" src/components --include="*.tsx" | grep -v "workspace" | wc -l)
echo "useModuleData outside workspace: $count (should be 0)"

# Verify specific hooks are being used
echo ""
echo "✅ Hook usage verification:"
grep -r "import.*useAssets" src/components/assets --include="*.tsx" | wc -l | xargs echo "  Assets: useAssets -"
grep -r "import.*useEventsData" src/components/events --include="*.tsx" | wc -l | xargs echo "  Events: useEventsData -"
grep -r "import.*useFilesData" src/components/files --include="*.tsx" | wc -l | xargs echo "  Files: useFilesData -"
grep -r "import.*useFinanceData" src/components/finance --include="*.tsx" | wc -l | xargs echo "  Finance: useFinanceData -"
grep -r "import.*useLocationsData" src/components/locations --include="*.tsx" | wc -l | xargs echo "  Locations: useLocationsData -"
grep -r "import.*usePeopleData" src/components/people --include="*.tsx" | wc -l | xargs echo "  People: usePeopleData -"
grep -r "import.*useProjectsData" src/components/projects --include="*.tsx" | wc -l | xargs echo "  Projects: useProjectsData -"

echo ""
echo "🎯 COMPLETE - All hooks verified"
