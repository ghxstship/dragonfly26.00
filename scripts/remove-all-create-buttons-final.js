const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find ALL tab files with create buttons
const findCommand = `find src/components -name "*-tab.tsx" -type f`;
const allTabFiles = execSync(findCommand, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

console.log(`Checking ${allTabFiles.length} tab files...`);

let fixedCount = 0;
let errorCount = 0;

allTabFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Remove CreateItemDialogEnhanced import
    content = content.replace(/^import { CreateItemDialogEnhanced } from ["']@\/components\/shared\/create-item-dialog-enhanced["']\n/gm, '');
    
    // Remove createDialogOpen state
    content = content.replace(/\s*const \[createDialogOpen, setCreateDialogOpen\] = useState\(false\)\n/g, '');
    
    // Remove the entire CreateItemDialogEnhanced JSX block
    content = content.replace(
      /<CreateItemDialogEnhanced[\s\S]*?(?:\/\>|\<\/CreateItemDialogEnhanced\>)/g,
      ''
    );
    
    // Remove create button JSX patterns (various formats)
    // Pattern 1: Button with Plus icon and create in aria-label
    content = content.replace(
      /<Button[^>]*aria-label[^>]*create[^>]*>[\s\S]*?<Plus[^>]*>[\s\S]*?<\/Button>/gi,
      ''
    );
    
    // Pattern 2: Button with Plus icon (without specific aria-label check)
    content = content.replace(
      /<Button[^>]*>[\s\S]*?<Plus className="h-4 w-4[^"]*"[^>]*>[\s\S]*?{t(?:Common)?\(['"]create['"]\)[^}]*}[\s\S]*?<\/Button>/gi,
      ''
    );
    
    // Pattern 3: Standalone create buttons with various patterns
    content = content.replace(
      /<Button[^>]*onClick[^>]*setCreate[^>]*>[\s\S]*?<\/Button>/gi,
      ''
    );
    
    // Clean up empty action button containers
    content = content.replace(
      /<div className="flex[^"]*gap[^"]*">\s*<\/div>/g,
      ''
    );
    
    // Clean up trailing empty comment blocks
    content = content.replace(/\n\s*\n\s*{\/\*\s*Create\s*(?:Dialog|Button|Item)?\s*\*\/}\s*\n/gi, '\n');
    
    // Clean up multiple consecutive blank lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Complete: ${fixedCount} files fixed, ${errorCount} errors`);
console.log(`📊 Total files processed: ${allTabFiles.length}`);
