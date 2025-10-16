#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Adding missing translation hooks...\n');

const filesToFix = [
  'src/components/files/file-share-dialog.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if useTranslations is already imported
  if (content.includes('useTranslations')) {
    console.log(`⏭️  Already has useTranslations: ${file}`);
    return;
  }
  
  // Check if file uses t() function
  if (!content.includes('t(')) {
    console.log(`⏭️  Doesn't use t(): ${file}`);
    return;
  }
  
  // Add import after "use client" and other imports
  const importLine = 'import { useTranslations } from "next-intl"';
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importLine);
    content = lines.join('\n');
  }
  
  // Find the component function and add the hook
  const componentMatch = content.match(/export\s+function\s+(\w+)\s*\([^)]*\)\s*{/);
  if (componentMatch) {
    const hookLine = "  const t = useTranslations('files')";
    
    // Find the opening brace of the function
    const funcStart = content.indexOf(componentMatch[0]) + componentMatch[0].length;
    
    // Insert the hook right after the opening brace
    content = content.slice(0, funcStart) + '\n' + hookLine + content.slice(funcStart);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`⚠️  Could not find component function: ${file}`);
  }
});

console.log('\n✅ Done!');
