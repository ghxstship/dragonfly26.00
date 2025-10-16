#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All page files that need params updated for Next.js 15
const pagesToFix = [
  'src/app/[locale]/offline/page.tsx',
  'src/app/[locale]/(dashboard)/webhooks/page.tsx',
  'src/app/[locale]/(dashboard)/reports/page.tsx',
  'src/app/[locale]/(dashboard)/api-tokens/page.tsx',
  'src/app/[locale]/(dashboard)/automations/page.tsx',
  'src/app/[locale]/(dashboard)/admin/page.tsx',
  'src/app/[locale]/(dashboard)/plugins/page.tsx',
  'src/app/[locale]/(dashboard)/insights/page.tsx',
  'src/app/[locale]/(auth)/login/page.tsx',
  'src/app/[locale]/(auth)/reset-password/page.tsx',
  'src/app/[locale]/(auth)/verify-email/page.tsx',
  'src/app/[locale]/(auth)/forgot-password/page.tsx',
  'src/app/[locale]/(auth)/signup/page.tsx',
  'src/app/[locale]/(auth)/auth-check/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/invite/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/workspace/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/complete/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/plan/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/welcome/page.tsx',
  'src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/page.tsx',
  'src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx',
  'src/app/[locale]/test-notifications/page.tsx',
];

function fixPageParams(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} - file not found`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Check if already using Promise<{
  if (content.includes('params: Promise<{')) {
    console.log(`✓ Skipping ${filePath} - already uses Promise params`);
    return false;
  }

  // Check if it's a client component
  const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
  
  if (!isClientComponent) {
    console.log(`⚠️  Skipping ${filePath} - not a client component`);
    return false;
  }

  // Add 'use' import from React if not present
  if (!content.includes("import { use") && !content.includes("import {use")) {
    content = content.replace(
      /from ['"]react['"]/,
      (match) => {
        const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]react['"]/);
        if (importMatch) {
          const imports = importMatch[1].trim();
          if (!imports.includes('use')) {
            return `from 'react'`.replace('from', `use, ${imports} } from`).replace('} }', '}');
          }
        }
        return match;
      }
    );
    
    // Simpler approach: just add use to existing React imports
    content = content.replace(
      /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
      (match, imports) => {
        if (!imports.includes('use')) {
          return `import { use, ${imports.trim()} } from 'react'`;
        }
        return match;
      }
    );
  }

  // Find the props interface
  const interfaceMatch = content.match(/interface\s+(\w+Props)\s+{\s+params:\s+{([^}]+)}\s+}/s);
  
  if (!interfaceMatch) {
    console.log(`⚠️  Skipping ${filePath} - couldn't find params interface`);
    return false;
  }

  const interfaceName = interfaceMatch[1];
  const paramsContent = interfaceMatch[2];

  // Update interface to use Promise
  content = content.replace(
    new RegExp(`interface\\s+${interfaceName}\\s+{\\s+params:\\s+{([^}]+)}\\s+}`, 's'),
    `interface ${interfaceName} {\n  params: Promise<{$1}>\n}`
  );

  // Find the function and add use() call
  const functionMatch = content.match(new RegExp(`export default function \\w+\\(\\{\\s*params\\s*}:\\s*${interfaceName}\\)`));
  
  if (functionMatch) {
    // Add use(params) destructuring at the start of the function
    content = content.replace(
      new RegExp(`(export default function \\w+\\(\\{\\s*params\\s*}:\\s*${interfaceName}\\)\\s*{)`, ''),
      (match) => {
        // Check if there's already a destructuring of params
        const nextLines = content.substring(content.indexOf(match) + match.length, content.indexOf(match) + match.length + 200);
        
        // Determine what to destructure from params
        let destructure = 'locale';
        if (filePath.includes('[workspaceId]')) destructure += ', workspaceId';
        if (filePath.includes('[module]')) destructure += ', module';
        if (filePath.includes('[tab]')) destructure += ', tab';
        if (filePath.includes('[token]')) destructure += ', token';
        
        return `${match}\n  const { ${destructure} } = use(params)`;
      }
    );
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Fixed ${filePath}`);
  return true;
}

console.log('🔧 Updating page params for Next.js 15...\n');

let fixedCount = 0;
let skippedCount = 0;

pagesToFix.forEach(filePath => {
  if (fixPageParams(filePath)) {
    fixedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n✨ Complete!`);
console.log(`   Fixed: ${fixedCount}`);
console.log(`   Skipped: ${skippedCount}`);
console.log(`   Total: ${pagesToFix.length}`);
