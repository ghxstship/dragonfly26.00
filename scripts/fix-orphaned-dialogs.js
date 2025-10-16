const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with CreateItemDialogEnhanced
const findCommand = `grep -rl 'CreateItemDialogEnhanced' src/components/admin src/components/settings 2>/dev/null || true`;
let files;

try {
  const output = execSync(findCommand, { encoding: 'utf-8' }).trim();
  files = output ? output.split('\n').filter(f => f.endsWith('.tsx')) : [];
} catch (error) {
  console.log('No files found');
  files = [];
}

console.log(`Found ${files.length} files to fix`);

let fixedCount = 0;
let errorCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Remove the import statement for CreateItemDialogEnhanced
    content = content.replace(/^import { CreateItemDialogEnhanced } from "@\/components\/shared\/create-item-dialog-enhanced"\n/gm, '');
    
    // Remove the createDialogOpen state if it exists
    content = content.replace(/\s*const \[createDialogOpen, setCreateDialogOpen\] = useState\(false\)\n/g, '');
    
    // Remove the entire CreateItemDialogEnhanced JSX block (including props)
    // Pattern: <CreateItemDialogEnhanced ... /> or <CreateItemDialogEnhanced ... >...</CreateItemDialogEnhanced>
    content = content.replace(
      /<CreateItemDialogEnhanced[\s\S]*?(?:\/\>|\<\/CreateItemDialogEnhanced\>)/g,
      ''
    );
    
    // Remove any trailing empty comment blocks
    content = content.replace(/\n\s*\n\s*{\/\* Create Dialog \*\/}\s*\n/g, '\n');
    
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

console.log(`\nComplete: ${fixedCount} files fixed, ${errorCount} errors`);
