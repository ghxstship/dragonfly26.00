#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const modules = {
  'analytics': [
    'analytics-custom-views-tab.tsx',
    'analytics-data-sources-tab.tsx',
    'analytics-forecasting-tab.tsx',
    'analytics-metrics-library-tab.tsx',
    'analytics-overview-tab.tsx',
    'analytics-performance-tab.tsx',
    'analytics-pivot-tables-tab.tsx',
    'analytics-realtime-tab.tsx',
    'analytics-trends-tab.tsx'
  ],
  'reports': [
    'reports-archived-tab.tsx',
    'reports-compliance-tab.tsx',
    'reports-custom-builder-tab.tsx',
    'reports-executive-tab.tsx',
    'reports-exports-tab.tsx',
    'reports-operational-tab.tsx',
    'reports-overview-tab.tsx',
    'reports-scheduled-tab.tsx',
    'reports-templates-tab.tsx'
  ],
  'insights': [
    'insights-benchmarks-tab.tsx',
    'insights-intelligence-feed-tab.tsx',
    'insights-key-results-tab.tsx',
    'insights-objectives-tab.tsx',
    'insights-overview-tab.tsx',
    'insights-priorities-tab.tsx',
    'insights-progress-tracking-tab.tsx',
    'insights-recommendations-tab.tsx',
    'insights-reviews-tab.tsx',
    'insights-success-metrics-tab.tsx'
  ]
};

console.log('Starting comprehensive Intelligence Hub i18n remediation...\n');

let filesProcessed = 0;
let totalReplacements = 0;

// Generic transformation function
function transformFile(filePath, moduleName) {
  let content = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;
  
  // Transform: name: "..." -> nameKey: "..."
  content = content.replace(/(\s+)name:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}nameKey: "${key}"`;
  });
  
  // Transform: label: "..." -> labelKey: "..."
  content = content.replace(/(\s+)label:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}labelKey: "${key}"`;
  });
  
  // Transform: title: "..." -> titleKey: "..."
  content = content.replace(/(\s+)title:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}titleKey: "${key}"`;
  });
  
  // Transform: description: "..." -> descriptionKey: "..."
  content = content.replace(/(\s+)description:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 60);
    return `${indent}descriptionKey: "${key}"`;
  });
  
  // Transform: text: "..." -> textKey: "..."
  content = content.replace(/(\s+)text:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}textKey: "${key}"`;
  });
  
  // Transform: region: "..." -> regionKey: "..."
  content = content.replace(/(\s+)region:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `${indent}regionKey: "${key}"`;
  });
  
  // Transform: category: "..." -> categoryKey: "..."
  content = content.replace(/(\s+)category:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `${indent}categoryKey: "${key}"`;
  });
  
  // Add rendering logic for keys in JSX
  // Transform {item.name} -> {t(item.nameKey)}
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)name\}/g, (match, prefix) => {
    return `{t(${prefix}nameKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)label\}/g, (match, prefix) => {
    return `{t(${prefix}labelKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)title\}/g, (match, prefix) => {
    return `{t(${prefix}titleKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)description\}/g, (match, prefix) => {
    return `{t(${prefix}descriptionKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)region\}/g, (match, prefix) => {
    return `{t(${prefix}regionKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)category\}/g, (match, prefix) => {
    return `{t(${prefix}categoryKey)}`;
  });
  
  // Transform common JSX hardcoded strings
  const commonTransforms = {
    '>Last<': '>{t(\'last\')}<',
    '>On Track<': '>{t(\'onTrack\')}<',
    '>At Risk<': '>{t(\'atRisk\')}<',
    '>Total Objectives<': '>{t(\'totalObjectives\')}<',
    '>Total Key Results<': '>{t(\'totalKeyResults\')}<',
    '>Active Objectives<': '>{t(\'activeObjectives\')}<',
    '>Objectives On Track<': '>{t(\'objectivesOnTrack\')}<',
    '>Overall Progress<': '>{t(\'overallProgress\')}<',
    '>Avg Velocity<': '>{t(\'avgVelocity\')}<',
    '>System Status<': '>{t(\'systemStatus\')}<',
    '>Database<': '>{t(\'database\')}<',
    '>Healthy<': '>{t(\'healthy\')}<',
    '>Region<': '>{t(\'region\')}<',
    '>Product<': '>{t(\'product\')}<',
    '>Your Performance<': '>{t(\'yourPerformance\')}<',
    '>Detailed Breakdown<': '>{t(\'detailedBreakdown\')}<',
    '>Upcoming Reviews<': '>{t(\'upcomingReviews\')}<',
    '>Date & Time<': '>{t(\'dateTime\')}<',
    '>Attendees<': '>{t(\'attendees\')}<',
    '>Estimated Benefit<': '>{t(\'estimatedBenefit\')}<',
    '>Implementation Effort<': '>{t(\'implementationEffort\')}<',
    '>Confidence Level<': '>{t(\'confidenceLevel\')}<',
    '>Impact vs Effort Matrix<': '>{t(\'impactVsEffortMatrix\')}<',
    '>Priority Score Distribution<': '>{t(\'priorityScoreDistribution\')}<',
    '>Composite score across all success criteria<': '>{t(\'compositeScoreDesc\')}<',
    '>Category Score<': '>{t(\'categoryScore\')}<',
    '>Last Run<': '>{t(\'lastRun\')}<',
    '>Current Value<': '>{t(\'currentValue\')}<',
    '>All Metrics<': '>{t(\'allMetrics\')}<',
    '>Sales by Region & Product<': '>{t(\'salesByRegionProduct\')}<'
  };
  
  Object.entries(commonTransforms).forEach(([find, replace]) => {
    if (content.includes(find)) {
      content = content.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
      replacements++;
    }
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  return replacements;
}

// Process all files
Object.entries(modules).forEach(([moduleName, files]) => {
  console.log(`\n=== ${moduleName.toUpperCase()} MODULE ===`);
  files.forEach(file => {
    const filePath = path.join(componentsDir, moduleName, file);
    if (fs.existsSync(filePath)) {
      const replacements = transformFile(filePath, moduleName);
      filesProcessed++;
      totalReplacements += replacements;
      console.log(`✓ ${file} (${replacements} transformations)`);
    } else {
      console.log(`✗ ${file} (not found)`);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log(`TRANSFORMATION COMPLETE`);
console.log('='.repeat(80));
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total transformations: ${totalReplacements}`);
console.log('\nNote: Manual review required for complex cases.');
console.log('Run audit script to verify completion.');
