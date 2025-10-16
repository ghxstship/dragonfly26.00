#!/usr/bin/env node

/**
 * REDUNDANT CREATE BUTTON AUDIT
 * 
 * Verifies that 100% of data views (DataTable, Card grids, etc.) 
 * do NOT contain create buttons, since the page layout already provides them.
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const results = {
  totalFiles: 0,
  filesWithRedundantButtons: [],
  compliantFiles: 0,
  violations: []
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
  
  const violations = [];
  
  // Check for buttons inside DataTable components
  let inDataTable = false;
  let dataTableStart = 0;
  let braceDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track DataTable component boundaries
    if (line.includes('<DataTable')) {
      inDataTable = true;
      dataTableStart = i + 1;
      braceDepth = 0;
    }
    
    if (inDataTable) {
      // Track JSX depth
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;
      
      // Check for create/add buttons inside DataTable
      const buttonPatterns = [
        /Button.*(?:Add|Create|New)/i,
        /onClick.*(?:create|add|new)/i,
        /setCreateDialogOpen\(true\)/i,
        /setAddDialogOpen\(true\)/i,
        /<Button[^>]*>\s*(?:\+|Add|Create|New)/i
      ];
      
      for (const pattern of buttonPatterns) {
        if (pattern.test(line)) {
          // Exclude action column buttons (Edit, Delete, View, etc.)
          if (!line.includes('Edit') && 
              !line.includes('Delete') && 
              !line.includes('View') &&
              !line.includes('Download') &&
              !line.includes('Export') &&
              !line.includes('actions')) {
            violations.push({
              line: i + 1,
              context: line.trim(),
              location: 'DataTable',
              type: 'CREATE_BUTTON_IN_DATATABLE'
            });
          }
        }
      }
      
      // Exit DataTable when we close the component
      if (line.includes('</DataTable>') || (line.includes('/>') && braceDepth <= 0)) {
        inDataTable = false;
      }
    }
    
    // Check for buttons in Card grids (common pattern for data display)
    if (line.includes('grid') && line.includes('gap')) {
      // Look ahead for create buttons in the next 50 lines
      const lookAhead = lines.slice(i, Math.min(i + 50, lines.length)).join('\n');
      
      if (lookAhead.includes('<Card') || lookAhead.includes('map(')) {
        const cardSection = lines.slice(i, Math.min(i + 50, lines.length));
        
        for (let j = 0; j < cardSection.length; j++) {
          const cardLine = cardSection[j];
          
          if (/Button.*(?:Add|Create|New)/i.test(cardLine) ||
              /onClick.*(?:create|add|new)/i.test(cardLine)) {
            
            // Check if it's not a card action button
            const context = cardSection.slice(Math.max(0, j - 3), j + 3).join('\n');
            
            if (!context.includes('CardFooter') && 
                !context.includes('CardHeader') &&
                !context.includes('.map(') &&
                !context.includes('item.')) {
              violations.push({
                line: i + j + 1,
                context: cardLine.trim(),
                location: 'Card Grid',
                type: 'CREATE_BUTTON_IN_CARD_GRID'
              });
            }
          }
        }
      }
    }
    
    // Check for buttons in empty states (these should be in page header instead)
    if (line.includes('emptyState') || 
        line.includes('No data') || 
        line.includes('No items') ||
        line.includes('No results')) {
      
      // Look ahead for create buttons in empty state
      const emptyStateSection = lines.slice(i, Math.min(i + 20, lines.length));
      
      for (let j = 0; j < emptyStateSection.length; j++) {
        const emptyLine = emptyStateSection[j];
        
        if (/Button.*(?:Add|Create|New)/i.test(emptyLine) ||
            /onClick.*(?:create|add|new)/i.test(emptyLine)) {
          violations.push({
            line: i + j + 1,
            context: emptyLine.trim(),
            location: 'Empty State',
            type: 'CREATE_BUTTON_IN_EMPTY_STATE'
          });
        }
      }
    }
  }
  
  return {
    path: relativePath,
    violations
  };
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('REDUNDANT CREATE BUTTON AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  console.log(`Total Files Analyzed: ${results.totalFiles}`);
  console.log(`Files with Redundant Buttons: ${results.filesWithRedundantButtons.length}`);
  console.log(`Compliant Files: ${results.compliantFiles}\n`);
  
  const complianceRate = ((results.compliantFiles / results.totalFiles) * 100).toFixed(1);
  
  console.log('COMPLIANCE SUMMARY:');
  console.log('─'.repeat(80));
  console.log(`Compliance Rate: ${complianceRate}%`);
  console.log(`Status: ${complianceRate >= 100 ? '✅ PERFECT' : complianceRate >= 95 ? '⚠️  NEEDS ATTENTION' : '❌ CRITICAL'}\n`);
  
  if (results.filesWithRedundantButtons.length > 0) {
    console.log('❌ FILES WITH REDUNDANT CREATE BUTTONS:');
    console.log('─'.repeat(80));
    
    results.filesWithRedundantButtons.forEach(file => {
      console.log(`\n📁 ${file.path}`);
      console.log(`   Violations: ${file.violations.length}`);
      
      file.violations.forEach(v => {
        console.log(`   ❌ Line ${v.line} (${v.location}): ${v.type}`);
        console.log(`      ${v.context.substring(0, 100)}${v.context.length > 100 ? '...' : ''}`);
      });
    });
    
    console.log('\n' + '─'.repeat(80));
    console.log('REMEDIATION REQUIRED:');
    console.log('─'.repeat(80));
    console.log('• Remove all create buttons from DataTable components');
    console.log('• Remove all create buttons from Card grids');
    console.log('• Remove all create buttons from empty states');
    console.log('• Page layout headers already contain these buttons');
    console.log('• Redundant buttons create UI clutter and confusion');
  } else {
    console.log('✅ PERFECT COMPLIANCE!');
    console.log('─'.repeat(80));
    console.log('All data views are free of redundant create buttons.');
    console.log('Page layout headers properly contain all create actions.');
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Save detailed JSON report
  const reportPath = path.join(__dirname, '../REDUNDANT_CREATE_BUTTONS_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved to: REDUNDANT_CREATE_BUTTONS_REPORT.json\n`);
}

// Main execution
console.log('🔍 Auditing for redundant create buttons in data views...\n');

const tabFiles = getAllTabFiles(COMPONENTS_DIR);
results.totalFiles = tabFiles.length;

tabFiles.forEach(file => {
  const analysis = analyzeFile(file);
  
  if (analysis.violations.length > 0) {
    results.filesWithRedundantButtons.push(analysis);
    results.violations.push(...analysis.violations);
  } else {
    results.compliantFiles++;
  }
});

generateReport();

// Exit with error code if violations found
process.exit(results.filesWithRedundantButtons.length > 0 ? 1 : 0);
