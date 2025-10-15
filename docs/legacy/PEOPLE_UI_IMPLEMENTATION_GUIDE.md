# People Module UI Implementation Guide

## Overview

This guide shows how to integrate all the new UI enhancement components into the existing People module **without breaking any existing functionality**. All components are **additive** and can be integrated incrementally.

## 📦 Components Created

### Phase 1: High-Impact, Low-Effort (Implement First)

1. ✅ **ActionButtonBar** - Quick access toolbar
2. ✅ **StatusBadge** - Visual status indicators
3. ✅ **NotificationBadge** - Count badges for nav items
4. ✅ **SmartFiltersBar** - Enhanced filtering
5. ✅ **QuickActionMenu** - Context menu for employees

### Phase 2: Dashboard & Widgets

6. ✅ **DashboardWidgets** - Overview cards (Headcount, Schedule, Approvals, Alerts, Stats)
7. ✅ **TimeClockWidget** - Quick clock in/out
8. ✅ **TodaysScheduleSidebar** - Real-time schedule view
9. ✅ **ProgressIndicators** - Onboarding & goal progress
10. ✅ **ComplianceAlertsBanner** - Critical alerts

### Phase 3: Enhanced Features

11. ✅ **MiniProfileCard** - Hover profile preview
12. ✅ **ActivityTimeline** - Event history
13. ✅ **PTOCalendarWidget** - Visual PTO request
14. ✅ **KeyboardShortcuts** - Power user features
15. ✅ **ExportMenu** - Data export options

---

## 🚀 Integration Examples

### Example 1: Add Action Button Bar (Top of Module)

**File**: `src/app/[locale]/(dashboard)/people/page.tsx` (or wherever your People page is)

```tsx
import { ActionButtonBar } from '@/components/people'

export default function PeoplePage() {
  const [pendingApprovals, setPendingApprovals] = useState(5)

  return (
    <div>
      {/* Add this at the top of your existing page */}
      <ActionButtonBar
        pendingApprovals={pendingApprovals}
        onAddEmployee={() => {/* your existing add employee logic */}}
        onClockInOut={() => {/* clock in/out logic */}}
        onRequestPTO={() => {/* PTO request logic */}}
        onSwapShift={() => {/* shift swap logic */}}
        onApprove={() => {/* go to approvals */}}
        onExport={() => {/* export logic */}}
        onSearch={() => {/* search logic */}}
      />

      {/* Your existing page content stays exactly the same */}
      <YourExistingEmployeeList />
    </div>
  )
}
```

**Result**: Adds floating action bar without touching existing UI.

---

### Example 2: Add Status Badges to Employee List

**Before** (existing code):
```tsx
<div className="employee-card">
  <p>{employee.name}</p>
  <p>{employee.status}</p> {/* Plain text */}
</div>
```

**After** (enhanced with badges):
```tsx
import { StatusBadge, EmploymentTypeBadge } from '@/components/people'

<div className="employee-card">
  <p>{employee.name}</p>
  <StatusBadge type="employment" status={employee.status} />
  <EmploymentTypeBadge type={employee.employmentType} />
</div>
```

**Result**: Visual badges replace plain text, no breaking changes.

---

### Example 3: Add Dashboard Widgets (Landing Page)

**File**: `src/app/[locale]/(dashboard)/people/page.tsx`

