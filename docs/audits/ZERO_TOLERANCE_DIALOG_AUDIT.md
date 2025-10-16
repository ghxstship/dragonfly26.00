# Zero Tolerance Dialog Normalization Audit
**Date:** January 15, 2025  
**Status:** IN PROGRESS  
**Mandate:** 100% Dialog Usage - NO Drawers for Create Actions

## Executive Summary

Complete repository audit to ensure ALL create/add/new actions use **Dialog components ONLY**. Zero tolerance for Drawer usage in create flows. Detail/view actions may use Drawers, but create actions must be Dialogs.

---

## CRITICAL VIOLATIONS FOUND

### Drawer Usage in Create Flows (MUST FIX)

**ZERO TOLERANCE VIOLATIONS - Using Drawer for Create:**
None found - all create flows either use Dialog or are missing entirely.

**Drawer Usage for Detail Views (ACCEPTABLE):**
1. `assets/inventory-tab.tsx` - InventoryItemDrawer (for viewing/editing existing items) ✅ OK
2. `marketplace/shop-tab.tsx` - MarketplaceCartDrawer, MarketplaceProductDetailDrawer ✅ OK  
3. `marketplace/products-tab.tsx` - MarketplaceCartDrawer, MarketplaceProductDetailDrawer ✅ OK
4. `marketplace/services-tab.tsx` - MarketplaceProductDetailDrawer ✅ OK

**Assessment:** All Drawer usage is for viewing/editing existing items, NOT for creating new ones. ✅ COMPLIANT

---

## TAB COMPONENT STATUS MATRIX

### ✅ FULLY COMPLIANT (Dialog Implemented & Working)

#### Admin Module (15 tabs)
1. ✅ admin/webhooks-tab.tsx - Dialog (lines 312-382)
2. ✅ admin/api-tokens-tab.tsx - Dialog (lines 287-395)
3. ✅ admin/recurrence-rules-tab.tsx - Dialog  
4. ✅ admin/checklist-templates-tab.tsx - Dialog
5. ✅ admin/custom-statuses-tab.tsx - Dialog
6. ✅ admin/automations-tab.tsx - Dialog
7. ℹ️ admin/members-management-tab.tsx - Drawer (but for EDITING, not creating)
8. ℹ️ admin/admin-overview-tab.tsx - Dashboard view (no create action needed)
9. ℹ️ admin/billing-tab.tsx - Read-only view
10. ℹ️ admin/integrations-tab.tsx - External connections
11. ℹ️ admin/organization-settings-tab.tsx - Settings form
12. ℹ️ admin/plugins-tab.tsx - Read-only catalog
13. ℹ️ admin/roles-permissions-tab.tsx - Configuration UI
14. ℹ️ admin/security-tab.tsx - Settings
15. ℹ️ admin/templates-tab.tsx - Needs review

#### Projects Module (2 tabs)
1. ✅ projects/projects-productions-tab.tsx - CreateItemDialogEnhanced
2. ✅ projects/projects-schedule-tab.tsx - CreateItemDialogEnhanced

#### Companies Module (2 tabs)
1. ✅ companies/companies-organizations-tab.tsx - CreateItemDialogEnhanced
2. ⚠️ companies/companies-contacts-tab.tsx - NEEDS DIALOG

#### Procurement Module (3 tabs)
1. ✅ procurement/procurement-orders-dashboard-tab.tsx - CreateItemDialogEnhanced
2. ⚠️ procurement/procurement-matching-tab.tsx - NEEDS REVIEW
3. ⚠️ procurement/procurement-receiving-tab.tsx - NEEDS REVIEW

#### Finance Module (6 tabs)
1. ✅ finance/finance-overview-tab.tsx - CreateItemDialogEnhanced
2. ⚠️ finance/finance-approvals-tab.tsx - NEEDS DIALOG
3. ⚠️ finance/finance-cash-flow-tab.tsx - NEEDS DIALOG
4. ⚠️ finance/finance-policies-tab.tsx - NEEDS DIALOG
5. ⚠️ finance/finance-scenarios-tab.tsx - NEEDS DIALOG
6. ⚠️ finance/finance-variance-tab.tsx - NEEDS DIALOG

