#!/usr/bin/env node

/**
 * ATOMIC WORKFLOW ERROR HANDLING VERIFICATION
 * 
 * Verifies that all 229 components now have proper error handling
 * 
 * Date: November 5, 2025
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// Statistics
const stats = {
  total: 0,
  withErrorHandling: 0,
  withoutErrorHandling: 0,
  details: {
    hasErrorBlock: 0,
    hasErrorVariable: 0,
    hasIsErrorVariable: 0,
    hasLoadingState: 0,
    complete: 0
  },
  missing: []
};

/**
 * Verify error handling in a component
 */
function verifyComponent(componentPath) {
  const fullPath = path.join(COMPONENTS_DIR, componentPath);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check for error handling patterns
  const hasErrorBlock = content.includes('if (isError || error)') || 
                        content.includes('if (error)') ||
                        content.includes('if (isError)') ||
                        content.includes('Failed to load');
  
  const hasErrorVariable = content.match(/\{\s*[^}]*error[^}]*\}\s*=\s*use/);
  const hasIsErrorVariable = content.match(/\{\s*[^}]*isError[^}]*\}\s*=\s*use/);
  const hasLoadingState = content.includes('if (loading)') || content.includes('if (isLoading)');
  
  const isComplete = hasErrorBlock && (hasErrorVariable || hasIsErrorVariable) && hasLoadingState;
  
  return {
    path: componentPath,
    hasErrorBlock,
    hasErrorVariable: !!hasErrorVariable,
    hasIsErrorVariable: !!hasIsErrorVariable,
    hasLoadingState,
    isComplete
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Verifying Atomic Workflow Error Handling\n');
  console.log('=' .repeat(60));
  
  // Get all tab component files
  const findFiles = (dir, pattern) => {
    const results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results.push(...findFiles(fullPath, pattern));
      } else if (file.name.match(pattern)) {
        results.push(fullPath.replace(COMPONENTS_DIR + '/', ''));
      }
    }
    
    return results;
  };
  
  const allTabFiles = findFiles(COMPONENTS_DIR, /-tab\.tsx$/);
  stats.total = allTabFiles.length;
  
  console.log(`📋 Checking ${stats.total} tab components...\n`);
  
  allTabFiles.forEach(componentPath => {
    const result = verifyComponent(componentPath);
    
    if (!result) return;
    
    if (result.isComplete) {
      stats.withErrorHandling++;
      stats.details.complete++;
    } else {
      stats.withoutErrorHandling++;
      stats.missing.push(result);
    }
    
    if (result.hasErrorBlock) stats.details.hasErrorBlock++;
    if (result.hasErrorVariable) stats.details.hasErrorVariable++;
    if (result.hasIsErrorVariable) stats.details.hasIsErrorVariable++;
    if (result.hasLoadingState) stats.details.hasLoadingState++;
  });
  
  // Print summary
  console.log('=' .repeat(60));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(60));
  console.log(`Total components: ${stats.total}`);
  console.log(`✅ With complete error handling: ${stats.withErrorHandling} (${((stats.withErrorHandling/stats.total)*100).toFixed(1)}%)`);
  console.log(`❌ Without complete error handling: ${stats.withoutErrorHandling}`);
  
  console.log('\n📈 DETAILED BREAKDOWN:');
  console.log(`  - Has error handling block: ${stats.details.hasErrorBlock}`);
  console.log(`  - Has error variable: ${stats.details.hasErrorVariable}`);
  console.log(`  - Has isError variable: ${stats.details.hasIsErrorVariable}`);
  console.log(`  - Has loading state: ${stats.details.hasLoadingState}`);
  console.log(`  - Complete implementation: ${stats.details.complete}`);
  
  if (stats.missing.length > 0 && stats.missing.length <= 20) {
    console.log('\n❌ COMPONENTS MISSING ERROR HANDLING:');
    stats.missing.forEach(item => {
      const missing = [];
      if (!item.hasErrorBlock) missing.push('error block');
      if (!item.hasErrorVariable && !item.hasIsErrorVariable) missing.push('error variable');
      if (!item.hasLoadingState) missing.push('loading state');
      console.log(`  - ${item.path}: missing ${missing.join(', ')}`);
    });
  } else if (stats.missing.length > 20) {
    console.log(`\n❌ ${stats.missing.length} components still need error handling`);
  }
  
  console.log('\n' + '='.repeat(60));
  
  const percentComplete = ((stats.withErrorHandling / stats.total) * 100).toFixed(1);
  
  if (stats.withErrorHandling === stats.total) {
    console.log('✅ 100% COMPLETE - All components have error handling!');
    console.log('🎯 ATOMIC WORKFLOW REMEDIATION: SUCCESS');
  } else {
    console.log(`🎯 COMPLETION: ${stats.withErrorHandling}/${stats.total} (${percentComplete}%)`);
    console.log(`⚠️  ${stats.withoutErrorHandling} components still need attention`);
  }
  
  console.log('='.repeat(60));
  
  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: stats.total,
      withErrorHandling: stats.withErrorHandling,
      withoutErrorHandling: stats.withoutErrorHandling,
      percentComplete: parseFloat(percentComplete)
    },
    details: stats.details,
    missing: stats.missing.map(m => ({
      path: m.path,
      hasErrorBlock: m.hasErrorBlock,
      hasErrorVariable: m.hasErrorVariable,
      hasIsErrorVariable: m.hasIsErrorVariable,
      hasLoadingState: m.hasLoadingState
    }))
  };
  
  const reportPath = path.join(__dirname, '../docs/audits/ATOMIC_WORKFLOW_ERROR_HANDLING_VERIFICATION.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Run the script
main();
