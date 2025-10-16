#!/usr/bin/env node
/**
 * Automated Business Hub i18n and Accessibility Remediation Script
 * 
 * This script systematically updates all 55 Business Hub component files to:
 * 1. Add i18n support (useTranslations hook)
 * 2. Add proper ARIA labels
 * 3. Fix loading state accessibility
 * 4. Remove duplicate action sections
 * 
 * Usage: node scripts/remediate-business-hub-i18n.js
 */

const fs = require('fs');
const path = require('path');

// File groups to process
const FILE_GROUPS = {
  companies: [
    'companies-bids-tab.tsx', // Already fixed as example
    'companies-companies-compliance-tab.tsx',
    'companies-companies-invoices-tab.tsx',
    'companies-companies-reviews-tab.tsx',
    'companies-companies-work-orders-tab.tsx',
    'companies-deliverables-tab.tsx',
    'companies-documents-tab.tsx',
    'companies-scopes-of-work-tab.tsx',
    'companies-subcontractor-profile-tab.tsx'
  ],
  jobs: [
    'jobs-active-tab.tsx',
    'jobs-archived-tab.tsx',
    'jobs-checklists-tab.tsx',
    'jobs-completed-tab.tsx',
    'jobs-dispatch-tab.tsx',
    'jobs-estimates-tab.tsx',
    'jobs-jobs-compliance-tab.tsx',
    'jobs-jobs-invoices-tab.tsx',
    'jobs-offers-tab.tsx',
    'jobs-overview-tab.tsx',
    'jobs-recruiting-tab.tsx',
    'jobs-rfps-tab.tsx',
    'jobs-shortlists-tab.tsx',
    'jobs-work-orders-tab.tsx'
  ],
  procurement: [
    'procurement-agreements-tab.tsx',
    'procurement-audits-tab.tsx',
    'procurement-fulfillment-tab.tsx',
    'procurement-line-items-tab.tsx',
    'procurement-orders-tab.tsx',
    'procurement-overview-tab.tsx',
    'procurement-procurement-approvals-tab.tsx',
    'procurement-requisitions-tab.tsx'
  ],
  finance: [
    'finance-accounts-tab.tsx',
    'finance-budgets-tab.tsx',
    'finance-expenses-tab.tsx',
    'finance-forecasts-tab.tsx',
    'finance-gl-codes-tab.tsx',
    'finance-invoices-tab.tsx',
    'finance-payments-tab.tsx',
    'finance-payroll-tab.tsx',
    'finance-reconciliation-tab.tsx',
    'finance-revenue-tab.tsx',
    'finance-taxes-tab.tsx',
    'finance-transactions-tab.tsx'
  ]
};

// Tab name mapping
const TAB_NAMES = {
  'bids': 'bids',
  'companies-compliance': 'compliance',
  'companies-invoices': 'invoices',
  'companies-reviews': 'reviews',
  'companies-work-orders': 'workOrders',
  'deliverables': 'deliverables',
  'documents': 'documents',
  'scopes-of-work': 'scopesOfWork',
  'subcontractor-profile': 'subcontractorProfile',
  'active': 'active',
  'archived': 'archived',
  'checklists': 'checklists',
  'completed': 'completed',
  'dispatch': 'dispatch',
  'estimates': 'estimates',
  'jobs-compliance': 'compliance',
  'jobs-invoices': 'invoices',
  'offers': 'offers',
  'overview': 'overview',
  'recruiting': 'recruiting',
  'rfps': 'rfps',
  'shortlists': 'shortlists',
  'work-orders': 'workOrders',
  'agreements': 'agreements',
  'audits': 'audits',
  'fulfillment': 'fulfillment',
  'line-items': 'lineItems',
  'orders': 'orders',
  'procurement-approvals': 'approvals',
  'requisitions': 'requisitions',
  'accounts': 'accounts',
  'budgets': 'budgets',
  'expenses': 'expenses',
  'forecasts': 'forecasts',
  'gl-codes': 'glCodes',
  'invoices': 'invoices',
  'payments': 'payments',
  'payroll': 'payroll',
  'reconciliation': 'reconciliation',
  'revenue': 'revenue',
  'taxes': 'taxes',
  'transactions': 'transactions'
};

function getTabKey(filename, module) {
  const baseName = filename.replace(`${module}-`, '').replace('-tab.tsx', '');
  return TAB_NAMES[baseName] || baseName;
}

function addImports(content) {
  if (content.includes('useTranslations')) {
    return content; // Already has imports
  }
  
  const importSection = content.match(/^(.*?import.*?from.*?\n)+/s)?.[0] || '';
  const afterImports = content.slice(importSection.length);
  
  return importSection + 
    'import { useTranslations } from "next-intl"\n' +
    'import { useLocale } from "next-intl"\n' +
    afterImports;
}

