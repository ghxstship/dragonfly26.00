#!/bin/bash

# Fix all incorrect hook destructuring patterns

echo "🔧 Fixing all hook destructuring issues..."

# Companies
find src/components/companies -name "*.tsx" -type f -exec sed -i '' 's/const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useCompaniesData();/const { loading: companiesLoading, error: companiesError } = useCompaniesData();/g' {} \;

# Jobs  
find src/components/jobs -name "*.tsx" -type f -exec sed -i '' 's/const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useJobsData();/const { loading: jobsLoading, error: jobsError } = useJobsData();/g' {} \;

# People
find src/components/people -name "*.tsx" -type f -exec sed -i '' 's/const { data: peopleData, isLoading: peopleLoading, error: peopleError } = usePeopleData();/const { loading: peopleLoading, error: peopleError } = usePeopleData();/g' {} \;

# Locations
find src/components/locations -name "*.tsx" -type f -exec sed -i '' 's/const { data: locationsData, isLoading: locationsLoading, error: locationsError } = useLocationsData();/const { loading: locationsLoading, error: locationsError } = useLocationsData();/g' {} \;

# Files
find src/components/files -name "*.tsx" -type f -exec sed -i '' 's/const { data: filesData, isLoading: filesLoading, error: filesError } = useFilesData();/const { loading: filesLoading, error: filesError } = useFilesData();/g' {} \;

# Marketplace
find src/components/marketplace -name "*.tsx" -type f -exec sed -i '' 's/const { data: marketplaceData, isLoading: marketplaceLoading, error: marketplaceError } = useMarketplaceData();/const { loading: marketplaceLoading, error: marketplaceError } = useMarketplaceData();/g' {} \;

# Resources
find src/components/resources -name "*.tsx" -type f -exec sed -i '' 's/const { data: resourcesData, isLoading: resourcesLoading, error: resourcesError } = useResourcesData();/const { loading: resourcesLoading, error: resourcesError } = useResourcesData();/g' {} \;

# Analytics
find src/components/analytics -name "*.tsx" -type f -exec sed -i '' 's/const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsData();/const { loading: analyticsLoading, error: analyticsError } = useAnalyticsData();/g' {} \;

# Reports
find src/components/reports -name "*.tsx" -type f -exec sed -i '' 's/const { data: reportsData, isLoading: reportsLoading, error: reportsError } = useReportsData();/const { loading: reportsLoading, error: reportsError } = useReportsData();/g' {} \;

# Insights
find src/components/insights -name "*.tsx" -type f -exec sed -i '' 's/const { data: insightsData, isLoading: insightsLoading, error: insightsError } = useInsightsData();/const { loading: insightsLoading, error: insightsError } = useInsightsData();/g' {} \;

# Settings
find src/components/settings -name "*.tsx" -type f -exec sed -i '' 's/const { data: settingsData, isLoading: settingsLoading, error: settingsError } = useSettingsData();/const { loading: settingsLoading, error: settingsError } = useSettingsData();/g' {} \;

# Profile
find src/components/profile -name "*.tsx" -type f -exec sed -i '' 's/const { data: profileData, isLoading: profileLoading, error: profileError } = useProfileData();/const { loading: profileLoading, error: profileError } = useProfileData();/g' {} \;

# Dashboard
find src/components/dashboard -name "*.tsx" -type f -exec sed -i '' 's/const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboardData();/const { loading: dashboardLoading, error: dashboardError } = useDashboardData();/g' {} \;

echo "✅ All hook destructuring fixed!"
