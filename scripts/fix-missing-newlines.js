const fs = require('fs');
const { execSync } = require('child_process');

// Find all tab files
const findCommand = `find src/components -name "*-tab.tsx" -type f`;
const allTabFiles = execSync(findCommand, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

console.log(`Fixing ${allTabFiles.length} tab files...`);

let fixedCount = 0;

allTabFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    // Fix missing newlines after useTranslations('common')
    content = content.replace(
      /const tCommon = useTranslations\('common'\)  const/g,
      "const tCommon = useTranslations('common')\n  const"
    );
    
    // Fix missing newlines after useState
    content = content.replace(
      /useState<[^>]+>\([^)]*\)  const/g,
      (match) => match.replace(')  const', ')\n  const')
    );
    
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
