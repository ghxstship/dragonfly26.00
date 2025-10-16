#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Pages that need params added (excluding those already fixed or with params)
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
  'src/app/[locale]/(onboarding)/onboarding/invite/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/workspace/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/complete/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/plan/page.tsx',
  'src/app/[locale]/(onboarding)/onboarding/welcome/page.tsx',
  'src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/page.tsx',
  'src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx',
];

function addParamsToPage(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} - file not found`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Check if already has params
  if (content.includes('params:') || content.includes('params }')) {
    console.log(`✓ Skipping ${filePath} - already has params`);
    return false;
  }

  // Determine the page name and props interface name
  const fileName = path.basename(filePath);
  let hasWorkspaceId = filePath.includes('[workspaceId]');
  let hasModule = filePath.includes('[module]');
  let hasTab = filePath.includes('[tab]');
  let hasToken = filePath.includes('[token]');

  // Find the export default function line
  const functionMatch = content.match(/export default function (\w+)\(\)/);
  if (!functionMatch) {
    console.log(`⚠️  Skipping ${filePath} - couldn't find function declaration`);
    return false;
  }

  const functionName = functionMatch[1];
  const propsInterfaceName = `${functionName}Props`;

  // Build the params interface
  let paramsInterface = `interface ${propsInterfaceName} {\n  params: {\n    locale: string\n`;
  
  if (hasWorkspaceId) {
    paramsInterface += `    workspaceId: string\n`;
  }
  if (hasModule) {
    paramsInterface += `    module: string\n`;
  }
  if (hasTab) {
    paramsInterface += `    tab: string\n`;
  }
  if (hasToken) {
    paramsInterface += `    token: string\n`;
  }
  
  paramsInterface += `  }\n}\n\n`;

  // Insert the interface before the function
  content = content.replace(
    `export default function ${functionName}()`,
    `${paramsInterface}export default function ${functionName}({ params }: ${propsInterfaceName})`
  );

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Fixed ${filePath}`);
  return true;
}

console.log('🔧 Adding params to page components...\n');

let fixedCount = 0;
let skippedCount = 0;

pagesToFix.forEach(filePath => {
  if (addParamsToPage(filePath)) {
    fixedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n✨ Complete!`);
console.log(`   Fixed: ${fixedCount}`);
console.log(`   Skipped: ${skippedCount}`);
console.log(`   Total: ${pagesToFix.length}`);
