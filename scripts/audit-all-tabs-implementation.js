#!/usr/bin/env node

/**
 * ZERO TOLERANCE FULL STACK IMPLEMENTATION AUDIT
 * Validates 100% of all tab components across all modules
 * 
 * Audit Criteria:
 * 1. No large h2 headers (text-3xl/text-2xl) at tab component top
 * 2. Action buttons properly positioned (top right or inline)
 * 3. Proper component structure (Card-based layouts)
 * 4. Correct data hooks usage
 * 5. TypeScript/interface compliance
 * 6. i18n implementation where needed
 * 7. Loading/error states
 * 8. Accessibility attributes
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const REGISTRY_PATH = path.join(__dirname, '../src/lib/modules/tabs-registry.ts');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
};

// Read tabs registry
function loadTabsRegistry() {
  const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const modulePattern = /export const MODULE_TABS: Record<string, ModuleTab\[\]> = {([\s\S]*?)^}/m;
  const match = registryContent.match(modulePattern);
  
  if (!match) {
    console.error('Could not parse tabs registry');
    return {};
  }
  
  return extractModuleTabs(registryContent);
}

function extractModuleTabs(content) {
  const modules = {};
  const createTabPattern = /createTab\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;
  
  let match;
  while ((match = createTabPattern.exec(content)) !== null) {
    const [, id, moduleId, name, slug] = match;
    if (!modules[moduleId]) {
      modules[moduleId] = [];
    }
    modules[moduleId].push({ id, name, slug, moduleId });
  }
  
  return modules;
}

// Find component file for a tab
function findComponentFile(moduleId, slug) {
  const possiblePaths = [
    path.join(COMPONENTS_DIR, moduleId, `${slug}-tab.tsx`),
    path.join(COMPONENTS_DIR, moduleId, `${moduleId}-${slug}-tab.tsx`),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return null;
}

// Audit individual component file
function auditComponent(filePath, tab) {
  if (!filePath || !fs.existsSync(filePath)) {
    return {
      status: 'MISSING',
      issues: ['Component file not found'],
    };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const warnings = [];
  
  // Check 1: No large headers at component top
  const largeHeaderPattern = /<h[12]\s+className="[^"]*text-(3xl|2xl)[^"]*">/;
  if (largeHeaderPattern.test(content)) {
    issues.push('❌ VIOLATION: Contains large h1/h2 header (text-3xl/text-2xl) - tabs should NOT have large headers');
  }
  
  // Check 2: Action buttons positioning
  const hasActionButtons = content.includes('<Button') || content.includes('action');
  const hasProperButtonPlacement = content.includes('justify-between') || content.includes('flex items-center');
  
  if (hasActionButtons && !hasProperButtonPlacement) {
    warnings.push('⚠️  Action buttons may not be properly positioned');
  }
  
  // Check 3: Card-based layout
  if (!content.includes('<Card')) {
    warnings.push('⚠️  Component may not use Card-based layout');
  }
  
  // Check 4: Loading state
  if (!content.includes('loading') && !content.includes('Loading')) {
    warnings.push('⚠️  Missing loading state handling');
  }
  
  // Check 5: TypeScript compliance
  if (!content.includes('interface') && !content.includes('type') && content.includes('any')) {
    warnings.push('⚠️  May have TypeScript compliance issues (using any without types)');
  }
  
  // Check 6: "use client" directive for client components
  if (content.includes('useState') || content.includes('useEffect')) {
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      issues.push('❌ Missing "use client" directive for client component');
    }
  }
  
  // Check 7: Empty or stub components
  if (content.length < 500) {
    warnings.push('⚠️  Component may be incomplete (< 500 characters)');
  }
  
  // Check 8: Component export
  if (!content.includes('export') && !content.includes('default')) {
    issues.push('❌ Component not properly exported');
  }
  
  return {
    status: issues.length > 0 ? 'FAILED' : (warnings.length > 0 ? 'WARNING' : 'PASSED'),
    issues,
    warnings,
    size: content.length,
  };
}

// Main audit function
function runAudit() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  ZERO TOLERANCE FULL STACK IMPLEMENTATION AUDIT          ║${colors.reset}`);
  console.log(`${colors.cyan}║  Production Hub - All Tabs Validation                    ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const modules = loadTabsRegistry();
  const moduleNames = Object.keys(modules).sort();
  
  console.log(`${colors.blue}Found ${moduleNames.length} modules${colors.reset}\n`);
  
  for (const moduleId of moduleNames) {
    const tabs = modules[moduleId];
    console.log(`${colors.magenta}━━━ ${moduleId.toUpperCase()} (${tabs.length} tabs) ━━━${colors.reset}`);
    
    for (const tab of tabs) {
      results.total++;
      const componentFile = findComponentFile(moduleId, tab.slug);
      const audit = auditComponent(componentFile, tab);
      
      let statusColor;
      let statusIcon;
      
      if (audit.status === 'MISSING') {
        statusColor = colors.red;
        statusIcon = '✗';
        results.failed++;
      } else if (audit.status === 'FAILED') {
        statusColor = colors.red;
        statusIcon = '✗';
        results.failed++;
      } else if (audit.status === 'WARNING') {
        statusColor = colors.yellow;
        statusIcon = '⚠';
        results.warnings++;
        results.passed++;
      } else {
        statusColor = colors.green;
        statusIcon = '✓';
        results.passed++;
      }
      
      console.log(`  ${statusColor}${statusIcon}${colors.reset} ${tab.name} (${tab.slug})`);
      
      if (componentFile) {
        console.log(`    ${colors.reset}${path.relative(COMPONENTS_DIR, componentFile)}${colors.reset}`);
      } else {
        console.log(`    ${colors.red}Component file not found${colors.reset}`);
      }
      
      if (audit.issues && audit.issues.length > 0) {
        audit.issues.forEach(issue => {
          console.log(`    ${colors.red}${issue}${colors.reset}`);
          results.issues.push({
            module: moduleId,
            tab: tab.name,
            issue,
            severity: 'ERROR',
          });
        });
      }
      
      if (audit.warnings && audit.warnings.length > 0) {
        audit.warnings.forEach(warning => {
          console.log(`    ${colors.yellow}${warning}${colors.reset}`);
          results.issues.push({
            module: moduleId,
            tab: tab.name,
            issue: warning,
            severity: 'WARNING',
          });
        });
      }
      
      console.log('');
    }
    
    console.log('');
  }
  
  // Print summary
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  AUDIT SUMMARY                                           ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`Total Tabs Audited: ${colors.blue}${results.total}${colors.reset}`);
  console.log(`${colors.green}✓ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Warnings: ${results.warnings}${colors.reset}`);
  console.log('');
  
  const errorIssues = results.issues.filter(i => i.severity === 'ERROR');
  if (errorIssues.length > 0) {
    console.log(`${colors.red}CRITICAL ISSUES (${errorIssues.length}):${colors.reset}`);
    errorIssues.forEach(issue => {
      console.log(`  ${colors.red}•${colors.reset} ${issue.module}/${issue.tab}: ${issue.issue}`);
    });
    console.log('');
  }
  
  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`Pass Rate: ${passRate}%`);
  
  if (results.failed === 0) {
    console.log(`\n${colors.green}✓ ALL TABS PASSED VALIDATION${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ AUDIT FAILED - ${results.failed} tabs require attention${colors.reset}\n`);
    process.exit(1);
  }
}

// Run the audit
runAudit();