#### Settings Module (1 tab)
1. ✅ settings/automations-tab.tsx - Dialog (lines 250-328)

#### Analytics Module (10 tabs)
1. ✅ analytics/analytics-custom-views-tab.tsx - CreateItemDialogEnhanced (JUST FIXED)
2. ⚠️ analytics/analytics-comparisons-tab.tsx - NEEDS DIALOG
3. ⚠️ analytics/analytics-data-sources-tab.tsx - NEEDS DIALOG
4. ⚠️ analytics/analytics-forecasting-tab.tsx - Read-only
5. ⚠️ analytics/analytics-metrics-library-tab.tsx - NEEDS DIALOG
6. ⚠️ analytics/analytics-overview-tab.tsx - Dashboard (no create needed)
7. ⚠️ analytics/analytics-performance-tab.tsx - Read-only
8. ⚠️ analytics/analytics-pivot-tables-tab.tsx - NEEDS DIALOG
9. ⚠️ analytics/analytics-realtime-tab.tsx - Read-only
10. ⚠️ analytics/analytics-trends-tab.tsx - Read-only

#### Assets Module (6 tabs)
1. ⚠️ assets/inventory-tab.tsx - Uses EnhancedTableView onCreate (needs verification)
2. ✅ assets/counts-tab.tsx - CreateItemDialogEnhanced (JUST FIXED)
3. ℹ️ assets/catalog-tab.tsx - Read-only global catalog (no create, copy only)
4. ⚠️ assets/assets-advances-tab.tsx - NEEDS DIALOG
5. ⚠️ assets/assets-approvals-tab.tsx - NEEDS DIALOG
6. ⚠️ assets/assets-maintenance-tab.tsx - NEEDS DIALOG

#### Community Module (8 tabs)
1. ℹ️ community/activity-tab.tsx - Inline post creation (social feed pattern - OK)
2. ⚠️ community/studios-tab.tsx - NEEDS DIALOG
3. ⚠️ community/connections-tab.tsx - NEEDS DIALOG  
4. ⚠️ community/discussions-tab.tsx - NEEDS DIALOG
5. ⚠️ community/events-tab.tsx - NEEDS DIALOG
6. ⚠️ community/competitions-tab.tsx - NEEDS DIALOG
7. ⚠️ community/showcase-tab.tsx - NEEDS DIALOG
8. ⚠️ community/news-tab.tsx - Read-only

#### Insights Module (9 tabs)
1. ⚠️ insights/insights-objectives-tab.tsx - NEEDS DIALOG
2. ⚠️ insights/insights-key-results-tab.tsx - NEEDS DIALOG
3. ⚠️ insights/insights-priorities-tab.tsx - NEEDS DIALOG
4. ⚠️ insights/insights-reviews-tab.tsx - NEEDS DIALOG
5. ⚠️ insights/insights-benchmarks-tab.tsx - NEEDS DIALOG
6. ⚠️ insights/insights-recommendations-tab.tsx - Read-only (AI generated)
7. ⚠️ insights/insights-intelligence-feed-tab.tsx - Read-only (AI generated)
8. ⚠️ insights/insights-progress-tracking-tab.tsx - Read-only dashboard
9. ⚠️ insights/insights-success-metrics-tab.tsx - Read-only dashboard
10. ⚠️ insights/insights-overview-tab.tsx - Dashboard

#### Marketplace Module (3 tabs)
1. ℹ️ marketplace/shop-tab.tsx - Uses Drawer for cart/details (acceptable)
2. ℹ️ marketplace/products-tab.tsx - Uses Drawer for cart/details (acceptable)
3. ℹ️ marketplace/services-tab.tsx - Uses Drawer for details (acceptable)

#### Dashboard Module (2 tabs)
1. ℹ️ dashboard/dashboard-my-advances-tab.tsx - Personal dashboard
2. ℹ️ dashboard/dashboard-my-agenda-tab.tsx - Personal dashboard

---

## REMEDIATION PRIORITY

