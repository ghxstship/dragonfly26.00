#!/usr/bin/env node

const fs = require('fs');

const files = [
  '/Users/julianclarkson/Documents/Dragonfly26.00/src/marketing/components/sections/PricingSection.tsx',
  '/Users/julianclarkson/Documents/Dragonfly26.00/src/marketing/components/sections/ProblemSection.tsx',
  '/Users/julianclarkson/Documents/Dragonfly26.00/src/marketing/components/sections/SecuritySection.tsx',
  '/Users/julianclarkson/Documents/Dragonfly26.00/src/marketing/components/sections/SolutionSection.tsx',
  '/Users/julianclarkson/Documents/Dragonfly26.00/src/marketing/components/sections/TestimonialsSection.tsx'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix duplicate className props - merge them using cn()
  content = content.replace(
    /className="([^"]+)"\s+className=\{([^}]+)\}/g,
    'className={cn("$1", $2)}'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed ${filePath.split('/').pop()}`);
});

console.log('\n✅ All duplicate className props fixed!');
