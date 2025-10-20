#!/usr/bin/env node

/**
 * DATA HOOKS LAYER REMEDIATION SCRIPT
 * 
 * Remediates all data hooks violations to achieve 100% compliance:
 * - Adds error handling to 166 files
 * - Adds loading states to 15 files
 * - Fixes 4 files with no data hook integration
 * 
 * Target: 221/221 files at 100% data hooks score
 */

const fs = require('fs');
const path = require('path');

// Load audit data
const auditData = require('../docs/audits/ZERO_TOLERANCE_12_LAYER_AUDIT_2025_01_20.json');

// Categorize violations
const violations = {
  noErrorHandling: [],
  noLoadingState: [],
  noIntegration: []
};

Object.entries(auditData.files).forEach(([filename, fileData]) => {
  const hooksLayer = fileData.layers.hooks;
  if (hooksLayer.score < 100) {
    const issues = hooksLayer.violations;
    
    if (issues.includes('No error handling')) {
      violations.noErrorHandling.push(filename);
    }
    if (issues.includes('No loading state')) {
      violations.noLoadingState.push(filename);
    }
    if (issues.includes('No data hook integration')) {
      violations.noIntegration.push(filename);
    }
  }
});

console.log('📊 DATA HOOKS VIOLATIONS ANALYSIS');
console.log('='.repeat(60));
console.log(`No Error Handling: ${violations.noErrorHandling.length} files`);
console.log(`No Loading State: ${violations.noLoadingState.length} files`);
console.log(`No Integration: ${violations.noIntegration.length} files`);
console.log(`Total Files to Fix: ${violations.noErrorHandling.length + violations.noLoadingState.length + violations.noIntegration.length}`);
console.log('='.repeat(60));
console.log('');

