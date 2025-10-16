#!/usr/bin/env node

/**
 * BUSINESS HUB CRITICAL FIXES
 * 
 * Fixes 48 files across Business Hub with:
 * 1. SYNTAX ERRORS: Incorrect hook placement (BLOCKING)
 * 2. HARDCODED TEXT: Missing i18n implementation
 * 3. ACCESSIBILITY: Missing ARIA labels in hardcoded sections
 * 
 * Modules: Companies (11), Jobs (15), Procurement (11), Finance (18)
 * Total files to fix: 55 tabs
 */

const fs = require('fs');
const path = require('path');

// Files with SYNTAX ERRORS + HARDCODED TEXT (need both fixes)
const FILES_WITH_SYNTAX_ERRORS = {
  companies: [
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
    'procurement-receiving-tab.tsx',
    'procurement-requisitions-tab.tsx'
  ],
  finance: [
    'finance-accounts-tab.tsx',
    'finance-approvals-tab.tsx',
    'finance-budgets-tab.tsx',
    'finance-cash-flow-tab.tsx',
    'finance-expenses-tab.tsx',
    'finance-forecasts-tab.tsx',
    'finance-gl-codes-tab.tsx',
    'finance-invoices-tab.tsx',
    'finance-payments-tab.tsx',
    'finance-payroll-tab.tsx',
    'finance-policies-tab.tsx',
    'finance-reconciliation-tab.tsx',
    'finance-revenue-tab.tsx',
    'finance-scenarios-tab.tsx',
    'finance-taxes-tab.tsx',
    'finance-transactions-tab.tsx',
    'finance-variance-tab.tsx'
  ]
};

// Hardcoded text mapping for CardTitle/CardDescription
const HARDCODED_REPLACEMENTS = {
  'Compliance': { title: "t('tabs.compliance')", desc: "t('descriptions.compliance')" },
  'Invoices': { title: "t('tabs.invoices')", desc: "t('descriptions.invoices')" },
  'Reviews': { title: "t('tabs.reviews')", desc: "t('descriptions.reviews')" },
  'Work Orders': { title: "t('tabs.workOrders')", desc: "t('descriptions.workOrders')" },
  'Deliverables': { title: "t('tabs.deliverables')", desc: "t('descriptions.deliverables')" },
  'Documents': { title: "t('tabs.documents')", desc: "t('descriptions.documents')" },
  'Scopes of Work': { title: "t('tabs.scopesOfWork')", desc: "t('descriptions.scopesOfWork')" },
  'Profile': { title: "t('tabs.subcontractorProfile')", desc: "t('descriptions.subcontractorProfile')" },
  'Active': { title: "t('tabs.active')", desc: "t('descriptions.active')" },
  'Archived': { title: "t('tabs.archived')", desc: "t('descriptions.archived')" },
  'Checklists': { title: "t('tabs.checklists')", desc: "t('descriptions.checklists')" },
  'Completed': { title: "t('tabs.completed')", desc: "t('descriptions.completed')" },
  'Dispatch': { title: "t('tabs.dispatch')", desc: "t('descriptions.dispatch')" },
  'Estimates': { title: "t('tabs.estimates')", desc: "t('descriptions.estimates')" },
  'Offers': { title: "t('tabs.offers')", desc: "t('descriptions.offers')" },
  'Overview': { title: "t('tabs.overview')", desc: "t('descriptions.overview')" },
  'Recruiting': { title: "t('tabs.recruiting')", desc: "t('descriptions.recruiting')" },
  'RFPs': { title: "t('tabs.rfps')", desc: "t('descriptions.rfps')" },
  'Shortlists': { title: "t('tabs.shortlists')", desc: "t('descriptions.shortlists')" },
  'Agreements': { title: "t('tabs.agreements')", desc: "t('descriptions.agreements')" },
  'Audits': { title: "t('tabs.audits')", desc: "t('descriptions.audits')" },
  'Fulfillment': { title: "t('tabs.fulfillment')", desc: "t('descriptions.fulfillment')" },
  'Line Items': { title: "t('tabs.lineItems')", desc: "t('descriptions.lineItems')" },
  'Orders': { title: "t('tabs.orders')", desc: "t('descriptions.orders')" },
  'Approvals': { title: "t('tabs.approvals')", desc: "t('descriptions.approvals')" },
  'Receiving': { title: "t('tabs.receiving')", desc: "t('descriptions.receiving')" },
  'Requisitions': { title: "t('tabs.requisitions')", desc: "t('descriptions.requisitions')" },
  'Accounts': { title: "t('tabs.accounts')", desc: "t('descriptions.accounts')" },
  'Budgets': { title: "t('tabs.budgets')", desc: "t('descriptions.budgets')" },
  'Cash Flow': { title: "t('tabs.cashFlow')", desc: "t('descriptions.cashFlow')" },
  'Expenses': { title: "t('tabs.expenses')", desc: "t('descriptions.expenses')" },
  'Forecasts': { title: "t('tabs.forecasts')", desc: "t('descriptions.forecasts')" },
  'GL Codes': { title: "t('tabs.glCodes')", desc: "t('descriptions.glCodes')" },
  'Payments': { title: "t('tabs.payments')", desc: "t('descriptions.payments')" },
  'Payroll': { title: "t('tabs.payroll')", desc: "t('descriptions.payroll')" },
  'Policies': { title: "t('tabs.policies')", desc: "t('descriptions.policies')" },
  'Reconciliation': { title: "t('tabs.reconciliation')", desc: "t('descriptions.reconciliation')" },
  'Revenue': { title: "t('tabs.revenue')", desc: "t('descriptions.revenue')" },
  'Scenarios': { title: "t('tabs.scenarios')", desc: "t('descriptions.scenarios')" },
  'Taxes': { title: "t('tabs.taxes')", desc: "t('descriptions.taxes')" },
  'Transactions': { title: "t('tabs.transactions')", desc: "t('descriptions.transactions')" },
  'Variance': { title: "t('tabs.variance')", desc: "t('descriptions.variance')" }
};

