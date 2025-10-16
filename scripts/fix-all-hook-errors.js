#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all hook-related errors...\n');

// Fix wrong parameter order: useModuleData('module', 'tab', workspaceId) -> useModuleData(workspaceId, 'module', 'tab')
const filesToFix = [
  'src/components/companies/companies-bids-tab.tsx',
  'src/components/companies/companies-companies-compliance-tab.tsx',
  'src/components/companies/companies-companies-invoices-tab.tsx',
  'src/components/companies/companies-companies-reviews-tab.tsx',
  'src/components/companies/companies-companies-work-orders-tab.tsx',
  'src/components/companies/companies-deliverables-tab.tsx',
  'src/components/companies/companies-documents-tab.tsx',
  'src/components/companies/companies-scopes-of-work-tab.tsx',
  'src/components/companies/companies-subcontractor-profile-tab.tsx',
  'src/components/events/events-all-events-tab.tsx',
  'src/components/finance/finance-accounts-tab.tsx',
  'src/components/finance/finance-budgets-tab.tsx',
  'src/components/finance/finance-expenses-tab.tsx',
  'src/components/finance/finance-forecasts-tab.tsx',
  'src/components/finance/finance-gl-codes-tab.tsx',
  'src/components/finance/finance-invoices-tab.tsx',
  'src/components/finance/finance-payments-tab.tsx',
  'src/components/finance/finance-payroll-tab.tsx',
  'src/components/finance/finance-reconciliation-tab.tsx',
  'src/components/finance/finance-revenue-tab.tsx',
  'src/components/finance/finance-taxes-tab.tsx',
  'src/components/finance/finance-transactions-tab.tsx',
  'src/components/jobs/jobs-active-tab.tsx',
  'src/components/jobs/jobs-archived-tab.tsx',
  'src/components/jobs/jobs-checklists-tab.tsx',
  'src/components/jobs/jobs-completed-tab.tsx',
  'src/components/jobs/jobs-dispatch-tab.tsx',
  'src/components/jobs/jobs-estimates-tab.tsx',
  'src/components/jobs/jobs-jobs-compliance-tab.tsx',
  'src/components/jobs/jobs-jobs-invoices-tab.tsx',
  'src/components/jobs/jobs-offers-tab.tsx',
  'src/components/jobs/jobs-overview-tab.tsx',
  'src/components/jobs/jobs-recruiting-tab.tsx',
  'src/components/jobs/jobs-rfps-tab.tsx',
  'src/components/jobs/jobs-shortlists-tab.tsx',
  'src/components/jobs/jobs-work-orders-tab.tsx',
  'src/components/locations/locations-access-tab.tsx',
  'src/components/locations/locations-bim-models-tab.tsx',
  'src/components/locations/locations-coordination-tab.tsx',
  'src/components/locations/locations-logistics-tab.tsx',
  'src/components/locations/locations-spatial-features-tab.tsx',
  'src/components/locations/locations-utilities-tab.tsx',
  'src/components/locations/locations-warehousing-tab.tsx',
  'src/components/people/people-applicants-tab.tsx',
  'src/components/people/people-assignments-tab.tsx',
  'src/components/people/people-onboarding-tab.tsx',
  'src/components/people/people-openings-tab.tsx',
  'src/components/people/people-personnel-tab.tsx',
  'src/components/people/people-teams-tab.tsx',
  'src/components/people/people-timekeeping-tab.tsx',
  'src/components/people/people-training-tab.tsx',
  'src/components/procurement/procurement-agreements-tab.tsx',
  'src/components/procurement/procurement-audits-tab.tsx',
  'src/components/procurement/procurement-fulfillment-tab.tsx',
  'src/components/procurement/procurement-line-items-tab.tsx',
  'src/components/procurement/procurement-orders-tab.tsx',
  'src/components/procurement/procurement-overview-tab.tsx',
  'src/components/procurement/procurement-procurement-approvals-tab.tsx',
  'src/components/procurement/procurement-requisitions-tab.tsx',
  'src/components/projects/projects-activations-tab.tsx',
  'src/components/projects/projects-compliance-tab.tsx',
  'src/components/projects/projects-costs-tab.tsx',
  'src/components/projects/projects-milestones-tab.tsx',
  'src/components/projects/projects-overview-tab.tsx',
  'src/components/projects/projects-projects-checklists-tab.tsx',
  'src/components/projects/projects-projects-work-orders-tab.tsx',
  'src/components/projects/projects-safety-tab.tsx',
  'src/components/projects/projects-tasks-tab.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix pattern: useModuleData('module', 'tab', workspaceId)
  const wrongPattern = /useModuleData\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*(\w+)\s*\)/g;
  if (wrongPattern.test(content)) {
    content = content.replace(wrongPattern, (match, module, tab, workspaceId) => {
      return `useModuleData(${workspaceId}, '${module}', '${tab}')`;
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  }
});

console.log('\n✅ All hook errors fixed!');
