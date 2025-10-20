#!/usr/bin/env node

/**
 * COMPLETE DATA HOOKS REMEDIATION
 * 
 * This script fixes ALL data hooks violations to achieve TRUE 100% compliance.
 * 
 * Strategy:
 * 1. Find all hook calls (useAdminData, useAnalyticsData, etc.)
 * 2. Add loading and error to destructuring if missing
 * 3. Add loading state UI after hook call
 * 4. Add error handling UI after loading state
 * 
 * NO SHORTCUTS. TRUE 100%.
 */

const fs = require('fs');
const path = require('path');

// Load audit data
const auditData = require('../docs/audits/ZERO_TOLERANCE_12_LAYER_AUDIT_2025_01_20.json');

// Get all files with data hooks violations
const filesToFix = [];

Object.entries(auditData.files).forEach(([filename, fileData]) => {
  const hooksLayer = fileData.layers.hooks;
  if (hooksLayer.score < 100 && hooksLayer.score > 0) {
    // Skip files with score 0 or 15 (no integration)
    filesToFix.push({
      filename,
      path: fileData.path,
      score: hooksLayer.score,
      violations: hooksLayer.violations
    });
  }
});

console.log('🔧 DATA HOOKS COMPLETE REMEDIATION');
console.log('='.repeat(70));
console.log(`Files to fix: ${filesToFix.length}`);
console.log('');

let fixed = 0;
let failed = 0;
const failedFiles = [];

filesToFix.forEach((file, index) => {
  console.log(`\n[${index + 1}/${filesToFix.length}] ${file.filename}`);
  console.log(`  Score: ${file.score}/100`);
  console.log(`  Violations: ${file.violations.join(', ')}`);
  
  if (!fs.existsSync(file.path)) {
    console.log(`  ❌ File not found`);
    failed++;
    failedFiles.push({ ...file, reason: 'File not found' });
    return;
  }

  let content = fs.readFileSync(file.path, 'utf8');
  let modified = false;
  const needsLoading = file.violations.includes('No loading state');
  const needsError = file.violations.includes('No error handling');

  // Find all hook patterns
  const hookPatterns = [
    /const\s+{\s*([^}]+)\s*}\s*=\s*(use\w+Data)\(\)/g,
    /const\s+{\s*([^}]+)\s*}\s*=\s*(use\w+Data)\([^)]*\)/g
  ];

  let hookFound = false;
  let hookName = '';
  let destructuredVars = '';

  for (const pattern of hookPatterns) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      hookFound = true;
      const match = matches[0];
      destructuredVars = match[1].trim();
      hookName = match[2];
      
      console.log(`  Found hook: ${hookName}`);
      console.log(`  Current destructuring: { ${destructuredVars} }`);

      // Check if loading and error are already destructured
      const hasLoading = /\bloading\b/.test(destructuredVars);
      const hasError = /\berror\b/.test(destructuredVars);

      let newDestructuring = destructuredVars;

      // Add loading if needed and missing
      if (needsLoading && !hasLoading) {
        newDestructuring += ', loading';
        console.log(`  ➕ Adding 'loading' to destructuring`);
      }

      // Add error if needed and missing
      if (needsError && !hasError) {
        newDestructuring += ', error';
        console.log(`  ➕ Adding 'error' to destructuring`);
      }

      // Update the destructuring
      if (newDestructuring !== destructuredVars) {
        const oldPattern = `const { ${destructuredVars} } = ${hookName}(`;
        const newPattern = `const { ${newDestructuring} } = ${hookName}(`;
        content = content.replace(oldPattern, newPattern);
        modified = true;
      }

      break;
    }
  }

  if (!hookFound) {
    console.log(`  ⚠️ No hook pattern found`);
    failed++;
    failedFiles.push({ ...file, reason: 'No hook pattern found' });
    return;
  }

  // Now add the UI components after the hook call
  // Find the line after the hook call
  const hookCallRegex = new RegExp(`const\\s+{[^}]+}\\s+=\\s+${hookName}\\([^)]*\\)`, 'g');
  const hookCallMatch = content.match(hookCallRegex);
  
  if (hookCallMatch) {
    const hookCall = hookCallMatch[0];
    const hookCallIndex = content.indexOf(hookCall);
    const afterHookCall = hookCallIndex + hookCall.length;

    // Find the next line (after any whitespace)
    let insertPosition = afterHookCall;
    while (insertPosition < content.length && /[\s\n]/.test(content[insertPosition])) {
      insertPosition++;
    }

    // Check if loading/error UI already exists nearby
    const next200Chars = content.substring(insertPosition, insertPosition + 200);
    const hasLoadingUI = /if\s*\(\s*loading\s*\)/.test(next200Chars);
    const hasErrorUI = /if\s*\(\s*error\s*\)/.test(next200Chars);

    let uiToAdd = '';

    // Add error handling UI if needed
    if (needsError && !hasErrorUI) {
      uiToAdd += `\n\n  if (error) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <p className="text-red-600 mb-2">Error loading data</p>\n          <p className="text-sm text-gray-500">{error.message}</p>\n        </div>\n      </div>\n    );\n  }`;
      console.log(`  ➕ Adding error handling UI`);
    }

    // Add loading state UI if needed
    if (needsLoading && !hasLoadingUI) {
      uiToAdd += `\n\n  if (loading) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\n      </div>\n    );\n  }`;
      console.log(`  ➕ Adding loading state UI`);
    }

    if (uiToAdd) {
      // Insert the UI after the hook call
      content = content.slice(0, insertPosition) + uiToAdd + '\n' + content.slice(insertPosition);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file.path, content, 'utf8');
    console.log(`  ✅ Fixed successfully`);
    fixed++;
  } else {
    console.log(`  ⚠️ No changes made`);
    failed++;
    failedFiles.push({ ...file, reason: 'No changes made' });
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 REMEDIATION SUMMARY');
console.log('='.repeat(70));
console.log(`Fixed: ${fixed}/${filesToFix.length}`);
console.log(`Failed: ${failed}/${filesToFix.length}`);
console.log(`Success Rate: ${((fixed / filesToFix.length) * 100).toFixed(1)}%`);

if (failedFiles.length > 0) {
  console.log('\n❌ FAILED FILES:');
  failedFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.filename} - ${file.reason}`);
  });
}

console.log('\n✅ Next Steps:');
console.log('1. Review changes: git diff');
console.log('2. Test the application');
console.log('3. Run audit again: node scripts/zero-tolerance-12-layer-audit.js');
console.log('4. Manually fix any remaining files');
console.log('');
