#!/usr/bin/env node

/**
 * Fix All Client Component Params
 * Remove unused params from all client components
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all client component params...\n');

const clientPages = [
  'src/app/[locale]/test-notifications/page.tsx',
  'src/app/[locale]/offline/page.tsx',
  'src/app/[locale]/(auth)/login/page.tsx',
  'src/app/[locale]/(auth)/signup/page.tsx',
  'src/app/[locale]/(auth)/forgot-password/page.tsx',
  'src/app/[locale]/(auth)/reset-password/page.tsx',
  'src/app/[locale]/(auth)/verify-email/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/welcome/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/workspace/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/plan/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/invite/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/complete/page.tsx',
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
let alreadyFixedCount = 0;

clientPages.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if it's a client component
  if (!content.includes('"use client"') && !content.includes("'use client'")) {
    console.log(`⚠️  Not a client component: ${file}`);
    return;
  }
  
  // Check if already fixed
  if (!content.includes('params: {') && !content.includes('params: Promise')) {
    alreadyFixedCount++;
    return;
  }
  
  // Remove interface with params
  const interfacePattern = /interface \w+PageProps \{[\s\S]*?params: (Promise<)?{[\s\S]*?\}(>)?[\s\S]*?\}\n\n/g;
  content = content.replace(interfacePattern, '');
  
  // Remove params from function signature - handle various patterns
  content = content.replace(
    /export default (async )?function (\w+)\(\{ params(, searchParams)? \}: \w+PageProps\)/g,
    'export default function $2()'
  );
  
  // Also handle destructured params
  content = content.replace(
    /const \{ locale(, \w+)* \} = (await )?params\n/g,
    ''
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed: ${file}`);
  fixedCount++;
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log(`⏭️  Already fixed: ${alreadyFixedCount} files`);
console.log('\nRun "npm run build" to verify.');
