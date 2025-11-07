#!/usr/bin/env node

/**
 * Script to replace hardcoded values with semantic design tokens in marketing components
 * 
 * Replaces:
 * - Hardcoded spacing (py-20, px-4, gap-6, etc.)
 * - Hardcoded sizing (size={48}, w-16 h-16, etc.)
 * - Hardcoded layouts (grid md:grid-cols-2, etc.)
 * - Hardcoded padding/containers (max-w-7xl, p-6, etc.)
 */

const fs = require('fs');
const path = require('path');

const componentsToUpdate = [
  'src/marketing/components/MarketingNav.tsx',
  'src/marketing/components/MarketingFooter.tsx',
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

function updateComponent(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already updated
  if (content.includes('from "@/design-tokens"')) {
    console.log(`✅ ${filePath} - Already updated`);
    return;
  }
  
  // Add imports after useTranslations import
  content = content.replace(
    /import { useTranslations } from "next-intl"/,
    `import { useTranslations } from "next-intl"\nimport { cn } from "@/lib/utils"\nimport { spacing, grid, padding, border, container, height } from "@/design-tokens"`
  );
  
  // Replace common patterns
  const replacements = [
    // Sections
    { pattern: /className="py-20 px-4 sm:px-6 lg:px-8 bg-white"/g, replacement: 'className={cn("py-20 bg-white", padding.sectionX)}' },
    { pattern: /className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"/g, replacement: 'className={cn("py-20 bg-gray-50", padding.sectionX)}' },
    { pattern: /className="py-12 px-4 sm:px-6 lg:px-8/g, replacement: 'className={cn("py-12", padding.sectionX' },
    
    // Containers
    { pattern: /className="max-w-7xl mx-auto"/g, replacement: 'className={cn("mx-auto", container[\'6xl\'])}' },
    { pattern: /className="max-w-4xl mx-auto"/g, replacement: 'className={cn("mx-auto", container[\'4xl\'])}' },
    { pattern: /className="max-w-3xl mx-auto"/g, replacement: 'className={cn("mx-auto", container[\'2xl\'])}' },
    
    // Grids
    { pattern: /className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"/g, replacement: 'className={grid.cards4}' },
    { pattern: /className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"/g, replacement: 'className={grid.cards3}' },
    { pattern: /className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"/g, replacement: 'className={cn(grid.cards3, "gap-8")}' },
    { pattern: /className="grid md:grid-cols-3 gap-8"/g, replacement: 'className={cn("grid md:grid-cols-3", spacing.gapLoose)}' },
    { pattern: /className="grid md:grid-cols-4 gap-8"/g, replacement: 'className={cn("grid md:grid-cols-4", spacing.gapLoose)}' },
    
    // Spacing
    { pattern: /className="space-y-8"/g, replacement: 'className={spacing.sectionLoose}' },
    { pattern: /className="space-y-4"/g, replacement: 'className={spacing.gap}' },
    { pattern: /className="space-y-3"/g, replacement: 'className={spacing.list}' },
    { pattern: /className="space-y-2"/g, replacement: 'className={spacing.listTight}' },
    { pattern: /className="space-x-8"/g, replacement: 'className="space-x-8"' }, // Keep for nav
    { pattern: /className="space-x-4"/g, replacement: 'className={spacing.inlineLoose}' },
    
    // Padding
    { pattern: /className="bg-white rounded-xl p-6"/g, replacement: 'className={cn("bg-white rounded-xl", padding.section)}' },
    { pattern: /className="bg-gray-50 rounded-xl p-6"/g, replacement: 'className={cn("bg-gray-50 rounded-xl", padding.section)}' },
    { pattern: /className="border-2 border-gray-200 rounded-xl p-6"/g, replacement: 'className={cn("border-2 border-gray-200 rounded-xl", padding.section)}' },
    
    // Icon sizes
    { pattern: /size={48}/g, replacement: 'className={height.iconXl}' },
    { pattern: /size={40}/g, replacement: 'className={height.iconXl}' },
    { pattern: /size={32}/g, replacement: 'className={height.iconLg}' },
    { pattern: /size={24}/g, replacement: 'className={height.iconLg}' },
    { pattern: /size={20}/g, replacement: 'className={height.icon}' },
    { pattern: /size={16}/g, replacement: 'className={height.iconSm}' },
    
    // Special cases for w-16 h-16 (step numbers)
    { pattern: /className="w-16 h-16/g, replacement: 'className="w-16 h-16' }, // Keep as is - specific design
  ];
  
  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ ${filePath} - Updated`);
}

console.log('🚀 Updating marketing components with design tokens...\n');

componentsToUpdate.forEach(updateComponent);

console.log('\n✅ All marketing components updated!');
console.log('\nNext steps:');
console.log('1. Review changes for accuracy');
console.log('2. Test marketing pages');
console.log('3. Verify design tokens are properly applied');
