#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing remaining build errors...\n');

// Fix duplicate props by removing all but first occurrence on same element
function fixDuplicateProps(content) {
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for duplicate aria-hidden
    if ((line.match(/aria-hidden="true"/g) || []).length > 1) {
      lines[i] = line.replace(/(\s+aria-hidden="true")(\s+aria-hidden="true")+/g, '$1');
      modified = true;
    }
    
    // Check for duplicate className on same line
    const classNameMatches = line.match(/className="[^"]*"/g);
    if (classNameMatches && classNameMatches.length > 1) {
      // Keep first className, remove others
      let fixedLine = line;
      for (let j = 1; j < classNameMatches.length; j++) {
        fixedLine = fixedLine.replace(classNameMatches[j], '');
      }
      lines[i] = fixedLine;
      modified = true;
    }
  }
  
  return { content: lines.join('\n'), modified };
}

// Fix conditional hook calls
function fixConditionalHooks(content) {
  let modified = false;
  
  // Pattern 1: if (!workspaceId) return ... followed by useModuleData
  const pattern1 = /([ \t]+)(if\s*\(!workspaceId\)\s*{\s*return[^}]+}\s*\n)([ \t]+)(const\s+{\s*data[^}]*}\s*=\s*useModuleData\([^)]+\))/;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, (match, indent1, ifBlock, indent2, hookCall) => {
      return `${indent2}${hookCall}\n${indent1}${ifBlock}`;
    });
    modified = true;
  }
  
  return { content, modified };
}

// Files with duplicate props
const duplicatePropsFiles = [
  'src/components/assets/assets-approvals-tab.tsx',
  'src/components/assets/counts-tab.tsx',
  'src/components/assets/inventory-tab.tsx',
  'src/components/dashboard/dashboard-my-advances-tab.tsx',
  'src/components/dashboard/dashboard-my-files-tab.tsx',
  'src/components/dashboard/dashboard-my-orders-tab.tsx',
  'src/components/dashboard/dashboard-my-reports-tab.tsx',
  'src/components/dashboard/dashboard-my-travel-tab.tsx',
  'src/components/events/events-calendar-tab.tsx',
  'src/components/events/events-run-of-show-tab.tsx',
  'src/components/events/events-tours-tab.tsx'
];

duplicatePropsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const result = fixDuplicateProps(content);
  
  if (result.modified) {
    fs.writeFileSync(filePath, result.content, 'utf8');
    console.log(`✅ Fixed duplicate props: ${file}`);
  }
});

// Files with conditional hooks
const conditionalHookFiles = [
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

conditionalHookFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const result = fixConditionalHooks(content);
  
  if (result.modified) {
    fs.writeFileSync(filePath, result.content, 'utf8');
    console.log(`✅ Fixed conditional hook: ${file}`);
  }
});

// Fix assets-overview-tab.tsx specifically
const assetsOverviewPath = path.join(process.cwd(), 'src/components/assets/assets-overview-tab.tsx');
if (fs.existsSync(assetsOverviewPath)) {
  let content = fs.readFileSync(assetsOverviewPath, 'utf8');
  
  // Fix the hook parameter order
  content = content.replace(
    /useModuleData\(workspaceId,\s*'assets',\s*'overview'\)/,
    "useModuleData(workspaceId, 'assets', 'overview')"
  );
  
  fs.writeFileSync(assetsOverviewPath, content, 'utf8');
  console.log('✅ Fixed assets-overview-tab.tsx');
}

console.log('\n✅ Remaining errors fixed!');
