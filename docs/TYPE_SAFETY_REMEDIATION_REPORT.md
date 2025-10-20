# TYPE SAFETY REMEDIATION REPORT
**Date:** 2025-10-20T12:46:15.845Z
**Script:** fix-type-safety-violations.js

## Summary

- **Total Files with Violations:** 216
- **Files Fixed (any types):** 200
- **Total Replacements:** 531
- **Files Fixed (return types):** 0
- **Files Fixed (prop types):** 18

## Violation Breakdown

### 'any' Types
- Files affected: 201
- Total occurrences: 532
- Files fixed: 200
- Replacements made: 531

### Missing Return Types
- Files affected: 210
- Files fixed: 0
- **Status:** Requires manual review for complex functions

### Missing Prop Types
- Files affected: 18
- Files fixed: 18
- **Status:** Interfaces created, props need to be defined

## Files Requiring Manual Review

### admin-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/admin-overview-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: Yes

### api-tokens-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/api-tokens-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### automations-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/automations-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### billing-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/billing-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### checklist-templates-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/checklist-templates-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: Yes

### custom-statuses-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/custom-statuses-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: Yes

### integrations-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/integrations-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### invite-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/members/invite-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: Yes

### members-management-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/members-management-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### organization-settings-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/organization-settings-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: Yes

### organization-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/organization-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### plugins-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/plugins-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### recurrence-rules-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/recurrence-rules-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### roles-permissions-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/roles-permissions-tab.tsx`
- 'any' types: 2
- Needs return types: No
- Needs prop types: Yes

### security-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/security-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: Yes

### templates-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/templates-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: Yes

### webhooks-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/webhooks-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### analytics-custom-views-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-custom-views-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### analytics-data-sources-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-data-sources-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### analytics-forecasting-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-forecasting-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### analytics-metrics-library-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-metrics-library-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### analytics-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-overview-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### analytics-performance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-performance-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### analytics-pivot-tables-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-pivot-tables-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### analytics-realtime-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-realtime-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### analytics-trends-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-trends-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### assets-advances-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-advances-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: Yes

### assets-approvals-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-approvals-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: Yes

### assets-maintenance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-maintenance-tab.tsx`
- 'any' types: 9
- Needs return types: Yes
- Needs prop types: No

### assets-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-overview-tab.tsx`
- 'any' types: 10
- Needs return types: Yes
- Needs prop types: No

### assets-tracking-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-tracking-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### catalog-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/catalog-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### counts-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/counts-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### inventory-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/inventory-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### tracking-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/tracking-tab.tsx`
- 'any' types: 16
- Needs return types: Yes
- Needs prop types: No

### activity-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/activity-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### competitions-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/competitions-tab.tsx`
- 'any' types: 6
- Needs return types: Yes
- Needs prop types: No

### connections-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/connections-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### discussions-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/discussions-tab.tsx`
- 'any' types: 6
- Needs return types: Yes
- Needs prop types: No

### events-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/events-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### news-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/news-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### showcase-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/showcase-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### studios-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/studios-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### companies-bids-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-bids-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-companies-compliance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-compliance-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-companies-invoices-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-invoices-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-companies-reviews-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-reviews-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-companies-work-orders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-work-orders-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-contacts-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-contacts-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### companies-deliverables-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-deliverables-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-documents-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-documents-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-organizations-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-organizations-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### companies-scopes-of-work-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-scopes-of-work-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### companies-subcontractor-profile-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-subcontractor-profile-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-advances-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-advances-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-agenda-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-agenda-tab.tsx`
- 'any' types: 7
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-assets-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-assets-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-expenses-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-expenses-tab.tsx`
- 'any' types: 4
- Needs return types: No
- Needs prop types: No

### dashboard-my-files-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-files-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-jobs-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-jobs-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-orders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-orders-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-reports-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-reports-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-tasks-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-tasks-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### dashboard-my-travel-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-travel-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### dashboard-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-overview-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### events-activities-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-activities-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-all-events-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-all-events-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-blocks-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-blocks-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-bookings-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-bookings-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-calendar-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-calendar-tab.tsx`
- 'any' types: 8
- Needs return types: Yes
- Needs prop types: No

