#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All remaining files from grep
const REMAINING_FILES = [
  'src/components/finance/finance-scenarios-tab.tsx',
  'src/components/finance/finance-variance-tab.tsx',
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/resources/resources-library-tab.tsx',
  'src/components/resources/resources-grants-tab.tsx',
  'src/components/resources/resources-troubleshooting-tab.tsx',
  'src/components/projects/projects-productions-tab.tsx',
  'src/components/projects/projects-schedule-tab.tsx',
  'src/components/people/people-scheduling-tab.tsx',
  'src/components/profile/performance-tab.tsx',
  'src/components/community/showcase-tab.tsx',
  'src/components/community/studios-tab.tsx',
  'src/components/procurement/procurement-orders-dashboard-tab.tsx',
];

let totalFiles = 0;
let totalReplacements = 0;

console.log('🔧 FINAL STAT CARD COMPLETION');
console.log('==============================\n');

REMAINING_FILES.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⏭️  ${filePath} (not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let replacements = 0;

    // Add StatCard import if not present
    if (!content.includes('import { StatCard }')) {
      const lucideImport = content.indexOf('from "lucide-react"');
      if (lucideImport !== -1) {
        const lineEnd = content.indexOf('\n', lucideImport);
        content = content.slice(0, lineEnd + 1) + 
                  'import { StatCard } from "@/components/atoms/cards/StatCard"\n' +
                  content.slice(lineEnd + 1);
      }
    }

    // Replace all stat card patterns - comprehensive regex
    const patterns = [
      // Pattern 1: Standard with CardTitle and aria-hidden
      /<Card(?:\s+className="[^"]*")?>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"(?:\s+aria-hidden="true")?>\s*<CardTitle className="text-sm font-medium"(?:\s+aria-hidden="true")?>([^<]+)<\/CardTitle>\s*(?:\{[^}]+\?\s*)?<([A-Z][a-zA-Z0-9]+) className="h-4 w-4[^"]*"(?:\s+aria-hidden="true")?[^>]*\/>\s*(?:\s*:\s*<[^>]+\/>\s*\})?\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold[^"]*">([^<]+)<\/div>\s*(?:<(?:p|div) className="[^"]*text-xs[^"]*">([^<]+)<\/(?:p|div)>)?\s*<\/CardContent>\s*<\/Card>/gs,
      
      // Pattern 2: With div instead of CardTitle
      /<Card(?:\s+className="[^"]*")?>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">\s*<div className="text-sm font-medium">([^<]+)<\/div>\s*<([A-Z][a-zA-Z0-9]+) className="h-4 w-4 text-muted-foreground" aria-hidden="true"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold[^"]*">([^<]+)<\/div>\s*<p className="text-xs text-muted-foreground">([^<]+)<\/p>\s*<\/CardContent>\s*<\/Card>/gs,
    ];

    patterns.forEach(pattern => {
      content = content.replace(pattern, (match, label, icon, value, description) => {
        replacements++;
        const descProp = description ? `\n          description={${description}}` : '';
        return `<StatCard
          label={${label}}
          value={${value}}
          icon={${icon}}${descProp}
        />`;
      });
    });

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} (${replacements} replacements)`);
      totalFiles++;
      totalReplacements += replacements;
    } else {
      console.log(`⏭️  ${filePath} (no changes)`);
    }

  } catch (error) {
    console.error(`❌ ${filePath} - ${error.message}`);
  }
});

console.log('\n==============================');
console.log(`Files updated: ${totalFiles}/${REMAINING_FILES.length}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log('\n✅ COMPLETE!\n');
