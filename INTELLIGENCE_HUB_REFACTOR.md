# Intelligence Hub Refactor - Reports, Analytics & Insights

## Overview
This document outlines the comprehensive refactor of the Intelligence Hub modules: Reports, Analytics, and Insights (formerly Goals).

## Module Changes

### 1. Goals → Insights
**Renamed** the Goals module to **Insights** to better reflect its purpose as a strategic intelligence and recommendations hub.

- **Module ID**: `insights`
- **Module Name**: Insights
- **Icon**: Lightbulb
- **Description**: Strategic intelligence and recommendations
- **Color**: #10b981

### Directory Structure Changes
- `/src/app/[locale]/(dashboard)/goals` → `/src/app/[locale]/(dashboard)/insights`
- `/src/components/goals` → `/src/components/insights`

### Component Renames
- `GoalsList` → `ObjectivesList`
- `GoalsHierarchy` → `ObjectivesHierarchy`
- `CreateGoalDialog` → `CreateObjectiveDialog`
- `GoalDetail` → `ObjectiveDetail`

## New Tab Structure

### Reports Module
**Focus**: Document generation and scheduled reporting

| # | Tab ID | Tab Name | View | Description |
|---|--------|----------|------|-------------|
| 1 | reports-overview | Overview | dashboard | Recent reports and activity dashboard |
| 2 | reports-custom-builder | Custom Builder | form | Build custom reports with drag-and-drop interface |
| 3 | reports-templates | Templates | table | Pre-built report templates library |
| 4 | reports-scheduled | Scheduled | calendar | Automated report generation and delivery |
| 5 | reports-exports | Exports | table | Export history and download center |
| 6 | reports-compliance | Compliance | table | Regulatory and compliance reports |
| 7 | reports-executive | Executive | table | C-suite and stakeholder reports |
| 8 | reports-operational | Operational | table | Day-to-day operational reports |
| 9 | reports-archived | Archived | table | Historical report storage |

### Analytics Module
**Focus**: Real-time data analysis and performance monitoring

| # | Tab ID | Tab Name | View | Description |
|---|--------|----------|------|-------------|
| 1 | analytics-overview | Overview | dashboard | Analytics dashboard with key metrics |
| 2 | analytics-performance | Performance | dashboard | Performance metrics and benchmarking |
| 3 | analytics-trends | Trends | dashboard | Historical trends and pattern analysis |
| 4 | analytics-comparisons | Comparisons | pivot | Comparative analysis across datasets |
| 5 | analytics-forecasting | Forecasting | dashboard | Predictive analytics and projections |
| 6 | analytics-realtime | Real-time | activity | Live metrics and monitoring |
| 7 | analytics-custom-views | Custom Views | pivot | Build custom analytics dashboards |
| 8 | analytics-pivot-tables | Pivot Tables | pivot | Advanced data exploration |
| 9 | analytics-metrics-library | Metrics Library | table | Saved metrics and KPIs |
| 10 | analytics-data-sources | Data Sources | table | Manage connected data sources |

### Insights Module
**Focus**: Strategic intelligence and actionable recommendations

| # | Tab ID | Tab Name | View | Description |
|---|--------|----------|------|-------------|
| 1 | insights-overview | Overview | dashboard | Strategic insights dashboard |
| 2 | insights-objectives | Objectives | table | Strategic objectives and initiatives |
| 3 | insights-key-results | Key Results | table | Measurable outcomes and milestones |
| 4 | insights-benchmarks | Benchmarks | dashboard | Industry benchmarks and best practices |
| 5 | insights-recommendations | Recommendations | activity | AI-powered strategic recommendations |
| 6 | insights-priorities | Priorities | table | Ranked priorities and focus areas |
| 7 | insights-progress-tracking | Progress Tracking | dashboard | Track progress against strategic goals |
| 8 | insights-reviews | Reviews | calendar | Periodic reviews and retrospectives |
| 9 | insights-intelligence-feed | Intelligence Feed | activity | Curated insights from all data sources |
| 10 | insights-success-metrics | Success Metrics | dashboard | Define and track success criteria |

## Key Differentiators

### Reports vs Analytics vs Insights
- **Reports**: Generated documents for stakeholders (static, scheduled, exported)
- **Analytics**: Interactive data exploration and visualization (real-time, dynamic)
- **Insights**: Strategic direction and intelligent recommendations (forward-looking, actionable)

### Industry Agnostic Design
All tabs are designed to be universally compatible across industries:
- No industry-specific terminology
- Focus on universal business concepts (objectives, metrics, performance)
- Flexible data structures that adapt to any domain

## Updated Files

### Core Registry Files
- `src/lib/modules/registry.ts` - Updated module definition
- `src/lib/modules/tabs-registry.ts` - Complete tab restructure for all three modules

### Insights Module (formerly Goals)
- `src/app/[locale]/(dashboard)/insights/page.tsx` - Main page component
- `src/components/insights/objectives-list.tsx` - List view component
- `src/components/insights/objectives-hierarchy.tsx` - Hierarchy view component
- `src/components/insights/create-objective-dialog.tsx` - Create dialog
- `src/components/insights/objective-detail.tsx` - Detail panel

### Supporting Files
- `src/lib/modules/item-type-mapper.ts` - Updated mapping for insights
- `src/lib/create-actions-registry.ts` - Updated create action for objectives

## Mock Data Examples

### Insights Module Objectives
The mock data now includes industry-agnostic strategic objectives:
1. **Increase Customer Satisfaction Score** - 90% target (service quality)
2. **Reduce Operational Costs** - 15% reduction (efficiency)
3. **Expand Market Presence** - 3 new markets (growth)

These examples work across any industry: manufacturing, services, tech, healthcare, etc.

## Migration Guide

### For Developers
1. Update any imports from `@/components/goals/*` to `@/components/insights/*`
2. Change component names: `Goals*` → `Objectives*`
3. Update module references from `goals` to `insights`

### For Users
1. The "Goals" module is now "Insights" in navigation
2. All existing goals data will be preserved (database schema unchanged)
3. New terminology: "Goals" → "Objectives", "OKRs" → "Key Results"

## Next Steps

### Recommended Implementation Priority
1. ✅ Core module rename (Goals → Insights)
2. ✅ Tab registry updates
3. 🔄 Create placeholder components for new tabs
4. 📋 Implement Reports module tabs with appropriate mock data
5. 📋 Implement Analytics module tabs with appropriate mock data
6. 📋 Implement Insights module tabs with appropriate mock data
7. 📋 Database migrations (if schema changes needed)
8. 📋 I18n updates for new terminology

## Benefits

### Clarity & Organization
- Clear separation of concerns between the three modules
- No redundancy - each tab serves a unique purpose
- Logical progression: Analytics → Reports → Insights

### Scalability
- Easy to add industry-specific tabs within each module
- Extensible structure for future AI-powered features
- Supports both manual and automated data flows

### User Experience
- Intuitive navigation
- Consistent terminology
- Purpose-built views for each use case

---

**Last Updated**: October 12, 2025
**Status**: Core refactor complete, ready for component implementation
