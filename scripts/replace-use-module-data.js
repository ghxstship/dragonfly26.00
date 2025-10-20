#!/usr/bin/env node

/**
 * REPLACE useModuleData WITH SPECIFIC SUPABASE HOOKS
 * 
 * This script replaces all instances of the generic useModuleData hook
 * with the correct module-specific Supabase hooks.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding all files using useModuleData...\n');

// Get all files using useModuleData
const grepResult = execSync(
  'grep -r "useModuleData" src/components --include="*.tsx" -l',
  { encoding: 'utf-8', cwd: path.join(__dirname, '..') }
);

const files = grepResult.trim().split('\n').filter(Boolean);

console.log(`📊 Found ${files.length} files using useModuleData\n`);

// Mapping of module paths to correct hooks
const hookMappings = {
  'assets': { hook: 'useAssetsData', import: '@/hooks/use-assets-data' },
  'companies': { hook: 'useCompaniesData', import: '@/hooks/use-companies-data' },
  'events': { hook: 'useEventsData', import: '@/hooks/use-events-data' },
  'files': { hook: 'useFilesData', import: '@/hooks/use-files-data' },
  'finance': { hook: 'useFinanceData', import: '@/hooks/use-finance-data' },
  'jobs': { hook: 'useJobsData', import: '@/hooks/use-jobs-data' },
  'locations': { hook: 'useLocationsData', import: '@/hooks/use-locations-data' },
  'people': { hook: 'usePeopleData', import: '@/hooks/use-people-data' },
  'procurement': { hook: 'useProcurementData', import: '@/hooks/use-procurement-data' },
  'projects': { hook: 'useProjectsData', import: '@/hooks/use-projects-data' },
  'dashboard': { hook: 'useDashboardData', import: '@/hooks/use-dashboard-data' },
  'community': { hook: 'useCommunityData', import: '@/hooks/use-community-data' },
  'marketplace': { hook: 'useMarketplaceData', import: '@/hooks/use-marketplace-data' },
  'resources': { hook: 'useResourcesData', import: '@/hooks/use-resources-data' },
  'analytics': { hook: 'useAnalyticsData', import: '@/hooks/use-analytics-data' },
  'reports': { hook: 'useReportsData', import: '@/hooks/use-reports-data' },
  'insights': { hook: 'useInsightsData', import: '@/hooks/use-insights-data' },
  'admin': { hook: 'useAdminData', import: '@/hooks/use-admin-data' },
  'settings': { hook: 'useSettingsData', import: '@/hooks/use-settings-data' },
  'profile': { hook: 'useProfileData', import: '@/hooks/use-profile-data' },
};

let fixed = 0;
let errors = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    errors++;
    return;
  }

  // Determine module from file path
  const match = file.match(/src\/components\/([^\/]+)\//);
  if (!match) {
    console.log(`⚠️  Cannot determine module for: ${file}`);
    errors++;
    return;
  }

  const module = match[1];
  const mapping = hookMappings[module];

  if (!mapping) {
    console.log(`⚠️  No hook mapping for module: ${module} in ${file}`);
    errors++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file actually uses useModuleData
  if (!content.includes('useModuleData')) {
    return;
  }

  // Replace import
  content = content.replace(
    /import\s+\{\s*useModuleData\s*\}\s+from\s+["']@\/hooks\/use-module-data["']/g,
    `import { ${mapping.hook} } from "${mapping.import}"`
  );

  // Replace hook usage - handle various patterns
  content = content.replace(
    /const\s+\{\s*data:\s*(\w+),\s*loading(?::\s*\w+)?\s*\}\s*=\s*useModuleData\([^)]*\)/g,
    `const { data: $1, loading } = ${mapping.hook}(workspaceId)`
  );

  content = content.replace(
    /const\s+\{\s*data,\s*loading\s*\}\s*=\s*useModuleData\([^)]*\)/g,
    `const { data, loading } = ${mapping.hook}(workspaceId)`
  );

  content = content.replace(
    /useModuleData\(/g,
    `${mapping.hook}(`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${file} → ${mapping.hook}`);
  fixed++;
});

console.log(`\n📊 SUMMARY:`);
console.log(`✅ Files fixed: ${fixed}`);
console.log(`❌ Errors: ${errors}`);
console.log(`\n🎯 STATUS: ${errors === 0 ? 'COMPLETE' : 'REVIEW NEEDED'}`);
