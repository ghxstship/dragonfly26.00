const fs = require('fs');
const path = require('path');

// Component directories to process
const componentDirs = [
  'src/components/shared',
  'src/components/admin',
  'src/components/goals',
  'src/components/reports',
  'src/components/plugins',
  'src/components/mobile',
  'src/components/realtime',
  'src/components/views',
  'src/components/automations',
  'src/components/api-tokens'
];

const baseDir = path.join(__dirname, '..');

// Helper to add useTranslations import if not exists
function addTranslationImport(content) {
  // Check if already has the import
  if (content.includes('useTranslations')) {
    return content;
  }
  
  // Check if it's a client component
  if (!content.includes('"use client"')) {
    return content;
  }
  
  // Find where to insert the import (after 'use client' and other imports)
  const lines = content.split('\n');
  let insertIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('from "next/navigation"') || 
        lines[i].includes('from "react"') ||
        lines[i].includes('from \'next/navigation\'') ||
        lines[i].includes('from \'react\'')) {
      insertIndex = i + 1;
    }
  }
  
  if (insertIndex > 0) {
    lines.splice(insertIndex, 0, 'import { useTranslations } from "next-intl"');
    return lines.join('\n');
  }
  
  return content;
}

// Helper to add const t = useTranslations() in component
function addTranslationHook(content) {
  if (content.includes('const t = useTranslations()')) {
    return content;
  }
  
  // Find function component declaration
  const functionMatch = content.match(/export function \w+\([^)]*\) \{/);
  if (functionMatch) {
    const insertPoint = functionMatch.index + functionMatch[0].length;
    return content.slice(0, insertPoint) + '\n  const t = useTranslations()' + content.slice(insertPoint);
  }
  
  return content;
}

let filesProcessed = 0;
let filesUpdated = 0;

componentDirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    filesProcessed++;
    
    // Add imports and hooks
    content = addTranslationImport(content);
    content = addTranslationHook(content);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesUpdated++;
      console.log(`✓ Updated: ${dir}/${file}`);
    }
  });
});

console.log(`\n✅ Processed ${filesProcessed} files`);
console.log(`📝 Updated ${filesUpdated} files with i18n imports`);
console.log(`\nNote: Manual updates still needed for hardcoded strings.`);
console.log(`Use t('namespace.key') to replace hardcoded text.`);
