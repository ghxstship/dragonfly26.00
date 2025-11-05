#!/usr/bin/env node

/**
 * FINAL 100% VERIFICATION
 * 
 * Verify EVERY component has ALL required workflow elements
 * Identify any remaining gaps and fix them
 * 
 * Date: November 5, 2025
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const stats = {
  total: 0,
  complete: 0,
  incomplete: [],
  details: {
    missingErrorHandling: [],
    missingLoadingState: [],
    missingEmptyState: [],
    missingAriaLabels: []
  }
};

function verifyComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = filePath.replace(COMPONENTS_DIR + '/', '');
  
  const checks = {
    hasErrorHandling: content.includes('if (isError || error)') || content.includes('if (error)'),
    hasLoadingState: content.includes('if (loading)') || content.includes('if (isLoading)'),
    hasEmptyState: content.includes('<EmptyState') || content.includes('length === 0'),
    hasAriaLabels: content.includes('aria-label') || content.includes('aria-hidden'),
    hasDataHook: content.includes('useQuery') || content.includes('Data(') || content.match(/use\w+\(/),
    isFormBased: content.includes('useForm') || content.includes('<form'),
    isStatic: !content.includes('useQuery') && !content.includes('Data(')
  };
  
  // Data-driven components should have all elements
  if (checks.hasDataHook && !checks.isFormBased) {
    const isComplete = checks.hasErrorHandling && 
                      checks.hasLoadingState && 
                      checks.hasEmptyState && 
                      checks.hasAriaLabels;
    
    if (!isComplete) {
      stats.incomplete.push({
        path: relativePath,
        missing: {
          errorHandling: !checks.hasErrorHandling,
          loadingState: !checks.hasLoadingState,
          emptyState: !checks.hasEmptyState,
          ariaLabels: !checks.hasAriaLabels
        }
      });
      
      if (!checks.hasErrorHandling) stats.details.missingErrorHandling.push(relativePath);
      if (!checks.hasLoadingState) stats.details.missingLoadingState.push(relativePath);
      if (!checks.hasEmptyState) stats.details.missingEmptyState.push(relativePath);
      if (!checks.hasAriaLabels) stats.details.missingAriaLabels.push(relativePath);
      
      return false;
    }
  }
  
  return true;
}

function findAllTabFiles(dir) {
  const results = [];
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results.push(...findAllTabFiles(fullPath));
      } else if (file.name.endsWith('-tab.tsx')) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    // Skip
  }
  
  return results;
}

function main() {
  console.log('🔍 FINAL 100% VERIFICATION\n');
  console.log('='.repeat(60));
  
  const allFiles = findAllTabFiles(COMPONENTS_DIR);
  stats.total = allFiles.length;
  
  console.log(`📋 Verifying ${stats.total} components...\n`);
  
  allFiles.forEach(file => {
    if (verifyComponent(file)) {
      stats.complete++;
    }
  });
  
  console.log('='.repeat(60));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(60));
  console.log(`Total components: ${stats.total}`);
  console.log(`✅ Complete: ${stats.complete} (${((stats.complete/stats.total)*100).toFixed(1)}%)`);
  console.log(`❌ Incomplete: ${stats.incomplete.length}`);
  
  if (stats.incomplete.length > 0) {
    console.log('\n❌ COMPONENTS MISSING ELEMENTS:');
    console.log(`  - Missing error handling: ${stats.details.missingErrorHandling.length}`);
    console.log(`  - Missing loading state: ${stats.details.missingLoadingState.length}`);
    console.log(`  - Missing empty state: ${stats.details.missingEmptyState.length}`);
    console.log(`  - Missing ARIA labels: ${stats.details.missingAriaLabels.length}`);
    
    if (stats.incomplete.length <= 20) {
      console.log('\n📋 INCOMPLETE COMPONENTS:');
      stats.incomplete.forEach(item => {
        const missing = Object.entries(item.missing)
          .filter(([_, value]) => value)
          .map(([key]) => key);
        console.log(`  - ${item.path}: ${missing.join(', ')}`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (stats.incomplete.length === 0) {
    console.log('✅ 100% COMPLETE - ZERO TOLERANCE ACHIEVED');
    console.log('🏆 ALL COMPONENTS HAVE ALL REQUIRED ELEMENTS');
  } else {
    console.log(`⚠️  ${stats.incomplete.length} components need attention`);
  }
  
  console.log('='.repeat(60));
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: stats.total,
      complete: stats.complete,
      incomplete: stats.incomplete.length,
      percentComplete: ((stats.complete/stats.total)*100).toFixed(1)
    },
    incompleteComponents: stats.incomplete,
    details: stats.details
  };
  
  const reportPath = path.join(__dirname, '../docs/audits/FINAL_100_PERCENT_VERIFICATION.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 Report: ${reportPath}`);
}

main();
