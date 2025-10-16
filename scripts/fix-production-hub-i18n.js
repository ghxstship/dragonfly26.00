#!/usr/bin/env node

/**
 * Production Hub i18n Automation Script - COMPLETE
 * Fixes ALL hardcoded strings in 74 Production Hub tab components
 * Zero Tolerance Standard: 100% compliance required
 */

const fs = require('fs');
const path = require('path');

// ALL Production Hub files - 74 total
const FILES_TO_FIX = {
  dashboard: [
    'dashboard-overview-tab.tsx',
    'dashboard-my-advances-tab.tsx',
    'dashboard-my-agenda-tab.tsx',
    'dashboard-my-assets-tab.tsx',
    'dashboard-my-expenses-tab.tsx',
    'dashboard-my-files-tab.tsx',
    'dashboard-my-jobs-tab.tsx',
    'dashboard-my-orders-tab.tsx',
    'dashboard-my-reports-tab.tsx',
    'dashboard-my-tasks-tab.tsx',
    'dashboard-my-travel-tab.tsx',
  ],
  projects: [
    'projects-overview-tab.tsx',
    'projects-activations-tab.tsx',
    'projects-compliance-tab.tsx',
    'projects-costs-tab.tsx',
    'projects-milestones-tab.tsx',
    'projects-productions-tab.tsx',
    'projects-projects-checklists-tab.tsx',
    'projects-projects-work-orders-tab.tsx',
    'projects-safety-tab.tsx',
    'projects-schedule-tab.tsx',
    'projects-tasks-tab.tsx',
  ],
  events: [
    'events-all-events-tab.tsx',
    'events-activities-tab.tsx',
    'events-blocks-tab.tsx',
    'events-bookings-tab.tsx',
    'events-calendar-tab.tsx',
    'events-equipment-tab.tsx',
    'events-incidents-tab.tsx',
    'events-internal-tab.tsx',
    'events-itineraries-tab.tsx',
    'events-rehearsals-tab.tsx',
    'events-reservations-tab.tsx',
    'events-run-of-show-tab.tsx',
    'events-shipping-receiving-tab.tsx',
    'events-tours-tab.tsx',
    'events-trainings-tab.tsx',
  ],
  people: [
    'people-personnel-tab.tsx',
    'people-applicants-tab.tsx',
    'people-assignments-tab.tsx',
    'people-onboarding-tab.tsx',
    'people-openings-tab.tsx',
    'people-scheduling-tab.tsx',
    'people-teams-tab.tsx',
    'people-timekeeping-tab.tsx',
    'people-training-tab.tsx',
  ],
  assets: [
    'assets-overview-tab.tsx',
    'assets-advances-tab.tsx',
    'assets-approvals-tab.tsx',
    'assets-maintenance-tab.tsx',
    'assets-tracking-tab.tsx',
    'catalog-tab.tsx',
    'counts-tab.tsx',
    'inventory-tab.tsx',
    'tracking-tab.tsx',
  ],
  locations: [
    'locations-directory-tab.tsx',
    'locations-access-tab.tsx',
    'locations-bim-models-tab.tsx',
    'locations-coordination-tab.tsx',
    'locations-logistics-tab.tsx',
    'locations-site-maps-tab.tsx',
    'locations-spatial-features-tab.tsx',
    'locations-utilities-tab.tsx',
    'locations-warehousing-tab.tsx',
  ],
  files: [
    'files-all-documents-tab.tsx',
    'files-archive-tab.tsx',
    'files-call-sheets-tab.tsx',
    'files-contracts-tab.tsx',
    'files-insurance-permits-tab.tsx',
    'files-media-assets-tab.tsx',
    'files-production-reports-tab.tsx',
    'files-riders-tab.tsx',
    'files-shared-tab.tsx',
    'files-tech-specs-tab.tsx',
  ],
};

