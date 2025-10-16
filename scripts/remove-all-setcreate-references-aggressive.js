const fs = require('fs');
const { execSync } = require('child_process');

// Get all files with setCreateDialogOpen
const files = [
  'src/components/analytics/analytics-custom-views-tab.tsx',
  'src/components/analytics/analytics-data-sources-tab.tsx',
  'src/components/analytics/analytics-metrics-library-tab.tsx',
  'src/components/analytics/analytics-pivot-tables-tab.tsx',
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/assets/counts-tab.tsx',
  'src/components/assets/tracking-tab.tsx',
  'src/components/community/studios-tab.tsx',
  'src/components/companies/companies-contacts-tab.tsx',
  'src/components/companies/companies-organizations-tab.tsx',
  'src/components/finance/finance-overview-tab.tsx',
  'src/components/insights/insights-key-results-tab.tsx',
  'src/components/insights/insights-objectives-tab.tsx',
  'src/components/procurement/procurement-orders-dashboard-tab.tsx',
  'src/components/projects/projects-schedule-tab.tsx'
];

console.log(`Fixing ${files.length} files...`);

let fixedCount = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    // Remove lines containing setCreateDialogOpen
    const filteredLines = lines.filter(line => !line.includes('setCreateDialogOpen'));
    
    const newContent = filteredLines.join('\n');
    
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error: ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
