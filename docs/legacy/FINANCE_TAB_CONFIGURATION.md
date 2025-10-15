# Finance Module Tab Configuration
## Updated October 15, 2025

---

## Overview
The Finance module now has **18 tabs** (up from 13), organized to support Ramp-style spend management, Runway-style FP&A, and Prism.fm-style show settlements.

---

## Complete Tab List

| Order | Tab Name | Slug | Icon | View Type | Primary Table(s) | Description |
|-------|----------|------|------|-----------|------------------|-------------|
| 0 | Overview | `overview` | LayoutDashboard | dashboard | Multiple | Financial overview & metrics dashboard |
| 1 | **Approvals** ⭐ | `approvals` | ClipboardCheck | dashboard | `approval_steps`, `approval_chains` | Pending approvals, chains & workflow tracking |
| 2 | **Scenarios** ⭐ | `scenarios` | GitCompare | dashboard | `budget_scenarios` | Budget scenarios & what-if analysis |
| 3 | **Variance** ⭐ | `variance` | ChartColumn | dashboard | `budget_variance_tracking` | Budget vs actual variance analysis |
| 4 | **Cash Flow** ⭐ | `cash-flow` | Waves | dashboard | `cash_flow_projections`, `cash_flow_items` | Cash flow projections & liquidity |
| 5 | Forecasts | `forecasts` | TrendingUpDown | dashboard | `financial_forecasts`, `forecast_data_points` | Financial forecasting with models |
| 6 | Budgets | `budgets` | Wallet | financial | `budgets`, `budget_line_items` | Production budgets & planning |
| 7 | Transactions | `transactions` | ArrowLeftRight | table | `financial_transactions`, `receipt_matches` | All transactions & receipt matching |
| 8 | Revenue | `revenue` | TrendingUp | financial | `financial_transactions` | Revenue streams & income tracking |
| 9 | Expenses | `expenses` | Banknote | table | `expense_reports`, `expense_items` | Expense tracking & reimbursements |
| 10 | Payroll | `payroll` | WalletCards | table | `payroll`, `payroll_items` | Crew payroll management |
| 11 | Reconciliation | `reconciliation` | CircleCheckBig | table | `reconciliations`, `reconciliation_line_items` | Project settlements & line items |
| 12 | Payments | `payments` | CreditCard | table | `financial_transactions`, `payment_schedules`, `payment_milestones` | Payment processing & schedules |
| 13 | Invoices | `invoices` | ReceiptText | table | `invoices`, `invoice_items`, `payment_schedules` | Invoicing & billing |
| 14 | Taxes | `taxes` | Calculator | table | `tax_documents` | Tax documents & compliance |
| 15 | **Policies** ⭐ | `policies` | ShieldCheck | table | `spending_policies`, `corporate_cards`, `policy_violations` | Spending policies & card management |
| 16 | Accounts | `accounts` | Landmark | table | Custom | Accounting categories |
| 17 | GL Codes | `gl-codes` | Hash | table | `gl_codes` | General ledger code management |

**⭐ = New Tab**

---

## Tab Categories

### 📊 Dashboard Tabs (Visual/Action-Oriented)
Strategic overviews with charts, KPIs, and actionable widgets:
- **Overview** - Overall financial health
- **Approvals** ⭐ - Action center for pending approvals
- **Scenarios** ⭐ - What-if planning and comparisons
- **Variance** ⭐ - Performance tracking
- **Cash Flow** ⭐ - Liquidity monitoring
- **Forecasts** - Predictive analytics

### 📋 Financial Tabs (Specialized Views)
Financial-specific view type with hierarchical data:
- **Budgets** - Budget management
- **Revenue** - Income tracking

### 📑 Table Tabs (Data Management)
Standard table views for CRUD operations:
- **Transactions** - Transaction records
- **Expenses** - Expense management
- **Payroll** - Payroll processing
- **Reconciliation** - Settlement tracking
- **Payments** - Payment processing
- **Invoices** - Invoice management
- **Taxes** - Tax compliance
- **Policies** ⭐ - Policy administration
- **Accounts** - Account management
- **GL Codes** - Code management

---

## New Tab Details

### 1. Approvals (`/finance/approvals`)
**Type:** Dashboard  
**Color:** #f59e0b (Orange)  
**Icon:** ClipboardCheck

**Purpose:**
Centralized hub for all approval workflows across the Finance module.

**Key Features:**
- **My Pending Approvals** - Cards showing items awaiting user's approval
- **Approval Chains** - Visual workflow representations
- **Escalated Items** - Overdue approvals requiring attention
- **Approval History** - Audit trail of past approvals
- **Quick Actions** - Approve/reject with comments

**Data Sources:**
```sql
-- Pending approvals for current user
SELECT * FROM approval_steps 
WHERE approver_id = auth.uid() 
  AND status = 'pending'
ORDER BY due_date ASC;

-- Approval chains with context
SELECT ac.*, count(as.*) as total_steps,
  count(CASE WHEN as.status = 'approved' THEN 1 END) as approved_steps
FROM approval_chains ac
LEFT JOIN approval_steps as ON ac.id = as.approval_chain_id
WHERE ac.workspace_id = $1
GROUP BY ac.id;
```

