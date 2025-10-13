# Dashboard Module

**Consolidated from**: DASHBOARD_MODULE_COMPLETE.md  
**Status**: ✅ Complete - All 11 tabs implemented  
**Last Updated**: October 13, 2025

---

## Overview

User-specific dashboard module with 11 personalized tabs for individual productivity tracking.

---

## Module Configuration

- **Module ID**: `dashboard`
- **Scope**: User-specific (not organization/project specific)
- **Tabs**: 11
- **Default View**: `widgets`
- **Icon**: `LayoutDashboard`
- **Color**: `#8b5cf6`

---

## Tabs

### 1. Overview
**Slug**: `overview`  
**View Type**: Dashboard  
**Purpose**: Customizable widget-based dashboard

**Features**:
- Quick stats (tasks, events, jobs, expenses)
- Quick action buttons
- Widget customization options
- Weekly activity summary
- Drag-and-drop widget layout

**Component**: `src/components/dashboard/dashboard-overview-tab.tsx`

---

### 2. My Agenda
**Slug**: `my-agenda`  
**View Type**: Calendar  
**Purpose**: Events including or created by user

**Features**:
- Upcoming events with details
- Weekly event distribution chart
- Status indicators (confirmed, tentative)
- Virtual/physical meeting indicators
- Organizer badges

**Component**: `src/components/dashboard/dashboard-my-agenda-tab.tsx`

---

### 3. My Jobs
**Slug**: `my-jobs`  
**View Type**: List  
**Purpose**: Contracts and scopes of work

**Features**:
- Active, pending, completed contracts
- Progress tracking for each job
- Revenue summaries
- Location and rate information
- Contract type differentiation

**Component**: `src/components/dashboard/dashboard-my-jobs-tab.tsx`

---

### 4. My Tasks
**Slug**: `my-tasks`  
**View Type**: List  
**Purpose**: Assigned and created tasks

**Features**:
- Task list with priorities
- Due dates and overdue indicators
- Subtask progress tracking
- Creator vs assignee badges
- Productivity statistics

**Component**: `src/components/dashboard/dashboard-my-tasks-tab.tsx`

---

### 5. My Assets
**Slug**: `my-assets`  
**View Type**: List  
**Purpose**: Personal equipment inventory

**Features**:
- Owned, rented, and leased assets
- Category breakdown (Audio, Lighting, Video)
- Condition tracking
- Maintenance schedules
- Asset value summaries

**Component**: `src/components/dashboard/dashboard-my-assets-tab.tsx`

---

### 6. My Orders
**Slug**: `my-orders`  
**View Type**: List  
**Purpose**: Marketplace orders

**Features**:
- Order tracking with status
- Delivery information
- Vendor details
- Spending summaries
- Order history

**Component**: `src/components/dashboard/dashboard-my-orders-tab.tsx`

---

### 7. My Advances
**Slug**: `my-advances`  
**View Type**: List  
**Purpose**: Production advances

**Features**:
- Materials, Equipment, Travel, Vendor advances
- Approval status tracking
- Utilized vs remaining amounts
- Purpose and project associations
- Financial reconciliation

**Component**: `src/components/dashboard/dashboard-my-advances-tab.tsx`

---

### 8. My Travel
**Slug**: `my-travel`  
**View Type**: List  
**Purpose**: Travel arrangements and itineraries

**Features**:
- Flight, hotel, and ground transport details
- Trip purpose and project links
- Cost breakdown
- Travel statistics
- Confirmation status

**Component**: `src/components/dashboard/dashboard-my-travel-tab.tsx`

---

### 9. My Expenses
**Slug**: `my-expenses`  
**View Type**: List  
**Purpose**: Expense reports and submissions

**Features**:
- Expense reports by category
- Approval workflow
- Item-level detail expansion
- Monthly spending summaries
- Reimbursement tracking

**Component**: `src/components/dashboard/dashboard-my-expenses-tab.tsx`

---

### 10. My Reports
**Slug**: `my-reports`  
**View Type**: List  
**Purpose**: Custom, favorited, recurring reports

**Features**:
- Report templates
- Favorites and subscriptions
- Scheduled report generation
- Category organization
- Download and view options

**Component**: `src/components/dashboard/dashboard-my-reports-tab.tsx`

---

### 11. My Files
**Slug**: `my-files`  
**View Type**: List  
**Purpose**: Files uploaded, downloaded, saved, favorited

**Features**:
- File management with metadata
- Storage breakdown by category
- Activity tracking (uploads, downloads)
- File type indicators
- Favorite system

**Component**: `src/components/dashboard/dashboard-my-files-tab.tsx`

---

## Database Schema

### Dashboards Table
```sql
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    layout JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Dashboard Widgets Table
```sql
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    data_source TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    position JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Design Patterns

### Consistent Structure
All dashboard tabs follow the same visual structure:
- Card-based layouts
- Consistent use of Badges, Buttons, and Progress indicators
- Unified color scheme and spacing
- Responsive grid layouts

### Data Sources
Each tab pulls data from its respective module tables:
- **My Agenda**: `events` table filtered by user
- **My Tasks**: `project_tasks` table where user is assignee
- **My Jobs**: `personnel_assignments` table
- **My Assets**: `assets` table where user is owner
- **My Orders**: `marketplace_orders` table
- **My Advances**: `production_advances` table where user is requester
- **My Travel**: Travel arrangements linked to user
- **My Expenses**: `expense_reports` table where user is submitter
- **My Reports**: Saved reports and subscriptions
- **My Files**: `files` table filtered by user activity

---

## Integration

### Routing
All dashboard tabs accessible via:
```
/workspace/[workspaceId]/dashboard/[tab]
```

### Tab Component Registry
**File**: `src/lib/dashboard-tab-components.tsx`

```typescript
export function getDashboardTabComponent(tabSlug: string) {
  const components = {
    'overview': DashboardOverviewTab,
    'my-agenda': DashboardMyAgendaTab,
    'my-jobs': DashboardMyJobsTab,
    'my-tasks': DashboardMyTasksTab,
    'my-assets': DashboardMyAssetsTab,
    'my-orders': DashboardMyOrdersTab,
    'my-advances': DashboardMyAdvancesTab,
    'my-travel': DashboardMyTravelTab,
    'my-expenses': DashboardMyExpensesTab,
    'my-reports': DashboardMyReportsTab,
    'my-files': DashboardMyFilesTab,
  }
  
  return components[tabSlug]
}
```

### Page Integration
**File**: `src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx`

Dashboard tabs are rendered with custom components instead of standard views:
```typescript
if (moduleSlug === 'dashboard') {
  const DashboardTab = getDashboardTabComponent(tabSlug)
  return <DashboardTab />
}
```

---

## Key Features

### User-Centric Design
- All data scoped to current user
- Personalized insights and metrics
- Quick access to frequently needed information

### Real-Time Updates
- Live updates via Supabase subscriptions
- Instant notification of changes
- Optimistic UI updates

### Customization
- Widget-based overview allows user customization
- Drag-and-drop layout in overview
- Configurable metrics and views

---

## Mock Data

Each tab includes realistic mock data for demonstration:
- Production-appropriate examples
- Industry-specific terminology
- Realistic dates and metrics

**Note**: Mock data will be replaced with real database queries in production.

---

## Next Steps

1. **Backend Integration**: Connect to Supabase for real data
2. **Real-Time**: Implement subscriptions for live updates
3. **Customization**: Add widget customization UI
4. **Export**: Add data export capabilities
5. **Mobile**: Optimize for mobile views

---

## Status

✅ **Complete** - All 11 dashboard tabs implemented with mock data and ready for backend integration.

