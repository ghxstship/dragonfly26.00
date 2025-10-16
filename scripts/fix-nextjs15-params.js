#!/usr/bin/env node

/**
 * Fix Next.js 15 Params - Make all params async
 * In Next.js 15, params are now Promise-based
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Next.js 15 params across all pages...\n');

// Find all page.tsx files with params interfaces
const findCommand = `find src/app -name "page.tsx" -type f`;
const files = execSync(findCommand, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let fixedCount = 0;
let skippedCount = 0;

files.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has params interface
  if (!content.includes('params: {')) {
    skippedCount++;
    return;
  }
  
  // Check if it's a client component
  const isClientComponent = content.includes('"use client"');
  
  if (isClientComponent) {
    // For client components, params are not needed - remove them
    // Pattern 1: Remove interface and params from function signature
    const interfacePattern = /interface \w+PageProps \{[\s\S]*?params: \{[\s\S]*?\}[\s\S]*?\}/g;
    const functionPattern = /export default (async )?function \w+\(\{ params \}: \w+PageProps\)/;
    
    if (content.match(interfacePattern) && content.match(functionPattern)) {
      // Remove the interface
      content = content.replace(interfacePattern, '');
      
      // Remove params from function signature
      content = content.replace(
        /export default (async )?function (\w+)\(\{ params \}: \w+PageProps\)/,
        'export default function $2()'
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed client component: ${file}`);
      fixedCount++;
    }
  } else {
    // For server components, make params async
    // Pattern: params: { ... } -> params: Promise<{ ... }>
    const updated = content.replace(
      /params: \{([\s\S]*?)\}/,
      'params: Promise<{$1}>'
    );
    
    if (updated !== content) {
      // Also need to make the function async and await params
      let finalContent = updated;
      
      // Make function async if not already
      if (!finalContent.includes('export default async function')) {
        finalContent = finalContent.replace(
          /export default function (\w+)\(/,
          'export default async function $1('
        );
      }
      
      // Add await for params destructuring
      finalContent = finalContent.replace(
        /export default async function \w+\(\{ params \}: \w+PageProps\) \{/,
        (match) => {
          return match + '\n  const { locale } = await params';
        }
      );
      
      fs.writeFileSync(filePath, finalContent);
      console.log(`✅ Fixed server component: ${file}`);
      fixedCount++;
    }
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log(`⏭️  Skipped ${skippedCount} files (no params)`);
console.log('\nRun "npm run build" to verify all fixes.');