### events-equipment-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-equipment-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-incidents-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-incidents-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-internal-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-internal-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-itineraries-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-itineraries-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-rehearsals-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-rehearsals-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-reservations-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-reservations-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-run-of-show-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-run-of-show-tab.tsx`
- 'any' types: 6
- Needs return types: Yes
- Needs prop types: No

### events-shipping-receiving-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-shipping-receiving-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### events-tours-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-tours-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### events-trainings-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-trainings-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-all-documents-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-all-documents-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-archive-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-archive-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-call-sheets-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-call-sheets-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-contracts-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-contracts-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-insurance-permits-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-insurance-permits-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-media-assets-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-media-assets-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-production-reports-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-production-reports-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-riders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-riders-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-shared-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-shared-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### files-tech-specs-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-tech-specs-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-accounts-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-accounts-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-approvals-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-approvals-tab.tsx`
- 'any' types: 3
- Needs return types: No
- Needs prop types: No

### finance-budgets-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-budgets-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-cash-flow-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-cash-flow-tab.tsx`
- 'any' types: 19
- Needs return types: Yes
- Needs prop types: No

### finance-expenses-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-expenses-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-forecasts-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-forecasts-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-gl-codes-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-gl-codes-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-invoices-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-invoices-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-overview-tab.tsx`
- 'any' types: 15
- Needs return types: Yes
- Needs prop types: No

### finance-payments-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-payments-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-payroll-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-payroll-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-policies-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-policies-tab.tsx`
- 'any' types: 6
- Needs return types: Yes
- Needs prop types: No

### finance-reconciliation-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-reconciliation-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-revenue-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-revenue-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-scenarios-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-scenarios-tab.tsx`
- 'any' types: 5
- Needs return types: No
- Needs prop types: No

### finance-taxes-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-taxes-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-transactions-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-transactions-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### finance-variance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-variance-tab.tsx`
- 'any' types: 2
- Needs return types: No
- Needs prop types: No

### insights-benchmarks-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-benchmarks-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### insights-intelligence-feed-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-intelligence-feed-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### insights-key-results-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-key-results-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### insights-objectives-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-objectives-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### insights-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-overview-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### insights-priorities-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-priorities-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### insights-progress-tracking-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-progress-tracking-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### insights-recommendations-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-recommendations-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### insights-reviews-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-reviews-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### insights-success-metrics-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-success-metrics-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: No

### jobs-active-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-active-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-archived-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-archived-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-checklists-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-checklists-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-completed-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-completed-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-dispatch-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-dispatch-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-estimates-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-estimates-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-jobs-compliance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-jobs-compliance-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-jobs-invoices-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-jobs-invoices-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-offers-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-offers-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-overview-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-pipeline-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-pipeline-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### jobs-recruiting-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-recruiting-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-rfps-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-rfps-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-shortlists-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-shortlists-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### jobs-work-orders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-work-orders-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-access-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-access-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-bim-models-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-bim-models-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-coordination-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-coordination-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-directory-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-directory-tab.tsx`
- 'any' types: 6
- Needs return types: Yes
- Needs prop types: No

### locations-logistics-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-logistics-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-site-maps-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-site-maps-tab.tsx`
- 'any' types: 8
- Needs return types: Yes
- Needs prop types: No

### locations-spatial-features-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-spatial-features-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-utilities-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-utilities-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### locations-warehousing-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-warehousing-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### favorites-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/favorites-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### lists-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/lists-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### orders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/orders-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### products-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/products-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### purchases-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/purchases-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### reviews-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/reviews-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### sales-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/sales-tab.tsx`
- 'any' types: 4
- Needs return types: Yes
- Needs prop types: No

### services-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/services-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### shop-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/shop-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### spotlight-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/spotlight-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### vendors-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/vendors-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### create-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/members/create-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-applicants-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-applicants-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-assignments-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-assignments-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-onboarding-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-onboarding-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-openings-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-openings-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-personnel-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-personnel-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-scheduling-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-scheduling-tab.tsx`
- 'any' types: 11
- Needs return types: Yes
- Needs prop types: No

### people-teams-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-teams-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-timekeeping-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-timekeeping-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### people-training-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-training-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### procurement-agreements-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-agreements-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-audits-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-audits-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-fulfillment-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-fulfillment-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-line-items-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-line-items-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-matching-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-matching-tab.tsx`
- 'any' types: 9
- Needs return types: Yes
- Needs prop types: No

