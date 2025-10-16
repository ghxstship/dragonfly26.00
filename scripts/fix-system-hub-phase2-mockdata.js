#!/usr/bin/env node

/**
 * SYSTEM HUB PHASE 2 - Mock Data Internationalization
 * 
 * Completes remaining internationalization for mock data arrays
 * to achieve TRUE 100% compliance matching Profile module standard.
 * 
 * Target: Remove all hardcoded mock data strings
 */

const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(__dirname, '../src/components/admin');

// Mock data patterns to internationalize
const MOCK_DATA_PATTERNS = [
  // admin-overview-tab.tsx - recentActivity
  { search: 'user: "Sarah Johnson"', replace: 'user: t(\'admin.mockData.user1\')' },
  { search: 'action: "created a new project"', replace: 'action: t(\'admin.mockData.action1\')' },
  { search: 'project: "Summer Festival 2024"', replace: 'project: t(\'admin.mockData.project1\')' },
  { search: 'user: "Mike Chen"', replace: 'user: t(\'admin.mockData.user2\')' },
  { search: 'action: "updated budget for"', replace: 'action: t(\'admin.mockData.action2\')' },
  { search: 'project: "Corporate Gala"', replace: 'project: t(\'admin.mockData.project2\')' },
  { search: 'user: "Emily Rodriguez"', replace: 'user: t(\'admin.mockData.user3\')' },
  { search: 'action: "completed milestone in"', replace: 'action: t(\'admin.mockData.action3\')' },
  { search: 'project: "Product Launch"', replace: 'project: t(\'admin.mockData.project3\')' },
  { search: 'user: "David Kim"', replace: 'user: t(\'admin.mockData.user4\')' },
  { search: 'action: "added 3 new members to"', replace: 'action: t(\'admin.mockData.action4\')' },
  { search: 'project: "Tour 2024"', replace: 'project: t(\'admin.mockData.project4\')' },
  { search: 'user: "Lisa Anderson"', replace: 'user: t(\'admin.mockData.user5\')' },
  { search: 'action: "scheduled event for"', replace: 'action: t(\'admin.mockData.action5\')' },
  { search: 'project: "Conference Setup"', replace: 'project: t(\'admin.mockData.project5\')' },
  
  // admin-overview-tab.tsx - systemHealth
  { search: 'metric: "API Response Time"', replace: 'metric: t(\'admin.systemHealth.apiResponseTime\')' },
  { search: 'metric: "Storage Used"', replace: 'metric: t(\'admin.systemHealth.storageUsed\')' },
  { search: 'metric: "Active Sessions"', replace: 'metric: t(\'admin.systemHealth.activeSessions\')' },
  { search: 'metric: "Uptime"', replace: 'metric: t(\'admin.systemHealth.uptime\')' },
];

function processFile(filename, patterns) {
  const filepath = path.join(ADMIN_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return false;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  let modified = false;

  patterns.forEach(({ search, replace }) => {
    if (content.includes(search)) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Updated: ${filename}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filename}`);
    return false;
  }
}

console.log('🚀 Starting Phase 2: Mock Data Internationalization...\n');

let updated = processFile('admin-overview-tab.tsx', MOCK_DATA_PATTERNS);

console.log('\n' + '='.repeat(60));
console.log('📊 PHASE 2 SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Mock data internationalized: ${updated ? 'YES' : 'NO'}`);
console.log('='.repeat(60));

if (updated) {
  console.log('\n✨ Phase 2 complete!');
  console.log('📝 Note: Translation keys need to be added to en.json');
} else {
  console.log('\n⚠️  No updates made. Files may already be internationalized.');
}
