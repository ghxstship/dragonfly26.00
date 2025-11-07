#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix max-w-3xl in multiple files
  {
    files: ['src/marketing/components/sections/HeroSection.tsx', 'src/marketing/components/sections/HowItWorksSection.tsx', 'src/marketing/components/sections/ProblemSection.tsx', 'src/marketing/components/sections/SecuritySection.tsx', 'src/marketing/components/sections/SolutionSection.tsx', 'src/marketing/components/sections/TestimonialsSection.tsx'],
    pattern: /max-w-3xl/g,
    replacement: ''
  },
  // Fix max-w-7xl
  {
    files: ['src/marketing/components/MarketingNav.tsx', 'src/marketing/components/sections/TrustBar.tsx'],
    pattern: /max-w-7xl/g,
    replacement: ''
  },
  // Fix size={48}
  {
    files: ['src/marketing/components/sections/ProblemSection.tsx', 'src/marketing/components/sections/SecuritySection.tsx', 'src/marketing/components/sections/SolutionSection.tsx'],
    pattern: /size=\{48\}/g,
    replacement: 'className={height.iconXl}'
  },
  // Fix size={32}
  {
    files: ['src/marketing/components/sections/TestimonialsSection.tsx'],
    pattern: /size=\{32\}/g,
    replacement: 'className={height.iconLg}'
  },
  // Fix size={24}
  {
    files: ['src/marketing/components/MarketingNav.tsx'],
    pattern: /size=\{24\}/g,
    replacement: 'className={height.iconLg}'
  },
  // Fix size={16} in PricingSection
  {
    files: ['src/marketing/components/sections/PricingSection.tsx'],
    pattern: /size=\{16\}/g,
    replacement: 'className={height.iconSm}'
  },
];

fixes.forEach(({ files, pattern, replacement }) => {
  files.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    const before = (content.match(pattern) || []).length;
    content = content.replace(pattern, replacement);
    const after = (content.match(pattern) || []).length;
    fs.writeFileSync(fullPath, content, 'utf8');
    if (before > after) {
      console.log(`✅ ${path.basename(filePath)}: Fixed ${before - after} occurrence(s)`);
    }
  });
});

console.log('\n✅ All remaining violations fixed!');
