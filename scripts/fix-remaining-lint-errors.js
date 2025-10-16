#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing remaining lint errors...\n');

// Get all files with errors
const lintOutput = execSync('npm run lint 2>&1 || true', { encoding: 'utf8' });
const errorFiles = [...new Set(lintOutput.match(/\.\/src\/components\/[^\s]+\.tsx/g) || [])];

console.log(`📋 Found ${errorFiles.length} files with errors\n`);

let fixedConditionalHooks = 0;
let fixedMissingImports = 0;

errorFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file.replace('./', ''));
  
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix 1: Conditional hook calls
  const conditionalHookPattern = /const \{ data: fetchedData, loading: fetchLoading \} = data\s*\?\s*\{ data, loading \}\s*:\s*useModuleData\(([^)]+)\)/;
  
  if (conditionalHookPattern.test(content)) {
    content = content.replace(
      conditionalHookPattern,
      'const { data: hookData, loading: hookLoading } = useModuleData($1)\n  const fetchedData = data || hookData\n  const fetchLoading = loading !== undefined ? loading : hookLoading'
    );
    modified = true;
    fixedConditionalHooks++;
  }

  // Fix 2: Missing Plus import
  if (content.includes('<Plus ') && !content.includes('import { Plus') && !content.includes(', Plus')) {
    // Find the lucide-react import line
    const lucideImportMatch = content.match(/import \{([^}]+)\} from ["']lucide-react["']/);
    if (lucideImportMatch) {
      const imports = lucideImportMatch[1].trim();
      const newImports = imports + ', Plus';
      content = content.replace(
        /import \{[^}]+\} from ["']lucide-react["']/,
        `import { ${newImports} } from "lucide-react"`
      );
      modified = true;
      fixedMissingImports++;
    } else {
      // No lucide import exists, add one
      const firstImportMatch = content.match(/^import .+$/m);
      if (firstImportMatch) {
        const insertPos = content.indexOf(firstImportMatch[0]) + firstImportMatch[0].length;
        content = content.slice(0, insertPos) + '\nimport { Plus } from "lucide-react"' + content.slice(insertPos);
        modified = true;
        fixedMissingImports++;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  }
});

console.log(`\n✅ Fixed ${fixedConditionalHooks} conditional hook errors`);
console.log(`✅ Fixed ${fixedMissingImports} missing import errors`);
console.log('\n🔍 Running lint again to verify...\n');

try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('\n✅ All errors fixed!');
} catch (error) {
  console.log('\n⚠️  Some errors may remain. Check output above.');
}
