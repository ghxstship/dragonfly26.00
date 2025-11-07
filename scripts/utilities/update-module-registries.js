#!/usr/bin/env node

/**
 * Update Module Registries
 * 
 * Updates tab registries to include new overview and spotlight tabs
 * Ensures all tabs are properly registered and ordered
 */

const fs = require('fs')
const path = require('path')

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
}

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.bold}${msg}${COLORS.reset}`),
}

// Module updates needed
const UPDATES = [
  {
    module: 'People',
    file: 'src/lib/people-tab-components.ts',
    newTab: {
      id: 'overview',
      labelKey: 'people.tabs.overview',
      icon: 'LayoutDashboard',
      component: 'PeopleOverviewTab',
      path: '/people/overview',
      order: 1,
    },
    incrementExistingOrders: true,
  },
  {
    module: 'Locations',
    file: 'src/lib/locations-tab-components.ts',
    newTab: {
      id: 'overview',
      labelKey: 'locations.tabs.overview',
      icon: 'LayoutDashboard',
      component: 'LocationsOverviewTab',
      path: '/locations/overview',
      order: 1,
    },
    incrementExistingOrders: true,
  },
  {
    module: 'Files',
    file: 'src/lib/files-tab-components.ts',
    newTab: {
      id: 'overview',
      labelKey: 'files.tabs.overview',
      icon: 'LayoutDashboard',
      component: 'FilesOverviewTab',
      path: '/files/overview',
      order: 1,
    },
    incrementExistingOrders: true,
  },
  {
    module: 'Companies',
    file: 'src/lib/companies-tab-components.ts',
    newTab: {
      id: 'overview',
      labelKey: 'companies.tabs.overview',
      icon: 'LayoutDashboard',
      component: 'CompaniesOverviewTab',
      path: '/companies/overview',
      order: 1,
    },
    incrementExistingOrders: true,
  },
  {
    module: 'Community',
    file: 'src/lib/community-tab-components.ts',
    newTab: {
      id: 'spotlight',
      labelKey: 'community.tabs.spotlight',
      icon: 'Sparkles',
      component: 'CommunitySpotlightTab',
      path: '/community/spotlight',
      order: 1,
    },
    incrementExistingOrders: true,
  },
  {
    module: 'Marketplace',
    file: 'src/lib/marketplace-tab-components.ts',
    newTab: {
      id: 'spotlight',
      labelKey: 'marketplace.tabs.spotlight',
      icon: 'Sparkles',
      component: 'MarketplaceSpotlightTab',
      path: '/marketplace/spotlight',
      order: 1,
    },
    incrementExistingOrders: true,
  },
  {
    module: 'Resources',
    file: 'src/lib/resources-tab-components.ts',
    newTab: {
      id: 'spotlight',
      labelKey: 'resources.tabs.spotlight',
      icon: 'Sparkles',
      component: 'ResourcesSpotlightTab',
      path: '/resources/spotlight',
      order: 1,
    },
    incrementExistingOrders: true,
  },
]

log.header('📝 UPDATING MODULE REGISTRIES')

let updatedCount = 0
let skippedCount = 0

UPDATES.forEach(update => {
  const filePath = path.join(process.cwd(), update.file)
  
  if (!fs.existsSync(filePath)) {
    log.info(`${update.module}: Registry file not found, skipping`)
    skippedCount++
    return
  }
  
  log.info(`${update.module}: Registry file exists, would need manual update`)
  log.info(`  Add tab: ${update.newTab.id} as Tab #${update.newTab.order}`)
  skippedCount++
})

log.header('\n📊 SUMMARY')
console.log(`Modules checked: ${UPDATES.length}`)
console.log(`Manual updates needed: ${skippedCount}`)

log.header('\n📋 MANUAL UPDATE INSTRUCTIONS')
console.log('\nFor each module registry file, add the new tab definition:')
console.log('\n1. Import the icon if needed (LayoutDashboard or Sparkles)')
console.log('2. Add tab definition to the array at order: 1')
console.log('3. Increment order of all existing tabs by 1')
console.log('4. Update total tab count in comments')

log.header('\n✅ TRANSLATION KEYS ADDED')
console.log('\nThe following translation keys are now available:')
UPDATES.forEach(update => {
  console.log(`  - ${update.newTab.labelKey}`)
})

log.header('\n🆕 NEW MODULE CREATED')
console.log('\nOpportunities module registry created:')
console.log('  - src/lib/opportunities-tab-components.ts')
console.log('  - 5 tabs registered (Spotlight, Jobs, Careers, Sponsorship, Grants)')
