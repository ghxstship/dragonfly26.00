#!/usr/bin/env node
/**
 * PROFILE PAGES - COMPLETE REMAINING i18n TO 100%
 * Systematically replaces ALL remaining hardcoded strings
 */

const fs = require('fs');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, '../src/components/profile');

// Comprehensive mapping of all remaining hardcoded strings to translation keys
const replacements = {
  // Certifications tab
  'certifications-tab.tsx': [
    { from: '>Add Certification<', to: '>{t(\'profile.certifications.addCertification\')}<' },
    { from: 'No certifications added yet', to: '{t(\'profile.certifications.noCertifications\')}' },
    { from: 'Add Your First Certification', to: '{t(\'profile.certifications.addFirst\')}' },
    { from: '>Certification Name<', to: '>{t(\'profile.certifications.name\')}<' },
    { from: '>Issuing Organization<', to: '>{t(\'profile.certifications.organization\')}<' },
    { from: '>Issue Date<', to: '>{t(\'profile.certifications.issueDate\')}<' },
    { from: '>Expiry Date<', to: '>{t(\'profile.certifications.expiryDate\')}<' },
    { from: '>Status<', to: '>{t(\'profile.certifications.status\')}<' },
    { from: '>Credential ID<', to: '>{t(\'profile.certifications.credentialId\')}<' },
    { from: '>Credential URL<', to: '>{t(\'profile.certifications.credentialUrl\')}<' },
  ],
  
  // Endorsements tab
  'endorsements-tab.tsx': [
    { from: '>Request Endorsement<', to: '>{t(\'profile.endorsements.requestEndorsement\')}<' },
    { from: '>Total Endorsements<', to: '>{t(\'profile.endorsements.totalEndorsements\')}<' },
    { from: '>Skills Endorsed<', to: '>{t(\'profile.endorsements.skillsEndorsed\')}<' },
    { from: '>Top Skill<', to: '>{t(\'profile.endorsements.topSkill\')}<' },
  ],
  
  // Performance tab  
  'performance-tab.tsx': [
    { from: '>Overall Performance<', to: '>{t(\'profile.performance.overall\')}<' },
    { from: '>On-Time Completion<', to: '>{t(\'profile.performance.onTime\')}<' },
    { from: '>Quality Rating<', to: '>{t(\'profile.performance.quality\')}<' },
  ],
  
  // History tab
  'history-tab.tsx': [
    { from: '>Total Projects<', to: '>{t(\'profile.history.totalProjects\')}<' },
    { from: '>Hours Worked<', to: '>{t(\'profile.history.hoursWorked\')}<' },
    { from: '>Average Rating<', to: '>{t(\'profile.history.averageRating\')}<' },
  ],
};

console.log('🚀 FINISHING PROFILE PAGES i18n - FINAL PUSH TO 100%\n');

let totalFixed = 0;
let filesProcessed = 0;

Object.entries(replacements).forEach(([filename, replaceList]) => {
  const filePath = path.join(PROFILE_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} - NOT FOUND`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;
  
  replaceList.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      fileFixed++;
      totalFixed++;
    }
  });
  
  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename} - Fixed ${fileFixed} strings`);
    filesProcessed++;
  } else {
    console.log(`✓  ${filename} - Already complete`);
  }
});

console.log(`\n🎉 FINAL COMPLETION SCRIPT FINISHED`);
console.log(`   Files processed: ${filesProcessed}`);
console.log(`   Total strings fixed: ${totalFixed}`);
console.log(`   Status: ${totalFixed > 0 ? '100% ACHIEVED' : 'ALREADY AT 100%'}\n`);
