#!/usr/bin/env node

/**
 * AUTOMATED FIX FOR ALL REDUNDANT CREATE BUTTONS
 * Removes redundant create buttons from 46 files with violations
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const filesToFix = [
  'admin/custom-statuses-tab.tsx',
  'companies/companies-bids-tab.tsx',
  'companies/companies-companies-compliance-tab.tsx',
  'companies/companies-companies-invoices-tab.tsx',
  'companies/companies-companies-reviews-tab.tsx',
  'companies/companies-companies-work-orders-tab.tsx',
  'companies/companies-deliverables-tab.tsx',
  'companies/companies-documents-tab.tsx',
  'companies/companies-organizations-tab.tsx',
  'companies/companies-scopes-of-work-tab.tsx',
  'companies/companies-subcontractor-profile-tab.tsx',
  'finance/finance-accounts-tab.tsx',
  'finance/finance-budgets-tab.tsx',
  'finance/finance-expenses-tab.tsx',
  'finance/finance-forecasts-tab.tsx',
  'finance/finance-gl-codes-tab.tsx',
  'finance/finance-invoices-tab.tsx',
  'finance/finance-payments-tab.tsx',
  'finance/finance-payroll-tab.tsx',
  'finance/finance-reconciliation-tab.tsx',
  'finance/finance-revenue-tab.tsx',
  'finance/finance-taxes-tab.tsx',
  'finance/finance-transactions-tab.tsx',
  'insights/insights-objectives-tab.tsx',
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
  'jobs/jobs-recruiting-tab.tsx',
  'jobs/jobs-rfps-tab.tsx',
  'jobs/jobs-shortlists-tab.tsx',
  'procurement/procurement-agreements-tab.tsx',
  'procurement/procurement-audits-tab.tsx',
  'procurement/procurement-fulfillment-tab.tsx',
  'procurement/procurement-line-items-tab.tsx',
  'procurement/procurement-orders-tab.tsx',
  'procurement/procurement-overview-tab.tsx',
  'procurement/procurement-procurement-approvals-tab.tsx',
  'procurement/procurement-requisitions-tab.tsx',
  'profile/professional-tab.tsx'
];

const results = {
  processed: 0,
  fixed: 0,
  skipped: 0,
  errors: []
};

function fixFile(filePath) {
  const fullPath = path.join(COMPONENTS_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    results.errors.push({ file: filePath, error: 'File not found' });
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const originalContent = content;
  
  // Pattern 1: Remove empty state button blocks (most common pattern)
  // This matches the multi-line button structure
  let lines = content.split('\n');
  let newLines = [];
  let skipUntilClosingButton = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line starts a redundant button
    if (trimmed.startsWith('<Button aria-label={tCommon(\'aria.createButton\'')) {
      skipUntilClosingButton = true;
      continue;
    }
    
    // Skip lines until we find the closing button tag
    if (skipUntilClosingButton) {
      if (trimmed === '</Button>') {
        skipUntilClosingButton = false;
      }
      continue;
    }
    
    newLines.push(line);
  }
  
  content = newLines.join('\n');
  
  // Pattern 2: For profile/professional-tab.tsx - remove inline add buttons
  if (filePath.includes('professional-tab.tsx')) {
    // Remove "Add Experience" button
    content = content.replace(
      /<Button\s+variant="outline"\s+size="sm"\s+onClick=\{addExperience\}>\s*<Plus[^>]+>\s*\{t\('profile\.professional\.addExperience'\)\}\s*<\/Button>/g,
      ''
    );
    
    // Remove "Add Education" button
    content = content.replace(
      /<Button\s+variant="outline"\s+size="sm"\s+onClick=\{addEducation\}>\s*<Plus[^>]+>\s*\{t\('profile\.professional\.addEducation'\)\}\s*<\/Button>/g,
      ''
    );
    
    // Remove "Add Certification" button
    content = content.replace(
      /<Button\s+variant="outline"\s+size="sm"\s+onClick=\{addCertification\}>\s*<Plus[^>]+>\s*\{t\('profile\.professional\.addCertification'\)\}\s*<\/Button>/g,
      ''
    );
  }
  
  // Pattern 3: For admin/custom-statuses-tab.tsx - remove create status button
  if (filePath.includes('custom-statuses-tab.tsx')) {
    content = content.replace(
      /<Button\s+onClick=\{handleCreateStatus\}\s+className="flex-1">\s*Create Status\s*<\/Button>/g,
      ''
    );
    
    // Also remove the cancel button's flex-1 class and make it full width
    content = content.replace(
      /<Button\s+variant="outline"\s+onClick=\{\(\) => setIsCreating\(false\)\}\s+className="flex-1">/g,
      '<Button variant="outline" onClick={() => setIsCreating(false)} className="w-full">'
    );
    
    // Remove the flex gap-2 wrapper if both buttons are gone
    content = content.replace(
      /<div className="flex gap-2">\s*<Button variant="outline"[^>]+onClick=\{\(\) => setIsCreating\(false\)\}[^>]+>\s*Cancel\s*<\/Button>\s*<\/div>/g,
      '<Button variant="outline" onClick={() => setIsCreating(false)} className="w-full">\n                    Cancel\n                  </Button>'
    );
  }
  
  // Pattern 4: For insights/insights-objectives-tab.tsx - remove any remaining buttons
  if (filePath.includes('insights-objectives-tab.tsx')) {
    content = content.replace(
      /\s*<Button[^>]*aria-label=\{tCommon\('aria\.createButton'[^}]+\}\)[^>]*>[\s\S]*?<\/Button>/g,
      ''
    );
  }
  
  // Only write if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    results.fixed++;
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    results.skipped++;
    console.log(`⚠️  No changes: ${filePath}`);
  }
  
  results.processed++;
}

console.log('🔧 Starting automated fix for redundant create buttons...\n');
console.log(`Files to process: ${filesToFix.length}\n`);

filesToFix.forEach(file => {
  try {
    fixFile(file);
  } catch (error) {
    results.errors.push({ file, error: error.message });
    console.error(`❌ Error: ${file} - ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('AUTOMATED FIX COMPLETE');
console.log('='.repeat(80));
console.log(`Files Processed: ${results.processed}`);
console.log(`Files Fixed: ${results.fixed}`);
console.log(`Files Skipped: ${results.skipped}`);
console.log(`Errors: ${results.errors.length}\n`);

if (results.errors.length > 0) {
  console.log('❌ ERRORS:');
  results.errors.forEach(e => {
    console.log(`  ${e.file}: ${e.error}`);
  });
}

process.exit(results.errors.length > 0 ? 1 : 0);
