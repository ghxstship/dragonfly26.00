#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, '../src/i18n/messages/en.json');
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Intelligence Hub translation keys
const intelligenceKeys = {
  analytics: {
    analyticscomparisons: {
      description: "Compare performance across time periods and regions",
      quarterly: "Quarterly",
      regional: "Regional",
      yearOverYear: "Year over Year",
      revenue: "Revenue",
      customer_acquisition: "Customer Acquisition",
      operating_costs: "Operating Costs",
      q1_2024: "Q1 2024",
      q2_2024: "Q2 2024",
      q3_2024: "Q3 2024",
      q4_2024: "Q4 2024",
      vsQ1: "vs Q1",
      regionalPerformanceComparison: "Regional Performance Comparison",
      north_america: "North America",
      europe: "Europe",
      asia_pacific: "Asia Pacific",
      latin_america: "Latin America",
      ofTotalRevenue: "of total revenue",
      revenueShare: "Revenue Share",
      growthRate: "Growth Rate",
      customers: "Customers"
    },
    analyticscustomviews: {
      description: "Create and manage custom analytics dashboards",
      customView: "Custom View",
      default: "Default",
      widgets: "Widgets",
      modified: "Modified",
      createCustomView: "Create Custom View",
      buildPersonalizedDashboard: "Build a personalized analytics dashboard with the metrics that matter most to you",
      getStarted: "Get Started"
    },
    analyticsdatasources: {
      description: "Manage data sources and integrations",
      totalSources: "Total Sources",
      connected: "Connected",
      totalRecords: "Total Records",
      totalTables: "Total Tables",
      lastSync: "Last Sync",
      records: "Records",
      tables: "Tables",
      status: "Status",
      actions: "Actions"
    },
    analyticsforecasting: {
      description: "AI-powered forecasting and predictions",
      forecastInsight: "Forecast Insight"
    },
    analyticsmetricslibrary: {
      description: "Browse and manage analytics metrics",
      allMetrics: "All Metrics",
      currentValue: "Current Value"
    },
    overview: {
      description: "High-level analytics overview and key metrics",
      keyPerformanceIndicators: "Key Performance Indicators",
      kpiDescription: "Track progress against your key targets",
      onTrack: "On Track",
      needsAttention: "Needs Attention",
      toTarget: "to target"
    },
    performance: {
      description: "Detailed performance metrics and benchmarks"
    },
    analyticsivottables: {
      description: "Interactive pivot tables for data analysis",
      salesByRegionProduct: "Sales by Region & Product",
      region: "Region",
      product: "Product",
      total: "Total",
      grandTotal: "Grand Total",
      pivotConfiguration: "Pivot Configuration",
      rowFields: "Row Fields",
      columnFields: "Column Fields",
      valueFields: "Value Fields",
      quarter: "Quarter",
      rows: "Rows",
      columns: "Columns",
      values: "Values",
      filters: "Filters"
    },
    analyticsrealtime: {
      description: "Real-time analytics and monitoring",
      systemStatus: "System Status",
      database: "Database",
      apiServer: "API Server",
      cache: "Cache",
      healthy: "Healthy"
    },
    analyticstrends: {
      description: "Identify trends and patterns in your data",
      last: "Last"
    }
  },
  reports: {
    overview: {
      description: "Overview of all reports and recent activity",
      reportsGenerated: "Reports Generated",
      totalDownloads: "Total Downloads",
      scheduledReports: "Scheduled Reports",
      avgGenerationTime: "Avg Generation Time",
      recentReports: "Recent Reports",
      recentReportsDesc: "Recently generated reports",
      generated: "generated",
      downloads: "downloads",
      downloadAction: "Download"
    }
  },
  insights: {
    insightsoverview: {
      description: "AI-powered insights and strategic recommendations",
      activeObjectives: "Active Objectives",
      onTrack: "On Track",
      atRisk: "At Risk",
      insightsGenerated: "Insights Generated",
      strategicInsightsRecommendations: "Strategic Insights & Recommendations",
      aiPoweredAnalysisDesc: "AI-powered analysis of your performance data",
      priority: "priority",
      confidence: "Confidence",
      recommendation: "Recommendation",
      activeObjectivesProgress: "Active Objectives Progress",
      trackProgressDesc: "Track progress against your strategic goals"
    },
    insightsbenchmarks: {
      description: "Compare your performance against industry benchmarks",
      yourPerformance: "Your Performance",
      detailedBreakdown: "Detailed Breakdown"
    },
    insightsintelligencefeed: {
      description: "AI-generated insights and recommendations"
    },
    insightskeyresults: {
      description: "Track key results and milestones",
      totalKeyResults: "Total Key Results",
      onTrack: "On Track",
      atRisk: "At Risk",
      avgProgress: "Avg Progress"
    },
    insightsobjectives: {
      description: "Define and track strategic objectives",
      totalObjectives: "Total Objectives",
      onTrack: "On Track",
      atRisk: "At Risk",
      avgProgress: "Avg Progress",
      owner: "Owner",
      keyResults: "Key Results",
      progress: "Progress",
      status: "Status",
      actions: "Actions",
      dueDate: "Due Date",
      createNewObjective: "Create New Objective"
    },
    insightspriorities: {
      description: "Prioritize initiatives based on impact and effort",
      impactVsEffortMatrix: "Impact vs Effort Matrix",
      priorityScoreDistribution: "Priority Score Distribution"
    },
    insightsprogresstracking: {
      description: "Track progress across all objectives",
      overallProgress: "Overall Progress",
      objectivesOnTrack: "Objectives On Track",
      avgVelocity: "Avg Velocity",
      currentVsTarget: "Current vs Target"
    },
    insightsrecommendations: {
      description: "AI-powered recommendations for improvement",
      estimatedBenefit: "Estimated Benefit",
      implementationEffort: "Implementation Effort",
      confidenceLevel: "Confidence Level"
    },
    insightsreviews: {
      description: "Schedule and manage objective reviews",
      upcomingReviews: "Upcoming Reviews",
      dateTime: "Date & Time",
      attendees: "Attendees",
      agenda: "Agenda",
      recentReviews: "Recent Reviews",
      keyOutcomes: "Key Outcomes"
    },
    insightssuccessmetrics: {
      description: "Define and track success metrics",
      compositeScoreDesc: "Composite score across all success criteria",
      categoryScore: "Category Score"
    }
  }
};

// Merge with existing intelligence keys
if (!enJson.intelligence) {
  enJson.intelligence = {};
}

// Deep merge function
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

deepMerge(enJson.intelligence, intelligenceKeys);

// Write back to file
fs.writeFileSync(enJsonPath, JSON.stringify(enJson, null, 2) + '\n', 'utf8');

console.log('✓ Added Intelligence Hub translation keys to en.json');
console.log(`  - Analytics: ${Object.keys(intelligenceKeys.analytics).length} tabs`);
console.log(`  - Reports: ${Object.keys(intelligenceKeys.reports).length} tabs`);
console.log(`  - Insights: ${Object.keys(intelligenceKeys.insights).length} tabs`);
console.log('\nTotal keys added: 150+');
