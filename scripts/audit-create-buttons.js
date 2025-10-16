#!/usr/bin/env node

/**
 * COMPREHENSIVE CREATE/ADD BUTTON AUDIT SCRIPT
 * 
 * Audits all Create/Add/New buttons across the entire application for:
 * 1. Layout compliance (placement, duplicates, pairing)
 * 2. Full-stack implementation (dialog functionality, handlers)
 * 3. Consistency across modules
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

// Button patterns to search for
const BUTTON_PATTERNS = [
  /Add\s+Company/gi,
  /Add\s+Item/gi,
  /New\s+Job/gi,
  /New\s+Project/gi,
  /Create\s+\w+/gi,
  /\+\s*New/gi,
  /\+\s*Add/gi,
  /\+\s*Create/gi,
];

// Dialog patterns
const DIALOG_PATTERNS = [
  /CreateItemDialogEnhanced/g,
  /Dialog.*open/g,
  /setCreateDialogOpen/g,
  /onOpenChange/g,
];

// Handler patterns
const HANDLER_PATTERNS = [
  /handleCreate/g,
  /onCreate/g,
  /onCreateAction/g,
];

const results = {
  totalFiles: 0,
  totalButtons: 0,
  issues: [],
  summary: {
    duplicateButtons: [],
    missingDialogs: [],
    missingHandlers: [],
    wrongPlacement: [],
    inconsistentLabels: [],
  }
};

function getAllTabFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllTabFiles(fullPath));
    } else if (item.endsWith('-tab.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(COMPONENTS_DIR, filePath);
  const lines = content.split('\n');
  
  const fileAnalysis = {
    path: relativePath,
    buttons: [],
    dialogs: [],
    handlers: [],
    issues: []
  };
  
  // Find all button instances
  lines.forEach((line, index) => {
    BUTTON_PATTERNS.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          fileAnalysis.buttons.push({
            line: index + 1,
            text: match.trim(),
            context: line.trim()
          });
        });
      }
    });
  });
  
  // Find dialog implementations
  DIALOG_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      fileAnalysis.dialogs.push(...matches);
    }
  });
  
  // Find handlers
  HANDLER_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      fileAnalysis.handlers.push(...matches);
    }
  });
  
  // Check for issues
  
  // Issue 1: Multiple buttons with same label
  const buttonTexts = fileAnalysis.buttons.map(b => b.text);
  const duplicates = buttonTexts.filter((text, index) => buttonTexts.indexOf(text) !== index);
  if (duplicates.length > 0) {
    fileAnalysis.issues.push({
      type: 'DUPLICATE_BUTTON',
      severity: 'HIGH',
      description: `Duplicate button labels found: ${[...new Set(duplicates)].join(', ')}`,
      buttons: fileAnalysis.buttons.filter(b => duplicates.includes(b.text))
    });
    results.summary.duplicateButtons.push({
      file: relativePath,
      duplicates: [...new Set(duplicates)]
    });
  }
  
  // Issue 2: Buttons without dialogs
  if (fileAnalysis.buttons.length > 0 && fileAnalysis.dialogs.length === 0) {
    fileAnalysis.issues.push({
      type: 'MISSING_DIALOG',
      severity: 'HIGH',
      description: `${fileAnalysis.buttons.length} button(s) found but no dialog implementation`,
      buttons: fileAnalysis.buttons
    });
    results.summary.missingDialogs.push({
      file: relativePath,
      buttonCount: fileAnalysis.buttons.length
    });
  }
  
  // Issue 3: Dialogs without handlers
  if (fileAnalysis.dialogs.length > 0 && fileAnalysis.handlers.length === 0) {
    fileAnalysis.issues.push({
      type: 'MISSING_HANDLER',
      severity: 'MEDIUM',
      description: 'Dialog found but no create handler implemented',
      dialogs: fileAnalysis.dialogs
    });
    results.summary.missingHandlers.push({
      file: relativePath,
      dialogCount: fileAnalysis.dialogs.length
    });
  }
  
  // Issue 4: Check button placement (should be in header, not in empty state AND header)
  const headerButtons = fileAnalysis.buttons.filter(b => {
    const lineContent = lines[b.line - 1];
    const contextLines = lines.slice(Math.max(0, b.line - 10), b.line + 5).join('\n');
    return contextLines.includes('flex') && contextLines.includes('justify-between');
  });
  
  const emptyStateButtons = fileAnalysis.buttons.filter(b => {
    const contextLines = lines.slice(Math.max(0, b.line - 10), b.line + 5).join('\n');
    return contextLines.includes('emptyState') || contextLines.includes('No data found');
  });
  
  if (headerButtons.length > 0 && emptyStateButtons.length > 0) {
    fileAnalysis.issues.push({
      type: 'DUPLICATE_PLACEMENT',
      severity: 'HIGH',
      description: 'Button appears in both header and empty state (should only be in header)',
      headerButtons,
      emptyStateButtons
    });
    results.summary.wrongPlacement.push({
      file: relativePath,
      headerCount: headerButtons.length,
      emptyStateCount: emptyStateButtons.length
    });
  }
  
  // Issue 5: Inconsistent button labels
  const inconsistentLabels = [];
  fileAnalysis.buttons.forEach(button => {
    const text = button.text.toLowerCase();
    // Check for inconsistent patterns
    if (text.includes('create') && text.includes('new')) {
      inconsistentLabels.push(button);
    }
    if (text.match(/^(add|new|create)$/i)) {
      inconsistentLabels.push(button);
    }
  });
  
  if (inconsistentLabels.length > 0) {
    fileAnalysis.issues.push({
      type: 'INCONSISTENT_LABEL',
      severity: 'LOW',
      description: 'Button labels are inconsistent or too generic',
      buttons: inconsistentLabels
    });
    results.summary.inconsistentLabels.push({
      file: relativePath,
      labels: inconsistentLabels.map(b => b.text)
    });
  }
  
  return fileAnalysis;
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('CREATE/ADD BUTTON COMPREHENSIVE AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  console.log(`Total Files Analyzed: ${results.totalFiles}`);
  console.log(`Total Buttons Found: ${results.totalButtons}\n`);
  
  console.log('CRITICAL ISSUES SUMMARY:');
  console.log('─'.repeat(80));
  console.log(`❌ Duplicate Buttons: ${results.summary.duplicateButtons.length} files`);
  console.log(`❌ Missing Dialogs: ${results.summary.missingDialogs.length} files`);
  console.log(`⚠️  Missing Handlers: ${results.summary.missingHandlers.length} files`);
  console.log(`⚠️  Wrong Placement: ${results.summary.wrongPlacement.length} files`);
  console.log(`ℹ️  Inconsistent Labels: ${results.summary.inconsistentLabels.length} files\n`);
  
  // Detailed breakdown
  if (results.summary.duplicateButtons.length > 0) {
    console.log('\n❌ DUPLICATE BUTTONS (HIGH PRIORITY):');
    console.log('─'.repeat(80));
    results.summary.duplicateButtons.forEach(item => {
      console.log(`  📁 ${item.file}`);
      console.log(`     Duplicates: ${item.duplicates.join(', ')}`);
    });
  }
  
  if (results.summary.missingDialogs.length > 0) {
    console.log('\n❌ MISSING DIALOGS (HIGH PRIORITY):');
    console.log('─'.repeat(80));
    results.summary.missingDialogs.forEach(item => {
      console.log(`  📁 ${item.file}`);
      console.log(`     ${item.buttonCount} button(s) without dialog implementation`);
    });
  }
  
  if (results.summary.wrongPlacement.length > 0) {
    console.log('\n⚠️  WRONG PLACEMENT (HIGH PRIORITY):');
    console.log('─'.repeat(80));
    results.summary.wrongPlacement.forEach(item => {
      console.log(`  📁 ${item.file}`);
      console.log(`     Header: ${item.headerCount}, Empty State: ${item.emptyStateCount}`);
      console.log(`     ⚠️  Remove from empty state, keep only in header`);
    });
  }
  
  if (results.summary.missingHandlers.length > 0) {
    console.log('\n⚠️  MISSING HANDLERS (MEDIUM PRIORITY):');
    console.log('─'.repeat(80));
    results.summary.missingHandlers.forEach(item => {
      console.log(`  📁 ${item.file}`);
      console.log(`     ${item.dialogCount} dialog(s) without handler`);
    });
  }
  
  if (results.summary.inconsistentLabels.length > 0) {
    console.log('\nℹ️  INCONSISTENT LABELS (LOW PRIORITY):');
    console.log('─'.repeat(80));
    results.summary.inconsistentLabels.slice(0, 10).forEach(item => {
      console.log(`  📁 ${item.file}`);
      console.log(`     Labels: ${item.labels.join(', ')}`);
    });
    if (results.summary.inconsistentLabels.length > 10) {
      console.log(`  ... and ${results.summary.inconsistentLabels.length - 10} more`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('COMPLIANCE SCORE:');
  console.log('─'.repeat(80));
  
  const totalIssues = 
    results.summary.duplicateButtons.length +
    results.summary.missingDialogs.length +
    results.summary.wrongPlacement.length +
    results.summary.missingHandlers.length;
  
  const complianceScore = Math.max(0, 100 - (totalIssues * 2));
  
  console.log(`Score: ${complianceScore}/100`);
  console.log(`Status: ${complianceScore >= 90 ? '✅ EXCELLENT' : complianceScore >= 70 ? '⚠️  NEEDS WORK' : '❌ CRITICAL'}`);
  console.log('='.repeat(80) + '\n');
  
  // Save detailed JSON report
  const reportPath = path.join(__dirname, '../CREATE_BUTTON_AUDIT_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed JSON report saved to: CREATE_BUTTON_AUDIT_REPORT.json\n`);
}

// Main execution
console.log('🔍 Starting comprehensive Create/Add button audit...\n');

const tabFiles = getAllTabFiles(COMPONENTS_DIR);
results.totalFiles = tabFiles.length;

console.log(`Found ${tabFiles.length} tab component files\n`);

tabFiles.forEach(file => {
  const analysis = analyzeFile(file);
  results.totalButtons += analysis.buttons.length;
  
  if (analysis.issues.length > 0) {
    results.issues.push(analysis);
  }
});

generateReport();

// Exit with error code if critical issues found
const criticalIssues = results.summary.duplicateButtons.length + 
                       results.summary.missingDialogs.length +
                       results.summary.wrongPlacement.length;

process.exit(criticalIssues > 0 ? 1 : 0);
