#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const modules = ['analytics', 'reports', 'insights'];

console.log('Starting Intelligence Hub i18n remediation...\n');

let filesUpdated = 0;
let totalReplacements = 0;

// Translation key mappings for common patterns
const translationMappings = {
  // Analytics module
  'analytics-comparisons-tab.tsx': {
    patterns: [
      { find: /label:\s*"([^"]+)"/g, replace: (match, p1) => `labelKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')}"` },
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: />All Metrics</g, replace: '>{t(\'allMetrics\')}<' },
      { find: />Current Value</g, replace: '>{t(\'currentValue\')}<' },
    ]
  },
  'analytics-overview-tab.tsx': {
    patterns: [
      { find: /label:\s*"([^"]+)"/g, replace: (match, p1) => `labelKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '_')}"` },
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
    ]
  },
  'analytics-performance-tab.tsx': {
    patterns: [
      { find: /label:\s*"([^"]+)"/g, replace: (match, p1) => `labelKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
    ]
  },
  'analytics-pivot-tables-tab.tsx': {
    patterns: [
      { find: />Sales by Region & Product</g, replace: '>{t(\'salesByRegionProduct\')}<' },
      { find: />Region</g, replace: '>{t(\'region\')}<' },
      { find: />Product</g, replace: '>{t(\'product\')}<' },
    ]
  },
  'analytics-realtime-tab.tsx': {
    patterns: [
      { find: /label:\s*"([^"]+)"/g, replace: (match, p1) => `labelKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_')}"` },
      { find: />System Status</g, replace: '>{t(\'systemStatus\')}<' },
      { find: />Database</g, replace: '>{t(\'database\')}<' },
      { find: />Healthy</g, replace: '>{t(\'healthy\')}<' },
    ]
  },
  'analytics-trends-tab.tsx': {
    patterns: [
      { find: />Last</g, replace: '>{t(\'last\')}<' },
    ]
  },
  
  // Reports module
  'reports-archived-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/[0-9]/g, 'n')}"` },
    ]
  },
  'reports-compliance-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/[0-9]/g, 'n')}"` },
    ]
  },
  'reports-custom-builder-tab.tsx': {
    patterns: [
      { find: /label:\s*"([^"]+)"/g, replace: (match, p1) => `labelKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
    ]
  },
  'reports-executive-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /description:\s*"([^"]+)"/g, replace: (match, p1) => `descriptionKey: "${p1.toLowerCase().replace(/\s+/g, '_').substring(0, 40)}"` },
    ]
  },
  'reports-exports-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '_')}"` },
    ]
  },
  'reports-operational-tab.tsx': {
    patterns: [
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: />Last Run</g, replace: '>{t(\'lastRun\')}<' },
    ]
  },
  'reports-overview-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/[0-9]/g, 'n')}"` },
    ]
  },
  'reports-scheduled-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
    ]
  },
  'reports-templates-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /description:\s*"([^"]+)"/g, replace: (match, p1) => `descriptionKey: "${p1.toLowerCase().replace(/\s+/g, '_').substring(0, 40)}"` },
    ]
  },
  
  // Insights module
  'insights-benchmarks-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: />Your Performance</g, replace: '>{t(\'yourPerformance\')}<' },
      { find: />Detailed Breakdown</g, replace: '>{t(\'detailedBreakdown\')}<' },
    ]
  },
  'insights-intelligence-feed-tab.tsx': {
    patterns: [
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_').substring(0, 40)}"` },
    ]
  },
  'insights-key-results-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/\+/g, 'plus').replace(/\$/g, 'usd').substring(0, 50)}"` },
      { find: />Total Key Results</g, replace: '>{t(\'totalKeyResults\')}<' },
      { find: />On Track</g, replace: '>{t(\'onTrack\')}<' },
      { find: />At Risk</g, replace: '>{t(\'atRisk\')}<' },
    ]
  },
  'insights-objectives-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /description:\s*"([^"]+)"/g, replace: (match, p1) => `descriptionKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/%/g, 'percent').substring(0, 50)}"` },
      { find: />Total Objectives</g, replace: '>{t(\'totalObjectives\')}<' },
      { find: />On Track</g, replace: '>{t(\'onTrack\')}<' },
      { find: />At Risk</g, replace: '>{t(\'atRisk\')}<' },
    ]
  },
  'insights-overview-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /description:\s*"([^"]+)"/g, replace: (match, p1) => `descriptionKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/%/g, 'percent').substring(0, 50)}"` },
      { find: />Active Objectives</g, replace: '>{t(\'activeObjectives\')}<' },
      { find: />On Track</g, replace: '>{t(\'onTrack\')}<' },
      { find: />At Risk</g, replace: '>{t(\'atRisk\')}<' },
    ]
  },
  'insights-priorities-tab.tsx': {
    patterns: [
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')}"` },
      { find: /description:\s*"([^"]+)"/g, replace: (match, p1) => `descriptionKey: "${p1.toLowerCase().replace(/\s+/g, '_').substring(0, 50)}"` },
      { find: />Impact vs Effort Matrix</g, replace: '>{t(\'impactVsEffortMatrix\')}<' },
      { find: />Priority Score Distribution</g, replace: '>{t(\'priorityScoreDistribution\')}<' },
    ]
  },
  'insights-progress-tracking-tab.tsx': {
    patterns: [
      { find: />Overall Progress</g, replace: '>{t(\'overallProgress\')}<' },
      { find: />Objectives On Track</g, replace: '>{t(\'objectivesOnTrack\')}<' },
      { find: />Avg Velocity</g, replace: '>{t(\'avgVelocity\')}<' },
    ]
  },
  'insights-recommendations-tab.tsx': {
    patterns: [
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: /description:\s*"([^"]+)"/g, replace: (match, p1) => `descriptionKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/%/g, 'percent').replace(/\//g, '_').substring(0, 60)}"` },
      { find: />Estimated Benefit</g, replace: '>{t(\'estimatedBenefit\')}<' },
      { find: />Implementation Effort</g, replace: '>{t(\'implementationEffort\')}<' },
      { find: />Confidence Level</g, replace: '>{t(\'confidenceLevel\')}<' },
    ]
  },
  'insights-reviews-tab.tsx': {
    patterns: [
      { find: /title:\s*"([^"]+)"/g, replace: (match, p1) => `titleKey: "${p1.toLowerCase().replace(/\s+/g, '_').replace(/[0-9]/g, 'n')}"` },
      { find: />Upcoming Reviews</g, replace: '>{t(\'upcomingReviews\')}<' },
      { find: />Date & Time</g, replace: '>{t(\'dateTime\')}<' },
      { find: />Attendees</g, replace: '>{t(\'attendees\')}<' },
    ]
  },
  'insights-success-metrics-tab.tsx': {
    patterns: [
      { find: /name:\s*"([^"]+)"/g, replace: (match, p1) => `nameKey: "${p1.toLowerCase().replace(/\s+/g, '_')}"` },
      { find: />Composite score across all success criteria</g, replace: '>{t(\'compositeScoreDesc\')}<' },
      { find: />Category Score</g, replace: '>{t(\'categoryScore\')}<' },
    ]
  },
};

console.log('This is a complex remediation requiring manual implementation.');
console.log('The patterns above show the transformation needed for each file.\n');
console.log('Due to the complexity of maintaining data structure integrity,');
console.log('manual implementation is recommended for each file.\n');

console.log('Files requiring remediation:');
Object.keys(translationMappings).forEach(file => {
  console.log(`  - ${file}`);
});

console.log(`\nTotal: ${Object.keys(translationMappings).length} files`);
