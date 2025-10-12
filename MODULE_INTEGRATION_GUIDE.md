# Module Integration Guide

## 🎯 Integration Strategy

Now that all 18 views are complete, we're ready to integrate them into modules. This guide outlines the systematic approach.

---

## 📋 Integration Status

### ✅ Already Integrated
1. **Admin → Members** - List View (members-management-tab.tsx)
2. **Admin → Billing** - Table View (billing-tab.tsx)

### 🔄 Ready for Integration
All other 200+ tabs across 18 modules

---

## 🏗️ Integration Pattern

### Standard Tab Structure

```typescript
"use client"

import { useState } from "react"
import { EnhancedTableView } from "@/components/shared/enhanced-table-view"
// Or import the specific view you need:
// import { BoardViewCrud } from "@/components/views/board-view-crud"
// import { CalendarViewCrud } from "@/components/views/calendar-view-crud"
// etc.

import { moduleSchema } from "@/lib/schemas/module-schemas"

export function ModuleTabName() {
  const [data, setData] = useState<DataItem[]>([])

  // CRUD Handlers
  const handleCreate = async (data: Record<string, any>) => {
    // TODO: Connect to Supabase
    // const newItem = await createItem(data)
    // setData([...data, newItem])
  }

  const handleUpdate = async (id: string, updates: Record<string, any>) => {
    // TODO: Connect to Supabase
    // await updateItem(id, updates)
    // setData(data.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const handleDelete = async (id: string) => {
    // TODO: Connect to Supabase
    // await deleteItem(id)
    // setData(data.filter(item => item.id !== id))
  }

  const handleBulkDelete = async (ids: string[]) => {
    // TODO: Connect to Supabase
    // await bulkDeleteItems(ids)
    // setData(data.filter(item => !ids.includes(item.id)))
  }

  return (
    <EnhancedTableView
      data={data}
      schema={moduleSchema.fields}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
    />
  )
}
```

---

## 📊 Integration Priority

### Phase 1: High-Priority Modules (Week 1)

#### Admin Module (9 tabs)
| Tab | Current View | Recommended View | Priority |
|-----|-------------|------------------|----------|
| ✅ Members | List | List View | Done |
| ✅ Billing | Table | Table View | Done |
| Roles & Permissions | Table | Table View | High |
| Security | Table | Activity View | High |
| API Tokens | Table | Table View | Medium |
| Webhooks | Table | Table View | Medium |
| Templates | Table | Box View | Medium |
| Automations | Table | List View | Medium |
| Integrations | Table | Box View | Medium |

#### Projects Module (8 tabs)
| Tab | Default View | Recommended | Priority |
|-----|-------------|-------------|----------|
| Productions | Table | Board/Timeline | High |
| Tasks | List | Board/List | High |
| Schedule | Timeline | Timeline View | High |
| Milestones | Timeline | Timeline View | High |
| Compliance | Table | Table View | Medium |
| Safety | Table | Table View | Medium |

#### Events Module (13 tabs)
| Tab | Default View | Recommended | Priority |
|-----|-------------|-------------|----------|
| All Events | Calendar | Calendar View | High |
| Activities | Table | Calendar/List | High |
| Run of Show | Timeline | Timeline View | High |
| Rehearsals | Calendar | Calendar View | Medium |
| Bookings | Calendar | Calendar View | Medium |
| Tours | Timeline | Timeline/Map | Medium |

### Phase 2: Medium-Priority Modules (Week 2)

#### People Module (9 tabs)
- Personnel → Table View
- Teams → Box View
- Assignments → Board View
- Scheduling → Calendar View
- Workload → Workload View

#### Finance Module (13 tabs)
- Budgets → Financial View
- Transactions → Table View
- Revenue → Financial View
- Expenses → Table View

#### Assets Module (7 tabs)
- Inventory → Table View
- Tracking → Map View
- Maintenance → Calendar View
- Catalog → Box View

### Phase 3: Community & Marketplace (Week 3)

#### Community Module (8 tabs)
- News → Activity View
- Showcase → Activity View
- Activity → Activity View
- Events → Calendar View
- Discussions → Chat View

