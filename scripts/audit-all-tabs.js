#!/usr/bin/env node

/**
 * Comprehensive Tab Layout Standardization Audit
 * Zero-tolerance audit for all Production Hub tabs
 */

const fs = require('fs');
const path = require('path');

// Load the tabs registry
const registryPath = path.join(__dirname, '../src/lib/modules/tabs-registry.ts');
const componentsPath = path.join(__dirname, '../src/components');

// Parse the registry to get all expected tabs
function parseRegistry() {
  const content = fs.readFileSync(registryPath, 'utf8');
  const modules = {};
  
  // Extract MODULE_TABS object
  const moduleTabsMatch = content.match(/export const MODULE_TABS: Record<string, ModuleTab\[\]> = \{([\s\S]*?)\n\}/);
  if (!moduleTabsMatch) return modules;
  
  const moduleTabsContent = moduleTabsMatch[1];
  
  // Extract each module section
  const moduleMatches = moduleTabsContent.matchAll(/(\w+): \[([\s\S]*?)\n  \]/g);
  
  for (const match of moduleMatches) {
    const moduleId = match[1];
    const tabsContent = match[2];
    
    // Extract tab slugs
    const tabs = [];
    const tabMatches = tabsContent.matchAll(/createTab\([^,]+,\s*'[^']+',\s*'[^']+',\s*'([^']+)'/g);
    
    for (const tabMatch of tabMatches) {
      tabs.push(tabMatch[1]);
    }
    
    modules[moduleId] = tabs;
  }
  
  return modules;
}

// Find all implemented tab files
function findTabFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTabFiles(filePath, fileList);
    } else if (file.endsWith('-tab.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Audit a single tab file
function auditTabFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(componentsPath, filePath);
  const issues = [];
  
  // Check for large headers at the top
  const lines = content.split('\n');
  const returnIndex = lines.findIndex(line => line.trim().startsWith('return'));
  
  if (returnIndex !== -1) {
    // Check first 50 lines after return for large headers
    const contentStart = lines.slice(returnIndex, returnIndex + 50).join('\n');
    
    // Check for h1 or h2 with large text classes near the top
    if (contentStart.match(/<h[12]\s+className="[^"]*text-[23]xl/)) {
      issues.push({
        type: 'LARGE_HEADER',
        severity: 'HIGH',
        message: 'Tab contains large header (h1/h2 with text-2xl/text-3xl). Remove - module navigation already shows tab name.',
        location: relativePath
      });
    }
    
    // Check for duplicate header in CardTitle after already having a top-level header
    const hasTopHeader = contentStart.match(/<h[12]/);
    const hasCardTitle = contentStart.match(/<CardTitle[^>]*>.*?<\/CardTitle>/);
    if (hasTopHeader && hasCardTitle) {
      issues.push({
        type: 'DUPLICATE_HEADER',
        severity: 'MEDIUM',
        message: 'Potential duplicate header: both top-level header and CardTitle present.',
        location: relativePath
      });
    }
  }
  
  // Check for TODOs
  const todoMatches = content.match(/\/\/\s*TODO:/gi);
  if (todoMatches) {
    issues.push({
      type: 'TODO',
      severity: 'HIGH',
      message: `Found ${todoMatches.length} TODO comment(s) - incomplete implementation.`,
      location: relativePath
    });
  }
  
  // Check for placeholders
  const placeholderMatches = content.match(/[Pp]laceholder|Coming soon|Not implemented/g);
  if (placeholderMatches) {
    issues.push({
      type: 'PLACEHOLDER',
      severity: 'HIGH',
      message: `Found ${placeholderMatches.length} placeholder text(s) - incomplete implementation.`,
      location: relativePath
    });
  }
  
  // Check for "Mock" or "MOCK" data
  const mockMatches = content.match(/MOCK_|mockData|mock\w+Data/g);
  if (mockMatches && mockMatches.length > 2) {
    issues.push({
      type: 'MOCK_DATA',
      severity: 'MEDIUM',
      message: `Found ${mockMatches.length} references to mock data - may need real data integration.`,
      location: relativePath
    });
  }
  
  // Check for proper layout structure
  const hasActionButtons = content.includes('Action Buttons');
  const hasSpaceY6 = content.match(/className="space-y-6"/);
  const hasSpaceY4 = content.match(/className="space-y-4"/);
  
  if (!hasSpaceY6 && !hasSpaceY4) {
    issues.push({
      type: 'LAYOUT_STRUCTURE',
      severity: 'MEDIUM',
      message: 'Missing standard spacing wrapper (space-y-6 or space-y-4).',
      location: relativePath
    });
  }
  
  return issues;
}

