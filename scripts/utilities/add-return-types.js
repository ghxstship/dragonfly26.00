#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 ADDING RETURN TYPE ANNOTATIONS');
console.log('==================================\n');

// Load audit data
const auditPath = path.join(__dirname, '../docs/audits/ZERO_TOLERANCE_12_LAYER_AUDIT_2025_01_20.json');
const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));

// Get files needing return types
const filesNeedingReturnTypes = [];
for (const [filename, fileData] of Object.entries(auditData.files)) {
  const hasReturnTypeViolation = fileData.layers.types.violations.some(v => 
    v.includes("Functions without return type annotations")
  );
  if (hasReturnTypeViolation) {
    filesNeedingReturnTypes.push({
      file: filename,
      path: fileData.path
    });
  }
}

console.log(`📊 Found ${filesNeedingReturnTypes.length} files needing return types\n`);

let filesFixed = 0;
let functionsAnnotated = 0;

filesNeedingReturnTypes.forEach(file => {
  const filePath = file.path;
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${file.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let annotations = 0;

  // Pattern 1: React component functions (should return JSX.Element)
  const componentPattern = /export\s+(?:default\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  let match;
  while ((match = componentPattern.exec(content)) !== null) {
    const funcName = match[1];
    const params = match[2];
    const fullMatch = match[0];
    
    // Check if already has return type
    if (!fullMatch.includes(':')) {
      // Check if it's a React component (starts with capital letter)
      if (funcName[0] === funcName[0].toUpperCase()) {
        const replacement = `export ${match[0].includes('default') ? 'default ' : ''}function ${funcName}(${params}): JSX.Element {`;
        content = content.replace(fullMatch, replacement);
        annotations++;
        modified = true;
      }
    }
  }

  // Pattern 2: Const arrow functions returning JSX
  const arrowComponentPattern = /const\s+([A-Z]\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{/g;
  content = content.replace(arrowComponentPattern, (match, name, params) => {
    if (!match.includes(':')) {
      annotations++;
      modified = true;
      return `const ${name} = (${params}): JSX.Element => {`;
    }
    return match;
  });

  // Pattern 3: Handler functions (onClick, onChange, etc.) - should return void
  const handlerPattern = /const\s+(handle\w+|on\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{/g;
  content = content.replace(handlerPattern, (match, name, params) => {
    if (!match.includes(':')) {
      annotations++;
      modified = true;
      return `const ${name} = (${params}): void => {`;
    }
    return match;
  });

  // Pattern 4: Async functions - should return Promise
  const asyncPattern = /const\s+(\w+)\s*=\s*async\s*\(([^)]*)\)\s*=>\s*\{/g;
  content = content.replace(asyncPattern, (match, name, params) => {
    if (!match.includes(':')) {
      annotations++;
      modified = true;
      return `const ${name} = async (${params}): Promise<void> => {`;
    }
    return match;
  });

  // Pattern 5: useEffect callbacks - should return void or cleanup function
  const useEffectPattern = /useEffect\(\(\)\s*=>\s*\{/g;
  content = content.replace(useEffectPattern, (match) => {
    annotations++;
    modified = true;
    return 'useEffect((): void | (() => void) => {';
  });

  // Pattern 6: Array methods (map, filter, etc.)
  const arrayMethodPattern = /\.(map|filter|reduce|forEach|find|some|every)\(\(([^)]*)\)\s*=>\s*\{/g;
  content = content.replace(arrayMethodPattern, (match, method, params) => {
    if (!match.includes(':')) {
      // Don't add return type here - let TypeScript infer
      return match;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${file.file} - Added ${annotations} return type annotations`);
    filesFixed++;
    functionsAnnotated += annotations;
  }
});

console.log(`\n✅ Added return types to ${filesFixed} files (${functionsAnnotated} functions)\n`);

console.log('═══════════════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('═══════════════════════════════════════════════════════════\n');
console.log(`✅ Files processed: ${filesNeedingReturnTypes.length}`);
console.log(`✅ Files modified: ${filesFixed}`);
console.log(`✅ Functions annotated: ${functionsAnnotated}`);
console.log(`\n📝 Next: Run type-check to verify changes\n`);