```tsx
import {
  HeadcountWidget,
  TodaysScheduleWidget,
  PendingApprovalsWidget,
  AlertsWidget,
  QuickStatsWidget
} from '@/components/people'

export default function PeoplePage() {
  // Fetch your data
  const headcount = useHeadcount()
  const schedule = useTodaysSchedule()
  const approvals = usePendingApprovals()
  const alerts = useComplianceAlerts()
  const stats = useQuickStats()

  return (
    <div>
      {/* Add widget grid at top of page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <HeadcountWidget
          activeCount={headcount.active}
          fullTimeCount={headcount.fullTime}
          partTimeCount={headcount.partTime}
          contractorCount={headcount.contractors}
          onViewDetails={() => {/* navigate to details */}}
        />
        
        <TodaysScheduleWidget
          onDutyCount={schedule.onDuty}
          comingCount={schedule.coming}
          openShiftsCount={schedule.openShifts}
          onViewSchedule={() => {/* navigate to schedule */}}
        />
        
        <PendingApprovalsWidget
          totalCount={approvals.total}
          ptoCount={approvals.pto}
          timesheetsCount={approvals.timesheets}
          shiftsCount={approvals.shifts}
          onReviewAll={() => {/* navigate to approvals */}}
        />

        <AlertsWidget
          alertCount={alerts.length}
          alerts={alerts}
          onReviewAlerts={() => {/* navigate to alerts */}}
        />

        <QuickStatsWidget
          onboardingCount={stats.onboarding}
          reviewsDueCount={stats.reviewsDue}
          onViewReports={() => {/* navigate to reports */}}
        />
      </div>

      {/* Your existing employee list stays unchanged */}
      <YourExistingEmployeeList />
    </div>
  )
}
```

**Result**: Dashboard widgets appear above existing content, nothing breaks.

---

### Example 4: Add Smart Filters Bar

```tsx
import { SmartFiltersBar, FilterSummaryBar } from '@/components/people'

export default function PeoplePage() {
  const [filters, setFilters] = useState<FilterState>({
    department: 'all',
    status: 'active',
    type: 'all'
  })

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Apply filters to your existing employee list
    filterEmployees(newFilters)
  }

  return (
    <div>
      {/* Add filters above existing list */}
      <SmartFiltersBar
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        departments={departments}
        employmentStatuses={statuses}
        employmentTypes={types}
      />

      {/* Optional: Show filter results summary */}
      <FilterSummaryBar
        totalCount={employees.length}
        filteredCount={filteredEmployees.length}
        activeFilters={['Active', 'Engineering']}
      />

      {/* Your existing list */}
      <YourEmployeeList data={filteredEmployees} />
    </div>
  )
}
```

---

### Example 5: Add Notification Badges to Navigation

**File**: `src/components/layout/navigation.tsx` (or wherever your nav is)

```tsx
import { NavBadge, NotificationBadge } from '@/components/people'

export function Navigation() {
  const pendingApprovals = usePendingApprovals()

  return (
    <nav>
      {/* Existing nav items enhanced with badges */}
      <NavLink href="/people">
        <NavBadge 
          label="People" 
          count={2} // 2 items need attention
          icon={<Users className="h-4 w-4" />}
        />
      </NavLink>

      <NavLink href="/schedule">
        <NavBadge 
          label="Schedule" 
          count={8} // 8 open shifts
          icon={<Calendar className="h-4 w-4" />}
        />
      </NavLink>

      <NavLink href="/approvals">
        <NavBadge 
          label="Approvals" 
          count={pendingApprovals.length}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </NavLink>
    </nav>
  )
}
```

**Result**: Navigation items show notification counts, existing functionality intact.

---

### Example 6: Add Quick Action Menu to Employee Cards

**Before**:
```tsx
<div className="employee-card">
  <p>{employee.name}</p>
  <button onClick={handleEdit}>Edit</button>
</div>
```

**After**:
```tsx
import { QuickActionMenu } from '@/components/people'

<div className="employee-card">
  <p>{employee.name}</p>
  
  {/* Keep existing button OR replace with menu */}
  <QuickActionMenu
    personnelId={employee.id}
    personnelName={employee.name}
    onViewProfile={() => navigate(`/people/${employee.id}`)}
    onEditDetails={() => handleEdit(employee.id)}
    onSendMessage={() => handleMessage(employee.id)}
    onRequestPTO={() => handlePTO(employee.id)}
    onViewTimesheet={() => navigate(`/timesheets/${employee.id}`)}
    onViewPerformance={() => navigate(`/performance/${employee.id}`)}
    pendingApprovalsCount={employee.pendingApprovals}
  />
</div>
```