#### Marketplace Module (10 tabs)
- Shop → Box View
- Products → Box View
- Sales → Table View
- Favorites → Box View

### Phase 4: Analytics & Reports (Week 4)

#### Analytics Module (10 tabs)
- Overview → Dashboard View
- Performance → Dashboard View
- Pivot Tables → Pivot View
- Comparisons → Pivot View

#### Reports Module (9 tabs)
- Overview → Dashboard View
- Templates → Box View
- Exports → Table View

---

## 🔧 Integration Steps

### For Each Tab:

1. **Read existing tab component**
   ```bash
   # Check current implementation
   src/components/[module]/[tab-name]-tab.tsx
   ```

2. **Identify schema**
   ```bash
   # Find or create schema file
   src/lib/schemas/[module]-schemas.ts
   ```

3. **Choose appropriate view**
   - Table View: Structured data, many columns
   - List View: Simple records, card layout
   - Board View: Status-based workflows
   - Calendar View: Date/time-based data
   - Timeline View: Duration-based tasks
   - etc.

4. **Implement CRUD handlers**
   - Create
   - Update
   - Delete
   - Bulk Delete
   - (View-specific actions)

5. **Test functionality**
   - Click items → Drawer opens
   - Edit → Saves correctly
   - Delete → Confirms and removes
   - Bulk actions → Work properly

6. **Add Supabase integration**
   - Replace stub handlers with real database calls

---

## 📝 View Selection Guide

### When to use each view:

**Table View** - Best for:
- Structured data with many columns
- Data that needs sorting/filtering
- Financial records, inventory, logs
- Examples: Billing, API Tokens, Transactions

**List View** - Best for:
- Simple records (3-5 key fields)
- Card-based layouts
- Member directories, contacts
- Examples: Members, Tasks, Discussions

**Board View** - Best for:
- Status-based workflows (To Do → Done)
- Visual task management
- Process tracking
- Examples: Tasks, Pipelines, Approvals

**Calendar View** - Best for:
- Date/time-based events
- Scheduling, appointments
- Multi-day events
- Examples: Events, Bookings, Rehearsals

**Timeline View** - Best for:
- Duration-based tasks (start → end dates)
- Project planning
- Gantt charts
- Examples: Schedule, Milestones, Tours

**Workload View** - Best for:
- Resource allocation
- Team capacity planning
- User-based task distribution
- Examples: Team Assignments, Crew Scheduling

**Dashboard View** - Best for:
- Metrics and KPIs
- Widget-based layouts
- Overview pages
- Examples: All "Overview" tabs

**Box View** - Best for:
- Visual browsing
- Image-heavy content
- Product catalogs
- Examples: Media Assets, Products, Templates

**Map View** - Best for:
- Geographic data
- Location tracking
- Venues, warehouses
- Examples: Site Maps, Venues, Logistics

**Activity View** - Best for:
- Event streams
- News feeds
- Audit logs
- Examples: Activity, News, Showcase

**Chat View** - Best for:
- Messaging, conversations
- Threaded discussions
- Real-time communication
- Examples: Discussions, Comments

**Doc View** - Best for:
- Document management
- File viewing
- Content libraries
- Examples: Documents, Files, Contracts

**Form View** - Best for:
- Form submissions
- Survey responses
- Data collection
- Examples: Settings forms, Applications

**Embed View** - Best for:
- External content
- Third-party integrations
- iFrame displays
- Examples: External dashboards

**Financial View** - Best for:
- Budget tracking
- Income/expense monitoring
- Financial dashboards
- Examples: Budgets, Revenue, Expenses

**Portfolio View** - Best for:
- Project portfolios
- Multi-project overview
- Health indicators
- Examples: Productions, Projects

**Mind Map View** - Best for:
- Hierarchical relationships
- Organizational charts
- Dependency trees
- Examples: Org structure, Dependencies

**Pivot View** - Best for:
- Data analysis
- Cross-tabulation
- Aggregated reporting
- Examples: Analytics, Comparisons

---

## 🚀 Quick Start Examples

### Example 1: Simple Table Integration

