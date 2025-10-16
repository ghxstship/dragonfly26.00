#!/usr/bin/env node
/**
 * Automated i18n + Accessibility Implementation Script
 * Applies complete fixes to all Production Hub tab components
 * Pattern based on dashboard-overview-tab.tsx exemplar
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

// All Production Hub modules and their tabs
const FILES_TO_PROCESS = [
  // Dashboard (9 remaining)
  'dashboard/dashboard-my-agenda-tab.tsx',
  'dashboard/dashboard-my-jobs-tab.tsx',
  'dashboard/dashboard-my-expenses-tab.tsx',
  'dashboard/dashboard-my-assets-tab.tsx',
  'dashboard/dashboard-my-files-tab.tsx',
  'dashboard/dashboard-my-reports-tab.tsx',
  'dashboard/dashboard-my-orders-tab.tsx',
  'dashboard/dashboard-my-travel-tab.tsx',
  'dashboard/dashboard-my-advances-tab.tsx',
  
  // Projects (all 11)
  'projects/projects-overview-tab.tsx',
  'projects/projects-activations-tab.tsx',
  'projects/projects-compliance-tab.tsx',
  'projects/projects-costs-tab.tsx',
  'projects/projects-milestones-tab.tsx',
  'projects/projects-productions-tab.tsx',
  'projects/projects-projects-checklists-tab.tsx',
  'projects/projects-projects-work-orders-tab.tsx',
  'projects/projects-safety-tab.tsx',
  'projects/projects-schedule-tab.tsx',
  'projects/projects-tasks-tab.tsx',
  
  // Events (all 15)
  'events/events-all-events-tab.tsx',
  'events/events-activities-tab.tsx',
  'events/events-blocks-tab.tsx',
  'events/events-bookings-tab.tsx',
  'events/events-calendar-tab.tsx',
  'events/events-equipment-tab.tsx',
  'events/events-incidents-tab.tsx',
  'events/events-internal-tab.tsx',
  'events/events-itineraries-tab.tsx',
  'events/events-rehearsals-tab.tsx',
  'events/events-reservations-tab.tsx',
  'events/events-run-of-show-tab.tsx',
  'events/events-shipping-receiving-tab.tsx',
  'events/events-tours-tab.tsx',
  'events/events-trainings-tab.tsx',
  
  // People (all 9)
  'people/people-personnel-tab.tsx',
  'people/people-applicants-tab.tsx',
  'people/people-assignments-tab.tsx',
  'people/people-onboarding-tab.tsx',
  'people/people-openings-tab.tsx',
  'people/people-scheduling-tab.tsx',
  'people/people-teams-tab.tsx',
  'people/people-timekeeping-tab.tsx',
  'people/people-training-tab.tsx',
  
  // Assets (all 8)
  'assets/assets-overview-tab.tsx',
  'assets/assets-advances-tab.tsx',
  'assets/assets-approvals-tab.tsx',
  'assets/assets-maintenance-tab.tsx',
  'assets/assets-tracking-tab.tsx',
  'assets/catalog-tab.tsx',
  'assets/counts-tab.tsx',
  'assets/inventory-tab.tsx',
  
  // Locations (all 9)
  'locations/locations-directory-tab.tsx',
  'locations/locations-access-tab.tsx',
  'locations/locations-bim-models-tab.tsx',
  'locations/locations-coordination-tab.tsx',
  'locations/locations-logistics-tab.tsx',
  'locations/locations-site-maps-tab.tsx',
  'locations/locations-spatial-features-tab.tsx',
  'locations/locations-utilities-tab.tsx',
  'locations/locations-warehousing-tab.tsx',
  
  // Files (all 10)
  'files/files-all-documents-tab.tsx',
  'files/files-archive-tab.tsx',
  'files/files-call-sheets-tab.tsx',
  'files/files-contracts-tab.tsx',
  'files/files-insurance-permits-tab.tsx',
  'files/files-media-assets-tab.tsx',
  'files/files-production-reports-tab.tsx',
  'files/files-riders-tab.tsx',
  'files/files-shared-tab.tsx',
  'files/files-tech-specs-tab.tsx',
];

function applyFixes(filePath) {
  const fullPath = path.join(COMPONENTS_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // 1. Add useTranslations import if not present
  if (!content.includes('useTranslations')) {
    content = content.replace(
      /^("use client")\s*\n\s*\nimport/,
      '$1\n\nimport { useTranslations } from \'next-intl\'\nimport'
    );
    modified = true;
  }
  
  // 2. Add translation hooks to component
  const funcMatch = content.match(/export function (\w+)\(/);
  if (funcMatch && !content.includes('const t = useTranslations')) {
    const componentName = funcMatch[1];
    content = content.replace(
      /export function \w+\([^)]+\) \{\s*\n(\s*const router)/,
      `export function ${componentName}($&\n  const t = useTranslations('${getTranslationKey(filePath)}')\n  const tCommon = useTranslations('common')\n  $1`
    );
    modified = true;
  }
  
  // 3. Fix loading state
  if (content.includes('Loading') && !content.includes('role="status"')) {
    content = content.replace(
      /<div className="flex items-center justify-center h-full">\s*<div className="text-center">\s*<div className="animate-spin[^>]+><\/div>\s*<p[^>]+>([^<]+)<\/p>/g,
      `<div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
        </div>
      </div>`
    );
    modified = true;
  }
  
  // 4. Wrap return in <main role="main">
  if (!content.includes('<main role="main"')) {
    content = content.replace(
      /return \(\s*<(>|div className="space-y-6">)/,
      'return (\n    <main role="main" aria-label={t(\'title\')}>\n      <$1'
    );
    content = content.replace(
      /<\/div>\s*\)\s*\}/,
      '    </div>\n    </main>\n  )\n}'
    );
    modified = true;
  }
  
  // 5. Add aria-hidden to all icon imports
  content = content.replace(
    /<(\w+) className="h-\d w-\d/g,
    (match, iconName) => {
      if (!match.includes('aria-hidden')) {
        return `<${iconName} className="h-4 w-4" aria-hidden="true"`;
      }
      return match;
    }
  );
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  console.log(`⏭️  Skipped (already fixed): ${filePath}`);
  return false;
}

function getTranslationKey(filePath) {
  const parts = filePath.split('/');
  const module = parts[0]; // dashboard, projects, etc.
  const file = parts[1].replace('.tsx', '').replace(`${module}-`, '').replace('-tab', '');
  return `${module}.${file}`;
}

console.log('🚀 Starting automated i18n + accessibility fixes...\n');
console.log(`📁 Processing ${FILES_TO_PROCESS.length} files\n`);

let fixed = 0;
let skipped = 0;

FILES_TO_PROCESS.forEach(file => {
  if (applyFixes(file)) {
    fixed++;
  } else {
    skipped++;
  }
});

console.log(`\n✨ Complete!`);
console.log(`   Fixed: ${fixed} files`);
console.log(`   Skipped: ${skipped} files`);
console.log(`   Total: ${FILES_TO_PROCESS.length} files`);
console.log(`\n📊 Progress: ${fixed + 2}/${FILES_TO_PROCESS.length + 2} (${Math.round(((fixed + 2) / (FILES_TO_PROCESS.length + 2)) * 100)}%)`);
