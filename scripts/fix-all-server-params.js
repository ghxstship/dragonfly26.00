#!/usr/bin/env node

/**
 * Fix All Server Component Params
 * Make params async for Next.js 15 or remove if unused
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all server component params...\n');

const serverPages = [
  'src/app/[locale]/offline/page.tsx',
  'src/app/[locale]/(dashboard)/admin/page.tsx',
  'src/app/[locale]/(dashboard)/reports/page.tsx',
  'src/app/[locale]/(dashboard)/insights/page.tsx',
  'src/app/[locale]/(dashboard)/webhooks/page.tsx',
  'src/app/[locale]/(dashboard)/automations/page.tsx',
  'src/app/[locale]/(dashboard)/api-tokens/page.tsx',
  'src/app/[locale]/(dashboard)/plugins/page.tsx',
  'src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/page.tsx',
  'src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx',
];

let fixedCount = 0;

serverPages.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if params are actually used in the component
  const usesParams = content.includes('params.') || content.includes('const { locale') || content.includes('const { workspaceId') || content.includes('const { module') || content.includes('const { tab');
  
  if (!usesParams) {
    // Remove unused params
    const interfacePattern = /interface \w+PageProps \{[\s\S]*?params: (Promise<)?{[\s\S]*?\}(>)?[\s\S]*?\}\n\n/g;
    content = content.replace(interfacePattern, '');
    
    content = content.replace(
      /export default (async )?function (\w+)\(\{ params \}: \w+PageProps\)/g,
      'export default function $2()'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Removed unused params: ${file}`);
    fixedCount++;
  } else {
    // Make params async for Next.js 15
    // Update interface
    content = content.replace(
      /params: \{([\s\S]*?)\}/,
      'params: Promise<{$1}>'
    );
    
    // Make function async if not already
    if (!content.includes('export default async function')) {
      content = content.replace(
        /export default function (\w+)\(/,
        'export default async function $1('
      );
    }
    
    // Add await for params destructuring at the start of the function
    const functionMatch = content.match(/export default async function \w+\(\{ params \}: \w+PageProps\) \{/);
    if (functionMatch) {
      // Check if params are destructured
      const destructureMatch = content.match(/const \{ ([\w, ]+) \} = params/);
      if (destructureMatch) {
        // Replace destructuring with await
        content = content.replace(
          /const \{ ([\w, ]+) \} = params/,
          'const { $1 } = await params'
        );
      } else {
        // Add destructuring after function declaration
        const paramsUsed = [];
        if (content.includes('params.locale')) paramsUsed.push('locale');
        if (content.includes('params.workspaceId')) paramsUsed.push('workspaceId');
        if (content.includes('params.module')) paramsUsed.push('module');
        if (content.includes('params.tab')) paramsUsed.push('tab');
        
        if (paramsUsed.length > 0) {
          content = content.replace(
            /export default async function (\w+)\(\{ params \}: \w+PageProps\) \{/,
            `export default async function $1({ params }: $1Props) {\n  const { ${paramsUsed.join(', ')} } = await params`
          );
          
          // Replace params.x with x
          paramsUsed.forEach(param => {
            content = content.replace(new RegExp(`params\\.${param}`, 'g'), param);
          });
        }
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Made params async: ${file}`);
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log('\nRun "npm run build" to verify.');