### 🔴 CRITICAL (Broken Buttons - Phase 1) ✅ COMPLETE
- [x] projects/projects-productions-tab.tsx
- [x] companies/companies-organizations-tab.tsx
- [x] procurement/procurement-orders-dashboard-tab.tsx
- [x] finance/finance-overview-tab.tsx
- [x] projects/projects-schedule-tab.tsx

### 🟡 HIGH PRIORITY (Missing Create Dialogs - Phase 2)
- [ ] companies/companies-contacts-tab.tsx
- [ ] finance/finance-approvals-tab.tsx
- [ ] finance/finance-cash-flow-tab.tsx
- [ ] assets/assets-maintenance-tab.tsx
- [ ] insights/insights-objectives-tab.tsx
- [ ] insights/insights-key-results-tab.tsx
- [ ] insights/insights-priorities-tab.tsx

### 🟢 MEDIUM PRIORITY (Phase 3)
- [ ] analytics/analytics-data-sources-tab.tsx
- [ ] analytics/analytics-metrics-library-tab.tsx
- [ ] analytics/analytics-pivot-tables-tab.tsx
- [ ] community/studios-tab.tsx
- [ ] community/discussions-tab.tsx
- [ ] community/events-tab.tsx

### ⚪ LOW PRIORITY (Phase 4)
- [ ] All remaining tabs with create functionality
- [ ] Verify read-only tabs don't need create actions

---

## STANDARDIZED DIALOG PATTERN

**100% Compliance Required:**

```tsx
// 1. Imports (REQUIRED)
import { useState } from "react"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"
import { Plus } from "lucide-react"

// 2. State (REQUIRED)
const [createDialogOpen, setCreateDialogOpen] = useState(false)

// 3. Button (REQUIRED - Top-right position)
<Button onClick={() => setCreateDialogOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  {contextualLabel}
</Button>

// 4. Dialog Component (REQUIRED - End of JSX)
<CreateItemDialogEnhanced
  open={createDialogOpen}
  onOpenChange={setCreateDialogOpen}
  moduleId={moduleId}
  tabSlug={tabSlug}
  onSuccess={(item) => {
    console.log("Created item:", item)
  }}
/>
```

**PROHIBITED:**
```tsx
// ❌ NO DRAWER USAGE FOR CREATE
import { Drawer } from "@/components/ui/drawer"
setRightSidebarOpen(true, 'create-something') // ❌ NO SIDEBAR

// ❌ NO BUTTONS WITHOUT ONCLICK
<Button>Create</Button> // Must have onClick

// ❌ NO GENERIC LABELS
<Button>Create</Button> // Must be contextual: "New Production", etc.
```

---

## VERIFICATION CHECKLIST

For each tab component:
- [ ] Uses Dialog component (not Drawer) for create actions
- [ ] Button has onClick handler
- [ ] Dialog opens when button clicked
- [ ] Form fields are appropriate for the entity type
- [ ] Success callback handles creation
- [ ] Dialog closes on success
- [ ] No console errors
- [ ] Contextual button label (not generic)
- [ ] Proper moduleId/tabSlug passed to CreateItemDialogEnhanced

---

## COMPLIANCE METRICS

**Target:** 100% Dialog compliance  
**Current Status:**
- ✅ Compliant: 15 tabs
- 🔄 In Progress: 7 tabs (just fixed)
- ⚠️ Non-Compliant: ~30 tabs
- ℹ️ Not Applicable (read-only): ~12 tabs

**Completion:** ~33% (22/64 tabs)

---

## NEXT ACTIONS

1. **Immediate:** Fix all Phase 2 HIGH PRIORITY tabs (7 tabs)
2. **Short-term:** Complete Phase 3 MEDIUM PRIORITY (6 tabs)
3. **Long-term:** Systematic fix of all remaining tabs
4. **Final:** Run automated compliance check
5. **Deploy:** Push all changes and test in staging

---

## ENFORCEMENT

**Going Forward:**
1. Add ESLint rule to prevent Drawer imports in *-tab.tsx files
2. Add code review checklist item for create dialog verification
3. Update CONTRIBUTING.md with tab component standards
4. Create tab component template/generator
5. Add CI check for compliance

---

**Last Updated:** January 15, 2025  
**Audited By:** Cascade AI  
**Status:** Phase 1 Complete, Phase 2 In Progress
