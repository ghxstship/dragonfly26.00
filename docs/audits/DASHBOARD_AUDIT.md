# Dashboard Module Full Stack Integration Audit

**Date**: October 13, 2025  
**Status**: 🔴 Critical - All tabs using mock data

---

## Executive Summary

All 11 dashboard tabs are currently displaying **hardcoded mock data** with **non-functional buttons**. While the UI is complete and polished, there is **zero integration** with the Supabase backend.

---

## Detailed Audit by Tab

### ✅ Database Tables Available
The following tables exist in the database and can support live data:
- ✅ `events` - For My Agenda
- ✅ `project_tasks` - For My Tasks  
- ✅ `personnel_assignments` - For My Jobs
- ✅ `assets` - For My Assets
- ✅ `marketplace_orders` - For My Orders
- ✅ `production_advances` - For My Advances
- ✅ `expense_reports` + `expense_items` - For My Expenses
- ✅ `files` - For My Files (needs verification)
- ✅ `report_templates` - For My Reports
- ⚠️ Travel data structure needs creation

---

## Tab-by-Tab Status

### 1. Overview Tab (`dashboard-overview-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All stats are hardcoded (tasks, events, jobs, expenses)
- ✗ Quick action buttons have no onClick handlers
- ✗ Widget customization buttons don't work
- ✗ "This Week's Summary" shows fake numbers

**Database Queries Needed**:
```sql
-- Count tasks due today for user
-- Count upcoming events for user
-- Count active jobs for user
-- Sum pending expenses for user
-- Weekly activity aggregations
```

**Non-Functional Buttons**:
- Log Expense
- Book Travel
- Create Task
- Upload File
- Add Widget buttons (6 widgets)

---

### 2. My Agenda Tab (`dashboard-my-agenda-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All events are hardcoded
- ✗ "New Event" button has no onClick
- ✗ Week overview chart uses fake data
- ✗ Event cards not clickable to view details

**Hook Exists**: ✅ `useMyAgenda` in `use-dashboard-data.ts` (NOT USED!)

**Database Query Available**:
```typescript
.from('events')
.eq('workspace_id', workspaceId)
.or(`created_by.eq.${userId},attendees.cs.{${userId}}`)
```

**Non-Functional Buttons**:
- New Event
- Event detail chevron buttons (6 events)

---

### 3. My Tasks Tab (`dashboard-my-tasks-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All tasks are hardcoded  
- ✗ "New Task" and "Filter" buttons non-functional
- ✗ Checkboxes don't update task status
- ✗ Progress bars show fake completion %

**Hook Exists**: ✅ `useMyTasks` in `use-dashboard-data.ts` (NOT USED!)

**Database Query Available**:
```typescript
.from('project_tasks')
.eq('workspace_id', workspaceId)
.or(`assignee_id.eq.${userId},created_by.eq.${userId}}`)
```

**Non-Functional Buttons**:
- Filter
- New Task
- Task checkboxes (7 tasks)

---

### 4. My Jobs Tab (`dashboard-my-jobs-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All job contracts are hardcoded
- ✗ "New Contract" button non-functional
- ✗ Contract detail buttons don't work
- ✗ Progress bars show fake %

**Database Table**: `personnel_assignments`

**Query Needed**:
```sql
SELECT pa.*, p.name as production_name, c.name as client_name
FROM personnel_assignments pa
LEFT JOIN productions p ON p.id = pa.production_id
LEFT JOIN companies c ON c.id = pa.client_id
WHERE pa.personnel_id = (SELECT id FROM personnel WHERE user_id = auth.uid())
```

**Non-Functional Buttons**:
- New Contract
- Detail chevron buttons (5 jobs)
- Document buttons (5 jobs)

---

### 5. My Assets Tab (`dashboard-my-assets-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All assets hardcoded
- ✗ "Search" and "Add Asset" buttons non-functional
- ✗ Assets not clickable for details
- ✗ Need to filter assets by ownership

**Database Table**: `assets`

**Query Needed**:
```sql
SELECT a.*, l.name as location_name
FROM assets a
LEFT JOIN locations l ON l.id = a.location_id
WHERE a.workspace_id = ? 
AND (a.owner_id = auth.uid() OR a.assigned_to = auth.uid())
```

**Note**: May need to add `owner_id` or `assigned_to` field to assets table

**Non-Functional Buttons**:
- Search
- Add Asset
- Asset cards (6 assets - all clickable)

