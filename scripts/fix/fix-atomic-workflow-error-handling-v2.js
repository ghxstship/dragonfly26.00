#!/usr/bin/env node

/**
 * ATOMIC WORKFLOW ERROR HANDLING REMEDIATION V2
 * 
 * Improved version that handles multiple hook patterns:
 * - Single data hooks: const { data, isLoading } = useXxxData()
 * - Multiple specialized hooks: const { tasks } = useMyTasks()
 * - Direct Supabase queries
 * 
 * Based on: ATOMIC_WORKFLOW_COMPLETE_AUDIT.json
 * Date: November 5, 2025
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// Statistics
const stats = {
  componentsFixed: 0,
  errors: [],
  skipped: [],
  patterns: {
    singleHook: 0,
    multipleHooks: 0,
    noHooks: 0,
    alreadyHasError: 0
  }
};

/**
 * All tab components missing error handling (229 total)
 */
const COMPONENTS_TO_FIX = [
  // Dashboard (11 files)
  'dashboard/dashboard-my-advances-tab.tsx',
  'dashboard/dashboard-my-agenda-tab.tsx',
  'dashboard/dashboard-my-assets-tab.tsx',
  'dashboard/dashboard-my-expenses-tab.tsx',
  'dashboard/dashboard-my-files-tab.tsx',
  'dashboard/dashboard-my-jobs-tab.tsx',
  'dashboard/dashboard-my-orders-tab.tsx',
  'dashboard/dashboard-my-reports-tab.tsx',
  'dashboard/dashboard-my-tasks-tab.tsx',
  'dashboard/dashboard-my-travel-tab.tsx',
  'dashboard/dashboard-overview-tab.tsx',
  
  // Projects (12 files)
  'projects/projects-activations-tab.tsx',
  'projects/projects-budgets-tab.tsx',
  'projects/projects-compliance-tab.tsx',
  'projects/projects-costs-tab.tsx',
  'projects/projects-milestones-tab.tsx',
  'projects/projects-overview-tab.tsx',
  'projects/projects-productions-tab.tsx',
  'projects/projects-projects-checklists-tab.tsx',
  'projects/projects-projects-work-orders-tab.tsx',
  'projects/projects-safety-tab.tsx',
  'projects/projects-schedule-tab.tsx',
  'projects/projects-tasks-tab.tsx',
  
  // Events (17 files)
  'events/events-activities-tab.tsx',
  'events/events-all-events-tab.tsx',
  'events/events-blocks-tab.tsx',
  'events/events-bookings-tab.tsx',
  'events/events-calendar-tab.tsx',
  'events/events-equipment-tab.tsx',
  'events/events-incidents-tab.tsx',
  'events/events-internal-tab.tsx',
  'events/events-itineraries-tab.tsx',
  'events/events-overview-tab.tsx',
  'events/events-rehearsals-tab.tsx',
  'events/events-reservations-tab.tsx',
  'events/events-run-of-show-tab.tsx',
  'events/events-scheduling-tab.tsx',
  'events/events-shipping-receiving-tab.tsx',
  'events/events-tours-tab.tsx',
  'events/events-trainings-tab.tsx',
  
  // People (12 files)
  'people/people-applicants-tab.tsx',
  'people/people-assignments-tab.tsx',
  'people/people-availability-tab.tsx',
  'people/people-directory-tab.tsx',
  'people/people-onboarding-tab.tsx',
  'people/people-openings-tab.tsx',
  'people/people-overview-tab.tsx',
  'people/people-personnel-tab.tsx',
  'people/people-scheduling-tab.tsx',
  'people/people-teams-tab.tsx',
  'people/people-timekeeping-tab.tsx',
  'people/people-training-tab.tsx',
  
  // Assets (10 files)
  'assets/assets-advances-tab.tsx',
  'assets/assets-approvals-tab.tsx',
  'assets/assets-maintenance-tab.tsx',
  'assets/assets-overview-tab.tsx',
  'assets/assets-tracking-tab.tsx',
  'assets/assets-transactions-tab.tsx',
  'assets/counts-tab.tsx',
  'assets/inventory-tab.tsx',
  'assets/maintenance-tab.tsx',
  'assets/tracking-tab.tsx',
  
  // Locations (11 files)
  'locations/locations-access-tab.tsx',
  'locations/locations-bim-models-tab.tsx',
  'locations/locations-bookings-tab.tsx',
  'locations/locations-coordination-tab.tsx',
  'locations/locations-directory-tab.tsx',
  'locations/locations-logistics-tab.tsx',
  'locations/locations-overview-tab.tsx',
  'locations/locations-site-maps-tab.tsx',
  'locations/locations-spatial-features-tab.tsx',
  'locations/locations-utilities-tab.tsx',
  'locations/locations-warehousing-tab.tsx',
  
  // Files (12 files)
  'files/files-all-documents-tab.tsx',
  'files/files-archive-tab.tsx',
  'files/files-call-sheets-tab.tsx',
  'files/files-contracts-tab.tsx',
  'files/files-folders-tab.tsx',
  'files/files-insurance-permits-tab.tsx',
  'files/files-media-assets-tab.tsx',
  'files/files-overview-tab.tsx',
  'files/files-production-reports-tab.tsx',
  'files/files-riders-tab.tsx',
  'files/files-shared-tab.tsx',
  'files/files-tech-specs-tab.tsx',
  
  // Community (8 files)
  'community/activity-tab.tsx',
  'community/community-spotlight-tab.tsx',
  'community/connections-tab.tsx',
  'community/discussions-tab.tsx',
  'community/events-tab.tsx',
  'community/news-tab.tsx',
  'community/showcase-tab.tsx',
  'community/studios-tab.tsx',
  
  // Marketplace (13 files)
  'marketplace/favorites-tab.tsx',
  'marketplace/lists-tab.tsx',
  'marketplace/marketplace-orders-tab.tsx',
  'marketplace/marketplace-shop-tab.tsx',
  'marketplace/marketplace-spotlight-tab.tsx',
  'marketplace/orders-tab.tsx',
  'marketplace/products-tab.tsx',
  'marketplace/purchases-tab.tsx',
  'marketplace/reviews-tab.tsx',
  'marketplace/sales-tab.tsx',
  'marketplace/services-tab.tsx',
  'marketplace/shop-tab.tsx',
  'marketplace/spotlight-tab.tsx',
  'marketplace/vendors-tab.tsx',
  
  // Resources (8 files)
  'resources/resources-courses-tab.tsx',
  'resources/resources-glossary-tab.tsx',
  'resources/resources-grants-tab.tsx',
  'resources/resources-guides-tab.tsx',
  'resources/resources-library-tab.tsx',
  'resources/resources-publications-tab.tsx',
  'resources/resources-spotlight-tab.tsx',
  'resources/resources-troubleshooting-tab.tsx',
  
  // Companies (13 files)
  'companies/companies-bids-tab.tsx',
  'companies/companies-companies-compliance-tab.tsx',
  'companies/companies-companies-invoices-tab.tsx',
  'companies/companies-companies-reviews-tab.tsx',
  'companies/companies-companies-work-orders-tab.tsx',
  'companies/companies-contacts-tab.tsx',
  'companies/companies-contracts-tab.tsx',
  'companies/companies-deliverables-tab.tsx',
  'companies/companies-documents-tab.tsx',
  'companies/companies-organizations-tab.tsx',
  'companies/companies-overview-tab.tsx',
  'companies/companies-scopes-of-work-tab.tsx',
  'companies/companies-subcontractor-profile-tab.tsx',
  
  // Jobs (15 files)
  'jobs/jobs-active-tab.tsx',
  'jobs/jobs-archived-tab.tsx',
  'jobs/jobs-checklists-tab.tsx',
  'jobs/jobs-completed-tab.tsx',
  'jobs/jobs-dispatch-tab.tsx',
  'jobs/jobs-estimates-tab.tsx',
  'jobs/jobs-jobs-compliance-tab.tsx',
  'jobs/jobs-jobs-invoices-tab.tsx',
  'jobs/jobs-offers-tab.tsx',
  'jobs/jobs-overview-tab.tsx',
  'jobs/jobs-pipeline-tab.tsx',
  'jobs/jobs-postings-tab.tsx',
  'jobs/jobs-recruiting-tab.tsx',
  'jobs/jobs-requisitions-tab.tsx',
  'jobs/jobs-scheduling-tab.tsx',
  
  // Procurement (10 files)
  'procurement/procurement-approvals-tab.tsx',
  'procurement/procurement-catalog-tab.tsx',
  'procurement/procurement-matching-tab.tsx',
  'procurement/procurement-orders-dashboard-tab.tsx',
  'procurement/procurement-orders-tab.tsx',
  'procurement/procurement-overview-tab.tsx',
  'procurement/procurement-purchase-orders-tab.tsx',
  'procurement/procurement-receiving-tab.tsx',
  'procurement/procurement-requests-tab.tsx',
  'procurement/procurement-vendors-tab.tsx',
  
  // Finance (18 files)
  'finance/finance-accounts-payable-tab.tsx',
  'finance/finance-accounts-receivable-tab.tsx',
  'finance/finance-advances-tab.tsx',
  'finance/finance-approvals-tab.tsx',
  'finance/finance-budgets-tab.tsx',
  'finance/finance-cash-flow-tab.tsx',
  'finance/finance-cost-tracking-tab.tsx',
  'finance/finance-expenses-tab.tsx',
  'finance/finance-forecasting-tab.tsx',
  'finance/finance-general-ledger-tab.tsx',
  'finance/finance-invoices-tab.tsx',
  'finance/finance-overview-tab.tsx',
  'finance/finance-payments-tab.tsx',
  'finance/finance-petty-cash-tab.tsx',
  'finance/finance-purchase-orders-tab.tsx',
  'finance/finance-reconciliation-tab.tsx',
  'finance/finance-reimbursements-tab.tsx',
  'finance/finance-transactions-tab.tsx',
  
  // Analytics (10 files)
  'analytics/analytics-assets-tab.tsx',
  'analytics/analytics-budget-tab.tsx',
  'analytics/analytics-events-tab.tsx',
  'analytics/analytics-finance-tab.tsx',
  'analytics/analytics-locations-tab.tsx',
  'analytics/analytics-overview-tab.tsx',
  'analytics/analytics-people-tab.tsx',
  'analytics/analytics-procurement-tab.tsx',
  'analytics/analytics-projects-tab.tsx',
  'analytics/analytics-timeline-tab.tsx',
  
  // Reports (9 files)
  'reports/reports-assets-tab.tsx',
  'reports/reports-budget-tab.tsx',
  'reports/reports-custom-tab.tsx',
  'reports/reports-events-tab.tsx',
  'reports/reports-finance-tab.tsx',
  'reports/reports-locations-tab.tsx',
  'reports/reports-overview-tab.tsx',
  'reports/reports-people-tab.tsx',
  'reports/reports-projects-tab.tsx',
  
  // Insights (10 files)
  'insights/insights-assets-tab.tsx',
  'insights/insights-budget-tab.tsx',
  'insights/insights-events-tab.tsx',
  'insights/insights-finance-tab.tsx',
  'insights/insights-locations-tab.tsx',
  'insights/insights-overview-tab.tsx',
  'insights/insights-people-tab.tsx',
  'insights/insights-procurement-tab.tsx',
  'insights/insights-projects-tab.tsx',
  'insights/insights-trends-tab.tsx',
  
  // Admin (11 files)
  'admin/admin-api-tokens-tab.tsx',
  'admin/admin-automations-tab.tsx',
  'admin/admin-billing-tab.tsx',
  'admin/admin-custom-statuses-tab.tsx',
  'admin/admin-integrations-tab.tsx',
  'admin/admin-members-management-tab.tsx',
  'admin/admin-organization-settings-tab.tsx',
  'admin/admin-overview-tab.tsx',
  'admin/admin-plugins-tab.tsx',
  'admin/admin-security-tab.tsx',
  'admin/admin-templates-tab.tsx',
  
  // Settings (6 files)
  'settings/settings-appearance-tab.tsx',
  'settings/settings-automations-tab.tsx',
  'settings/settings-billing-tab.tsx',
  'settings/settings-integrations-tab.tsx',
  'settings/settings-profile-page.tsx',
  'settings/settings-team-tab.tsx',
  
  // Profile (11 files)
  'profile/profile-access-tab.tsx',
  'profile/profile-basic-info-tab.tsx',
  'profile/profile-certifications-tab.tsx',
  'profile/profile-emergency-contact-tab.tsx',
  'profile/profile-endorsements-tab.tsx',
  'profile/profile-health-tab.tsx',
  'profile/profile-history-tab.tsx',
  'profile/profile-performance-tab.tsx',
  'profile/profile-professional-tab.tsx',
  'profile/profile-social-media-tab.tsx',
  'profile/profile-tags-tab.tsx'
];