---

### Example 7: Add Time Clock Widget (Prominent Placement)

**Option A: Dashboard Widget**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <TimeClockWidget
    employeeName={currentUser.name}
    isClockedIn={currentUser.isClockedIn}
    currentShift={currentShift}
    todayHours={8.5}
    weekHours={32.0}
    location={{
      name: "Downtown Office",
      withinGeofence: true
    }}
    onClockIn={handleClockIn}
    onClockOut={handleClockOut}
    showQROption={true}
  />
  {/* Other widgets */}
</div>
```

**Option B: Sidebar**
```tsx
<div className="flex gap-4">
  <main className="flex-1">
    {/* Your main content */}
  </main>
  
  <aside className="w-80">
    <TimeClockWidgetCompact
      isClockedIn={isClockedIn}
      todayHours={todayHours}
      onClockIn={handleClockIn}
      onClockOut={handleClockOut}
    />
  </aside>
</div>
```

---

### Example 8: Add Compliance Alerts Banner

```tsx
import { ComplianceAlertsBanner } from '@/components/people'

export default function PeoplePage() {
  const alerts = useComplianceAlerts()

  return (
    <div>
      {/* Add alert banner at top of page */}
      {alerts.length > 0 && (
        <ComplianceAlertsBanner
          alerts={alerts}
          onDismiss={handleDismissAlert}
          onViewAll={() => navigate('/compliance')}
          className="mb-4"
        />
      )}

      {/* Existing content */}
      <YourExistingContent />
    </div>
  )
}
```

---

### Example 9: Add Progress Indicators (Onboarding)

```tsx
import { OnboardingProgressCard } from '@/components/people'

export function OnboardingSection() {
  const newHires = useNewHires()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {newHires.map(employee => (
        <OnboardingProgressCard
          key={employee.id}
          personnelName={employee.name}
          overallProgress={employee.onboardingProgress}
          tasks={employee.onboardingTasks}
          onViewDetails={() => navigate(`/people/${employee.id}/onboarding`)}
          onMarkComplete={() => handleCompleteOnboarding(employee.id)}
        />
      ))}
    </div>
  )
}
```

---

### Example 10: Add Today's Schedule Sidebar

```tsx
export default function PeoplePage() {
  const schedule = useTodaysSchedule()

  return (
    <div className="flex gap-4">
      {/* Main content */}
      <main className="flex-1">
        <YourExistingContent />
      </main>

      {/* Add sidebar (collapsible on mobile) */}
      <aside className="hidden lg:block w-80">
        <TodaysScheduleSidebar
          onDuty={schedule.onDuty}
          comingSoon={schedule.comingSoon}
          openShifts={schedule.openShifts}
          outToday={schedule.outToday}
          onViewFullSchedule={() => navigate('/schedule')}
          onAssignShift={() => openAssignShiftDialog()}
        />
      </aside>
    </div>
  )
}
```

---

## 🎨 Styling Consistency

All components use your existing design system:

- **Tailwind CSS** classes
- **shadcn/ui** components (`Card`, `Button`, `Badge`, etc.)
- **Lucide React** icons
- **Color scheme** follows your theme (light/dark mode compatible)

No new CSS files needed, everything integrates seamlessly.

---

## 📱 Mobile Responsive

All components are mobile-responsive out of the box:

```tsx
// Desktop: Full sidebar
<aside className="hidden lg:block w-80">
  <TodaysScheduleSidebar {...props} />
</aside>

// Mobile: Compact version or drawer
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" className="lg:hidden">
      <Calendar className="h-4 w-4" />
    </Button>
  </SheetTrigger>
  <SheetContent>
    <TodaysScheduleSidebar {...props} />
  </SheetContent>