---

### 6. My Orders Tab (`dashboard-my-orders-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All orders hardcoded
- ✗ "Search" and "New Order" buttons non-functional
- ✗ Order cards not clickable for tracking

**Database Table**: `marketplace_orders`

**Query Needed**:
```sql
SELECT mo.*, oi.product_name, oi.quantity
FROM marketplace_orders mo
LEFT JOIN order_items oi ON oi.order_id = mo.id  
WHERE mo.workspace_id = ? AND mo.buyer_id = auth.uid()
ORDER BY mo.created_at DESC
```

**Non-Functional Buttons**:
- Search
- New Order
- Order cards (5 orders)

---

### 7. My Advances Tab (`dashboard-my-advances-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All production advances hardcoded
- ✗ "Request Advance" button non-functional
- ✗ Detail buttons don't work
- ✗ Return progress bars show fake data

**Database Table**: `production_advances`

**Query Needed**:
```sql
SELECT pa.*, p.name as production_name
FROM production_advances pa
LEFT JOIN productions p ON p.id = pa.production_id
WHERE pa.workspace_id = ? AND pa.requested_by = auth.uid()
ORDER BY pa.created_at DESC
```

**Non-Functional Buttons**:
- Request Advance
- Detail buttons (5 advances)

---

### 8. My Travel Tab (`dashboard-my-travel-tab.tsx`)
**Status**: 🔴 100% Mock Data + Missing Table

**Issues**:
- ✗ All travel arrangements hardcoded
- ✗ "Book Travel" button non-functional
- ✗ Travel cards not clickable
- ⚠️ **No `travel_arrangements` table exists**

**Database Table**: ❌ Does not exist

**Table Creation Needed**:
```sql
CREATE TABLE travel_arrangements (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  user_id UUID REFERENCES auth.users(id),
  production_id UUID REFERENCES productions(id),
  title TEXT,
  destination TEXT,
  departure_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ,
  status TEXT,
  flight_details JSONB,
  hotel_details JSONB,
  ground_transport JSONB,
  total_cost DECIMAL,
  purpose TEXT,
  created_at TIMESTAMPTZ
);
```

**Non-Functional Buttons**:
- Book Travel
- Travel cards (4 trips)

---

### 9. My Expenses Tab (`dashboard-my-expenses-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All expense reports hardcoded
- ✗ "Filter" and "New Expense" buttons non-functional
- ✗ Expense items in details accordion are fake

**Hook Exists**: ✅ `useMyExpenses` in `use-dashboard-data.ts` (NOT USED!)

**Database Tables**: `expense_reports` + `expense_items`

**Query Available**:
```typescript
.from('financial_transactions')
.eq('workspace_id', workspaceId)
.eq('created_by', userId)
.eq('type', 'expense')
```

**Better Query Needed**:
```sql
SELECT er.*, 
  (SELECT json_agg(ei.*) FROM expense_items ei WHERE ei.expense_report_id = er.id) as items
FROM expense_reports er
WHERE er.workspace_id = ? AND er.submitted_by = auth.uid()
ORDER BY er.submitted_date DESC
```

**Non-Functional Buttons**:
- Filter
- New Expense
- Expense report cards (5 reports)

---

### 10. My Reports Tab (`dashboard-my-reports-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All reports hardcoded
- ✗ "Create Report" button non-functional
- ✗ "Download" and "View" buttons don't work
- ✗ Quick action buttons non-functional
- ✗ Favorite toggle doesn't persist

**Database Table**: `report_templates`

**Query Needed**:
```sql
SELECT rt.*
FROM report_templates rt
WHERE rt.workspace_id = ? AND rt.created_by = auth.uid()
ORDER BY rt.created_at DESC
```

**Additional Table Needed**: `user_report_favorites`

**Non-Functional Buttons**:
- Create Report
- Download buttons (6 reports)
- View buttons (6 reports)
- Quick action buttons (4 templates)

---

### 11. My Files Tab (`dashboard-my-files-tab.tsx`)
**Status**: 🔴 100% Mock Data

**Issues**:
- ✗ All files hardcoded
- ✗ "Search" and "Upload File" buttons non-functional
- ✗ "Download" and "View" buttons don't work
- ✗ Favorite toggle doesn't persist
- ✗ File activity stats are fake

**Database Table**: `files` (assumed to exist)

