#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Comprehensive lint error fixes...\n');

// Find all tab files
const tabFiles = glob.sync('src/components/**/*-tab.tsx', { cwd: process.cwd() });

let fixedSyntax = 0;
let fixedDuplicateProps = 0;
let fixedConditionalHooks = 0;
let fixedMissingImports = 0;

tabFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix 1: Syntax errors - hooks in function parameters
  const syntaxPattern = /export function (\w+)\(\{\s*const t = useTranslations\([^)]+\)\s*const tCommon = useTranslations\([^)]+\)\s*([^}]+)\}: ([^)]+)\) \{/s;
  
  if (syntaxPattern.test(content)) {
    const match = content.match(syntaxPattern);
    if (match) {
      const funcName = match[1];
      const params = match[2].trim();
      const propsType = match[3];
      
      // Extract translation keys from original
      const tMatch = content.match(/const t = useTranslations\(['"]([^'"]+)['"]\)/);
      const tKey = tMatch ? tMatch[1] : 'common';
      
      content = content.replace(
        syntaxPattern,
        `export function ${funcName}({ ${params} }: ${propsType}) {\n  const t = useTranslations('${tKey}')\n  const tCommon = useTranslations('common')`
      );
      
      // Fix duplicate closing braces
      content = content.replace(/\s+<\/div>\s+\)\s+}/m, '\n    )\n  }');
      
      modified = true;
      fixedSyntax++;
    }
  }

  // Fix 2: Duplicate className props
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    // Pattern 1: aria-hidden="true" className="..."
    if (line.match(/aria-hidden="true"\s+className="/)) {
      const fixed = line.replace(/(\s+)aria-hidden="true"(\s+)className="([^"]+)"/, '$1className="$3" aria-hidden="true"');
      if (fixed !== line) {
        modified = true;
        fixedDuplicateProps++;
        return fixed;
      }
    }
    
    // Pattern 2: Two className attributes
    if (line.match(/className="[^"]*"[^>]*className="/)) {
      const match1 = line.match(/className="([^"]+)"/);
      const match2 = line.match(/className="[^"]*"[^>]*className="([^"]+)"/);
      if (match1 && match2) {
        const combined = `${match1[1]} ${match2[1]}`.trim();
        const fixed = line.replace(/className="[^"]*"[^>]*className="[^"]*"/, `className="${combined}"`);
        if (fixed !== line) {
          modified = true;
          fixedDuplicateProps++;
          return fixed;
        }
      }
    }
    
    return line;
  });
  
  if (modified) {
    content = newLines.join('\n');
  }

  // Fix 3: Conditional hook calls
  const conditionalHookPattern = /const \{ data: fetchedData, loading: fetchLoading \} = data\s*\?\s*\{ data, loading \}\s*:\s*useModuleData\(([^)]+)\)/;
  
  if (conditionalHookPattern.test(content)) {
    content = content.replace(
      conditionalHookPattern,
      'const { data: hookData, loading: hookLoading } = useModuleData($1)\n  const fetchedData = data || hookData\n  const fetchLoading = loading !== undefined ? loading : hookLoading'
    );
    modified = true;
    fixedConditionalHooks++;
  }

  // Fix 4: Missing Plus import
  if (content.includes('<Plus ') && !content.includes('import { Plus') && !content.includes(', Plus')) {
    const lucideImportMatch = content.match(/import \{([^}]+)\} from ["']lucide-react["']/);
    if (lucideImportMatch) {
      const imports = lucideImportMatch[1].trim().split(',').map(s => s.trim());
      if (!imports.includes('Plus')) {
        imports.push('Plus');
        content = content.replace(
          /import \{[^}]+\} from ["']lucide-react["']/,
          `import { ${imports.join(', ')} } from "lucide-react"`
        );
        modified = true;
        fixedMissingImports++;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Fixed ${fixedSyntax} syntax errors`);
console.log(`✅ Fixed ${fixedDuplicateProps} duplicate props`);
console.log(`✅ Fixed ${fixedConditionalHooks} conditional hooks`);
console.log(`✅ Fixed ${fixedMissingImports} missing imports`);
console.log(`\n✅ All fixes complete!`);