```typescript
// src/components/admin/api-tokens-tab.tsx
"use client"

import { EnhancedTableView } from "@/components/shared/enhanced-table-view"
import { apiTokensSchema } from "@/lib/schemas/admin-schemas"

export function ApiTokensTab() {
  const [tokens, setTokens] = useState<DataItem[]>([])

  return (
    <EnhancedTableView
      data={tokens}
      schema={apiTokensSchema.fields}
      onCreate={async (data) => {
        // Create token
      }}
      onUpdate={async (id, updates) => {
        // Update token
      }}
      onDelete={async (id) => {
        // Delete token
      }}
      onBulkDelete={async (ids) => {
        // Bulk delete
      }}
    />
  )
}
```

### Example 2: Board View Integration

```typescript
// src/components/projects/tasks-tab.tsx
"use client"

import { BoardViewCrud } from "@/components/views/board-view-crud"
import { projectTasksSchema } from "@/lib/schemas/projects-schemas"

export function TasksTab() {
  const [tasks, setTasks] = useState<DataItem[]>([])

  return (
    <BoardViewCrud
      data={tasks}
      schema={projectTasksSchema.fields}
      onCreate={async (data) => {
        // Create task
      }}
      onUpdate={async (id, updates) => {
        // Update task (includes status changes from drag-drop)
      }}
      onDelete={async (id) => {
        // Delete task
      }}
      onBulkDelete={async (ids) => {
        // Bulk delete tasks
      }}
      onMove={async (itemId, newStatus) => {
        // Optional: Handle drag-to-column separately
      }}
    />
  )
}
```

### Example 3: Calendar View Integration

```typescript
// src/components/events/all-events-tab.tsx
"use client"

import { CalendarViewCrud } from "@/components/views/calendar-view-crud"
import { eventsSchema } from "@/lib/schemas/events-schemas"

export function AllEventsTab() {
  const [events, setEvents] = useState<DataItem[]>([])

  return (
    <CalendarViewCrud
      data={events}
      schema={eventsSchema.fields}
      onCreate={async (data) => {
        // Create event (date pre-filled from calendar click)
      }}
      onUpdate={async (id, updates) => {
        // Update event
      }}
      onDelete={async (id) => {
        // Delete event
      }}
      onBulkDelete={async (ids) => {
        // Bulk delete events
      }}
    />
  )
}
```

---

## 📚 Schema Creation

If a schema doesn't exist, create it:

```typescript
// src/lib/schemas/[module]-schemas.ts
import type { ModuleSchema } from "@/lib/data-schemas"

export const exampleSchema: ModuleSchema = {
  id: "example",
  label: "Example Module",
  fields: [
    {
      id: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      id: "status",
      label: "Status",
      type: "status",
      options: [
        { label: "Active", value: "active", color: "#10b981" },
        { label: "Pending", value: "pending", color: "#f59e0b" },
        { label: "Inactive", value: "inactive", color: "#64748b" },
      ],
    },
    {
      id: "due_date",
      label: "Due Date",
      type: "date",
    },
    // ... more fields
  ],
}
```

---

## ✅ Integration Checklist

For each tab integration:

- [ ] Identify correct view type
- [ ] Create/verify schema exists
- [ ] Import view component
- [ ] Add CRUD handlers
- [ ] Test create operation
- [ ] Test update operation
- [ ] Test delete operation
- [ ] Test bulk operations
- [ ] Test selection
- [ ] Verify drawer works
- [ ] Add Supabase integration
- [ ] Test with real data
- [ ] Update documentation

---

## 🎯 Success Metrics

| Metric | Target |
|--------|--------|
| Tabs Integrated | 200+ |
| Modules Complete | 18 |
| Views Used | 18 |
| CRUD Coverage | 100% |
| Schema Coverage | 100% |

---

## 📝 Next Steps

1. **Start with Admin module** (highest priority, most critical)
2. **Move to Projects & Events** (high business value)
3. **Complete People & Finance** (core operations)
4. **Finish remaining modules** (community, marketplace, etc.)
5. **Connect to Supabase** (real data integration)
6. **Performance testing** (large datasets)
7. **User acceptance testing** (feedback & refinement)

---

**Ready to begin systematic module integration!**

_Integration Plan Created: October 12, 2025_