/**
 * Add error handling to a component file
 */
function fixComponent(componentPath) {
  const fullPath = path.join(COMPONENTS_DIR, componentPath);
  
  if (!fs.existsSync(fullPath)) {
    stats.skipped.push(`Component not found: ${componentPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if component already has comprehensive error handling
  const hasErrorState = content.includes('if (error)') || 
                        content.includes('if (isError)') ||
                        content.includes('error &&') ||
                        content.includes('Failed to load');
  
  if (hasErrorState) {
    stats.patterns.alreadyHasError++;
    stats.skipped.push(`Already has error handling: ${componentPath}`);
    return;
  }
  
  let modified = false;
  
  // Pattern 1: Single data hook with destructuring
  // const { data, isLoading, error } = useXxxData()
  const singleHookPattern = /const\s*\{\s*([^}]+)\}\s*=\s*(use\w+Data\([^)]*\))/g;
  let singleHookMatches = [];
  let match;
  
  while ((match = singleHookPattern.exec(content)) !== null) {
    singleHookMatches.push({
      fullMatch: match[0],
      destructured: match[1],
      hookCall: match[2],
      index: match.index
    });
  }
  
  if (singleHookMatches.length > 0) {
    // Add error and isError to the first hook if not present
    const firstHook = singleHookMatches[0];
    if (!firstHook.destructured.includes('error')) {
      const newVars = firstHook.destructured.trim() + ', error, isError';
      content = content.replace(
        firstHook.fullMatch,
        `const { ${newVars} } = ${firstHook.hookCall}`
      );
      modified = true;
      stats.patterns.singleHook++;
    }
  }
  
  // Pattern 2: Multiple specialized hooks (e.g., useMyTasks, useMyAgenda)
  // const { tasks, loading: tasksLoading } = useMyTasks()
  const multiHookPattern = /const\s*\{\s*([^}]+)\}\s*=\s*(use\w+\([^)]*\))/g;
  let hasMultipleHooks = false;
  let loadingVars = [];
  
  while ((match = multiHookPattern.exec(content)) !== null) {
    const destructured = match[1];
    // Look for loading variables
    const loadingMatch = destructured.match(/loading:\s*(\w+)/);
    if (loadingMatch) {
      loadingVars.push(loadingMatch[1]);
      hasMultipleHooks = true;
    }
  }
  
  if (hasMultipleHooks && loadingVars.length > 0) {
    stats.patterns.multipleHooks++;
  }
  
  // Find where loading state is handled
  const loadingPattern = /if\s*\((loading|isLoading|[\w\s|&]+Loading)\)\s*\{[\s\S]*?return[\s\S]*?\n\s*\}/;
  const loadingMatch = content.match(loadingPattern);
  
  if (loadingMatch) {
    // Add error handling right after loading check
    const errorHandling = `\n\n  // Error state\n  if (isError || error) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <p className="text-red-500 mb-2">Failed to load data</p>\n          <p className="text-sm text-gray-500">\n            {error?.message || "An error occurred while loading the data"}\n          </p>\n        </div>\n      </div>\n    );\n  }`;
    
    content = content.replace(
      loadingPattern,
      loadingMatch[0] + errorHandling
    );
    modified = true;
  } else {
    // No loading state found - add both loading and error handling after hook declarations
    const componentFunctionPattern = /export\s+function\s+\w+[^{]*\{[\s\S]*?(const\s+\{[^}]+\}\s*=\s*use\w+[^;]+;)/;
    const componentMatch = content.match(componentFunctionPattern);
    
    if (componentMatch) {
      const insertPoint = componentMatch.index + componentMatch[0].length;
      const errorHandling = `\n\n  // Loading state\n  if (isLoading || loading) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>\n          <p className="text-muted-foreground">Loading...</p>\n        </div>\n      </div>\n    );\n  }\n\n  // Error state\n  if (isError || error) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <p className="text-red-500 mb-2">Failed to load data</p>\n          <p className="text-sm text-gray-500">\n            {error?.message || "An error occurred while loading the data"}\n          </p>\n        </div>\n      </div>\n    );\n  }`;
      
      content = content.slice(0, insertPoint) + errorHandling + content.slice(insertPoint);
      modified = true;
    }
  }
  
  if (!singleHookMatches.length && !hasMultipleHooks) {
    stats.patterns.noHooks++;
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    stats.componentsFixed++;
    console.log(`✅ Fixed component: ${componentPath}`);
  } else {
    stats.skipped.push(`No changes needed: ${componentPath}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting Atomic Workflow Error Handling Remediation V2\n');
  console.log('=' .repeat(60));
  console.log('📋 Fixing 229 components with missing error handling');
  console.log('-'.repeat(60));
  
  COMPONENTS_TO_FIX.forEach(componentPath => {
    try {
      fixComponent(componentPath);
    } catch (error) {
      stats.errors.push(`Error fixing ${componentPath}: ${error.message}`);
      console.error(`❌ Error fixing ${componentPath}:`, error.message);
    }
  });
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 REMEDIATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Components fixed: ${stats.componentsFixed}/${COMPONENTS_TO_FIX.length}`);
  console.log(`⏭️  Skipped: ${stats.skipped.length}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  
  console.log('\n📈 PATTERN BREAKDOWN:');
  console.log(`  - Single hook pattern: ${stats.patterns.singleHook}`);
  console.log(`  - Multiple hooks pattern: ${stats.patterns.multipleHooks}`);
  console.log(`  - No hooks found: ${stats.patterns.noHooks}`);
  console.log(`  - Already has error handling: ${stats.patterns.alreadyHasError}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  const percentComplete = ((stats.componentsFixed / COMPONENTS_TO_FIX.length) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 COMPLETION: ${stats.componentsFixed}/${COMPONENTS_TO_FIX.length} (${percentComplete}%)`);
  console.log('='.repeat(60));
  
  if (stats.componentsFixed === COMPONENTS_TO_FIX.length) {
    console.log('\n✅ 100% COMPLETE - All workflows now have error handling!');
  } else {
    console.log(`\n⚠️  ${COMPONENTS_TO_FIX.length - stats.componentsFixed} files still need attention`);
  }
}

// Run the script
main();
