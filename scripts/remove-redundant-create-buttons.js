#!/usr/bin/env node

/**
 * REMOVE REDUNDANT CREATE BUTTONS
 * 
 * Removes all redundant create buttons from data views across the application.
 * Page layout headers already provide create functionality.
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
  errors: [],
  changes: []
};

function removeRedundantButtons(filePath) {
  const fullPath = path.join(COMPONENTS_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    results.errors.push({ file: filePath, error: 'File not found' });
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const originalContent = content;
  let changesMade = [];
  
  // Pattern 1: Remove empty state sections with create buttons
  // These typically look like: {data.length === 0 && (<div>...button...</div>)}
  const emptyStatePattern = /\{[^}]*\.length\s*===\s*0\s*&&\s*\([^)]*<div[^>]*className="[^"]*(?:empty|no-data|no-items)[^"]*"[^>]*>[\s\S]*?<Button[^>]*(?:aria-label[^>]*createButton|onClick[^>]*create|>[\s\S]*?(?:\+|Add|Create|New))[^>]*>[\s\S]*?<\/Button>[\s\S]*?<\/div>\s*\)\}/g;
  
  if (emptyStatePattern.test(content)) {
    // For empty states, we'll keep the message but remove the button
    content = content.replace(
      /(<div[^>]*className="[^"]*(?:empty|no-data|no-items)[^"]*"[^>]*>[\s\S]*?)(<Button[^>]*(?:aria-label[^>]*createButton|onClick[^>]*create)[^>]*>[\s\S]*?<\/Button>)([\s\S]*?<\/div>)/g,
      (match, before, button, after) => {
        changesMade.push('Removed create button from empty state');
        return before + after;
      }
    );
  }
  
  // Pattern 2: Remove standalone button sections in empty states
  // Look for buttons with createButton aria-label or create-related onClick
  const standaloneButtonPattern = /<Button\s+[^>]*(?:aria-label=\{tCommon\('aria\.createButton'|onClick=\{[^}]*(?:setCreate|handleCreate|onCreate))[^>]*>[\s\S]*?<\/Button>/g;
  
  const lines = content.split('\n');
  const newLines = [];
  let skipNext = false;
  let inEmptyState = false;
  let emptyStateDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Track empty state blocks
    if (trimmed.includes('.length === 0') || trimmed.includes('No data') || trimmed.includes('No items')) {
      inEmptyState = true;
      emptyStateDepth = 0;
    }
    
    if (inEmptyState) {
      emptyStateDepth += (line.match(/{/g) || []).length;
      emptyStateDepth -= (line.match(/}/g) || []).length;
      
      if (emptyStateDepth <= 0) {
        inEmptyState = false;
      }
    }
    
    // Skip lines with redundant create buttons in empty states
    if (inEmptyState && 
        (trimmed.includes('aria-label={tCommon(\'aria.createButton\'') ||
         trimmed.includes('onClick={() => setCreateDialogOpen(true)') ||
         (trimmed.includes('<Button') && trimmed.includes('Create')))) {
      
      // Skip this button and its closing tag
      let depth = (line.match(/<Button/g) || []).length;
      depth -= (line.match(/<\/Button>/g) || []).length;
      
      if (depth > 0) {
        // Multi-line button, skip until we find the closing tag
        while (i < lines.length - 1 && depth > 0) {
          i++;
          depth -= (lines[i].match(/<\/Button>/g) || []).length;
        }
      }
      
      changesMade.push(`Removed redundant create button at line ${i + 1}`);
      continue;
    }
    
    newLines.push(line);
  }
  
  content = newLines.join('\n');
  
  // Pattern 3: Clean up empty divs left behind
  content = content.replace(
    /<div className="[^"]*(?:empty|no-data)[^"]*">\s*<\/div>/g,
    ''
  );
  
  // Pattern 4: For profile/professional-tab.tsx specifically - remove inline add buttons
  if (filePath.includes('professional-tab.tsx')) {
    content = content.replace(
      /<Button\s+variant="outline"\s+size="sm"\s+onClick=\{addExperience\}>\s*<Plus[^>]*>\s*Add Experience\s*<\/Button>/g,
      ''
    );
    content = content.replace(
      /<Button\s+variant="outline"\s+size="sm"\s+onClick=\{addEducation\}>\s*<Plus[^>]*>\s*Add Education\s*<\/Button>/g,
      ''
    );
    changesMade.push('Removed inline Add Experience/Education buttons');
  }
  
  // Pattern 5: For admin/custom-statuses-tab.tsx - remove color picker buttons
  if (filePath.includes('custom-statuses-tab.tsx')) {
    // Keep the color picker UI but remove redundant create buttons
    content = content.replace(
      /<Button\s+onClick=\{handleCreateStatus\}[^>]*>\s*(?:Create Status|Add Status)\s*<\/Button>/g,
      ''
    );
    changesMade.push('Removed redundant status creation buttons');
  }
  
  // Only write if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    results.fixed++;
    results.changes.push({
      file: filePath,
      changes: changesMade
    });
    console.log(`✅ Fixed: ${filePath} (${changesMade.length} changes)`);
  } else {
    console.log(`⚠️  No changes needed: ${filePath}`);
  }
  
  results.processed++;
}

console.log('🔧 Starting remediation of redundant create buttons...\n');
console.log(`Files to process: ${filesToFix.length}\n`);

filesToFix.forEach(file => {
  try {
    removeRedundantButtons(file);
  } catch (error) {
    results.errors.push({ file, error: error.message });
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('REMEDIATION COMPLETE');
console.log('='.repeat(80));
console.log(`Files Processed: ${results.processed}`);
console.log(`Files Fixed: ${results.fixed}`);
console.log(`Errors: ${results.errors.length}`);

if (results.errors.length > 0) {
  console.log('\n❌ ERRORS:');
  results.errors.forEach(e => {
    console.log(`  ${e.file}: ${e.error}`);
  });
}

console.log('\n📄 Changes summary saved to: REDUNDANT_BUTTONS_REMEDIATION.json\n');

fs.writeFileSync(
  path.join(__dirname, '../REDUNDANT_BUTTONS_REMEDIATION.json'),
  JSON.stringify(results, null, 2)
);

process.exit(results.errors.length > 0 ? 1 : 0);