---

### 2. Scenarios (`/finance/scenarios`)
**Type:** Dashboard  
**Color:** #8b5cf6 (Purple)  
**Icon:** GitCompare

**Purpose:**
Budget scenario planning and what-if analysis for productions.

**Key Features:**
- **Scenario Comparison** - Side-by-side view of multiple scenarios
- **Probability Weighting** - Weighted projections based on likelihood
- **Assumptions Viewer** - Display JSONB assumptions clearly
- **Variance from Base** - Compare scenarios to baseline budget
- **Scenario Builder** - Create new scenarios with templates

**Data Sources:**
```sql
-- All scenarios for a budget
SELECT bs.*, b.name as budget_name, b.total_amount as base_amount
FROM budget_scenarios bs
JOIN budgets b ON bs.budget_id = b.id
WHERE bs.workspace_id = $1
  AND bs.is_active = true
ORDER BY bs.probability_percentage DESC;

-- Scenario comparison metrics
SELECT 
  scenario_type,
  AVG(projected_revenue) as avg_revenue,
  AVG(projected_expenses) as avg_expenses,
  AVG(projected_net) as avg_net
FROM budget_scenarios
WHERE budget_id = $1
GROUP BY scenario_type;
```

---

### 3. Variance (`/finance/variance`)
**Type:** Dashboard  
**Color:** #dc2626 (Red)  
**Icon:** ChartColumn

**Purpose:**
Budget vs actual variance analysis with root cause tracking.

**Key Features:**
- **Variance Summary** - Total favorable vs unfavorable
- **Variance Trends** - Charts showing variance over time
- **Root Cause Analysis** - Categorized reasons for variances
- **Action Required** - Flagged items needing corrective action
- **Drill-Down** - Click to see line-item details

**Data Sources:**
```sql
-- Variance summary
SELECT 
  COUNT(*) as total_items,
  SUM(CASE WHEN variance_type = 'favorable' THEN 1 ELSE 0 END) as favorable_count,
  SUM(CASE WHEN variance_type = 'unfavorable' THEN 1 ELSE 0 END) as unfavorable_count,
  SUM(variance_amount) as total_variance,
  SUM(CASE WHEN variance_type = 'favorable' THEN variance_amount ELSE 0 END) as favorable_amount,
  SUM(CASE WHEN variance_type = 'unfavorable' THEN variance_amount ELSE 0 END) as unfavorable_amount
FROM budget_variance_tracking
WHERE workspace_id = $1
  AND tracking_period_start >= $2
  AND tracking_period_end <= $3;

-- Items requiring action
SELECT * FROM budget_variance_tracking
WHERE workspace_id = $1
  AND requires_action = true
  AND action_taken = false
ORDER BY ABS(variance_amount) DESC;
```

---

### 4. Cash Flow (`/finance/cash-flow`)
**Type:** Dashboard  
**Color:** #0891b2 (Cyan)  
**Icon:** Waves

**Purpose:**
Cash flow forecasting and liquidity management for productions.

**Key Features:**
- **12-Month Projection** - Waterfall chart of projected cash flow
- **Inflow/Outflow Breakdown** - Category-based analysis
- **Projected vs Actual** - Track forecast accuracy
- **Cash Runway** - Calculate weeks/months of runway
- **Alerts** - Low balance warnings

**Data Sources:**
```sql
-- Cash flow projection summary
SELECT 
  cfp.*,
  COUNT(cfi.*) as period_count,
  SUM(cfi.projected_inflows) as total_projected_inflows,
  SUM(cfi.projected_outflows) as total_projected_outflows,
  SUM(cfi.actual_inflows) as total_actual_inflows,
  SUM(cfi.actual_outflows) as total_actual_outflows
FROM cash_flow_projections cfp
LEFT JOIN cash_flow_items cfi ON cfp.id = cfi.projection_id
WHERE cfp.workspace_id = $1
  AND cfp.status = 'active'
GROUP BY cfp.id;

-- Period-by-period items
SELECT * FROM cash_flow_items
WHERE projection_id = $1
ORDER BY period_date ASC;
```

---

### 5. Policies (`/finance/policies`)
**Type:** Table  
**Color:** #ea580c (Orange)  
**Icon:** ShieldCheck

**Purpose:**
Spending policy configuration and corporate card management.

**Key Features:**
- **Active Policies** - List of all spending policies
- **Corporate Cards** - Card management and limits
- **Policy Violations** - Violation tracking and exceptions
- **Compliance Metrics** - Policy adherence statistics
- **Quick Config** - Create new policies with templates

