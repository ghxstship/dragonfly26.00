#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const insightsFiles = [
  'src/components/insights/insights-benchmarks-tab.tsx',
  'src/components/insights/insights-intelligence-feed-tab.tsx',
  'src/components/insights/insights-key-results-tab.tsx',
  'src/components/insights/insights-objectives-tab.tsx',
  'src/components/insights/insights-overview-tab.tsx',
  'src/components/insights/insights-priorities-tab.tsx',
  'src/components/insights/insights-progress-tracking-tab.tsx',
  'src/components/insights/insights-recommendations-tab.tsx',
  'src/components/insights/insights-reviews-tab.tsx',
  'src/components/insights/insights-success-metrics-tab.tsx'
];

let totalFixed = 0;
let errors = [];

console.log('Starting Intelligence Hub Layout Remediation...\n');

insightsFiles.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Pattern 1: Remove description + Create button section
    const pattern1 = /(\s+return \(\s+<div className="space-y-6">\s+)\/\* Action Buttons - Standard Positioning \*\/\s+<div className="flex items-center justify-between">\s+<p className="text-muted-foreground" role="doc-subtitle">\s+\{t\('description'\)\}\s+<\/p>\s+<Button[^>]+>\s+<Plus[^>]+\/>\s+\{tCommon\('create'\)\}\s+<\/Button>\s+<\/div>\s+\n\s+\n/;
    
    // Pattern 2: Remove description only section
    const pattern2 = /(\s+return \(\s+<div className="space-y-6">\s+)\/\* Action Buttons - Standard Positioning \*\/\s+<div className="flex items-center justify-between">\s+<p className="text-muted-foreground" role="doc-subtitle">\s+\{t\('description'\)\}\s+<\/p>\s+<\/div>\s+\n\s+\n/;
    
    if (pattern1.test(content)) {
      content = content.replace(pattern1, '$1');
      console.log(`✅ ${path.basename(filePath)} - Removed description + Create button`);
      totalFixed++;
    } else if (pattern2.test(content)) {
      content = content.replace(pattern2, '$1');
      console.log(`✅ ${path.basename(filePath)} - Removed description only`);
      totalFixed++;
    } else {
      console.log(`⚠️  ${path.basename(filePath)} - No matching pattern found`);
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
    }
    
  } catch (error) {
    console.error(`❌ ${path.basename(filePath)} - Error: ${error.message}`);
    errors.push({ file: filePath, error: error.message });
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`REMEDIATION COMPLETE`);
console.log(`${'='.repeat(60)}`);
console.log(`Total Files Processed: ${insightsFiles.length}`);
console.log(`Successfully Fixed: ${totalFixed}`);
console.log(`Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}

process.exit(errors.length > 0 ? 1 : 0);
