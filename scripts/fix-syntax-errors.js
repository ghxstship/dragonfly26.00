const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/admin/api-tokens-tab.tsx',
  'src/components/admin/automations-tab.tsx',
  'src/components/admin/billing-tab.tsx',
  'src/components/admin/checklist-templates-tab.tsx',
  'src/components/admin/integrations-tab.tsx',
];

let fixedCount = 0;

filesToFix.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix pattern: return (\n    <div className="space-y-6">\n      {\n\n      {/* Comment */}
    content = content.replace(
      /return \(\s*<div className="space-y-6">\s*\{\s*\n\s*\{\/\*/g,
      'return (\n    <div className="space-y-6">\n      {/*'
    );
    
    // Fix pattern: </Card>\n      </div>\n\n      <div className="space-y-3">
    // Should close the outer div first
    content = content.replace(
      /(\/Card>\s*<\/div>\s*)\n\s*\n\s*(<div className="space-y-3">)/g,
      '$1\n\n      $2'
    );
    
    // Fix empty closing braces )}
    content = content.replace(
      /\s*\)\}\s*\n\s*<\/div>/g,
      '\n                        </div>'
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    } else {
      console.log(`  No changes: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
  }
});

console.log(`\nFixed ${fixedCount} files`);
