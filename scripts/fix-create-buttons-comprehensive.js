#!/usr/bin/env node

/**
 * COMPREHENSIVE CREATE BUTTON FIX SCRIPT
 * 
 * Fixes all Create/Add button issues:
 * 1. Removes duplicate buttons from empty states
 * 2. Adds missing CreateItemDialogEnhanced implementations
 * 3. Ensures consistent button placement (header only)
 * 4. Standardizes button labels
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const fixes = {
  totalFiles: 0,
  filesModified: 0,
  issues: {
    duplicatesRemoved: 0,
    dialogsAdded: 0,
    handlersAdded: 0,
    labelsStandardized: 0
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

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let modified = false;
  const relativePath = path.relative(COMPONENTS_DIR, filePath);
  
  console.log(`\n📝 Processing: ${relativePath}`);
  
  // Check if file has CreateItemDialogEnhanced import
  const hasDialogImport = content.includes('CreateItemDialogEnhanced');
  const hasDialogState = content.includes('createDialogOpen');
  const hasDialogComponent = content.includes('<CreateItemDialogEnhanced');
  
  // Find button instances in empty states
  const emptyStateButtonPattern = /<div[^>]*(?:emptyState|No data found|text-center py-\d+)[^>]*>[\s\S]*?<Button[^>]*>[\s\S]*?<Plus[^>]*\/>[\s\S]*?(?:Create|Add|New)[^<]*<\/Button>/gi;
  const matches = content.match(emptyStateButtonPattern);
  
  if (matches && matches.length > 0) {
    console.log(`  ⚠️  Found ${matches.length} button(s) in empty state`);
    
    // Remove buttons from empty states (keep only in header)
    matches.forEach(match => {
      // Only remove if there's already a button in the header
      if (content.includes('Action Buttons - Standard Positioning') || 
          content.includes('flex items-center justify-between')) {
        content = content.replace(match, match.replace(/<Button[\s\S]*?<\/Button>/, ''));
        modified = true;
        fixes.issues.duplicatesRemoved++;
        console.log(`  ✅ Removed duplicate button from empty state`);
      }
    });
  }
  
  // Add missing dialog implementation if buttons exist but no dialog
  const hasCreateButton = content.includes('<Plus') && 
                          (content.includes('Create') || content.includes('Add') || content.includes('New'));
  
  if (hasCreateButton && !hasDialogComponent) {
    console.log(`  ⚠️  Has Create button but missing dialog implementation`);
    
    // Add import if missing
    if (!hasDialogImport) {
      const importSection = content.match(/import.*from.*lucide-react.*/);
      if (importSection) {
        const insertAfter = importSection[0];
        content = content.replace(
          insertAfter,
          `${insertAfter}\nimport { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"`
        );
        console.log(`  ✅ Added CreateItemDialogEnhanced import`);
      }
    }
    
    // Add state if missing
    if (!hasDialogState) {
      const componentMatch = content.match(/export (?:default )?function \w+\([^)]*\) \{/);
      if (componentMatch) {
        const insertAfter = componentMatch[0];
        // Find where to insert (after translations)
        const translationsEnd = content.indexOf('useTranslations', content.indexOf(insertAfter));
        if (translationsEnd > -1) {
          const nextLineAfterTranslations = content.indexOf('\n', translationsEnd + 100);
          if (nextLineAfterTranslations > -1) {
            content = content.slice(0, nextLineAfterTranslations + 1) +
                     `  const [createDialogOpen, setCreateDialogOpen] = useState(false)\n` +
                     content.slice(nextLineAfterTranslations + 1);
            console.log(`  ✅ Added dialog state`);
          }
        }
      }
    }
    
    // Add useState import if missing
    if (!content.includes('useState')) {
      content = content.replace(
        /from ['"]react['"]/,
        match => match.replace('react', 'react"\nimport { useState } from "react')
      );
    }
    
    // Add dialog component before closing div
    if (!hasDialogComponent) {
      const lastClosingDiv = content.lastIndexOf('</div>');
      if (lastClosingDiv > -1) {
        const dialogComponent = `

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
        content = content.slice(0, lastClosingDiv) + dialogComponent + content.slice(lastClosingDiv);
        console.log(`  ✅ Added CreateItemDialogEnhanced component`);
        fixes.issues.dialogsAdded++;
      }
    }
    
    // Add onClick handler to button if missing
    const buttonWithoutOnClick = content.match(/<Button[^>]*size="sm"[^>]*>[\s\S]*?<Plus[^>]*\/>[\s\S]*?(?:Create|Add|New)[^<]*<\/Button>/);
    if (buttonWithoutOnClick && !buttonWithoutOnClick[0].includes('onClick')) {
      content = content.replace(
        buttonWithoutOnClick[0],
        buttonWithoutOnClick[0].replace('<Button', '<Button onClick={() => setCreateDialogOpen(true)}')
      );
      console.log(`  ✅ Added onClick handler to button`);
      fixes.issues.handlersAdded++;
    }
    
    modified = true;
  }
  
  // Standardize button labels (Create New -> Create, Add Item -> Add, etc.)
  const genericLabels = [
    { pattern: /Create new/gi, replacement: 'Create' },
    { pattern: /Create New/g, replacement: 'Create' },
    { pattern: /Add new/gi, replacement: 'Add' },
  ];
  
  genericLabels.forEach(({ pattern, replacement }) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      console.log(`  ✅ Standardized button label`);
      fixes.issues.labelsStandardized++;
      modified = true;
    }
  });
  
  // Save if modified
  if (modified && content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixes.filesModified++;
    console.log(`  💾 File saved with fixes`);
    return true;
  } else if (modified) {
    console.log(`  ℹ️  No actual changes needed`);
  } else {
    console.log(`  ✅ File already compliant`);
  }
  
  return false;
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('CREATE BUTTON FIX REPORT');
  console.log('='.repeat(80) + '\n');
  
  console.log(`Total Files Processed: ${fixes.totalFiles}`);
  console.log(`Files Modified: ${fixes.filesModified}\n`);
  
  console.log('FIXES APPLIED:');
  console.log('─'.repeat(80));
  console.log(`✅ Duplicate Buttons Removed: ${fixes.issues.duplicatesRemoved}`);
  console.log(`✅ Dialogs Added: ${fixes.issues.dialogsAdded}`);
  console.log(`✅ Handlers Added: ${fixes.issues.handlersAdded}`);
  console.log(`✅ Labels Standardized: ${fixes.issues.labelsStandardized}\n`);
  
  console.log('='.repeat(80));
  console.log(`STATUS: ${fixes.filesModified > 0 ? '✅ FIXES APPLIED' : '✅ ALL FILES COMPLIANT'}`);
  console.log('='.repeat(80) + '\n');
}

// Main execution
console.log('🔧 Starting comprehensive Create button fixes...\n');

const tabFiles = getAllTabFiles(COMPONENTS_DIR);
fixes.totalFiles = tabFiles.length;

console.log(`Found ${tabFiles.length} tab component files\n`);

tabFiles.forEach(file => {
  fixFile(file);
});

generateReport();

console.log('✅ All fixes complete!\n');