**Query Needed**:
```sql
SELECT f.*, p.name as production_name
FROM files f
LEFT JOIN productions p ON p.id = f.production_id
WHERE f.workspace_id = ?
AND (f.uploaded_by = auth.uid() OR auth.uid() = ANY(f.shared_with))
ORDER BY f.created_at DESC
```

**Non-Functional Buttons**:
- Search
- Upload File
- Download buttons (8 files)
- View buttons (8 files)

---

## Summary Statistics

### Coverage
- **Total Tabs**: 11
- **Tabs with Mock Data**: 11 (100%)
- **Tabs with Working Buttons**: 0 (0%)
- **Database Hooks Available**: 3 (used in 0 tabs)
- **Database Tables Available**: 9/11 (82%)
- **Tables Missing**: 2 (travel_arrangements, user_report_favorites)

### Non-Functional UI Elements
- **Total Buttons**: ~75+
- **Working Buttons**: 0
- **Total Data Points**: ~300+
- **Real Data Points**: 0

---

## Implementation Priority

### Phase 1: Critical Data Integration (P0)
1. ✅ Wire up existing hooks to My Agenda, My Tasks, My Expenses
2. Create hooks for My Jobs, My Assets, My Orders, My Advances
3. Update Overview tab to aggregate real data

### Phase 2: Missing Infrastructure (P0)
1. Create `travel_arrangements` table migration
2. Create `user_report_favorites` table  
3. Verify `files` table structure
4. Add user ownership fields to `assets` if needed

### Phase 3: Button Functionality (P1)
1. Implement "New X" button modals for all tabs
2. Add navigation to detail views
3. Implement Filter functionality
4. Add file download handlers

### Phase 4: Polish (P2)
1. Add optimistic UI updates
2. Implement proper error handling
3. Add loading skeletons
4. Real-time subscriptions for live updates

---

## Technical Debt

### Code Quality Issues
1. **No separation of concerns**: Mock data embedded in components
2. **No error boundaries**: Will crash on data fetch failures
3. **No loading states**: UI will be blank during fetch
4. **No type safety**: Using `any[]` for data types
5. **Duplicated logic**: Each tab reimplements similar patterns

### Recommended Refactoring
1. Extract all data fetching to custom hooks
2. Create shared types for all dashboard data structures
3. Build reusable card/list components
4. Implement a unified dashboard data provider
5. Add proper TypeScript interfaces

---

## Files Requiring Changes

### Hooks to Create/Update
- `/src/hooks/use-dashboard-data.ts` - Extend with all tab hooks
- `/src/hooks/use-jobs-data.ts` - New
- `/src/hooks/use-assets-data.ts` - New  
- `/src/hooks/use-orders-data.ts` - New
- `/src/hooks/use-advances-data.ts` - New
- `/src/hooks/use-travel-data.ts` - New
- `/src/hooks/use-reports-data.ts` - New
- `/src/hooks/use-files-data.ts` - New

### Components to Update (all 11)
- `/src/components/dashboard/dashboard-overview-tab.tsx`
- `/src/components/dashboard/dashboard-my-agenda-tab.tsx`
- `/src/components/dashboard/dashboard-my-tasks-tab.tsx`
- `/src/components/dashboard/dashboard-my-jobs-tab.tsx`
- `/src/components/dashboard/dashboard-my-assets-tab.tsx`
- `/src/components/dashboard/dashboard-my-orders-tab.tsx`
- `/src/components/dashboard/dashboard-my-advances-tab.tsx`
- `/src/components/dashboard/dashboard-my-travel-tab.tsx`
- `/src/components/dashboard/dashboard-my-expenses-tab.tsx`
- `/src/components/dashboard/dashboard-my-reports-tab.tsx`
- `/src/components/dashboard/dashboard-my-files-tab.tsx`

### Database Migrations to Create
- `022_travel_arrangements_table.sql`
- `023_user_report_favorites.sql`
- `024_add_user_ownership_to_assets.sql` (if needed)

---

## Estimated Effort

- **Phase 1**: 8-12 hours
- **Phase 2**: 4-6 hours
- **Phase 3**: 12-16 hours
- **Phase 4**: 8-10 hours

**Total**: 32-44 hours of development work

---

## Next Steps

1. ✅ Complete audit (DONE)
2. Create database migrations for missing tables
3. Extend `use-dashboard-data.ts` with all hooks
4. Wire up components one by one
5. Test each tab thoroughly
6. Add button click handlers
7. Implement create/edit modals
8. Final integration testing
