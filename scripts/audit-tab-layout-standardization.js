#!/usr/bin/env node

/**
 * TAB LAYOUT STANDARDIZATION AUDIT
 * Zero-tolerance audit for layout violations across all 121 tab components
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

// Layout standard requirements
const STANDARDS = {
  noLargeHeaders: true,
  actionButtonsFirst: true,
  noDuplicateElements: true,
  correctImports: true,
};

const violations = [];
const tabFiles = [];

// Recursively find all *-tab.tsx files
function findTabFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTabFiles(filePath);
    } else if (file.endsWith('-tab.tsx')) {
      tabFiles.push(filePath);
    }
  });
}

// Check for violations in a file
function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(COMPONENTS_DIR, filePath);
  const fileViolations = [];

  // 1. Check for large headers (h2 with text-3xl or text-2xl)
  const largeHeaderRegex = /<h2[^>]*className="[^"]*text-[23]xl/g;
  if (largeHeaderRegex.test(content)) {
    fileViolations.push({
      type: 'LARGE_HEADER',
      severity: 'CRITICAL',
      message: 'Tab contains large header (h2 with text-3xl/text-2xl). Module navigation already displays tab name.',
      lines: lines.reduce((acc, line, idx) => {
        if (largeHeaderRegex.test(line)) acc.push(idx + 1);
        return acc;
      }, [])
    });
  }

  // 2. Check for duplicate action button sections
  const actionButtonSectionRegex = /\/\*.*Action Buttons.*\*\//g;
  const actionButtonMatches = content.match(actionButtonSectionRegex);
  if (actionButtonMatches && actionButtonMatches.length > 1) {
    fileViolations.push({
      type: 'DUPLICATE_ACTION_BUTTONS',
      severity: 'CRITICAL',
      message: `Found ${actionButtonMatches.length} action button sections. Should have exactly 1.`,
      count: actionButtonMatches.length
    });
  }

  // 3. Check for missing action button section
  if (!actionButtonSectionRegex.test(content) && !content.includes('Action Buttons')) {
    // Check if it's a special case (form tabs, etc.)
    const isFormTab = content.includes('type: \'form\'') || filePath.includes('profile/');
    if (!isFormTab) {
      fileViolations.push({
        type: 'MISSING_ACTION_BUTTONS',
        severity: 'HIGH',
        message: 'Tab missing standard action button section at top.'
      });
    }
  }

  // 4. Check for missing imports
  const importSection = content.substring(0, content.indexOf('export'));
  const componentUsage = content.substring(content.indexOf('return'));
  
  // Check for Button usage without import
  if (componentUsage.includes('<Button') && !importSection.includes('import { Button }') && !importSection.includes('import {Button}')) {
    fileViolations.push({
      type: 'MISSING_IMPORT',
      severity: 'CRITICAL',
      message: 'Button component used but not imported.'
    });
  }

  // Check for Plus icon usage without import
  if ((componentUsage.includes('<Plus') || componentUsage.includes('Plus className')) && 
      !importSection.includes('Plus') && !importSection.includes('lucide-react')) {
    fileViolations.push({
      type: 'MISSING_IMPORT',
      severity: 'CRITICAL',
      message: 'Plus icon used but not imported from lucide-react.'
    });
  }

  // 5. Check action button positioning (should be at top, before summary cards)
  const returnIdx = content.indexOf('return');
  const actionButtonIdx = content.indexOf('Action Buttons');
  const summaryCardIdx = content.indexOf('Summary Stats') || content.indexOf('Summary Cards') || content.indexOf('Key Metrics');
  
  if (actionButtonIdx > -1 && summaryCardIdx > -1 && actionButtonIdx > summaryCardIdx) {
    fileViolations.push({
      type: 'INCORRECT_POSITIONING',
      severity: 'HIGH',
      message: 'Action buttons positioned AFTER summary cards. Should be FIRST element after return.'
    });
  }

  // 6. Check for consistent spacing
  const spaceYPattern = /className="space-y-(\d+)"/;
  const rootSpacing = content.match(/<div className="space-y-(\d+)">/);
  if (!rootSpacing) {
    fileViolations.push({
      type: 'MISSING_ROOT_SPACING',
      severity: 'MEDIUM',
      message: 'Missing root container with space-y-6 spacing.'
    });
  }

  if (fileViolations.length > 0) {
    violations.push({
      file: relativePath,
      path: filePath,
      violations: fileViolations
    });
  }
}

// Generate report
function generateReport() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   TAB LAYOUT STANDARDIZATION AUDIT REPORT                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Total tab files audited: ${tabFiles.length}`);
  console.log(`Files with violations: ${violations.length}`);
  console.log(`Compliance rate: ${((1 - violations.length / tabFiles.length) * 100).toFixed(1)}%\n`);

  // Group violations by type
  const violationsByType = {};
  violations.forEach(file => {
    file.violations.forEach(v => {
      if (!violationsByType[v.type]) {
        violationsByType[v.type] = [];
      }
      violationsByType[v.type].push({ file: file.file, ...v });
    });
  });

  // Print summary by violation type
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('VIOLATIONS BY TYPE:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  Object.entries(violationsByType).forEach(([type, items]) => {
    console.log(`\n[${type}] - ${items.length} occurrences`);
    console.log('─'.repeat(65));
    items.forEach(item => {
      console.log(`  ⚠ ${item.file}`);
      console.log(`    ${item.message}`);
      if (item.lines) console.log(`    Lines: ${item.lines.join(', ')}`);
    });
  });

  // Detailed file-by-file report
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('DETAILED FILE-BY-FILE REPORT:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  violations.forEach((file, idx) => {
    console.log(`\n${idx + 1}. ${file.file}`);
    console.log('   ' + '─'.repeat(60));
    file.violations.forEach(v => {
      const severity = v.severity === 'CRITICAL' ? '🔴' : v.severity === 'HIGH' ? '🟠' : '🟡';
      console.log(`   ${severity} [${v.severity}] ${v.type}`);
      console.log(`      ${v.message}`);
      if (v.lines) console.log(`      Lines: ${v.lines.join(', ')}`);
      if (v.count) console.log(`      Count: ${v.count}`);
    });
  });

  // Export to JSON
  const reportData = {
    timestamp: new Date().toISOString(),
    totalFiles: tabFiles.length,
    filesWithViolations: violations.length,
    complianceRate: ((1 - violations.length / tabFiles.length) * 100).toFixed(1),
    violationsByType,
    violations,
    allFiles: tabFiles.map(f => path.relative(COMPONENTS_DIR, f))
  };

  const reportPath = path.join(__dirname, '../docs/audits/TAB_LAYOUT_AUDIT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  console.log(`\n\n✅ Full audit report exported to: ${reportPath}\n`);
}

// Run audit
console.log('🔍 Starting comprehensive tab layout audit...\n');
findTabFiles(COMPONENTS_DIR);
console.log(`Found ${tabFiles.length} tab component files.\n`);

tabFiles.forEach(auditFile);
generateReport();

// Exit with error if violations found
if (violations.length > 0) {
  console.log('❌ AUDIT FAILED: Layout violations detected.\n');
  process.exit(1);
} else {
  console.log('✅ AUDIT PASSED: All tabs comply with layout standards.\n');
  process.exit(0);
}