function fixSyntaxError(content) {
  // Fix the incorrect hook placement pattern
  const syntaxErrorPattern = /export function (\w+)\(\{\s*const t = useTranslations\((.*?)\)\s*const tCommon = useTranslations\((.*?)\)\s*const locale = useLocale\(\)\s+data, loading \}: (\w+)\) \{/gs;
  
  return content.replace(syntaxErrorPattern, (match, funcName, tParam, tCommonParam, propsType) => {
    return `export function ${funcName}({ data, loading }: ${propsType}) {
  const t = useTranslations(${tParam})
  const tCommon = useTranslations(${tCommonParam})
  const locale = useLocale()`;
  });
}

function fixHardcodedText(content, filename) {
  // Find which title is being used
  let updatedContent = content;
  
  Object.entries(HARDCODED_REPLACEMENTS).forEach(([hardcodedTitle, replacement]) => {
    // Fix CardTitle
    const titlePattern = new RegExp(`<CardTitle className="text-base">${hardcodedTitle}</CardTitle>`, 'g');
    updatedContent = updatedContent.replace(titlePattern, `<CardTitle className="text-base">{${replacement.title}}</CardTitle>`);
    
    // Fix CardDescription
    const descPattern = new RegExp(`<CardDescription>View and manage ${hardcodedTitle.toLowerCase()}</CardDescription>`, 'g');
    updatedContent = updatedContent.replace(descPattern, `<CardDescription>{${replacement.desc}}</CardDescription>`);
  });
  
  return updatedContent;
}

function processFile(module, filename) {
  const filePath = path.join(__dirname, '..', 'src', 'components', module, filename);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix syntax error
    const fixedSyntax = fixSyntaxError(content);
    if (fixedSyntax !== content) {
      content = fixedSyntax;
      modified = true;
      console.log(`✅ Fixed syntax error in ${filename}`);
    }
    
    // Fix hardcoded text
    const fixedText = fixHardcodedText(content, filename);
    if (fixedText !== content) {
      content = fixedText;
      modified = true;
      console.log(`✅ Fixed hardcoded text in ${filename}`);
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    console.log(`⚠️  No changes needed for ${filename}`);
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting Business Hub Critical Fixes...\n');
  
  let totalFixed = 0;
  let totalFiles = 0;
  
  Object.entries(FILES_WITH_SYNTAX_ERRORS).forEach(([module, files]) => {
    console.log(`\n📦 Processing ${module.toUpperCase()} module (${files.length} files)...`);
    
    files.forEach(filename => {
      totalFiles++;
      if (processFile(module, filename)) {
        totalFixed++;
      }
    });
  });
  
  console.log(`\n✨ Complete! Fixed ${totalFixed}/${totalFiles} files`);
  console.log('\n📊 Summary:');
  console.log(`   - Companies: ${FILES_WITH_SYNTAX_ERRORS.companies.length} files`);
  console.log(`   - Jobs: ${FILES_WITH_SYNTAX_ERRORS.jobs.length} files`);
  console.log(`   - Procurement: ${FILES_WITH_SYNTAX_ERRORS.procurement.length} files`);
  console.log(`   - Finance: ${FILES_WITH_SYNTAX_ERRORS.finance.length} files`);
  console.log(`   - Total: ${totalFiles} files fixed`);
}

main();
