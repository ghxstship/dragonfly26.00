#!/usr/bin/env node

/**
 * PRODUCTION HUB ONLY - ZERO TOLERANCE AUDIT
 * Validates ONLY production operations modules
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const REGISTRY_PATH = path.join(__dirname, '../src/lib/modules/tabs-registry.ts');

// PRODUCTION HUB MODULES ONLY
const PRODUCTION_HUB_MODULES = [
  'projects',
  'events',
  'people',
  'assets',
  'locations',
  'files',
  'finance',
  'procurement',
  'jobs',
  'companies'
];

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

function loadTabsRegistry() {
  const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
  return extractModuleTabs(registryContent);
}

function extractModuleTabs(content) {
  const modules = {};
  const createTabPattern = /createTab\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g;
  
  let match;
  while ((match = createTabPattern.exec(content)) !== null) {
    const [, id, moduleId, name, slug] = match;
    
    // ONLY include production hub modules
    if (PRODUCTION_HUB_MODULES.includes(moduleId)) {
      if (!modules[moduleId]) {
        modules[moduleId] = [];
      }
      modules[moduleId].push({ id, name, slug, moduleId });
    }
  }
  
  return modules;
}

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
  
  // Check 1: No large headers
  const largeHeaderPattern = /<h[12]\s+className="[^"]*text-(3xl|2xl)[^"]*">/;
  if (largeHeaderPattern.test(content)) {
    issues.push('❌ VIOLATION: Large h1/h2 header with text-3xl/text-2xl');
  }
  
  // Check 2: Action buttons
  const hasActionButtons = content.includes('<Button');
  const hasProperButtonPlacement = content.includes('justify-between') || content.includes('flex items-center');
  
  if (hasActionButtons && !hasProperButtonPlacement) {
    warnings.push('⚠️  Action buttons may not be properly positioned');
  }
  
  // Check 3: Card layout
  if (!content.includes('<Card')) {
    warnings.push('⚠️  Missing Card-based layout');
  }
  
  // Check 4: Loading state
  if (!content.includes('loading') && !content.includes('Loading')) {
    warnings.push('⚠️  Missing loading state');
  }
  
  // Check 5: Client directive
  if (content.includes('useState') || content.includes('useEffect')) {
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
      issues.push('❌ Missing "use client" directive');
    }
  }
  
  return {
    status: issues.length > 0 ? 'FAILED' : (warnings.length > 0 ? 'WARNING' : 'PASSED'),
    issues,
    warnings,
    size: content.length,
  };
}

function runAudit() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  PRODUCTION HUB ONLY - ZERO TOLERANCE AUDIT              ║${colors.reset}`);
  console.log(`${colors.cyan}║  Operational Modules Only                                ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const modules = loadTabsRegistry();
  const moduleNames = Object.keys(modules).sort();
  
  console.log(`${colors.blue}Production Hub Modules: ${moduleNames.length}${colors.reset}`);
  console.log(`${colors.blue}Modules: ${moduleNames.join(', ')}${colors.reset}\n`);
  
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
        });
      }
      
      console.log('');
    }
    
    console.log('');
  }
  
  // Summary
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  PRODUCTION HUB AUDIT SUMMARY                            ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`Total Production Hub Tabs: ${colors.blue}${results.total}${colors.reset}`);
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
    console.log(`\n${colors.green}✓ ALL PRODUCTION HUB TABS VALIDATED${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ AUDIT FAILED - ${results.failed} tabs require attention${colors.reset}\n`);
    process.exit(1);
  }
}

runAudit();
