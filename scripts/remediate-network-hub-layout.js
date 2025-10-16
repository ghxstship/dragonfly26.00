#!/usr/bin/env node

/**
 * Network Hub Layout Compliance Remediation Script
 * Removes redundant action buttons and descriptions from all Network Hub tabs
 * 
 * SCOPE: 26 files (Community: 8, Marketplace: 11, Resources: 7)
 * VIOLATION: Lines containing redundant description + action button block
 * PATTERN: Typically lines 129-138 or similar
 */

const fs = require('fs');
const path = require('path');

const NETWORK_HUB_FILES = [
  // Community Module (8 files)
  'src/components/community/activity-tab.tsx',
  'src/components/community/competitions-tab.tsx',
  'src/components/community/connections-tab.tsx',
  'src/components/community/discussions-tab.tsx',
  'src/components/community/events-tab.tsx',
  'src/components/community/news-tab.tsx',
  'src/components/community/showcase-tab.tsx',
  'src/components/community/studios-tab.tsx',
  
  // Marketplace Module (11 files)
  'src/components/marketplace/favorites-tab.tsx',
  'src/components/marketplace/lists-tab.tsx',
  'src/components/marketplace/orders-tab.tsx',
  'src/components/marketplace/products-tab.tsx',
  'src/components/marketplace/purchases-tab.tsx',
  'src/components/marketplace/reviews-tab.tsx',
  'src/components/marketplace/sales-tab.tsx',
  'src/components/marketplace/services-tab.tsx',
  'src/components/marketplace/shop-tab.tsx',
  'src/components/marketplace/spotlight-tab.tsx',
  'src/components/marketplace/vendors-tab.tsx',
  
  // Resources Module (7 files)
  'src/components/resources/resources-courses-tab.tsx',
  'src/components/resources/resources-glossary-tab.tsx',
  'src/components/resources/resources-grants-tab.tsx',
  'src/components/resources/resources-guides-tab.tsx',
  'src/components/resources/resources-library-tab.tsx',
  'src/components/resources/resources-publications-tab.tsx',
  'src/components/resources/resources-troubleshooting-tab.tsx',
];

function remediateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Pattern 1: Remove redundant action button block with description
  // Matches: {/* Action Buttons - Standard Positioning */} ... </div>
  const actionButtonPattern = /\s*{\/\* Action Buttons - Standard Positioning \*\/}\s*<div className="flex items-center justify-between">\s*<p className="text-muted-foreground">\s*{t\(['"]\w+['"]\)}\s*<\/p>\s*<Button[^>]*>[\s\S]*?<\/Button>\s*<\/div>\s*/g;
  
  content = content.replace(actionButtonPattern, '\n');
  
  // Pattern 2: Alternative pattern without comment
  const altPattern = /<div className="flex items-center justify-between">\s*<p className="text-muted-foreground">\s*{t\(['"]\w+['"]\)}\s*<\/p>\s*<Button[^>]*>\s*<[^>]+className="h-4 w-4[^"]*"[^>]*\/>\s*{t\(['"]\w+['"]\)}\s*<\/Button>\s*<\/div>/g;
  
  content = content.replace(altPattern, '');
  
  // Pattern 3: Multi-line button pattern
  const multiLinePattern = /<div className="flex items-center justify-between">\s*<p className="text-muted-foreground">\s*{t\(['"]description['"]\)}\s*<\/p>\s*<Button[^>]*>\s*<Plus className="h-4 w-4 mr-2" aria-hidden="true" \/>\s*{t\(['"][^'"]+['"]\)}\s*<\/Button>\s*<\/div>/g;
  
  content = content.replace(multiLinePattern, '');
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Remediated: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
    return false;
  }
}

function main() {
  console.log('🚀 Network Hub Layout Compliance Remediation\n');
  console.log(`📋 Total files to process: ${NETWORK_HUB_FILES.length}\n`);
  
  let remediatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  NETWORK_HUB_FILES.forEach((file, index) => {
    console.log(`[${index + 1}/${NETWORK_HUB_FILES.length}] Processing: ${file}`);
    
    try {
      const result = remediateFile(file);
      if (result) {
        remediatedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 REMEDIATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Files remediated: ${remediatedCount}`);
  console.log(`ℹ️  Files skipped (no changes): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Total processed: ${NETWORK_HUB_FILES.length}`);
  console.log('='.repeat(60));
  
  if (remediatedCount > 0) {
    console.log('\n✨ Network Hub layout compliance remediation complete!');
  }
}

main();
