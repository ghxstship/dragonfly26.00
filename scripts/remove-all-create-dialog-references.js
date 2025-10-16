const fs = require('fs');
const { execSync } = require('child_process');

// Find all files with setCreateDialogOpen references
const findCommand = `grep -rl "setCreateDialogOpen" src/components 2>/dev/null || true`;
const files = execSync(findCommand, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f && f.endsWith('.tsx'));

console.log(`Fixing ${files.length} files with setCreateDialogOpen references...`);

let fixedCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Remove Button elements with onClick setCreateDialogOpen
    content = content.replace(
      /<Button[^>]*onClick[^>]*setCreateDialogOpen[^>]*>[\s\S]*?<\/Button>/gi,
      ''
    );
    
    // Remove onAction props with setCreateDialogOpen
    content = content.replace(
      /onAction=\{[^}]*setCreateDialogOpen[^}]*\}/gi,
      ''
    );
    
    // Remove onCreate props with setCreateDialogOpen
    content = content.replace(
      /onCreate=\{[^}]*setCreateDialogOpen[^}]*\}/gi,
      ''
    );
    
    // Clean up empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error: ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