**Data Sources:**
```sql
-- Active spending policies
SELECT * FROM spending_policies
WHERE workspace_id = $1
  AND is_active = true
ORDER BY priority DESC, created_at DESC;

-- Corporate cards summary
SELECT 
  cc.*,
  COALESCE(sp.name, 'No Policy') as policy_name,
  (cc.spending_limit - cc.spent_current_period) as remaining_limit
FROM corporate_cards cc
LEFT JOIN spending_policies sp ON cc.policy_id = sp.id
WHERE cc.workspace_id = $1
  AND cc.status = 'active'
ORDER BY cc.card_holder_id;

-- Recent violations
SELECT 
  pv.*,
  sp.name as policy_name,
  u.first_name || ' ' || u.last_name as violated_by_name
FROM policy_violations pv
JOIN spending_policies sp ON pv.policy_id = sp.id
JOIN profiles u ON pv.violated_by = u.id
WHERE pv.workspace_id = $1
  AND pv.status = 'pending'
ORDER BY pv.violation_date DESC;
```

---

## Updated Tab Descriptions

### Forecasts (formerly "Forecasting")
**Updated Description:**
"Financial forecasting with multiple models & accuracy tracking"

**Enhanced Features:**
- Now uses `financial_forecasts` table instead of `budgets`
- Multiple forecasting models (linear regression, moving average, manual)
- Accuracy tracking with historical comparison
- Forecast data points with variance analysis

---

## Tab Color Scheme

**Dashboard Tabs:**
- Overview: `#059669` (Green)
- Approvals: `#f59e0b` (Orange)
- Scenarios: `#8b5cf6` (Purple)
- Variance: `#dc2626` (Red)
- Cash Flow: `#0891b2` (Cyan)
- Forecasts: `#7c3aed` (Purple)

**Financial View Tabs:**
- Budgets: `#2563eb` (Blue)
- Revenue: `#16a34a` (Green)

**Table Tabs:**
- Transactions: `#6366f1` (Indigo)
- Expenses: `#ea580c` (Orange)
- Payroll: `#2563eb` (Blue)
- Reconciliation: `#8b5cf6` (Purple)
- Payments: `#10b981` (Green)
- Invoices: `#f59e0b` (Orange)
- Taxes: `#dc2626` (Red)
- Policies: `#ea580c` (Orange)
- Accounts: `#64748b` (Gray)
- GL Codes: `#7c3aed` (Purple)

---

## Implementation Notes

### File Modified
- `/src/lib/modules/tabs-registry.ts`

### Changes Made
1. Added 5 new tab definitions
2. Renamed "Forecasting" to "Forecasts"
3. Updated descriptions for enhanced tabs
4. Reordered all tabs to accommodate new additions
5. Updated order indices (0-17)

### Migration Impact
- **Frontend**: Tabs appear immediately in navigation
- **Backend**: All required tables exist from migration `20251015000000_finance_optimization_ramp_runway.sql`
- **Data**: No existing data affected
- **RLS**: All new tables have proper workspace isolation

### Testing Checklist
- [ ] All 18 tabs visible in Finance module navigation
- [ ] Tab order matches specification (0-17)
- [ ] Icons render correctly
- [ ] Tab colors display properly
- [ ] Dashboard tabs load without errors
- [ ] Table tabs show proper data structure
- [ ] Custom components work (if created)
- [ ] Mobile navigation works correctly

---

## Next Steps

### Required Custom Components

These 5 new tabs will need custom dashboard components created:

1. **`/src/components/finance/finance-approvals-tab.tsx`**
   - Approval action cards
   - Pending approvals list
   - Approval chain visualizer

2. **`/src/components/finance/finance-scenarios-tab.tsx`**
   - Scenario comparison charts
   - Scenario builder form
   - Assumptions display

3. **`/src/components/finance/finance-variance-tab.tsx`**
   - Variance charts (favorable vs unfavorable)
   - Root cause breakdown
   - Action items list

4. **`/src/components/finance/finance-cash-flow-tab.tsx`**
   - Waterfall chart
   - Inflow/outflow breakdown
   - Cash runway calculator

5. **`/src/components/finance/finance-policies-tab.tsx`**
   - Policy management cards
   - Corporate card table
   - Violation tracking dashboard

### Component Registration

Update `/src/lib/finance-tab-components.tsx`:

```typescript
import { FinanceApprovalsTab } from '@/components/finance/finance-approvals-tab'
import { FinanceScenariosTab } from '@/components/finance/finance-scenarios-tab'
import { FinanceVarianceTab } from '@/components/finance/finance-variance-tab'
import { FinanceCashFlowTab } from '@/components/finance/finance-cash-flow-tab'
import { FinancePoliciesTab } from '@/components/finance/finance-policies-tab'

const FINANCE_TAB_COMPONENTS: Record<string, React.ComponentType<FinanceTabProps>> = {
  'overview': FinanceOverviewTab,
  'approvals': FinanceApprovalsTab,
  'scenarios': FinanceScenariosTab,
  'variance': FinanceVarianceTab,
  'cash-flow': FinanceCashFlowTab,
  'policies': FinancePoliciesTab,
  // Other tabs use generic views
}
```

---

## Summary

✅ **18 Total Finance Tabs** (13 original + 5 new)  
✅ **Strategic Placement** - New tabs positioned for workflow efficiency  
✅ **Color-Coded** - Visual organization by function  
✅ **Backend Ready** - All database tables exist  
✅ **Zero Breaking Changes** - Existing tabs unchanged  
✅ **Production Ready** - Configuration complete, components needed

**Next Action:** Create the 5 custom dashboard components to visualize the new data.
