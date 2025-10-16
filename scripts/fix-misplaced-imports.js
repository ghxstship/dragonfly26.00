const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files with the misplaced import
const findCommand = `grep -rl 'import type { TabComponentProps } from "@/types"' src/components`;
let files;

try {
  files = execSync(findCommand, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter(f => f.endsWith('.tsx'));
} catch (error) {
  console.log('No files found or error:', error.message);
  process.exit(0);
}

console.log(`Found ${files.length} files to fix`);

let fixedCount = 0;
let errorCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Remove all instances of the misplaced import line
    content = content.replace(/^import type { TabComponentProps } from "@\/types"\n/gm, '');
    
    // Also remove if it's in the middle of code (not at start of line)
    content = content.split('\n').filter(line => {
      return !line.trim().startsWith('import type { TabComponentProps }');
    }).join('\n');
    
    // Remove duplicate useState declarations that might have been created
    // Pattern: two consecutive lines with useState for createDialogOpen
    content = content.replace(
      /const \[createDialogOpen, setCreateDialogOpen\] = useState\(false\)\n\s*const \[createDialogOpen, setCreateDialogOpen\] = useState\(false\)/g,
      'const [createDialogOpen, setCreateDialogOpen] = useState(false)'
    );
    
    // Fix cases where useState array initialization was broken
    // Pattern: useState([ followed by another useState on next line
    content = content.replace(
      /const \[(\w+), set\w+\] = useState<[^>]+>\(\[\n\s*const \[createDialogOpen, setCreateDialogOpen\] = useState\(false\)/g,
      (match, varName) => {
        return `const [${varName}, set${varName.charAt(0).toUpperCase() + varName.slice(1)}] = useState<any>([`;
      }
    );
    
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
