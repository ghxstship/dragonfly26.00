#!/usr/bin/env node

/**
 * Fix Hook Parameters Script
 * 
 * Removes workspaceId parameters from data hooks that don't accept them
 */

const fs = require('fs')
const path = require('path')

// Hooks that don't accept parameters
const HOOKS_WITHOUT_PARAMS = [
  'useAdminData',
  'useCommunityData',
  'useCompaniesData',
  'useJobsData',
  'useProcurementData',
  'useFinanceData',
  'useAnalyticsData',
  'useReportsData',
  'useInsightsData',
  'useSettingsData',
  'useProfileData',
  'useResourcesData',
  'useMarketplaceData',
  'useFilesData',
  'useLocationsData',
  'usePeopleData',
  'useAssetsData',
  'useEventsData',
  'useProjectsData',
  'useDashboardData',
]

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  HOOKS_WITHOUT_PARAMS.forEach(hook => {
    // Pattern: useHookName(workspaceId) or useHookName(workspaceId, userId)
    const pattern1 = new RegExp(`${hook}\\(workspaceId\\)`, 'g')
    const pattern2 = new RegExp(`${hook}\\(workspaceId,\\s*userId\\)`, 'g')
    
    if (pattern1.test(content) || pattern2.test(content)) {
      content = content.replace(pattern1, `${hook}()`)
      content = content.replace(pattern2, `${hook}()`)
      modified = true
    }
  })

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Fixed: ${path.basename(filePath)}`)
    return 1
  }

  return 0
}

function scanDirectory(dir) {
  let fixedCount = 0
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      fixedCount += scanDirectory(filePath)
    } else if (file.endsWith('-tab.tsx')) {
      fixedCount += fixFile(filePath)
    }
  })

  return fixedCount
}

// Main execution
console.log('🔧 Fixing hook parameters...\n')

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const fixedCount = scanDirectory(componentsDir)

console.log(`\n✅ Fixed ${fixedCount} files`)
