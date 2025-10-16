#!/usr/bin/env node

/**
 * Automated remediation script for Production Hub layout violations
 * Removes redundant description + action buttons section from all tab components
 */

const fs = require('fs');
const path = require('path');

// All Production Hub tab files that need remediation
const filesToRemediate = [
  // Projects (remaining 7)
  'src/components/projects/projects-overview-tab.tsx',
  'src/components/projects/projects-productions-tab.tsx',
  'src/components/projects/projects-projects-checklists-tab.tsx',
  'src/components/projects/projects-projects-work-orders-tab.tsx',
  'src/components/projects/projects-safety-tab.tsx',
  'src/components/projects/projects-schedule-tab.tsx',
  'src/components/projects/projects-tasks-tab.tsx',
  
  // Events (all 15)
  'src/components/events/events-activities-tab.tsx',
  'src/components/events/events-all-events-tab.tsx',
  'src/components/events/events-blocks-tab.tsx',
  'src/components/events/events-bookings-tab.tsx',
  'src/components/events/events-calendar-tab.tsx',
  'src/components/events/events-equipment-tab.tsx',
  'src/components/events/events-incidents-tab.tsx',
  'src/components/events/events-internal-tab.tsx',
  'src/components/events/events-itineraries-tab.tsx',
  'src/components/events/events-rehearsals-tab.tsx',
  'src/components/events/events-reservations-tab.tsx',
  'src/components/events/events-run-of-show-tab.tsx',
  'src/components/events/events-shipping-receiving-tab.tsx',
  'src/components/events/events-tours-tab.tsx',
  'src/components/events/events-trainings-tab.tsx',
  
  // People (all 9)
  'src/components/people/people-applicants-tab.tsx',
  'src/components/people/people-assignments-tab.tsx',
  'src/components/people/people-onboarding-tab.tsx',
  'src/components/people/people-openings-tab.tsx',
  'src/components/people/people-personnel-tab.tsx',
  'src/components/people/people-scheduling-tab.tsx',
  'src/components/people/people-teams-tab.tsx',
  'src/components/people/people-timekeeping-tab.tsx',
  'src/components/people/people-training-tab.tsx',
  
  // Assets (all 9)
  'src/components/assets/assets-advances-tab.tsx',
  'src/components/assets/assets-approvals-tab.tsx',
  'src/components/assets/assets-maintenance-tab.tsx',
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/assets/assets-tracking-tab.tsx',
  'src/components/assets/catalog-tab.tsx',
  'src/components/assets/counts-tab.tsx',
  'src/components/assets/inventory-tab.tsx',
  'src/components/assets/tracking-tab.tsx',
  
  // Locations (all 9)
  'src/components/locations/locations-access-tab.tsx',
  'src/components/locations/locations-bim-models-tab.tsx',
  'src/components/locations/locations-coordination-tab.tsx',
  'src/components/locations/locations-directory-tab.tsx',
  'src/components/locations/locations-logistics-tab.tsx',
  'src/components/locations/locations-site-maps-tab.tsx',
  'src/components/locations/locations-spatial-features-tab.tsx',
  'src/components/locations/locations-utilities-tab.tsx',
  'src/components/locations/locations-warehousing-tab.tsx',
  
  // Files (all 10)
  'src/components/files/files-all-documents-tab.tsx',
  'src/components/files/files-archive-tab.tsx',
  'src/components/files/files-call-sheets-tab.tsx',
  'src/components/files/files-contracts-tab.tsx',
  'src/components/files/files-insurance-permits-tab.tsx',
  'src/components/files/files-media-assets-tab.tsx',
  'src/components/files/files-production-reports-tab.tsx',
  'src/components/files/files-riders-tab.tsx',
  'src/components/files/files-shared-tab.tsx',
  'src/components/files/files-tech-specs-tab.tsx',
];

const rootDir = path.join(__dirname, '..');

// Pattern to match and remove (with variations)
const patterns = [
  // Standard pattern (most files)
  /\s*{\/\* Action Buttons - Standard Positioning \*\/}\s*<div className="flex items-center justify-between">[\s\S]*?<\/div>\s*<\/div>\s*\n\s*{\/\* Summary/,
  // Pattern with section wrapper
  /\s*{\/\* Action Buttons - Standard Positioning \*\/}\s*<section[\s\S]*?<\/section>\s*\n\s*{\/\* (Summary|Week|Stats)/,
  // Pattern with different comment
  /\s*{\/\* Action Buttons - Standard Positioning \*\/}\s*<div className="flex items-center justify-between">[\s\S]*?<\/div>\s*\n\s*{\/\* (Stats|Week)/,
];

let successCount = 0;
let failCount = 0;
const failedFiles = [];

filesToRemediate.forEach(filePath => {
  const fullPath = path.join(rootDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    failCount++;
    failedFiles.push(filePath);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Try each pattern
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, (match, commentText) => {
        modified = true;
        return `\n      {/* ${commentText || 'Summary'}`;
      });
      break;
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}`);
    successCount++;
  } else {
    console.log(`⚠️  Pattern not found: ${filePath}`);
    failCount++;
    failedFiles.push(filePath);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`REMEDIATION COMPLETE`);
console.log(`${'='.repeat(60)}`);
console.log(`✅ Success: ${successCount}/${filesToRemediate.length}`);
console.log(`❌ Failed: ${failCount}/${filesToRemediate.length}`);

if (failedFiles.length > 0) {
  console.log(`\nFailed files:`);
  failedFiles.forEach(f => console.log(`  - ${f}`));
}