// Main audit function
function runAudit() {
  console.log('🔍 Starting Comprehensive Tab Audit...\n');
  
  const registry = parseRegistry();
  const tabFiles = findTabFiles(componentsPath);
  
  console.log(`📋 Registry defines ${Object.keys(registry).length} modules`);
  
  let totalExpected = 0;
  Object.values(registry).forEach(tabs => totalExpected += tabs.length);
  console.log(`📋 Expected ${totalExpected} total tabs across all modules`);
  console.log(`📁 Found ${tabFiles.length} implemented tab files\n`);
  
  // Audit all found tabs
  const allIssues = [];
  const tabsWithIssues = new Set();
  
  tabFiles.forEach(file => {
    const issues = auditTabFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues);
      tabsWithIssues.add(file);
    }
  });
  
  // Generate report
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 AUDIT RESULTS');
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log(`✅ Clean tabs: ${tabFiles.length - tabsWithIssues.size}`);
  console.log(`⚠️  Tabs with issues: ${tabsWithIssues.size}`);
  console.log(`🚨 Total issues found: ${allIssues.length}\n`);
  
  // Group issues by type
  const issuesByType = {};
  allIssues.forEach(issue => {
    if (!issuesByType[issue.type]) {
      issuesByType[issue.type] = [];
    }
    issuesByType[issue.type].push(issue);
  });
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 ISSUES BY TYPE');
  console.log('═══════════════════════════════════════════════════════\n');
  
  Object.entries(issuesByType).forEach(([type, issues]) => {
    console.log(`${type}: ${issues.length} issues`);
    issues.forEach(issue => {
      const severity = issue.severity === 'HIGH' ? '🔴' : issue.severity === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`  ${severity} ${issue.location}`);
      console.log(`     ${issue.message}\n`);
    });
  });
  
  // Missing tabs analysis
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 MISSING IMPLEMENTATIONS');
  console.log('═══════════════════════════════════════════════════════\n');
  
  Object.entries(registry).forEach(([moduleId, expectedTabs]) => {
    const missingTabs = expectedTabs.filter(slug => {
      const possibleNames = [
        `${moduleId}-${slug}-tab.tsx`,
        `${slug}-tab.tsx`,
        `${moduleId.replace(/_/g, '-')}-${slug.replace(/_/g, '-')}-tab.tsx`
      ];
      
      return !tabFiles.some(file => 
        possibleNames.some(name => file.endsWith(name))
      );
    });
    
    if (missingTabs.length > 0) {
      console.log(`${moduleId.toUpperCase()}: ${missingTabs.length}/${expectedTabs.length} tabs missing`);
      missingTabs.forEach(slug => {
        console.log(`  ❌ ${slug}`);
      });
      console.log('');
    }
  });
  
  return {
    totalTabs: tabFiles.length,
    cleanTabs: tabFiles.length - tabsWithIssues.size,
    tabsWithIssues: tabsWithIssues.size,
    totalIssues: allIssues.length,
    issuesByType,
    allIssues
  };
}

// Run the audit
const results = runAudit();

// Exit with error code if issues found
if (results.totalIssues > 0) {
  console.log('\n❌ Audit completed with issues. Review and fix before production.');
  process.exit(1);
} else {
  console.log('\n✅ All tabs pass the audit!');
  process.exit(0);
}