</Sheet>
```

---

## 🔌 Data Fetching Integration

### Option 1: Use Existing Hooks

```tsx
import { usePersonnel } from '@/hooks/use-people-data'

export default function PeoplePage() {
  const { personnel, loading } = usePersonnel(workspaceId)

  // Pass data to components
  return <EmployeeList data={personnel} loading={loading} />
}
```

### Option 2: Create New Hooks for Dashboard Data

```tsx
// src/hooks/use-people-dashboard.ts
export function usePeopleDashboard(workspaceId: string) {
  const { data: headcount } = useQuery({
    queryKey: ['headcount', workspaceId],
    queryFn: () => fetchHeadcount(workspaceId)
  })

  const { data: schedule } = useQuery({
    queryKey: ['schedule', workspaceId],
    queryFn: () => fetchTodaysSchedule(workspaceId)
  })

  return { headcount, schedule }
}
```

---

## ✅ Migration Checklist

### Phase 1: Quick Wins (1-2 days)
- [ ] Add `ActionButtonBar` to People page header
- [ ] Replace status text with `StatusBadge` components
- [ ] Add `NotificationBadge` to navigation
- [ ] Add `SmartFiltersBar` above employee list
- [ ] Add `QuickActionMenu` to employee cards

### Phase 2: Dashboard (2-3 days)
- [ ] Add dashboard widgets to landing page
- [ ] Implement `TimeClockWidget` for employees
- [ ] Add `ComplianceAlertsBanner` for alerts
- [ ] Integrate `ProgressIndicators` for onboarding

### Phase 3: Enhanced Features (3-4 days)
- [ ] Add `TodaysScheduleSidebar` (optional)
- [ ] Implement `PTOCalendarWidget` for requests
- [ ] Add `MiniProfileCard` hover previews
- [ ] Add `ActivityTimeline` to profiles
- [ ] Setup `KeyboardShortcuts`
- [ ] Integrate `ExportMenu`

---

## 🚫 What NOT to Change

**Leave these alone:**
- Existing routing
- Database queries
- API endpoints
- Authentication/authorization
- Existing state management
- Current business logic

**Only add:**
- New UI components
- Enhanced visual elements
- Better UX patterns
- Dashboard widgets

---

## 🐛 Troubleshooting

### Issue: Components not found
**Solution**: Make sure to export from index file:
```tsx
export * from './status-badge'
```

### Issue: Styling conflicts
**Solution**: Use `cn()` utility for conditional classes:
```tsx
<div className={cn("base-classes", customClassName)} />
```

### Issue: Type errors
**Solution**: All components have TypeScript interfaces. Check props:
```tsx
interface StatusBadgeProps {
  type: "employment" | "approval" | "compliance"
  status: string
  // ...
}
```

---

## 📚 Component API Reference

See individual component files for full prop documentation. All components follow these patterns:

```tsx
// Standard pattern
<Component
  // Data props
  data={data}
  
  // Event handlers
  onClick={handler}
  onChange={handler}
  
  // Style props
  className={styles}
  variant="default"
  size="md"
/>
```

---

## 🎯 Best Practices

1. **Progressive Enhancement**: Add components incrementally
2. **No Breaking Changes**: Wrap existing elements, don't replace
3. **Keep Data Flow**: Use existing data sources
4. **Test Incrementally**: Test each addition before moving on
5. **Mobile First**: Test on mobile after each change

---

## 📞 Support

All components are self-contained and documented inline. Refer to:
- Component TypeScript interfaces for props
- Inline comments for complex logic
- This guide for integration patterns

---

## Summary

These components are **100% additive**. You can:
- ✅ Add them one at a time
- ✅ Test each individually
- ✅ Roll back easily if needed
- ✅ Keep all existing functionality
- ✅ Enhance UX without risk

Start with Phase 1 (quick wins) and progressively add more as time allows.
