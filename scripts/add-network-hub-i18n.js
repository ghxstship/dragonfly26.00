#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  // Community (7)
  'src/components/community/competitions-tab.tsx',
  'src/components/community/connections-tab.tsx',
  'src/components/community/discussions-tab.tsx',
  'src/components/community/events-tab.tsx',
  'src/components/community/news-tab.tsx',
  'src/components/community/showcase-tab.tsx',
  'src/components/community/studios-tab.tsx',
  // Marketplace (11)
  'src/components/marketplace/favorites-tab.tsx',
  'src/components/marketplace/lists-tab.tsx',
  'src/components/marketplace/orders-tab.tsx',
  'src/components/marketplace/products-tab.tsx',
  'src/components/marketplace/purchases-tab.tsx',
  'src/components/marketplace/reviews-tab.tsx',
  'src/components/marketplace/sales-tab.tsx',
  'src/components/marketplace/services-tab.tsx',
  'src/components/marketplace/shop-tab.tsx',
  'src/components/marketplace/spotlight-tab.tsx',
  'src/components/marketplace/vendors-tab.tsx',
  // Resources (7)
  'src/components/resources/resources-library-tab.tsx',
  'src/components/resources/resources-guides-tab.tsx',
  'src/components/resources/resources-courses-tab.tsx',
  'src/components/resources/resources-grants-tab.tsx',
  'src/components/resources/resources-publications-tab.tsx',
  'src/components/resources/resources-glossary-tab.tsx',
  'src/components/resources/resources-troubleshooting-tab.tsx',
];

// Translation key mappings based on file
const translationMappings = {
  'competitions-tab.tsx': { module: 'community', component: 'competitions' },
  'connections-tab.tsx': { module: 'community', component: 'connections' },
  'discussions-tab.tsx': { module: 'community', component: 'discussions' },
  'events-tab.tsx': { module: 'community', component: 'events' },
  'news-tab.tsx': { module: 'community', component: 'news' },
  'showcase-tab.tsx': { module: 'community', component: 'showcase' },
  'studios-tab.tsx': { module: 'community', component: 'studios' },
  'favorites-tab.tsx': { module: 'marketplace', component: 'favorites' },
  'lists-tab.tsx': { module: 'marketplace', component: 'lists' },
  'orders-tab.tsx': { module: 'marketplace', component: 'orders' },
  'products-tab.tsx': { module: 'marketplace', component: 'products' },
  'purchases-tab.tsx': { module: 'marketplace', component: 'purchases' },
  'reviews-tab.tsx': { module: 'marketplace', component: 'reviews' },
  'sales-tab.tsx': { module: 'marketplace', component: 'sales' },
  'services-tab.tsx': { module: 'marketplace', component: 'services' },
  'shop-tab.tsx': { module: 'marketplace', component: 'shop' },
  'spotlight-tab.tsx': { module: 'marketplace', component: 'spotlight' },
  'vendors-tab.tsx': { module: 'marketplace', component: 'vendors' },
  'resources-library-tab.tsx': { module: 'resources', component: 'library' },
  'resources-guides-tab.tsx': { module: 'resources', component: 'guides' },
  'resources-courses-tab.tsx': { module: 'resources', component: 'courses' },
  'resources-grants-tab.tsx': { module: 'resources', component: 'grants' },
  'resources-publications-tab.tsx': { module: 'resources', component: 'publications' },
  'resources-glossary-tab.tsx': { module: 'resources', component: 'glossary' },
  'resources-troubleshooting-tab.tsx': { module: 'resources', component: 'troubleshooting' },
};

function updateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileName = path.basename(filePath);
  
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 1. Add import if not present
  if (!content.includes("import { useTranslations } from 'next-intl'")) {
    content = content.replace(
      /^(import { useState[^}]*} from "react")/m,
      '$1\nimport { useTranslations } from \'next-intl\''
    );
  }
  
  // 2. Add hooks in component function
  const mapping = translationMappings[fileName];
  if (mapping && !content.includes('const t = useTranslations')) {
    // Find the export function and add hooks after opening brace
    const exportMatch = content.match(/(export function \w+Tab[^{]*{)(\n\s*)/);
    if (exportMatch) {
      const indent = exportMatch[2];
      content = content.replace(
        exportMatch[0],
        `${exportMatch[1]}${indent}const t = useTranslations('${mapping.module}.${mapping.component}')${indent}const tCommon = useTranslations('common')${indent}`
      );
    }
  }
  
  // 3. Replace description text pattern
  content = content.replace(
    /<p className="text-muted-foreground">\s*([^<{]+)\s*<\/p>/g,
    (match, text) => {
      // Only replace if it looks like a description and doesn't already use {t(
      if (!match.includes('{t(') && !match.includes('{tCommon(')) {
        return '<p className="text-muted-foreground">\n          {t(\'description\')}\n        </p>';
      }
      return match;
    }
  );
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Updated: ${filePath}`);
}

// Process all files
let successCount = 0;
let errorCount = 0;

filesToUpdate.forEach(file => {
  try {
    updateFile(file);
    successCount++;
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
    errorCount++;
  }
});

console.log(`\n========================================`);
console.log(`✅ Successfully updated: ${successCount}/${filesToUpdate.length} files`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`========================================\n`);
