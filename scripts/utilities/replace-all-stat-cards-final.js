#!/usr/bin/env node

/**
 * FINAL STAT CARD REPLACEMENT SCRIPT
 * Replaces ALL inline stat card implementations with the corrected StatCard component
 * Pattern matches the existing left-aligned design with icon on right
 */

const fs = require('fs');
const path = require('path');

// All files with stat cards from grep audit
const FILES_TO_FIX = [
  'src/components/procurement/procurement-matching-tab.tsx',
  'src/components/procurement/procurement-receiving-tab.tsx',
  'src/components/assets/assets-maintenance-tab.tsx',
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/community/activity-tab.tsx',
  'src/components/community/competitions-tab.tsx',
  'src/components/community/connections-tab.tsx',
  'src/components/community/discussions-tab.tsx',
  'src/components/community/events-tab.tsx',
  'src/components/community/news-tab.tsx',
  'src/components/community/showcase-tab.tsx',
  'src/components/community/studios-tab.tsx',
  'src/components/companies/companies-contacts-tab.tsx',
  'src/components/companies/companies-organizations-tab.tsx',
  'src/components/events/events-calendar-tab.tsx',
  'src/components/events/events-tours-tab.tsx',
  'src/components/finance/finance-cash-flow-tab.tsx',
  'src/components/finance/finance-overview-tab.tsx',
  'src/components/finance/finance-policies-tab.tsx',
  'src/components/finance/finance-scenarios-tab.tsx',
  'src/components/finance/finance-variance-tab.tsx',
  'src/components/jobs/jobs-pipeline-tab.tsx',
  'src/components/locations/locations-directory-tab.tsx',
  'src/components/people/people-scheduling-tab.tsx',
  'src/components/procurement/procurement-orders-dashboard-tab.tsx',
  'src/components/projects/projects-productions-tab.tsx',
  'src/components/projects/projects-schedule-tab.tsx',
  'src/components/resources/resources-courses-tab.tsx',
  'src/components/resources/resources-glossary-tab.tsx',
  'src/components/resources/resources-grants-tab.tsx',
  'src/components/resources/resources-guides-tab.tsx',
  'src/components/resources/resources-library-tab.tsx',
  'src/components/resources/resources-publications-tab.tsx',
  'src/components/resources/resources-troubleshooting-tab.tsx',
  'src/components/profile/endorsements-tab.tsx',
  'src/components/profile/history-tab.tsx',
  'src/components/profile/performance-tab.tsx',
];

let totalReplacements = 0;
let filesProcessed = 0;
let filesWithErrors = 0;

console.log('🔧 FINAL STAT CARD REPLACEMENT');
console.log('================================\n');

FILES_TO_FIX.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  ${filePath} (file not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let replacements = 0;

    // Add StatCard import if not present
    if (!content.includes('StatCard')) {
      // Find the last import from @/components
      const lastComponentImport = content.lastIndexOf('from "@/components/');
      if (lastComponentImport !== -1) {
        const lineEnd = content.indexOf('\n', lastComponentImport);
        content = content.slice(0, lineEnd + 1) + 
                  'import { StatCard } from "@/components/atoms/cards/StatCard"\n' +
                  content.slice(lineEnd + 1);
      }
    }

    // Pattern 1: Full stat card with CardHeader and CardContent
    const statCardPattern = /<Card>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"[^>]*>\s*<CardTitle className="text-sm font-medium"[^>]*>([^<]+)<\/CardTitle>\s*<([A-Z][a-zA-Z]+) className="h-4 w-4[^"]*"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold[^"]*">([^<]+)<\/div>\s*(?:<p className="text-xs text-muted-foreground[^"]*">([^<]+)<\/p>)?\s*<\/CardContent>\s*<\/Card>/gs;

    content = content.replace(statCardPattern, (match, label, icon, value, description) => {
      replacements++;
      const descProp = description ? `\n          description={${description.includes('{') ? description : `"${description}"`}}` : '';
      return `<StatCard
          label={${label.includes('{') ? label : `"${label}"`}}
          value={${value.includes('{') ? value : `"${value}"`}}
          icon={${icon}}${descProp}
        />`;
    });

    // Pattern 2: Stat card with additional elements in CardContent
    const complexStatCardPattern = /<Card>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"[^>]*>\s*<CardTitle className="text-sm font-medium"[^>]*>([^<]+)<\/CardTitle>\s*<([A-Z][a-zA-Z]+) className="h-4 w-4[^"]*"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold[^"]*">([^<]+)<\/div>\s*<div[^>]*>\s*(?:<[^>]+>[^<]*<\/[^>]+>\s*)*([^<]+)\s*<\/div>\s*<\/CardContent>\s*<\/Card>/gs;

    content = content.replace(complexStatCardPattern, (match, label, icon, value, description) => {
      replacements++;
      return `<StatCard
          label={${label.includes('{') ? label : `"${label}"`}}
          value={${value.includes('{') ? value : `"${value}"`}}
          icon={${icon}}
          description={${description.includes('{') ? description : `"${description}"`}}
        />`;
    });

    // Pattern 3: Stat card with aria-hidden="true" on header
    const ariaStatCardPattern = /<Card>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" aria-hidden="true">\s*<CardTitle className="text-sm font-medium" aria-hidden="true">([^<]+)<\/CardTitle>\s*<([A-Z][a-zA-Z]+) className="h-4 w-4[^"]*" aria-hidden="true"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold[^"]*">([^<]+)<\/div>\s*(?:<p className="text-xs text-muted-foreground[^"]*">([^<]+)<\/p>)?\s*<\/CardContent>\s*<\/Card>/gs;

    content = content.replace(ariaStatCardPattern, (match, label, icon, value, description) => {
      replacements++;
      const descProp = description ? `\n          description={${description.includes('{') ? description : `"${description}"`}}` : '';
      return `<StatCard
          label={${label.includes('{') ? label : `"${label}"`}}
          value={${value.includes('{') ? value : `"${value}"`}}
          icon={${icon}}${descProp}
        />`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} (${replacements} replacements)`);
      filesProcessed++;
      totalReplacements += replacements;
    } else {
      console.log(`⏭️  ${filePath} (no stat cards found or already using StatCard)`);
    }

  } catch (error) {
    console.error(`❌ ${filePath} - Error: ${error.message}`);
    filesWithErrors++;
  }
});

console.log('\n================================');
console.log('📊 REPLACEMENT SUMMARY');
console.log('================================');
console.log(`Files processed: ${filesProcessed}/${FILES_TO_FIX.length}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log(`Files with errors: ${filesWithErrors}`);
console.log('\n✅ REPLACEMENT COMPLETE!\n');
console.log('Next steps:');
console.log('1. Run: npm run build (verify no compilation errors)');
console.log('2. Test in browser (verify visual consistency)');
console.log('3. Run accessibility tests');
console.log('4. Commit changes');
