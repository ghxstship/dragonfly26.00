#!/usr/bin/env node

/**
 * AUTOMATED TAB VIOLATION FIXES
 * Applies standardization fixes based on audit report
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const AUDIT_REPORT = require('../docs/audits/TAB_LAYOUT_AUDIT_REPORT.json');

let fixCount = 0;

// Helper: Add import to file
function addImport(filePath, importName, fromModule) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Find existing import from the module
  const importLineIdx = lines.findIndex(line => 
    line.includes(`from "${fromModule}"`) || line.includes(`from '${fromModule}'`)
  );
  
  if (importLineIdx >= 0) {
    const importLine = lines[importLineIdx];
    
    // Check if import already exists
    if (importLine.includes(importName)) {
      console.log(`  ✓ ${importName} already imported`);
      return false;
    }
    
    // Add to existing import
    if (importLine.includes('{')) {
      const closingBrace = importLine.lastIndexOf('}');
      lines[importLineIdx] = importLine.slice(0, closingBrace) + `, ${importName}` + importLine.slice(closingBrace);
    }
  } else {
    // Find where to insert (after other imports)
    let insertIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIdx = i + 1;
      } else if (insertIdx > 0 && !lines[i].trim()) {
        break;
      }
    }
    
    // Insert new import
    lines.splice(insertIdx, 0, `import { ${importName} } from "${fromModule}"`);
  }
  
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`  ✅ Added import: ${importName} from ${fromModule}`);
  return true;
}

// Helper: Remove duplicate action button sections
function removeDuplicateActionButtons(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let actionButtonSections = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('/* Action Buttons') || lines[i].includes('/*Action Buttons')) {
      actionButtonSections.push(i);
    }
  }
  
  if (actionButtonSections.length <= 1) {
    console.log(`  ✓ No duplicate action button sections found`);
    return false;
  }
  
  // Keep the first one, remove the rest
  console.log(`  Found ${actionButtonSections.length} action button sections`);
  
  // Remove from the end to preserve line numbers
  for (let i = actionButtonSections.length - 1; i > 0; i--) {
    const startIdx = actionButtonSections[i];
    
    // Find the end of this section (next empty line or next comment)
    let endIdx = startIdx + 1;
    while (endIdx < lines.length) {
      const line = lines[endIdx].trim();
      if (line === '' || (line.startsWith('/*') && !line.includes('Action Buttons'))) {
        break;
      }
      endIdx++;
    }
    
    // Find the closing </div> for this section
    let bracketCount = 0;
    let foundStart = false;
    for (let j = startIdx; j < Math.min(endIdx + 20, lines.length); j++) {
      const line = lines[j];
      if (line.includes('<div')) {
        bracketCount++;
        foundStart = true;
      }
      if (line.includes('</div>')) {
        bracketCount--;
        if (foundStart && bracketCount === 0) {
          endIdx = j + 1;
          break;
        }
      }
    }
    
    // Remove the duplicate section including trailing empty lines
    while (endIdx < lines.length && lines[endIdx].trim() === '') {
      endIdx++;
    }
    
    lines.splice(startIdx, endIdx - startIdx);
    console.log(`  ✅ Removed duplicate action button section`);
  }
  
  fs.writeFileSync(filePath, lines.join('\n'));
  return true;
}

// Helper: Add standard action button section
function addActionButtonSection(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Find the return statement
  const returnIdx = lines.findIndex(line => line.trim().startsWith('return'));
  if (returnIdx < 0) {
    console.log(`  ⚠ Could not find return statement`);
    return false;
  }
  
  // Find the opening div with space-y
  let insertIdx = returnIdx + 1;
  while (insertIdx < lines.length && !lines[insertIdx].includes('className="space-y')) {
    insertIdx++;
  }
  
  if (insertIdx >= lines.length) {
    console.log(`  ⚠ Could not find space-y container`);
    return false;
  }
  
  // Insert action button section after the opening div
  const indent = '      ';
  const actionButtonSection = [
    indent + '{/* Action Buttons - Standard Positioning */}',
    indent + '<div className="flex items-center justify-between">',
    indent + '  <p className="text-muted-foreground">',
    indent + '    Tab description',
    indent + '  </p>',
    indent + '  <Button size="sm">',
    indent + '    <Plus className="h-4 w-4 mr-2" />',
    indent + '    Create',
    indent + '  </Button>',
    indent + '</div>',
    ''
  ];
  
  lines.splice(insertIdx + 1, 0, ...actionButtonSection);
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`  ✅ Added standard action button section`);
  return true;
}

// Process each violation
console.log('\n🔧 Starting automated fixes...\n');

AUDIT_REPORT.violations.forEach(({ file, path: filePath, violations }) => {
  console.log(`\n📝 Fixing: ${file}`);
  
  violations.forEach(violation => {
    switch (violation.type) {
      case 'MISSING_IMPORT':
        if (violation.message.includes('Button component')) {
          if (addImport(filePath, 'Button', '@/components/ui/button')) fixCount++;
        } else if (violation.message.includes('Plus icon')) {
          if (addImport(filePath, 'Plus', 'lucide-react')) fixCount++;
        }
        break;
        
      case 'DUPLICATE_ACTION_BUTTONS':
        if (removeDuplicateActionButtons(filePath)) fixCount++;
        break;
        
      case 'MISSING_ACTION_BUTTONS':
        // Skip form-based tabs
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('TabComponentProps') && !content.includes('ProfileTab')) {
          // Only add if it's a data display tab
          const hasDataDisplay = content.includes('Card') || content.includes('Table') || content.includes('Grid');
          if (hasDataDisplay) {
            // Check if Plus is imported, if not, add it
            if (!content.includes("import { Plus }") && !content.includes("import {Plus}")) {
              addImport(filePath, 'Plus', 'lucide-react');
              fixCount++;
            }
            if (!content.includes("import { Button }") && !content.includes("import {Button}")) {
              addImport(filePath, 'Button', '@/components/ui/button');
              fixCount++;
            }
            if (addActionButtonSection(filePath)) fixCount++;
          }
        }
        break;
        
      case 'MISSING_ROOT_SPACING':
        // Fix root spacing
        let fileContent = fs.readFileSync(filePath, 'utf8');
        if (!fileContent.includes('className="space-y-6"') && !fileContent.includes("className='space-y-6'")) {
          fileContent = fileContent.replace(
            /return\s*\(\s*<div>/,
            'return (\n    <div className="space-y-6">'
          );
          fs.writeFileSync(filePath, fileContent);
          console.log(`  ✅ Added root spacing (space-y-6)`);
          fixCount++;
        }
        break;
    }
  });
});

console.log(`\n✅ Applied ${fixCount} fixes across ${AUDIT_REPORT.violations.length} files\n`);
