#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Remaining files to update
const filesToUpdate = [
  // Analytics (8 remaining)
  'src/components/analytics/analytics-trends-tab.tsx',
  'src/components/analytics/analytics-realtime-tab.tsx',
  'src/components/analytics/analytics-comparisons-tab.tsx',
  'src/components/analytics/analytics-forecasting-tab.tsx',
  'src/components/analytics/analytics-pivot-tables-tab.tsx',
  'src/components/analytics/analytics-data-sources-tab.tsx',
  'src/components/analytics/analytics-custom-views-tab.tsx',
  'src/components/analytics/analytics-metrics-library-tab.tsx',
  // Insights (10 files)
  'src/components/insights/insights-overview-tab.tsx',
  'src/components/insights/insights-objectives-tab.tsx',
  'src/components/insights/insights-key-results-tab.tsx',
  'src/components/insights/insights-priorities-tab.tsx',
  'src/components/insights/insights-progress-tracking-tab.tsx',
  'src/components/insights/insights-benchmarks-tab.tsx',
  'src/components/insights/insights-recommendations-tab.tsx',
  'src/components/insights/insights-success-metrics-tab.tsx',
  'src/components/insights/insights-reviews-tab.tsx',
  'src/components/insights/insights-intelligence-feed-tab.tsx',
];

const projectRoot = '/Users/julianclarkson/Documents/Dragonfly26.00';

function updateFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has useTranslations
  if (content.includes('useTranslations')) {
    console.log(`✅ Already updated: ${filePath}`);
    return true;
  }

  // Extract module and tab name from path
  const match = filePath.match(/components\/(analytics|insights)\/(.+)-tab\.tsx/);
  if (!match) {
    console.log(`⚠️  Could not parse: ${filePath}`);
    return false;
  }

  const [, module, tabName] = match;
  const translationKey = `intelligence.${module}.${tabName.replace(/-/g, '')}`;

  // Add import after last import
  const importPattern = /^import.*from.*['"].*['"];?\s*$/gm;
  const imports = content.match(importPattern);
  if (imports) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertIndex = lastImportIndex + lastImport.length;
    
    content = content.slice(0, insertIndex) + 
              '\nimport { useTranslations } from "next-intl"' +
              content.slice(insertIndex);
  }

  // Add translation hooks after function declaration
  const functionPattern = /export function \w+Tab\([^)]*\)[^{]*{/;
  const functionMatch = content.match(functionPattern);
  
  if (functionMatch) {
    const functionIndex = content.indexOf(functionMatch[0]);
    const insertIndex = functionIndex + functionMatch[0].length;
    
    // Add hooks
    const hooks = `\n  const t = useTranslations('${translationKey}')\n  const tCommon = useTranslations('common')\n`;
    content = content.slice(0, insertIndex) + hooks + content.slice(insertIndex);
  }

  // Replace description text
  content = content.replace(
    /<p className="text-muted-foreground">\s*([^<]+)\s*<\/p>/,
    '<p className="text-muted-foreground" role="doc-subtitle">\n          {t(\'description\')}\n        </p>'
  );

  // Replace Create button
  content = content.replace(
    /<Button size="sm">\s*<Plus className="h-4 w-4 mr-2" \/>\s*Create\s*<\/Button>/,
    '<Button size="sm" aria-label={`${tCommon(\'create\')} item`}>\n          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />\n          {tCommon(\'create\')}\n        </Button>'
  );

  // Add aria-hidden to all icons
  content = content.replace(
    /<(\w+) className="([^"]*h-\d+[^"]*)"/g,
    (match, iconName, className) => {
      // Check if it's likely an icon (Lucide icons are capitalized)
      if (iconName[0] === iconName[0].toUpperCase() && !match.includes('aria-hidden')) {
        return `<${iconName} className="${className}" aria-hidden="true"`;
      }
      return match;
    }
  );

  // Add role to Cards
  content = content.replace(
    /<Card key={([^}]+)}>/g,
    '<Card key={$1} role="article">'
  );

  // Add aria-live to values
  content = content.replace(
    /<p className="text-2xl font-bold([^"]*)">/g,
    '<p className="text-2xl font-bold$1" aria-live="polite">'
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Updated: ${filePath}`);
  return true;
}

console.log('🚀 Starting Intelligence Hub i18n completion...\n');

let successCount = 0;
let failCount = 0;

filesToUpdate.forEach(file => {
  if (updateFile(file)) {
    successCount++;
  } else {
    failCount++;
  }
});

console.log(`\n📊 Results: ${successCount} updated, ${failCount} failed`);
console.log('✅ Intelligence Hub i18n completion script finished!');
