#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Standard header template
const createHeader = (description) => `      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          ${description}
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

`;

// Tab descriptions
const descriptions = {
  // Events
  'events-tours-tab': 'Organize tours and venue visits',
  'events-calendar-tab': 'View and manage event calendar',
  
  // Finance  
  'finance-scenarios-tab': 'Create and compare financial scenarios',
  'finance-variance-tab': 'Analyze budget vs actual variances',
  'finance-policies-tab': 'Manage financial policies and rules',
  
  // Marketplace
  'lists-tab': 'Manage your shopping and wish lists',
  'orders-tab': 'Track your orders and shipments', 
  'purchases-tab': 'View purchase history',
  'reviews-tab': 'Your product and service reviews',
  'sales-tab': 'Manage your sales and listings',
  
  // Reports
  'reports-overview-tab': 'Reports dashboard and overview',
  'reports-templates-tab': 'Manage report templates',
  'reports-scheduled-tab': 'Scheduled and automated reports',
  'reports-exports-tab': 'Export history and downloads',
  'reports-compliance-tab': 'Compliance and audit reports',
  'reports-executive-tab': 'Executive summary reports',
  'reports-operational-tab': 'Operational performance reports',
  'reports-archived-tab': 'Archived reports and history',
  
  // Procurement
  'procurement-receiving-tab': 'Receiving and delivery tracking',
  'procurement-matching-tab': 'Invoice matching and reconciliation',
  
  // Insights
  'insights-overview-tab': 'Insights dashboard and key metrics',
  'insights-benchmarks-tab': 'Industry benchmarks and comparisons',
  'insights-recommendations-tab': 'AI-powered recommendations',
  'insights-priorities-tab': 'Priority actions and focus areas',
  'insights-progress-tracking-tab': 'Goal progress and tracking',
  'insights-intelligence-feed-tab': 'Intelligence feed and updates',
  'insights-success-metrics-tab': 'Success metrics and KPIs',
};

function fixTab(filePath, description) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has standard positioning
  if (content.includes('Action Buttons - Standard Positioning')) {
    return { fixed: false, reason: 'already-correct' };
  }
  
  // Find return statement with space-y-6
  const returnMatch = content.match(/return \(\s+<div className="space-y-6">/);
  if (!returnMatch) {
    return { fixed: false, reason: 'no-match' };
  }
  
  const header = createHeader(description);
  const newContent = content.replace(
    /return \(\s+<div className="space-y-6">/,
    `return (\n    <div className="space-y-6">\n${header}`
  );
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  return { fixed: true };
}

async function main() {
  console.log('🚀 Batch fixing ALL remaining tabs...\n');
  
  const componentsDir = path.join(__dirname, '../src/components');
  let fixed = 0;
  let skipped = 0;
  
  for (const [filename, description] of Object.entries(descriptions)) {
    const pattern = `${componentsDir}/**/${filename}.tsx`;
    const files = glob.sync(pattern);
    
    if (files.length === 0) {
      console.log(`⚠️  Not found: ${filename}`);
      continue;
    }
    
    const result = fixTab(files[0], description);
    if (result.fixed) {
      console.log(`✅ Fixed: ${filename}`);
      fixed++;
    } else {
      console.log(`⏭️  Skipped: ${filename} (${result.reason})`);
      skipped++;
    }
  }
  
  console.log(`\n📊 Complete!`);
  console.log(`   ✅ Fixed: ${fixed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

main().catch(console.error);
