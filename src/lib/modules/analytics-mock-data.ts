import type { DataItem } from "@/types"

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateAnalyticsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'performance':
      return generatePerformanceData(count)
    case 'trends':
      return generateTrendsData(count)
    case 'insights':
      return generateInsightsData(count)
    case 'forecasts':
      return generateForecastsData(count)
    case 'benchmarks':
      return generateBenchmarksData(count)
    default:
      return generateOverviewData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const metricNames = [
    "Total Revenue YTD",
    "Production Count",
    "Crew Utilization Rate",
    "Asset Utilization Rate",
    "Budget Efficiency",
    "On-Time Completion Rate",
    "Client Satisfaction Score",
    "Vendor Performance Score"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `metric-${i + 1}`,
    name: metricNames[i % metricNames.length],
    description: "Key performance metric with historical trends",
    metric_type: i % 4 === 0 ? "count" : i % 4 === 1 ? "percentage" : i % 4 === 2 ? "sum" : "average",
    source_table: "productions",
    calculation_formula: {},
    unit: i % 2 === 0 ? "USD" : "%",
    format: "number",
    target_value: parseFloat((Math.random() * 1000000).toFixed(2)),
    warning_threshold: parseFloat((Math.random() * 800000).toFixed(2)),
    critical_threshold: parseFloat((Math.random() * 600000).toFixed(2)),
    created_by: "person-1",
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: 0,
  }))
}

function generatePerformanceData(count: number): DataItem[] {
  const performanceMetrics = [
    "Production Delivery Performance",
    "Budget Variance Analysis",
    "Resource Utilization Efficiency",
    "Quality Metrics Score",
    "Timeline Adherence Rate",
    "Crew Productivity Index"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `perf-${i + 1}`,
    name: performanceMetrics[i % performanceMetrics.length],
    description: "Performance metric with benchmarking data",
    status: i % 3 === 0 ? "above_target" : i % 3 === 1 ? "on_target" : "below_target",
    priority: i % 3 === 0 ? "normal" : i % 3 === 1 ? "normal" : "high",
    assignee: "person-1",
    assignee_name: "Analytics Team",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["performance", "kpi"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: 0,
  }))
}

function generateTrendsData(count: number): DataItem[] {
  const trendTypes = [
    "Revenue Trend Analysis",
    "Production Volume Trends",
    "Cost Trends by Category",
    "Crew Availability Trends",
    "Equipment Demand Trends",
    "Seasonal Performance Patterns"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `trend-${i + 1}`,
    name: trendTypes[i % trendTypes.length],
    description: "Historical trend analysis with pattern detection",
    status: "active",
    priority: "normal",
    assignee: "person-1",
    assignee_name: "Data Analyst",
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["trends", "analysis"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: 1,
  }))
}

function generateInsightsData(count: number): DataItem[] {
  const insights = [
    "Cost Optimization Opportunity Identified",
    "Resource Allocation Recommendation",
    "Revenue Growth Opportunity",
    "Process Efficiency Improvement",
    "Risk Alert: Budget Overrun Predicted",
    "Opportunity: Expand Service Line"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `insight-${i + 1}`,
    name: insights[i % insights.length],
    description: "AI-generated insight with actionable recommendations",
    status: i % 4 === 0 ? "new" : i % 4 === 1 ? "reviewed" : i % 4 === 2 ? "actioned" : "dismissed",
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: "person-1",
    assignee_name: "Management Team",
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    tags: ["insight", "ai", "recommendation"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: 0,
  }))
}

function generateForecastsData(count: number): DataItem[] {
  const forecastTypes = [
    "Revenue Forecast Q3 2024",
    "Production Capacity Forecast",
    "Resource Demand Forecast",
    "Cost Projection Analysis",
    "Market Demand Forecast",
    "Crew Availability Projection"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `forecast-${i + 1}`,
    name: forecastTypes[i % forecastTypes.length],
    description: "Predictive forecast based on historical data and trends",
    status: "active",
    priority: "high",
    assignee: "person-1",
    assignee_name: "Planning Team",
    created_at: getRandomPastDate(7),
    updated_at: new Date().toISOString(),
    tags: ["forecast", "prediction"],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: 1,
  }))
}

function generateBenchmarksData(count: number): DataItem[] {
  const benchmarkCategories = [
    "Industry Standard: Production Costs",
    "Industry Average: Timeline Delivery",
    "Best Practice: Crew Utilization",
    "Market Benchmark: Client Satisfaction",
    "Competitor Analysis: Service Pricing",
    "Performance Standard: Quality Score"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `benchmark-${i + 1}`,
    name: benchmarkCategories[i % benchmarkCategories.length],
    description: "Industry benchmark comparison and gap analysis",
    status: i % 3 === 0 ? "above_benchmark" : i % 3 === 1 ? "at_benchmark" : "below_benchmark",
    priority: i % 3 === 2 ? "high" : "normal",
    assignee: "person-1",
    assignee_name: "Strategy Team",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["benchmark", "comparison", "industry"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: 1,
  }))
}