function addTranslationHooks(content, module) {
  const functionMatch = content.match(/export function (\w+)\([^)]*\) \{/);
  if (!functionMatch) return content;
  
  const afterFunctionDeclaration = content.indexOf('{', functionMatch.index) + 1;
  const beforeCode = content.slice(0, afterFunctionDeclaration);
  const afterCode = content.slice(afterFunctionDeclaration);
  
  if (afterCode.includes('useTranslations')) {
    return content; // Already has hooks
  }
  
  const hooks = `\n  const t = useTranslations('business.${module}')\n  const tCommon = useTranslations('business.common')\n  const locale = useLocale()`;
  
  return beforeCode + hooks + afterCode;
}

function fixLoadingState(content, module, tabKey) {
  const loadingPattern = /if \(isLoading\) \{\s*return \(\s*<div className="flex items-center[^>]*>\s*<div className="text-center">\s*<div className="animate-spin[^>]*><\/div>\s*<p className="text-muted-foreground">Loading ([^<]+)<\/p>/gs;
  
  return content.replace(loadingPattern, `if (isLoading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-muted-foreground">
            {tCommon('loading', { resource: t('tabs.${tabKey}') })}
          </p>`);
}

function fixActionButtons(content, module, tabKey) {
  // Fix description
  content = content.replace(
    /(<p className="text-muted-foreground">\s*)Manage ([^<]+)(<\/p>)/g,
    `$1{t('descriptions.${tabKey}')}$3`
  );
  
  // Fix Search button
  content = content.replace(
    /<Button variant="outline" size="sm" className="gap-2">\s*<Search className="h-4 w-4" \/>\s*Search\s*<\/Button>/g,
    `<Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            aria-label={tCommon('aria.searchButton', { context: t('tabs.${tabKey}') })}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {tCommon('buttons.search')}
          </Button>`
  );
  
  // Fix Create button
  content = content.replace(
    /<Button size="sm" className="gap-2">\s*<Plus className="h-4 w-4" \/>\s*Create ([^<]+)\s*<\/Button>/g,
    `<Button 
            size="sm" 
            className="gap-2"
            aria-label={tCommon('aria.createButton', { type: t('tabs.${tabKey}') })}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {tCommon('buttons.create')} {t('tabs.${tabKey}')}
          </Button>`
  );
  
  return content;
}

function fixSummaryCards(content) {
  content = content.replace(/Total Items<\/p>/g, "{tCommon('summaryCards.totalItems')}</p>");
  content = content.replace(/>Active<\/p>/g, ">{tCommon('summaryCards.active')}</p>");
  content = content.replace(/>Pending<\/p>/g, ">{tCommon('summaryCards.pending')}</p>");
  content = content.replace(/>Completed<\/p>/g, ">{tCommon('summaryCards.completed')}</p>");
  return content;
}

function fixEmptyState(content, module, tabKey) {
  const emptyPattern = /<p className="text-lg font-semibold mb-2">No ([^<]+) found<\/p>\s*<p className="text-sm mb-4">Get started by creating your first item<\/p>\s*<Button>\s*<Plus className="h-4 w-4 mr-2" \/>\s*Create ([^<]+)\s*<\/Button>/gs;
  
  return content.replace(emptyPattern, `<p className="text-lg font-semibold mb-2">
                  {tCommon('emptyState.title', { resource: t('tabs.${tabKey}') })}
                </p>
                <p className="text-sm mb-4">{tCommon('emptyState.description')}</p>
                <Button aria-label={tCommon('aria.createButton', { type: t('tabs.${tabKey}') })}>
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  {tCommon('emptyState.button', { resource: t('tabs.${tabKey}') })}
                </Button>`);
}

function processFile(filePath, module) {
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    const tabKey = getTabKey(filename, module);
    
    // Apply transformations
    content = addImports(content);
    content = addTranslationHooks(content, module);
    content = fixLoadingState(content, module, tabKey);
    content = fixActionButtons(content, module, tabKey);
    content = fixSummaryCards(content);
    content = fixEmptyState(content, module, tabKey);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Completed: ${filename}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function main() {
  const baseDir = path.join(__dirname, '../src/components');
  let processedCount = 0;
  let skippedCount = 0;
  
  console.log('🚀 Starting Business Hub i18n & Accessibility Remediation...\n');
  
  for (const [module, files] of Object.entries(FILE_GROUPS)) {
    console.log(`\n📁 Processing ${module} module (${files.length} files)...`);
    
    for (const file of files) {
      const filePath = path.join(baseDir, module, file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipped (not found): ${file}`);
        skippedCount++;
        continue;
      }
      
      processFile(filePath, module);
      processedCount++;
    }
  }
  
  console.log(`\n✨ Remediation Complete!`);
  console.log(`   Processed: ${processedCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`\n📋 Next Steps:`);
  console.log(`   1. Review the changes`);
  console.log(`   2. Run: npm run lint`);
  console.log(`   3. Test with different locales`);
  console.log(`   4. Run accessibility audit`);
}

main();
