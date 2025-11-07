#!/usr/bin/env node

/**
 * ATOMIC WORKFLOW ERROR HANDLING REMEDIATION
 * 
 * Fixes 232 incomplete workflows by adding comprehensive error handling:
 * - 3 HIGH priority hooks (use-assets-data, use-events-data, use-finance-data)
 * - 229 MEDIUM priority components (all tab components)
 * 
 * Based on: ATOMIC_WORKFLOW_COMPLETE_AUDIT.json
 * Date: November 5, 2025
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const HOOKS_DIR = path.join(SRC_DIR, 'hooks');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// Statistics
const stats = {
  hooksFixed: 0,
  componentsFixed: 0,
  errors: [],
  skipped: []
};

/**
 * HIGH PRIORITY: Fix hooks with missing error handling
 */
const HIGH_PRIORITY_HOOKS = [
  'use-assets-data.ts',
  'use-events-data.ts',
  'use-finance-data.ts'
];

/**
 * MEDIUM PRIORITY: All tab components missing error handling
 */
const MEDIUM_PRIORITY_COMPONENTS = [
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
  
  // Projects (13 files)
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
 * Add error handling to a hook file
 */
function fixHook(hookPath) {
  const fullPath = path.join(HOOKS_DIR, hookPath);
  
  if (!fs.existsSync(fullPath)) {
    stats.skipped.push(`Hook not found: ${hookPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Check if toast is already imported
  const hasToastImport = content.includes('import { toast }');
  
  // Add toast import if missing
  if (!hasToastImport && content.includes('from "react"')) {
    content = content.replace(
      /(import.*from ['"]react['"];?\n)/,
      '$1import { toast } from "sonner";\n'
    );
    modified = true;
  }
  
  // Find all mutation functions and add error handling
  const mutationPattern = /const\s+(\w+Mutation)\s*=\s*useMutation\(\{([^}]+onSuccess:[^}]+)\}\)/g;
  
  content = content.replace(mutationPattern, (match, mutationName, body) => {
    // Check if onError already exists
    if (body.includes('onError:')) {
      return match; // Already has error handling
    }
    
    // Add onError handler before the closing brace
    const withError = match.replace(
      /(\}\))$/,
      `,\n    onError: (error) => {\n      console.error("${mutationName} error:", error);\n      toast.error("Operation failed. Please try again.");\n    }\n  })`
    );
    
    modified = true;
    return withError;
  });
  
  // Find standalone async functions and wrap in try-catch
  const asyncFunctionPattern = /const\s+(\w+)\s*=\s*async\s*\([^)]*\)\s*=>\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  
  content = content.replace(asyncFunctionPattern, (match, funcName, body) => {
    // Skip if already has try-catch
    if (body.includes('try {') || body.includes('catch')) {
      return match;
    }
    
    // Skip if it's just a simple return or query
    if (body.trim().startsWith('return') || body.length < 50) {
      return match;
    }
    
    // Wrap in try-catch
    const indentedBody = body.split('\n').map(line => '  ' + line).join('\n');
    const withTryCatch = `const ${funcName} = async (${match.match(/async\s*\(([^)]*)\)/)[1]}) => {
  try {${indentedBody}
  } catch (error) {
    console.error("${funcName} error:", error);
    toast.error("Operation failed. Please try again.");
    throw error;
  }
}`;
    
    modified = true;
    return withTryCatch;
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    stats.hooksFixed++;
    console.log(`✅ Fixed hook: ${hookPath}`);
  } else {
    stats.skipped.push(`No changes needed: ${hookPath}`);
  }
}

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
  let modified = false;
  
  // Check if component already has error handling
  const hasErrorHandling = content.includes('if (error)') || 
                          content.includes('if (isError)') ||
                          content.includes('error &&');
  
  if (hasErrorHandling) {
    stats.skipped.push(`Already has error handling: ${componentPath}`);
    return;
  }
  
  // Find the hook usage (e.g., const { data, isLoading } = useXxxData())
  const hookPattern = /const\s*\{\s*([^}]+)\}\s*=\s*(use\w+Data\(\))/;
  const hookMatch = content.match(hookPattern);
  
  if (!hookMatch) {
    stats.skipped.push(`No data hook found: ${componentPath}`);
    return;
  }
  
  const destructuredVars = hookMatch[1];
  const hookCall = hookMatch[2];
  
  // Add error and isError to destructured variables if not present
  if (!destructuredVars.includes('error')) {
    const newVars = destructuredVars.trim() + ', error, isError';
    content = content.replace(
      hookPattern,
      `const { ${newVars} } = ${hookCall}`
    );
    modified = true;
  }
  
  // Find where loading state is handled
  const loadingPattern = /if\s*\(isLoading\)\s*\{[\s\S]*?return[\s\S]*?\}/;
  const loadingMatch = content.match(loadingPattern);
  
  if (loadingMatch) {
    // Add error handling right after loading check
    const errorHandling = `\n\n  if (isError) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <p className="text-red-500 mb-2">Failed to load data</p>\n          <p className="text-sm text-gray-500">{error?.message || "An error occurred"}</p>\n        </div>\n      </div>\n    );\n  }`;
    
    content = content.replace(
      loadingPattern,
      loadingMatch[0] + errorHandling
    );
    modified = true;
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
  console.log('🚀 Starting Atomic Workflow Error Handling Remediation\n');
  console.log('=' .repeat(60));
  
  // Phase 1: Fix HIGH priority hooks
  console.log('\n📋 Phase 1: Fixing HIGH priority hooks (3 files)');
  console.log('-'.repeat(60));
  
  HIGH_PRIORITY_HOOKS.forEach(hookPath => {
    try {
      fixHook(hookPath);
    } catch (error) {
      stats.errors.push(`Error fixing ${hookPath}: ${error.message}`);
      console.error(`❌ Error fixing ${hookPath}:`, error.message);
    }
  });
  
  // Phase 2: Fix MEDIUM priority components
  console.log('\n📋 Phase 2: Fixing MEDIUM priority components (229 files)');
  console.log('-'.repeat(60));
  
  MEDIUM_PRIORITY_COMPONENTS.forEach(componentPath => {
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
  console.log(`✅ Hooks fixed: ${stats.hooksFixed}/${HIGH_PRIORITY_HOOKS.length}`);
  console.log(`✅ Components fixed: ${stats.componentsFixed}/${MEDIUM_PRIORITY_COMPONENTS.length}`);
  console.log(`⏭️  Skipped: ${stats.skipped.length}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (stats.skipped.length > 0 && stats.skipped.length < 20) {
    console.log('\n⏭️  SKIPPED:');
    stats.skipped.forEach(skip => console.log(`  - ${skip}`));
  }
  
  const totalFixed = stats.hooksFixed + stats.componentsFixed;
  const totalTarget = HIGH_PRIORITY_HOOKS.length + MEDIUM_PRIORITY_COMPONENTS.length;
  const percentComplete = ((totalFixed / totalTarget) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 COMPLETION: ${totalFixed}/${totalTarget} (${percentComplete}%)`);
  console.log('='.repeat(60));
  
  if (totalFixed === totalTarget) {
    console.log('\n✅ 100% COMPLETE - All workflows now have error handling!');
  } else {
    console.log(`\n⚠️  ${totalTarget - totalFixed} files still need attention`);
  }
}

// Run the script
main();