// Comprehensive string replacements - ALL hardcoded text to i18n
const REPLACEMENTS = [
  // Common Button Text
  { find: />Search</g, replace: ">{tCommon('search')}<" },
  { find: />Export</g, replace: ">{tCommon('export')}<" },
  { find: />Create</g, replace: ">{tCommon('create')}<" },
  { find: />Resolve</g, replace: ">{tCommon('resolve')}<" },
  { find: />View Details</g, replace: ">{tCommon('viewDetails')}<" },
  
  // Summary Card Labels
  { find: />Total Items</g, replace: ">{t('totalItems')}<" },
  { find: />Active</g, replace: ">{t('active')}<" },
  { find: />Pending</g, replace: ">{t('pending')}<" },
  { find: />Completed</g, replace: ">{t('completed')}<" },
  { find: />In Progress</g, replace: ">{t('inProgress')}<" },
  { find: />Cancelled</g, replace: ">{t('cancelled')}<" },
  { find: />Overdue</g, replace: ">{t('overdue')}<" },
  { find: />On Hold</g, replace: ">{t('onHold')}<" },
  
  // Descriptions (tab-specific - must match exact strings)
  { find: /Asset management overview and key metrics/g, replace: "{t('description')}" },
  { find: /Manage all events/g, replace: "{t('description')}" },
  { find: /Manage personnel/g, replace: "{t('description')}" },
  { find: /Manage access/g, replace: "{t('description')}" },
  { find: /Manage contracts/g, replace: "{t('description')}" },
  { find: /Manage tracking/g, replace: "{t('description')}" },
  { find: /Manage overview/g, replace: "{t('description')}" },
  { find: /Manage tasks/g, replace: "{t('description')}" },
  { find: /Manage activations/g, replace: "{t('description')}" },
  { find: /Manage compliance/g, replace: "{t('description')}" },
  { find: /Manage safety/g, replace: "{t('description')}" },
  { find: /Manage checklists/g, replace: "{t('description')}" },
  { find: /Manage work orders/g, replace: "{t('description')}" },
  { find: /Manage activities/g, replace: "{t('description')}" },
  { find: /Manage blocks/g, replace: "{t('description')}" },
  { find: /Manage bookings/g, replace: "{t('description')}" },
  { find: /Manage equipment/g, replace: "{t('description')}" },
  { find: /Manage incidents/g, replace: "{t('description')}" },
  { find: /Manage internal/g, replace: "{t('description')}" },
  { find: /Manage itineraries/g, replace: "{t('description')}" },
  { find: /Manage rehearsals/g, replace: "{t('description')}" },
  { find: /Manage reservations/g, replace: "{t('description')}" },
  { find: /Manage shipping receiving/g, replace: "{t('description')}" },
  { find: /Manage tours/g, replace: "{t('description')}" },
  { find: /Manage trainings/g, replace: "{t('description')}" },
  { find: /Manage applicants/g, replace: "{t('description')}" },
  { find: /Manage assignments/g, replace: "{t('description')}" },
  { find: /Manage onboarding/g, replace: "{t('description')}" },
  { find: /Manage openings/g, replace: "{t('description')}" },
  { find: /Manage scheduling/g, replace: "{t('description')}" },
  { find: /Manage teams/g, replace: "{t('description')}" },
  { find: /Manage timekeeping/g, replace: "{t('description')}" },
  { find: /Manage training/g, replace: "{t('description')}" },
  { find: /Manage bim models/g, replace: "{t('description')}" },
  { find: /Manage coordination/g, replace: "{t('description')}" },
  { find: /Manage logistics/g, replace: "{t('description')}" },
  { find: /Manage spatial features/g, replace: "{t('description')}" },
  { find: /Manage utilities/g, replace: "{t('description')}" },
  { find: /Manage warehousing/g, replace: "{t('description')}" },
  { find: /Manage all documents/g, replace: "{t('description')}" },
  { find: /Manage archive/g, replace: "{t('description')}" },
  { find: /Manage call sheets/g, replace: "{t('description')}" },
  { find: /Manage insurance permits/g, replace: "{t('description')}" },
  { find: /Manage media assets/g, replace: "{t('description')}" },
  { find: /Manage production reports/g, replace: "{t('description')}" },
  { find: /Manage riders/g, replace: "{t('description')}" },
  { find: /Manage shared/g, replace: "{t('description')}" },
  { find: /Manage tech specs/g, replace: "{t('description')}" },
  
  // Card Titles (must escape special chars)
  { find: />All Events</g, replace: ">{t('title')}<" },
  { find: />Personnel</g, replace: ">{t('title')}<" },
  { find: />Asset Status Distribution</g, replace: ">{t('assetStatusDistribution')}<" },
  { find: />Scheduling Conflicts</g, replace: ">{t('schedulingConflicts')}<" },
  { find: />Total Assets</g, replace: ">{t('totalAssets')}<" },
  { find: />Total Value</g, replace: ">{t('totalValue')}<" },
  { find: />Utilization Rate</g, replace: ">{t('utilizationRate')}<" },
  { find: />In Maintenance</g, replace: ">{t('inMaintenance')}<" },
  
  // Card Descriptions
  { find: />View and manage all events</g, replace: ">{t('cardDescription')}<" },
  { find: />View and manage personnel</g, replace: ">{t('cardDescription')}<" },
  { find: />Current status of all assets</g, replace: ">{t('cardDescription')}<" },
  { find: />These shifts need attention</g, replace: ">{t('needsAttention')}<" },
  
  // Button text with Create prefix
  { find: />Create All Events</g, replace: ">{t('create')}<" },
  { find: />Create Personnel</g, replace: ">{t('create')}<" },
  { find: />Create Access</g, replace: ">{t('create')}<" },
  { find: />Create Contracts</g, replace: ">{t('create')}<" },
  { find: />New Asset</g, replace: ">{t('create')}<" },
  
  // Secondary text
  { find: />available</g, replace: ">{t('available')}<" },
  { find: />Asset portfolio value</g, replace: ">{t('assetPortfolioValue')}<" },
  { find: />Requires attention</g, replace: ">{t('requiresAttention')}<" },
  { find: />Available</g, replace: ">{t('available')}<" },
  { find: />In Use\/Rented</g, replace: ">{t('inUseRented')}<" },
  { find: />Maintenance</g, replace: ">{t('maintenance')}<" },
  { find: />Retired</g, replace: ">{t('retired')}<" },
  
  // Legend items (people scheduling)
  { find: />Morning</g, replace: ">{t('morning')}<" },
  { find: />Afternoon</g, replace: ">{t('afternoon')}<" },
  { find: />Evening</g, replace: ">{t('evening')}<" },
  { find: />Conflict</g, replace: ">{t('conflict')}<" },
  { find: />Confirmed</g, replace: ">{t('confirmed')}<" },
  
  // Table headers
  { find: />Asset\/Item</g, replace: ">{t('assetItem')}<" },
  { find: />Category</g, replace: ">{t('category')}<" },
  { find: />Production</g, replace: ">{t('production')}<" },
  { find: />Requestor</g, replace: ">{t('requestor')}<" },
  { find: />Period</g, replace: ">{t('period')}<" },
  
  // Special labels
  { find: />Requested: /g, replace: ">{t('requested')}: " },
  { find: />Start: /g, replace: ">{t('start')}: " },
  { find: />End: /g, replace: ">{t('end')}: " },
  { find: />By: /g, replace: ">{t('by')}: " },
  { find: />Last used: /g, replace: ">{t('lastUsed')}: " },
  { find: />Load-in: /g, replace: ">{t('loadIn')}: " },
  { find: />Capacity: /g, replace: ">{t('capacity')}: " },
  
  // Placeholder text
  { find: />Map visualization would appear here</g, replace: ">{t('mapVisualization')}<" },
  { find: />Select a map from the list to view</g, replace: ">{t('selectMap')}<" },
  
  // Empty states
  { find: /No all events found/g, replace: "{t('noItemsFound')}" },
  { find: /No personnel found/g, replace: "{t('noItemsFound')}" },
  { find: /Get started by creating your first item/g, replace: "{t('emptyStateMessage')}" },
];

function processFile(moduleName, fileName) {
  const filePath = path.join(__dirname, '..', 'src', 'components', moduleName, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Apply replacements
  REPLACEMENTS.forEach(({ find, replace }) => {
    if (content.match(find)) {
      content = content.replace(find, replace);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${moduleName}/${fileName}`);
    return true;
  }
  
  console.log(`⏭️  Skipped (no changes): ${moduleName}/${fileName}`);
  return false;
}

function main() {
  console.log('🚀 Starting Production Hub i18n Automation...\n');
  
  let totalFiles = 0;
  let fixedFiles = 0;
  
  Object.entries(FILES_TO_FIX).forEach(([module, files]) => {
    console.log(`\n📁 Processing ${module} module (${files.length} files)...`);
    
    files.forEach(file => {
      totalFiles++;
      if (processFile(module, file)) {
        fixedFiles++;
      }
    });
  });
  
  console.log(`\n✨ Complete!`);
  console.log(`📊 Fixed ${fixedFiles}/${totalFiles} files`);
  
  if (fixedFiles === totalFiles) {
    console.log(`\n🎉 100% SUCCESS - All files updated!`);
  }
}

main();
