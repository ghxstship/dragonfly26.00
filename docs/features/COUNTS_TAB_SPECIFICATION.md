# Counts Tab - Specification

**Module:** Assets  
**Tab Order:** 3 (between Inventory and Maintenance)  
**Icon:** `ListChecks`  
**Color:** `#0891b2` (cyan)  
**Default View:** Table  
**Added:** October 15, 2025

## Purpose

The Counts tab provides a dedicated workspace for managing physical inventory counts, cycle counting programs, and audit reconciliation. It separates the operational workflow of counting from the day-to-day inventory management in the Inventory tab.

## Why a Separate Tab?

1. **Distinct Workflow** - Counting is a multi-step process: plan → schedule → assign → execute → reconcile
2. **Team Coordination** - Counts involve assignments, schedules, and multi-user collaboration
3. **Compliance** - Many industries require documented audit trails
4. **Focus** - Dedicated space prevents cluttering the Inventory tab
5. **Reporting** - Historical count accuracy and performance metrics

## Schema Support

### Database Tables
- `inventory_counts` - Count records (planned, in_progress, completed, cancelled)
- `count_line_items` - Individual items counted with variance tracking

### Key Fields

**inventory_counts:**
- `count_name` - Descriptive name
- `count_type` - full, cycle, spot, location, category
- `status` - planned, in_progress, completed, cancelled
- `folder_id` - Specific folder if applicable
- `location_id` - Specific location if applicable
- `category` - Specific category if applicable
- `scheduled_date` - When to perform
- `assigned_to[]` - Team member IDs
- `total_items_counted` - Count summary
- `discrepancies_found` - Variance count

**count_line_items:**
- `count_id` - Parent count
- `inventory_item_id` - Item being counted
- `expected_quantity` - System quantity
- `counted_quantity` - Physical count
- `variance` - Computed difference
- `condition_recorded` - Condition during count
- `count_photos[]` - Photos taken during count
- `counted_by` - Who counted it
- `counted_at` - When counted

## Tab Views & Layouts

### Primary View: Table
Display all counts with key information:
- Count name & type
- Status badge
- Scheduled date
- Assigned team members (avatars)
- Progress (items counted / total items)
- Discrepancies count
- Actions (view, edit, delete)

**Filters:**
- Status (planned, in_progress, completed)
- Type (full, cycle, spot, location, category)
- Date range
- Assigned to me
- Has discrepancies

**Sorting:**
- Scheduled date
- Created date
- Count name
- Status
- Discrepancies count

### Secondary View: Calendar
Show scheduled counts on calendar with:
- Color coding by type
- Status indicators
- Assigned team badges
- Click to view/edit

### Dashboard View (Optional)
Count metrics and KPIs:
- Active counts
- Scheduled upcoming
- Completion rate
- Average accuracy
- Items requiring recount
- Team performance

## User Workflows

### 1. Create New Count

**Wizard/Modal Steps:**

**Step 1: Basic Info**
- Count name (required)
- Count type: full, cycle, spot, location, category
- Description/notes

**Step 2: Scope**
- Based on type, show relevant filters:
  - **Full:** All inventory
  - **Cycle:** Select categories or folders for rotation
  - **Spot:** Select specific items
  - **Location:** Select location/folder
  - **Category:** Select category

**Step 3: Schedule & Assign**
- Scheduled date (calendar picker)
- Time (optional)
- Assign to team members (multi-select)
- Set priority

**Step 4: Review & Create**
- Summary of scope (X items to count)
- Assigned team
- Schedule
- Create button

### 2. Execute Count

**Count Execution Interface:**

**Header:**
- Count name & type
- Progress bar (X of Y items counted)
- Status: In Progress
- Pause/Resume/Complete buttons

**Item List:**
- Show all items in scope
- For each item:
  - Photo thumbnail
  - Name & SKU
  - Current location/folder
  - Expected quantity (from system)
  - Input: Counted quantity ⭐
  - Condition dropdown
  - Add photo button
  - Notes field
  - Save button

**Barcode Scanner Mode:**
- Activate camera
- Scan item barcode/QR
- Auto-populate item details
- Quick entry: counted quantity + save
- Next item

**Filtering:**
- Show all
- Not counted yet
- Has variance
- By location/folder

