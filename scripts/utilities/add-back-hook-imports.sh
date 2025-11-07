#!/bin/bash

echo "🔧 Adding back necessary hook imports..."

# Function to add import if hook is used but import is missing
add_import_if_needed() {
    local dir=$1
    local hook_name=$2
    local hook_file=$3
    
    for file in src/components/$dir/*.tsx; do
        if [ -f "$file" ]; then
            # Check if hook is used but import is missing
            if grep -q "${hook_name}()" "$file" && ! grep -q "import.*${hook_name}" "$file"; then
                # Add import after "use client"
                sed -i '' '/"use client"/a\
\
import { '"${hook_name}"' } from "@/hooks/'"${hook_file}"'"
' "$file"
                echo "✅ Added ${hook_name} import to $(basename $file)"
            fi
        fi
    done
}

# Add imports for each module
add_import_if_needed "companies" "useCompaniesData" "use-companies-data"
add_import_if_needed "jobs" "useJobsData" "use-jobs-data"
add_import_if_needed "people" "usePeopleData" "use-people-data"
add_import_if_needed "locations" "useLocationsData" "use-locations-data"
add_import_if_needed "files" "useFilesData" "use-files-data"
add_import_if_needed "marketplace" "useMarketplaceData" "use-marketplace-data"
add_import_if_needed "resources" "useResourcesData" "use-resources-data"
add_import_if_needed "analytics" "useAnalyticsData" "use-analytics-data"
add_import_if_needed "reports" "useReportsData" "use-reports-data"
add_import_if_needed "insights" "useInsightsData" "use-insights-data"
add_import_if_needed "settings" "useSettingsData" "use-settings-data"
add_import_if_needed "profile" "useProfileData" "use-profile-data"
add_import_if_needed "dashboard" "useDashboardData" "use-dashboard-data"

echo "✅ All necessary imports added!"
