#!/usr/bin/env node

/**
 * COMPREHENSIVE STAT CARD REPLACEMENT SCRIPT
 * Handles ALL stat card patterns found in the codebase
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_FIX = [
  'src/components/community/activity-tab.tsx',
  'src/components/community/competitions-tab.tsx',
  'src/components/community/connections-tab.tsx',
  'src/components/community/discussions-tab.tsx',
  'src/components/community/events-tab.tsx',
  'src/components/community/news-tab.tsx',
  'src/components/community/showcase-tab.tsx',
  'src/components/community/studios-tab.tsx',
  'src/components/assets/assets-maintenance-tab.tsx',
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/finance/finance-overview-tab.tsx',
  'src/components/finance/finance-cash-flow-tab.tsx',
  'src/components/finance/finance-policies-tab.tsx',
  'src/components/finance/finance-scenarios-tab.tsx',
  'src/components/finance/finance-variance-tab.tsx',
  'src/components/procurement/procurement-matching-tab.tsx',
  'src/components/procurement/procurement-receiving-tab.tsx',
  'src/components/procurement/procurement-orders-dashboard-tab.tsx',
  'src/components/companies/companies-organizations-tab.tsx',
  'src/components/people/people-scheduling-tab.tsx',
  'src/components/profile/performance-tab.tsx',
  'src/components/projects/projects-productions-tab.tsx',
  'src/components/projects/projects-schedule-tab.tsx',
  'src/components/resources/resources-library-tab.tsx',
  'src/components/resources/resources-grants-tab.tsx',
  'src/components/resources/resources-troubleshooting-tab.tsx',
];

let totalReplacements = 0;
let filesProcessed = 0;

console.log('🔧 COMPREHENSIVE STAT CARD REPLACEMENT');
console.log('======================================\n');

FILES_TO_FIX.forEach(filePath => {
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
      const lastImport = content.lastIndexOf('from "lucide-react"');
      if (lastImport !== -1) {
        const lineEnd = content.indexOf('\n', lastImport);
        content = content.slice(0, lineEnd + 1) + 
                  'import { StatCard } from "@/components/atoms/cards/StatCard"\n' +
                  content.slice(lineEnd + 1);
      }
    }

    // Pattern 1: div with text-sm font-medium (community files)
    const divPattern = /<Card>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">\s*<div className="text-sm font-medium">([^<]+)<\/div>\s*<([A-Z][a-zA-Z0-9]+) className="h-4 w-4 text-muted-foreground" aria-hidden="true"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold">([^<]+)<\/div>\s*<p className="text-xs text-muted-foreground">([^<]+)<\/p>\s*<\/CardContent>\s*<\/Card>/gs;

    content = content.replace(divPattern, (match, label, icon, value, description) => {
      replacements++;
      return `<StatCard
          label={${label}}
          value={${value}}
          icon={${icon}}
          description={${description}}
        />`;
    });

    // Pattern 2: CardTitle with aria-hidden (finance/companies files)
    const ariaPattern = /<Card>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" aria-hidden="true">\s*<CardTitle className="text-sm font-medium" aria-hidden="true">([^<]+)<\/CardTitle>\s*<([A-Z][a-zA-Z0-9]+) className="h-4 w-4[^"]*" aria-hidden="true"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold[^"]*">([^<]+)<\/div>\s*(?:<(?:p|div) className="[^"]*text-xs[^"]*">([^<]+)<\/(?:p|div)>)?\s*<\/CardContent>\s*<\/Card>/gs;

    content = content.replace(ariaPattern, (match, label, icon, value, description) => {
      replacements++;
      const descProp = description ? `\n          description={${description}}` : '';
      return `<StatCard
          label={${label}}
          value={${value}}
          icon={${icon}}${descProp}
        />`;
    });

    // Pattern 3: Multi-line value expressions
    const multilineValuePattern = /<Card>\s*<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">\s*<div className="text-sm font-medium">([^<]+)<\/div>\s*<([A-Z][a-zA-Z0-9]+) className="h-4 w-4 text-muted-foreground" aria-hidden="true"[^>]*\/>\s*<\/CardHeader>\s*<CardContent>\s*<div className="text-2xl font-bold">\s*\{([^}]+)\}\s*<\/div>\s*<p className="text-xs text-muted-foreground">([^<]+)<\/p>\s*<\/CardContent>\s*<\/Card>/gs;

    content = content.replace(multilineValuePattern, (match, label, icon, value, description) => {
      replacements++;
      return `<StatCard
          label={${label}}
          value={${value.trim()}}
          icon={${icon}}
          description={${description}}
        />`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} (${replacements} replacements)`);
      filesProcessed++;
      totalReplacements += replacements;
    } else {
      console.log(`⏭️  ${filePath} (no changes)`);
    }

  } catch (error) {
    console.error(`❌ ${filePath} - ${error.message}`);
  }
});

console.log('\n======================================');
console.log('📊 SUMMARY');
console.log('======================================');
console.log(`Files processed: ${filesProcessed}/${FILES_TO_FIX.length}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log('\n✅ COMPLETE!\n');