### 3. Review Variances

**Variance Review Screen:**

- List items with variance (counted ≠ expected)
- For each variance:
  - Item details with photo
  - Expected quantity
  - Counted quantity
  - Variance (±)
  - Percentage difference
  - Possible reasons (dropdown)
  - Actions:
    - Accept (adjust stock)
    - Recount
    - Investigate
    - Dismiss

**Bulk Actions:**
- Accept all
- Schedule recount
- Export variance report

### 4. Complete Count

**Completion Modal:**
- Summary statistics:
  - Total items counted
  - Items with variance
  - Total variance amount
  - Accuracy percentage
- Apply stock adjustments checkbox
- Final notes
- Complete button

**Post-Completion:**
- Status → Completed
- Stock movements created for variances (if accepted)
- Historical record saved
- Email/notification to stakeholders

## Key Features

### 1. Count Scheduling
- Calendar-based scheduling
- Recurring cycle counts (daily, weekly, monthly)
- Automatic count creation based on schedule
- Team availability checking

### 2. Mobile Optimization
- Optimized for tablets/phones
- Barcode scanner integration
- Photo capture
- Offline capability (sync when online)

### 3. Progress Tracking
- Real-time progress updates
- Team member activity
- Time to complete estimates
- Pause/resume capability

### 4. Variance Management
- Automatic variance detection
- Threshold alerts (e.g., >10% variance)
- Investigation workflow
- Recount requests

### 5. Reporting
- Count history table
- Accuracy trends over time
- Team performance metrics
- Items frequently miscounted
- Count duration analytics

### 6. Permissions
- **Create counts:** Managers only
- **Perform counts:** Assigned team members
- **Review variances:** Managers + inventory leads
- **Complete counts:** Managers only

## UI Components

### 1. Count Creation Wizard
Multi-step modal with validation

### 2. Count Card/Row
Compact display in table:
```
[Icon] Count Name               [Status Badge]
       Type: Cycle Count
       Scheduled: Oct 20, 2025
       [Avatar] [Avatar] +2
       Progress: ████████░░ 24/30 items
       Variances: 3
       [View] [Edit] [Delete]
```

### 3. Count Execution Panel
Full-screen or side panel interface:
- Sticky header with progress
- Scrollable item list
- Quick entry form
- Scanner activation button

### 4. Variance Alert Card
Highlight items needing attention:
```
⚠️ Variance Detected
   LED Par Can (SKU: LIGHT-001)
   Expected: 12 | Counted: 10 | Variance: -2 (-16.7%)
   [Accept] [Recount] [Investigate]
```

### 5. Count Calendar
Month/week view with scheduled counts

### 6. Count History Table
Filterable, sortable table of past counts

## API Integration

Uses existing API functions:
```typescript
// Get counts
getInventoryCounts(workspaceId, status, type)

// Create count
createInventoryCount(count)

// Update count
updateInventoryCount(countId, updates)

// Complete count
completeInventoryCount(countId, applyAdjustments)

// Count line items
getCountLineItems(countId)
createCountLineItem(lineItem)
updateCountLineItem(lineItemId, updates)

// Apply variance adjustments
applyCountAdjustments(countId, lineItems)
```

## Success Metrics

1. **Efficiency:** Reduce count time by 50%
2. **Accuracy:** Increase inventory accuracy to 99%+
3. **Compliance:** 100% documented audit trails
4. **Adoption:** 80%+ of team uses mobile scanner
5. **Frequency:** Cycle counts executed on schedule

## Competitive Advantage

While Sortly focuses on individual item scanning, the Counts tab provides:
- **Structured audit programs** for compliance
- **Team coordination** for large operations
- **Variance workflows** for issue resolution
- **Historical analytics** for continuous improvement
- **Enterprise-grade** reporting and controls

## Related Documentation

- [Inventory Sortly Optimization](/docs/features/INVENTORY_SORTLY_OPTIMIZATION.md)
- [Inventory Quick Reference](/docs/features/INVENTORY_QUICK_REFERENCE.md)
- [Assets Module](/src/lib/modules/tabs-registry.ts)

---

**Status:** Schema & API Ready | Frontend Implementation Pending  
**Priority:** High (enables enterprise inventory compliance)