### procurement-orders-dashboard-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-orders-dashboard-tab.tsx`
- 'any' types: 17
- Needs return types: Yes
- Needs prop types: No

### procurement-orders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-orders-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-overview-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-procurement-approvals-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-procurement-approvals-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### procurement-receiving-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-receiving-tab.tsx`
- 'any' types: 7
- Needs return types: Yes
- Needs prop types: No

### procurement-requisitions-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-requisitions-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### access-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/access-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### basic-info-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/basic-info-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: Yes

### certifications-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/certifications-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### emergency-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/emergency-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: Yes

### endorsements-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/endorsements-tab.tsx`
- 'any' types: 7
- Needs return types: Yes
- Needs prop types: No

### health-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/health-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: Yes

### history-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/history-tab.tsx`
- 'any' types: 9
- Needs return types: Yes
- Needs prop types: No

### performance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/performance-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### professional-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/professional-tab.tsx`
- 'any' types: 6
- Needs return types: Yes
- Needs prop types: No

### social-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/social-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: Yes

### tags-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/tags-tab.tsx`
- 'any' types: 9
- Needs return types: Yes
- Needs prop types: Yes

### travel-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/travel-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: Yes

### projects-activations-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-activations-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-compliance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-compliance-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-costs-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-costs-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-milestones-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-milestones-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-overview-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-productions-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-productions-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### projects-projects-checklists-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-projects-checklists-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-projects-work-orders-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-projects-work-orders-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-safety-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-safety-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### projects-schedule-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-schedule-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### projects-tasks-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-tasks-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### reports-archived-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-archived-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### reports-compliance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-compliance-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### reports-custom-builder-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-custom-builder-tab.tsx`
- 'any' types: 3
- Needs return types: Yes
- Needs prop types: No

### reports-executive-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-executive-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### reports-exports-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-exports-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### reports-operational-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-operational-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### reports-overview-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-overview-tab.tsx`
- 'any' types: 1
- Needs return types: No
- Needs prop types: No

### reports-scheduled-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-scheduled-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### reports-templates-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-templates-tab.tsx`
- 'any' types: 2
- Needs return types: Yes
- Needs prop types: No

### resources-courses-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-courses-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### resources-glossary-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-glossary-tab.tsx`
- 'any' types: 8
- Needs return types: Yes
- Needs prop types: No

### resources-grants-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-grants-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### resources-guides-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-guides-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### resources-library-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-library-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No

### resources-publications-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-publications-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### resources-troubleshooting-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-troubleshooting-tab.tsx`
- 'any' types: 5
- Needs return types: Yes
- Needs prop types: No

### account-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/account-tab.tsx`
- 'any' types: 0
- Needs return types: Yes
- Needs prop types: Yes

### appearance-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/appearance-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: Yes

### team-tab.tsx
- Path: `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/team-tab.tsx`
- 'any' types: 1
- Needs return types: Yes
- Needs prop types: No


## Next Steps

1. **Review Automated Changes**
   - All 'any' types replaced with 'unknown'
   - Review each usage and replace with specific types

2. **Add Explicit Return Types**
   - Review functions without return types
   - Add appropriate return type annotations
   - Consider using TypeScript's inference where appropriate

3. **Complete Prop Interfaces**
   - Fill in prop type definitions
   - Add JSDoc comments for prop documentation
   - Consider using React.ComponentProps for complex cases

4. **Enable Strict Mode**
   - Update tsconfig.json: `"strict": true`
   - Fix any new errors that appear
   - Consider enabling additional strict flags

5. **Verify Changes**
   - Run: `npm run type-check`
   - Run: `npm run lint`
   - Re-run audit script
   - Target: 100% type safety score

## TypeScript Best Practices

- Prefer `unknown` over `any` for truly dynamic types
- Use type guards to narrow `unknown` types
- Add explicit return types to public APIs
- Use `interface` for object shapes, `type` for unions
- Enable `noImplicitAny` and `strictNullChecks`
- Leverage TypeScript's type inference where safe

## Certification Requirements

To achieve A+ (100%) type safety:
- ✅ Zero 'any' types (use 'unknown' with type guards)
- ✅ All functions have explicit return types
- ✅ All components have typed props
- ✅ TypeScript strict mode enabled
- ✅ Zero TypeScript errors
- ✅ Proper use of generics where applicable
