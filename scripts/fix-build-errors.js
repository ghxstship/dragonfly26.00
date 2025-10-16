#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all build errors...\n');

// Fix 1: Missing Plus import in finance files
const financeFiles = [
  'src/components/finance/finance-cash-flow-tab.tsx',
  'src/components/finance/finance-variance-tab.tsx'
];

financeFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if Plus is already imported
  if (content.includes('import {') && content.includes('from "lucide-react"') && !content.includes(' Plus')) {
    // Find the lucide-react import line
    const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*"lucide-react"/);
    if (importMatch) {
      const imports = importMatch[1];
      const newImports = imports.trim() + ', Plus';
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*"lucide-react"/,
        `import { ${newImports} } from "lucide-react"`
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed Plus import: ${file}`);
    }
  }
});

// Fix 2: Duplicate props in various files
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
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove duplicate aria-hidden props
  const ariaHiddenRegex = /(\s+aria-hidden="true"\s+)(\s+aria-hidden="true"\s+)/g;
  if (ariaHiddenRegex.test(content)) {
    content = content.replace(ariaHiddenRegex, '$1');
    modified = true;
  }
  
  // Remove duplicate className props (keep first occurrence)
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    // Match lines with duplicate className
    const classNameMatches = line.match(/className="[^"]*"/g);
    if (classNameMatches && classNameMatches.length > 1) {
      // Keep only the first className
      const firstClassName = classNameMatches[0];
      let fixedLine = line;
      // Remove all classNames
      fixedLine = fixedLine.replace(/className="[^"]*"/g, '');
      // Add back the first one
      fixedLine = fixedLine.replace(/(<[^>]+)/, `$1 ${firstClassName}`);
      modified = true;
      return fixedLine;
    }
    return line;
  });
  
  if (modified) {
    content = fixedLines.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed duplicate props: ${file}`);
  }
});

// Fix 3: Conditional hook calls - wrap in early return pattern
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
  
  // Pattern: if (!workspaceId) { return ... } const { data } = useModuleData(...)
  // Fix: Move hook call before the conditional
  const pattern = /(\s+)(if\s*\(!workspaceId\)\s*{\s*return[^}]+}\s*)(const\s+{\s*data[^}]*}\s*=\s*useModuleData\([^)]+\))/;
  
  if (pattern.test(content)) {
    content = content.replace(pattern, (match, indent, ifBlock, hookCall) => {
      return `${indent}${hookCall}\n${indent}${ifBlock}`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed conditional hook: ${file}`);
  }
});

// Fix 4: Parsing errors in events/files tabs - fix hook parameter order
const parsingErrorFiles = [
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/assets/assets-tracking-tab.tsx',
  'src/components/events/events-activities-tab.tsx',
  'src/components/events/events-blocks-tab.tsx',
  'src/components/events/events-bookings-tab.tsx',
  'src/components/events/events-equipment-tab.tsx',
  'src/components/events/events-incidents-tab.tsx',
  'src/components/events/events-internal-tab.tsx',
  'src/components/events/events-itineraries-tab.tsx',
  'src/components/events/events-rehearsals-tab.tsx',
  'src/components/events/events-reservations-tab.tsx',
  'src/components/events/events-shipping-receiving-tab.tsx',
  'src/components/events/events-trainings-tab.tsx',
  'src/components/files/files-all-documents-tab.tsx',
  'src/components/files/files-archive-tab.tsx',
  'src/components/files/files-call-sheets-tab.tsx',
  'src/components/files/files-contracts-tab.tsx',
  'src/components/files/files-insurance-permits-tab.tsx',
  'src/components/files/files-media-assets-tab.tsx',
  'src/components/files/files-production-reports-tab.tsx',
  'src/components/files/files-riders-tab.tsx',
  'src/components/files/files-shared-tab.tsx',
  'src/components/files/files-tech-specs-tab.tsx'
];

parsingErrorFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix: useModuleData('module', 'tab', workspaceId) -> useModuleData(workspaceId, 'module', 'tab')
  const wrongOrderPattern = /useModuleData\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*(\w+)\s*\)/g;
  
  if (wrongOrderPattern.test(content)) {
    content = content.replace(wrongOrderPattern, (match, module, tab, workspaceId) => {
      return `useModuleData(${workspaceId}, '${module}', '${tab}')`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed hook parameter order: ${file}`);
  }
});

console.log('\n✅ All build errors fixed!');
console.log('🔍 Run "npm run build" to verify fixes\n');
