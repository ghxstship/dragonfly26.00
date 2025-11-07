#!/usr/bin/env node

/**
 * Verification script for marketing design token usage
 * 
 * Checks that marketing components:
 * 1. Import design tokens
 * 2. Use cn() utility for className composition
 * 3. Avoid hardcoded spacing/sizing values
 */

const fs = require('fs');
const path = require('path');

const componentsToCheck = [
  'src/marketing/components/MarketingNav.tsx',
  'src/marketing/components/MarketingFooter.tsx',
  'src/marketing/components/sections/HeroSection.tsx',
  'src/marketing/components/sections/CTASection.tsx',
  'src/marketing/components/sections/PricingSection.tsx',
  'src/marketing/components/sections/FAQSection.tsx',
  'src/marketing/components/sections/FeaturesSection.tsx',
  'src/marketing/components/sections/HowItWorksSection.tsx',
  'src/marketing/components/sections/IntegrationsSection.tsx',
  'src/marketing/components/sections/ProblemSection.tsx',
  'src/marketing/components/sections/RolesSection.tsx',
  'src/marketing/components/sections/SecuritySection.tsx',
  'src/marketing/components/sections/SolutionSection.tsx',
  'src/marketing/components/sections/TestimonialsSection.tsx',
  'src/marketing/components/sections/TrustBar.tsx',
];

const violations = [];
let totalChecks = 0;
let passedChecks = 0;

function checkComponent(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const fileName = path.basename(filePath);
  
  console.log(`\n📋 Checking ${fileName}...`);
  
  // Check 1: Has design token import
  totalChecks++;
  if (content.includes('from "@/design-tokens"')) {
    console.log('  ✅ Design tokens imported');
    passedChecks++;
  } else {
    console.log('  ❌ Missing design token import');
    violations.push(`${fileName}: Missing design token import`);
  }
  
  // Check 2: Has cn() utility import
  totalChecks++;
  if (content.includes('from "@/lib/utils"')) {
    console.log('  ✅ cn() utility imported');
    passedChecks++;
  } else {
    console.log('  ❌ Missing cn() utility import');
    violations.push(`${fileName}: Missing cn() utility import`);
  }
  
  // Check 3: No hardcoded max-w-7xl (should use container token)
  totalChecks++;
  if (!content.includes('max-w-7xl') && !content.includes('max-w-4xl') && !content.includes('max-w-3xl')) {
    console.log('  ✅ No hardcoded container widths');
    passedChecks++;
  } else {
    const matches = content.match(/max-w-\w+/g) || [];
    console.log(`  ⚠️  Found ${matches.length} hardcoded container width(s): ${matches.join(', ')}`);
    violations.push(`${fileName}: Hardcoded container widths found`);
  }
  
  // Check 4: No hardcoded size={} on icons (should use height token)
  totalChecks++;
  const sizeMatches = content.match(/size=\{\d+\}/g) || [];
  if (sizeMatches.length === 0) {
    console.log('  ✅ No hardcoded icon sizes');
    passedChecks++;
  } else {
    console.log(`  ⚠️  Found ${sizeMatches.length} hardcoded icon size(s): ${sizeMatches.join(', ')}`);
    violations.push(`${fileName}: Hardcoded icon sizes found`);
  }
  
  // Check 5: Uses cn() for className composition
  totalChecks++;
  const cnUsage = (content.match(/className=\{cn\(/g) || []).length;
  if (cnUsage > 0) {
    console.log(`  ✅ Uses cn() utility (${cnUsage} times)`);
    passedChecks++;
  } else {
    console.log('  ❌ Not using cn() utility');
    violations.push(`${fileName}: Not using cn() utility`);
  }
}

console.log('🔍 Verifying marketing design token usage...\n');
console.log('=' .repeat(60));

componentsToCheck.forEach(checkComponent);

console.log('\n' + '='.repeat(60));
console.log('\n📊 VERIFICATION SUMMARY\n');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log(`Failed: ${totalChecks - passedChecks}`);

if (violations.length > 0) {
  console.log('\n⚠️  VIOLATIONS FOUND:\n');
  violations.forEach((v, i) => console.log(`${i + 1}. ${v}`));
  console.log('\n❌ Verification FAILED - Please fix violations above');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Marketing pages use semantic design tokens correctly.');
  process.exit(0);
}
