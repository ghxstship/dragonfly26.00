#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');

const fixes = [
  {
    file: 'analytics/analytics-custom-views-tab.tsx',
    replacements: [
      { find: '>Create Custom View<', replace: '>{t(\'createCustomView\')}<' },
      { find: 'New Custom View', replace: '{tCommon(\'create\')} {t(\'customView\')}' },
      { find: 'Default', replace: '{t(\'default\')}' },
      { find: '>Widgets (', replace: '>{t(\'widgets\')} (' },
      { find: 'Modified ', replace: '{t(\'modified\')} ' },
      { find: '>Edit<', replace: '>{tCommon(\'edit\')}<' },
      { find: '>View<', replace: '>{tCommon(\'view\')}<' },
      { find: 'Build a personalized analytics dashboard with the metrics that matter most to you', replace: '{t(\'buildPersonalizedDashboard\')}' },
      { find: '>Get Started<', replace: '>{t(\'getStarted\')}<' }
    ]
  },
  {
    file: 'analytics/analytics-data-sources-tab.tsx',
    replacements: [
      { find: '>Total Sources<', replace: '>{t(\'totalSources\')}<' },
      { find: '>Connected<', replace: '>{t(\'connected\')}<' },
      { find: '>Total Records<', replace: '>{t(\'totalRecords\')}<' },
      { find: '>Last Synced<', replace: '>{t(\'lastSynced\')}<' },
      { find: '>Status<', replace: '>{t(\'status\')}<' },
      { find: '>Records<', replace: '>{t(\'records\')}<' },
      { find: '>Actions<', replace: '>{t(\'actions\')}<' }
    ]
  },
  {
    file: 'analytics/analytics-forecasting-tab.tsx',
    replacements: [
      { find: '>Forecast Insight<', replace: '>{t(\'forecastInsight\')}<' }
    ]
  },
  {
    file: 'analytics/analytics-pivot-tables-tab.tsx',
    replacements: [
      { find: '>Total<', replace: '>{t(\'total\')}<' },
      { find: '>Grand Total<', replace: '>{t(\'grandTotal\')}<' },
      { find: '>Pivot Configuration<', replace: '>{t(\'pivotConfiguration\')}<' },
      { find: '>Rows<', replace: '>{t(\'rows\')}<' },
      { find: '>Columns<', replace: '>{t(\'columns\')}<' },
      { find: '>Values<', replace: '>{t(\'values\')}<' },
      { find: '>Filters<', replace: '>{t(\'filters\')}<' }
    ]
  },
  {
    file: 'analytics/analytics-realtime-tab.tsx',
    replacements: [
      { find: '>API Server<', replace: '>{t(\'apiServer\')}<' },
      { find: '>Cache<', replace: '>{t(\'cache\')}<' }
    ]
  },
  {
    file: 'insights/insights-key-results-tab.tsx',
    replacements: [
      { find: '>Avg Progress<', replace: '>{t(\'avgProgress\')}<' }
    ]
  },
  {
    file: 'insights/insights-objectives-tab.tsx',
    replacements: [
      { find: '>Avg Progress<', replace: '>{t(\'avgProgress\')}<' },
      { find: '>Owner<', replace: '>{t(\'owner\')}<' },
      { find: '>Key Results<', replace: '>{t(\'keyResults\')}<' },
      { find: '>Progress<', replace: '>{t(\'progress\')}<' },
      { find: '>Status<', replace: '>{t(\'status\')}<' },
      { find: '>Actions<', replace: '>{t(\'actions\')}<' }
    ]
  },
  {
    file: 'insights/insights-overview-tab.tsx',
    replacements: [
      { find: '>Insights Generated<', replace: '>{t(\'insightsGenerated\')}<' },
      { find: '>Active Objectives Progress<', replace: '>{t(\'activeObjectivesProgress\')}<' },
      { find: '>Track progress against your strategic goals<', replace: '>{t(\'trackProgressDesc\')}<' },
      { find: 'Strategic Insights & Recommendations', replace: '{t(\'strategicInsightsRecommendations\')}' },
      { find: 'AI-powered analysis of your performance data', replace: '{t(\'aiPoweredAnalysisDesc\')}' },
      { find: ' priority', replace: ' {t(\'priority\')}' },
      { find: 'Confidence: ', replace: '{t(\'confidence\')}: ' },
      { find: 'Recommendation:', replace: '{t(\'recommendation\')}:' }
    ]
  },
  {
    file: 'insights/insights-progress-tracking-tab.tsx',
    replacements: [
      { find: '>Current vs Target<', replace: '>{t(\'currentVsTarget\')}<' }
    ]
  },
  {
    file: 'insights/insights-reviews-tab.tsx',
    replacements: [
      { find: '>Agenda<', replace: '>{t(\'agenda\')}<' },
      { find: '>Recent Reviews<', replace: '>{t(\'recentReviews\')}<' },
      { find: '>Key Outcomes<', replace: '>{t(\'keyOutcomes\')}<' }
    ]
  }
];

console.log('Fixing remaining JSX violations...\n');

let filesFixed = 0;
let totalReplacements = 0;

fixes.forEach(({ file, replacements }) => {
  const filePath = path.join(componentsDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${file} (not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  
  replacements.forEach(({ find, replace }) => {
    if (content.includes(find)) {
      content = content.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
      fileReplacements++;
    }
  });
  
  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed++;
    totalReplacements += fileReplacements;
    console.log(`✓ ${file} (${fileReplacements} fixes)`);
  } else {
    console.log(`- ${file} (no changes needed)`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`JSX CLEANUP COMPLETE`);
console.log('='.repeat(80));
console.log(`Files fixed: ${filesFixed}`);
console.log(`Total replacements: ${totalReplacements}`);
