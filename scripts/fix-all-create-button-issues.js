#!/usr/bin/env node

/**
 * COMPREHENSIVE CREATE BUTTON FIX - ALL ISSUES
 * 
 * Systematically fixes:
 * 1. Duplicate buttons in empty states (removes them, keeps header only)
 * 2. Missing dialog implementations
 * 3. Missing onClick handlers
 * 4. Inconsistent labels
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  duplicatesRemoved: 0,
  dialogsAdded: 0,
  handlersAdded: 0,
  labelsFixed: 0,
  errors: []
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

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const relativePath = path.relative(COMPONENTS_DIR, filePath);
    let modified = false;
    
    console.log(`\n📝 ${relativePath}`);
    
    // Check current state
    const hasCreateButton = /(<Plus|Create|Add|New)/.test(content);
    const hasDialogImport = content.includes('CreateItemDialogEnhanced');
    const hasDialogState = content.includes('createDialogOpen');
    const hasDialogComponent = content.includes('<CreateItemDialogEnhanced');
    const hasTabComponentProps = content.includes('TabComponentProps');
    
    if (!hasCreateButton) {
      console.log(`  ℹ️  No create buttons found`);
      return false;
    }
    
    // FIX 1: Remove duplicate buttons from empty states
    // Pattern: Button inside empty state div with "No data found" or "text-center py-"
    const emptyStatePattern = /<div[^>]*(?:text-center py-\d+|No data found)[^>]*>[\s\S]{0,500}?<Button[^>]*>[\s\S]{0,200}?<Plus[\s\S]{0,100}?<\/Button>/gi;
    const emptyStateMatches = content.match(emptyStatePattern);
    
    if (emptyStateMatches) {
      emptyStateMatches.forEach(match => {
        // Check if there's already a button in the header
        if (content.includes('Action Buttons - Standard Positioning') || 
            (content.includes('justify-between') && content.includes('<Plus'))) {
          // Remove the button from empty state, keep the text
          const withoutButton = match.replace(/<Button[\s\S]*?<\/Button>/, '');
          // Also remove the mb-4 from the paragraph before it
          const cleaned = withoutButton.replace(/mb-4/, '');
          content = content.replace(match, cleaned);
          stats.duplicatesRemoved++;
          modified = true;
          console.log(`  ✅ Removed duplicate button from empty state`);
        }
      });
    }
    
    // FIX 2: Add missing imports
    if (hasCreateButton && !hasDialogImport) {
      // Add CreateItemDialogEnhanced import after lucide-react
      const lucideImport = content.match(/import.*from ['"]lucide-react['"]/);
      if (lucideImport) {
        content = content.replace(
          lucideImport[0],
          `${lucideImport[0]}\nimport { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"`
        );
        console.log(`  ✅ Added CreateItemDialogEnhanced import`);
        modified = true;
      }
    }
    
    // Add TabComponentProps if missing
    if (hasCreateButton && !hasTabComponentProps && !content.includes('export default function')) {
      const lastImport = content.lastIndexOf('import');
      const nextNewline = content.indexOf('\n', lastImport + 100);
      if (nextNewline > -1) {
        content = content.slice(0, nextNewline) +
                 `\nimport type { TabComponentProps } from "@/types"` +
                 content.slice(nextNewline);
        console.log(`  ✅ Added TabComponentProps import`);
        modified = true;
      }
    }
    
    // Add useState if missing
    if (hasCreateButton && !content.includes('useState')) {
      const reactImport = content.match(/import.*from ['"]react['"]/);
      if (reactImport) {
        content = content.replace(
          reactImport[0],
          `import { useState } from "react"\n${reactImport[0]}`
        );
        console.log(`  ✅ Added useState import`);
        modified = true;
      } else {
        // Add new import
        const firstImport = content.indexOf('import');
        if (firstImport > -1) {
          content = content.slice(0, firstImport) +
                   `import { useState } from "react"\n` +
                   content.slice(firstImport);
          console.log(`  ✅ Added useState import`);
          modified = true;
        }
      }
    }
    
    // FIX 3: Add dialog state if missing
    if (hasCreateButton && !hasDialogState) {
      // Find the component function
      const functionMatch = content.match(/export (?:default )?function \w+\([^)]*\) \{/);
      if (functionMatch) {
        // Find where to insert (after useTranslations or useModuleData)
        const afterFunction = content.indexOf(functionMatch[0]) + functionMatch[0].length;
        const useTranslationsPos = content.indexOf('useTranslations', afterFunction);
        const useModuleDataPos = content.indexOf('useModuleData', afterFunction);
        
        let insertPos = Math.max(useTranslationsPos, useModuleDataPos);
        if (insertPos > -1) {
          // Find the end of that line
          const nextNewline = content.indexOf('\n', insertPos);
          if (nextNewline > -1) {
            // Find the next blank line or the next const
            let insertPoint = nextNewline + 1;
            // Skip to after all the hooks
            while (content.slice(insertPoint, insertPoint + 100).includes('use')) {
              insertPoint = content.indexOf('\n', insertPoint + 1) + 1;
            }
            
            content = content.slice(0, insertPoint) +
                     `  const [createDialogOpen, setCreateDialogOpen] = useState(false)\n\n` +
                     content.slice(insertPoint);
            console.log(`  ✅ Added dialog state`);
            modified = true;
          }
        }
      }
    }
    
    // FIX 4: Add onClick handler to header button if missing
    const headerButtonPattern = /<Button[^>]*size="sm"[^>]*>[\s\S]{0,100}?<Plus[\s\S]{0,100}?(?:Create|Add|New)[\s\S]{0,100}?<\/Button>/g;
    const headerButtons = content.match(headerButtonPattern);
    
    if (headerButtons) {
      headerButtons.forEach(button => {
        if (!button.includes('onClick')) {
          const fixed = button.replace('<Button', '<Button onClick={() => setCreateDialogOpen(true)}');
          content = content.replace(button, fixed);
          stats.handlersAdded++;
          modified = true;
          console.log(`  ✅ Added onClick handler to button`);
        }
      });
    }
    
    // FIX 5: Add dialog component if missing
    if (hasCreateButton && !hasDialogComponent) {
      // Find the last closing div before the closing brace
      const lastDiv = content.lastIndexOf('</div>');
      const closingBrace = content.lastIndexOf('}');
      
      if (lastDiv > -1 && lastDiv < closingBrace) {
        const dialogCode = `

      {/* Create Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={moduleId}
        tabSlug={tabSlug}
        workspaceId={workspaceId}
        onSuccess={(item) => {
          console.log("Created item:", item)
        }}
      />
    `;
        content = content.slice(0, lastDiv) + dialogCode + content.slice(lastDiv);
        stats.dialogsAdded++;
        modified = true;
        console.log(`  ✅ Added CreateItemDialogEnhanced component`);
      }
    }
    
    // FIX 6: Standardize labels
    const labelFixes = [
      { from: /Create new/g, to: 'Create' },
      { from: /Create New/g, to: 'Create' },
      { from: /Add new/gi, to: 'Add' },
    ];
    
    labelFixes.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        stats.labelsFixed++;
        modified = true;
        console.log(`  ✅ Standardized button label`);
      }
    });
    
    // Save if modified
    if (modified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      stats.filesModified++;
      console.log(`  💾 Saved`);
      return true;
    } else if (!modified) {
      console.log(`  ✅ Already compliant`);
    }
    
    return false;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    stats.errors.push({ file: filePath, error: error.message });
    return false;
  }
}

// Main execution
console.log('🔧 Starting comprehensive Create button fixes...\n');
console.log('='.repeat(80));

const tabFiles = getAllTabFiles(COMPONENTS_DIR);
stats.filesProcessed = tabFiles.length;

console.log(`\nFound ${tabFiles.length} tab files\n`);
console.log('='.repeat(80));

tabFiles.forEach(file => {
  fixFile(file);
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Files Processed: ${stats.filesProcessed}`);
console.log(`Files Modified: ${stats.filesModified}`);
console.log(`Duplicate Buttons Removed: ${stats.duplicatesRemoved}`);
console.log(`Dialogs Added: ${stats.dialogsAdded}`);
console.log(`Handlers Added: ${stats.handlersAdded}`);
console.log(`Labels Fixed: ${stats.labelsFixed}`);
console.log(`Errors: ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log('\n❌ ERRORS:');
  stats.errors.forEach(({ file, error }) => {
    console.log(`  ${path.relative(COMPONENTS_DIR, file)}: ${error}`);
  });
}

console.log('\n' + '='.repeat(80));
console.log(stats.filesModified > 0 ? '✅ FIXES COMPLETE' : '✅ ALL FILES COMPLIANT');
console.log('='.repeat(80) + '\n');

process.exit(stats.errors.length > 0 ? 1 : 0);