// Helper function to find file path
function findFilePath(filename) {
  const possiblePaths = [
    `src/components/admin/${filename}`,
    `src/components/analytics/${filename}`,
    `src/components/assets/${filename}`,
    `src/components/companies/${filename}`,
    `src/components/community/${filename}`,
    `src/components/dashboard/${filename}`,
    `src/components/events/${filename}`,
    `src/components/files/${filename}`,
    `src/components/finance/${filename}`,
    `src/components/insights/${filename}`,
    `src/components/jobs/${filename}`,
    `src/components/locations/${filename}`,
    `src/components/marketplace/${filename}`,
    `src/components/people/${filename}`,
    `src/components/procurement/${filename}`,
    `src/components/profile/${filename}`,
    `src/components/projects/${filename}`,
    `src/components/reports/${filename}`,
    `src/components/resources/${filename}`,
    `src/components/settings/${filename}`
  ];

  for (const p of possiblePaths) {
    const fullPath = path.join(process.cwd(), p);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

// Add error handling to a file
function addErrorHandling(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has error handling
  if (content.includes('if (error)') || content.includes('if (isError)')) {
    return { success: true, message: 'Already has error handling' };
  }

  // Find the hook call pattern
  const hookPatterns = [
    /const\s+{\s*data:\s*(\w+),\s*isLoading:\s*(\w+)\s*}\s*=\s*use(\w+)\(/g,
    /const\s+{\s*data:\s*(\w+),\s*loading:\s*(\w+)\s*}\s*=\s*use(\w+)\(/g,
    /const\s+{\s*(\w+),\s*isLoading:\s*(\w+)\s*}\s*=\s*use(\w+)\(/g
  ];

  let modified = false;
  
  for (const pattern of hookPatterns) {
    const matches = [...content.matchAll(pattern)];
    
    if (matches.length > 0) {
      // Add error state to hook destructuring
      matches.forEach(match => {
        const original = match[0];
        const dataVar = match[1];
        const loadingVar = match[2];
        const hookName = match[3];
        
        // Add error to destructuring
        const withError = original.replace(
          /{\s*([^}]+)\s*}/,
          '{ $1, error }'
        );
        
        content = content.replace(original, withError);
      });
      
      // Add error handling UI after the hook call
      const hookCallEnd = content.indexOf(';', content.indexOf('use' + matches[0][3]));
      if (hookCallEnd > -1) {
        const errorHandling = `\n\n  if (error) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <p className="text-red-600 mb-2">Error loading data</p>\n          <p className="text-sm text-gray-500">{error.message}</p>\n        </div>\n      </div>\n    );\n  }`;
        
        content = content.slice(0, hookCallEnd + 1) + errorHandling + content.slice(hookCallEnd + 1);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, message: 'Added error handling' };
  }
  
  return { success: false, message: 'Could not find hook pattern' };
}

// Add loading state to a file
function addLoadingState(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has loading state
  if (content.includes('if (isLoading)') || content.includes('if (loading)')) {
    return { success: true, message: 'Already has loading state' };
  }

  // Find the hook call pattern
  const hookPatterns = [
    /const\s+{\s*data:\s*(\w+),\s*isLoading:\s*(\w+)\s*}\s*=\s*use(\w+)\(/g,
    /const\s+{\s*data:\s*(\w+),\s*loading:\s*(\w+)\s*}\s*=\s*use(\w+)\(/g,
    /const\s+{\s*(\w+),\s*isLoading:\s*(\w+)\s*}\s*=\s*use(\w+)\(/g
  ];

  let modified = false;
  
  for (const pattern of hookPatterns) {
    const matches = [...content.matchAll(pattern)];
    
    if (matches.length > 0) {
      const loadingVar = matches[0][2];
      
      // Add loading state UI after the hook call
      const hookCallEnd = content.indexOf(';', content.indexOf('use' + matches[0][3]));
      if (hookCallEnd > -1) {
        const loadingState = `\n\n  if (${loadingVar}) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\n      </div>\n    );\n  }`;
        
        content = content.slice(0, hookCallEnd + 1) + loadingState + content.slice(hookCallEnd + 1);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, message: 'Added loading state' };
  }
  
  return { success: false, message: 'Could not find hook pattern' };
}

// PHASE 1: Add error handling to 166 files
console.log('🔧 PHASE 1: Adding Error Handling');
console.log('-'.repeat(60));

let errorHandlingFixed = 0;
let errorHandlingFailed = 0;

violations.noErrorHandling.forEach((filename, index) => {
  const filePath = findFilePath(filename);
  
  if (!filePath) {
    console.log(`❌ ${index + 1}/${violations.noErrorHandling.length} - ${filename} - File not found`);
    errorHandlingFailed++;
    return;
  }

  const result = addErrorHandling(filePath);
  
  if (result.success) {
    console.log(`✅ ${index + 1}/${violations.noErrorHandling.length} - ${filename} - ${result.message}`);
    errorHandlingFixed++;
  } else {
    console.log(`⚠️ ${index + 1}/${violations.noErrorHandling.length} - ${filename} - ${result.message}`);
    errorHandlingFailed++;
  }
});

console.log('');
console.log(`Error Handling: ${errorHandlingFixed} fixed, ${errorHandlingFailed} failed`);
console.log('');

// PHASE 2: Add loading states to 15 files
console.log('🔧 PHASE 2: Adding Loading States');
console.log('-'.repeat(60));

let loadingStateFixed = 0;
let loadingStateFailed = 0;

violations.noLoadingState.forEach((filename, index) => {
  const filePath = findFilePath(filename);
  
  if (!filePath) {
    console.log(`❌ ${index + 1}/${violations.noLoadingState.length} - ${filename} - File not found`);
    loadingStateFailed++;
    return;
  }

  const result = addLoadingState(filePath);
  
  if (result.success) {
    console.log(`✅ ${index + 1}/${violations.noLoadingState.length} - ${filename} - ${result.message}`);
    loadingStateFixed++;
  } else {
    console.log(`⚠️ ${index + 1}/${violations.noLoadingState.length} - ${filename} - ${result.message}`);
    loadingStateFailed++;
  }
});

console.log('');
console.log(`Loading States: ${loadingStateFixed} fixed, ${loadingStateFailed} failed`);
console.log('');

// PHASE 3: Report files needing manual integration
console.log('🔧 PHASE 3: Files Needing Manual Integration');
console.log('-'.repeat(60));

if (violations.noIntegration.length > 0) {
  console.log('The following files need manual data hook integration:');
  violations.noIntegration.forEach((filename, index) => {
    const filePath = findFilePath(filename);
    console.log(`${index + 1}. ${filename}`);
    if (filePath) {
      console.log(`   Path: ${filePath}`);
    }
  });
} else {
  console.log('✅ No files need manual integration');
}

console.log('');

// FINAL SUMMARY
console.log('='.repeat(60));
console.log('📊 REMEDIATION SUMMARY');
console.log('='.repeat(60));
console.log(`Error Handling: ${errorHandlingFixed}/${violations.noErrorHandling.length} fixed`);
console.log(`Loading States: ${loadingStateFixed}/${violations.noLoadingState.length} fixed`);
console.log(`Manual Integration Needed: ${violations.noIntegration.length} files`);
console.log('');

const totalFixed = errorHandlingFixed + loadingStateFixed;
const totalAttempted = violations.noErrorHandling.length + violations.noLoadingState.length;
const successRate = ((totalFixed / totalAttempted) * 100).toFixed(1);

console.log(`Total: ${totalFixed}/${totalAttempted} automated fixes (${successRate}%)`);
console.log('');

if (violations.noIntegration.length > 0) {
  console.log('⚠️ Manual work required for files with no data hook integration');
  console.log('   These files need to be updated to use appropriate data hooks');
} else {
  console.log('✅ All automated fixes complete!');
}

console.log('');
console.log('Next steps:');
console.log('1. Review the changes in git diff');
console.log('2. Fix any files that failed automated remediation');
console.log('3. Manually integrate data hooks in files that need it');
console.log('4. Run the audit again to verify 100% compliance');
console.log('');
