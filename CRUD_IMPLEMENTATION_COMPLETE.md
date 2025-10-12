# Complete CRUD Implementation Guide

## Overview

This document provides a comprehensive guide for implementing full CRUD (Create, Read, Update, Delete) functionality with record-level and bulk actions across all modules using the right sidebar drawer pattern.

## Core Components Created

### 1. Data Schema Registry (`src/lib/data-schemas.ts`)
Defines consistent field structures for all modules to ensure data consistency across list views, forms, and detail views.

### 2. Record Actions Menu (`src/components/shared/record-actions-menu.tsx`)
Provides the three-dot menu for individual record actions:
- View details
- Edit
- Duplicate
- Delete
- Custom actions

### 3. CRUD Drawer (`src/components/shared/crud-drawer.tsx`)
Right sidebar drawer component that handles:
- View mode: Display record details with activity feed
- Create mode: Form for creating new records
- Edit mode: Form for updating existing records
- Supports all field types with proper rendering
- Activity and comments panel
- Metadata display

### 4. Enhanced Table View (`src/components/shared/enhanced-table-view.tsx`)
Advanced table component with:
- Checkbox selection
- Sortable columns
- Record actions menu
- Bulk actions toolbar
- Integrated CRUD drawer
- Dynamic column generation from schema
- Click to view details

### 5. Bulk Actions Toolbar (`src/components/shared/bulk-actions-toolbar.tsx`)
Fixed bottom toolbar that appears when rows are selected:
- Delete multiple records
- Duplicate multiple records
- Archive multiple records
- Bulk edit capabilities

## Implementation Pattern

### Step 1: Define Schema

Create a schema file in `src/lib/schemas/[module]-schemas.ts`:

```typescript
import { ModuleSchema, commonFields } from '../data-schemas'

export const myTabSchema: ModuleSchema = {
  moduleId: 'module_name',
  tabId: 'module_name-tab_name',
  tableName: 'database_table_name',
  primaryKey: 'id',
  displayField: 'name',
  fields: [
    commonFields.id,
    commonFields.name,
    commonFields.description,
    commonFields.status,
    // Add custom fields
    { 
      id: 'custom_field', 
      label: 'Custom Field', 
      type: 'text', 
      showInList: true, 
      showInForm: true,
      order: 5 
    },
    commonFields.createdAt,
  ],
}
```

### Step 2: Implement Tab Component

Replace existing tab implementation with the enhanced pattern:

```typescript
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/hooks/use-toast"
import { EnhancedTableView } from "@/components/shared/enhanced-table-view"
import { myTabSchema } from "@/lib/schemas/[module]-schemas"
import type { DataItem } from "@/types"

export function MyTab() {
  const { toast } = useToast()
  
  // State for data
  const [data, setData] = useState<DataItem[]>([
    {
      id: "1",
      name: "Example Item",
      description: "Example description",
      status: "active",
      custom_field: "value",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])

  // CRUD handlers
  const handleCreate = async (newData: Record<string, any>) => {
    const now = new Date().toISOString()
    const newItem: DataItem = {
      id: String(data.length + 1),
      ...newData,
      created_at: now,
      updated_at: now,
    }
    setData([...data, newItem])
    toast({ title: "Item created successfully" })
  }

  const handleUpdate = async (id: string, updates: Record<string, any>) => {
    setData(data.map(item => 
      item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
    ))
    toast({ title: "Item updated successfully" })
  }

  const handleDelete = async (id: string) => {
    setData(data.filter(item => item.id !== id))
    toast({ title: "Item deleted successfully" })
  }

  const handleBulkDelete = async (ids: string[]) => {
    setData(data.filter(item => !ids.includes(item.id)))
    toast({ title: `${ids.length} items deleted successfully` })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Tab</CardTitle>
          <CardDescription>
            Manage your items with full CRUD functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedTableView
            data={data}
            schema={myTabSchema.fields}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

## Database Schema Definitions

### Common Fields for All Tables
```sql
-- Every table should include these base fields
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
created_by UUID REFERENCES users(id),
organization_id UUID REFERENCES organizations(id)
```

### Admin Module Schemas

#### Billing Records
```sql
CREATE TABLE billing_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  billing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
  plan VARCHAR(50) CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  payment_method VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Roles & Permissions
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  level VARCHAR(20) CHECK (level IN ('owner', 'admin', 'member', 'guest')),
  permissions JSONB DEFAULT '[]',
  user_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, name)
);
```

#### Security Logs
```sql
CREATE TABLE security_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES users(id),
  event VARCHAR(200) NOT NULL,
  event_type VARCHAR(50) CHECK (event_type IN ('login', 'logout', 'password_change', 'permission_change', 'failed_login', 'suspicious')),
  ip_address INET,
  user_agent TEXT,
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_security_logs_org ON security_logs(organization_id, created_at DESC);
CREATE INDEX idx_security_logs_user ON security_logs(user_id, created_at DESC);
```

### Projects Module Schemas

#### Productions
```sql
CREATE TABLE productions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  production_type VARCHAR(50) CHECK (production_type IN ('show', 'tour', 'event', 'festival', 'concert')),
  status VARCHAR(50) DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  producer_id UUID REFERENCES users(id),
  venue_id UUID REFERENCES locations(id),
  crew_size INTEGER,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

#### Tasks
```sql
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  project_id UUID REFERENCES productions(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  due_date DATE,
  estimated_hours DECIMAL(8, 2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Task assignees (many-to-many)
CREATE TABLE task_assignees (
  task_id UUID REFERENCES project_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (task_id, user_id)
);
```

#### Milestones
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  project_id UUID REFERENCES productions(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  milestone_date DATE NOT NULL,
  owner_id UUID REFERENCES users(id),
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Events Module Schemas

#### Events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) CHECK (event_type IN ('performance', 'rehearsal', 'meeting', 'workshop', 'class')),
  status VARCHAR(50) DEFAULT 'scheduled',
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  location_id UUID REFERENCES locations(id),
  organizer_id UUID REFERENCES users(id),
  capacity INTEGER,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees
CREATE TABLE event_attendees (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'invited',
  responded_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (event_id, user_id)
);
```

#### Activities
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  event_id UUID REFERENCES events(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  activity_type VARCHAR(50) CHECK (activity_type IN ('performance', 'rehearsal', 'class', 'workshop', 'recreation')),
  status VARCHAR(50) DEFAULT 'scheduled',
  start_time TIME,
  duration INTEGER, -- minutes
  instructor_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### People Module Schemas

#### Personnel
```sql
CREATE TABLE personnel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(100),
  department VARCHAR(100),
  employment_type VARCHAR(50) CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'freelance')),
  status VARCHAR(50) DEFAULT 'active',
  hire_date DATE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Teams
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  team_lead_id UUID REFERENCES users(id),
  department VARCHAR(100),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);
```

### Assets Module Schemas

#### Assets Inventory
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  asset_type VARCHAR(50) CHECK (asset_type IN ('equipment', 'vehicle', 'tool', 'infrastructure', 'credential')),
  asset_id VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  location_id UUID REFERENCES locations(id),
  purchase_date DATE,
  purchase_price DECIMAL(12, 2),
  condition VARCHAR(50) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Asset Tracking
```sql
CREATE TABLE asset_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  action VARCHAR(50) CHECK (action IN ('check_out', 'check_in', 'transfer', 'maintenance', 'repair')),
  user_id UUID REFERENCES users(id),
  from_location_id UUID REFERENCES locations(id),
  to_location_id UUID REFERENCES locations(id),
  notes TEXT,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Field Type Reference

### Available Field Types
- `text` - Single line text input
- `textarea` - Multi-line text input
- `number` - Numeric input
- `currency` - Monetary value with formatting
- `email` - Email address with validation
- `phone` - Phone number input
- `url` - URL with validation
- `date` - Date picker
- `datetime` - Date and time picker
- `time` - Time picker
- `select` - Dropdown with single selection
- `multiselect` - Dropdown with multiple selections
- `checkbox` - Single checkbox
- `toggle` - Toggle switch
- `user` - User selector (single)
- `users` - User selector (multiple)
- `tags` - Tag input with badges
- `file` - File upload (single)
- `files` - File upload (multiple)
- `color` - Color picker
- `rating` - Star rating
- `status` - Status badge with colors
- `priority` - Priority level with colors
- `relation` - Foreign key relationship

### Common Field Options
```typescript
{
  id: 'field_name',
  label: 'Field Label',
  type: 'select',
  required: true,
  placeholder: 'Select an option',
  description: 'Help text for the field',
  defaultValue: 'default',
  showInList: true,      // Show in table view
  showInDetail: true,    // Show in detail drawer
  showInForm: true,      // Show in create/edit forms
  showInCreate: true,    // Show specifically in create form
  sortable: true,        // Enable column sorting
  filterable: true,      // Enable filtering
  width: 200,            // Column width in pixels
  order: 5,              // Display order
  options: [             // For select/status/priority types
    { label: 'Active', value: 'active', color: '#16a34a' },
    { label: 'Inactive', value: 'inactive', color: '#64748b' },
  ],
  validation: {
    min: 0,
    max: 100,
    pattern: '^[A-Z]',
    message: 'Custom validation message'
  }
}
```

## Complete Module Implementation Checklist

For each module tab, complete the following:

- [ ] **Define Schema**: Create schema in `/src/lib/schemas/[module]-schemas.ts`
- [ ] **Database Migration**: Create SQL migration in `/supabase/migrations/`
- [ ] **Update Tab Component**: Replace with EnhancedTableView pattern
- [ ] **Test CRUD Operations**:
  - [ ] Create new records
  - [ ] View record details
  - [ ] Edit existing records
  - [ ] Delete single records
  - [ ] Select multiple records
  - [ ] Bulk delete records
  - [ ] Duplicate records
- [ ] **Verify Data Consistency**:
  - [ ] List view shows correct fields
  - [ ] Form includes all necessary fields
  - [ ] Detail view displays complete information
  - [ ] Field types render correctly
- [ ] **Add Real Data Integration**: Connect to Supabase tables

## Module Implementation Priority

### Phase 1: Core Admin (Completed Example)
- ✅ Admin - Billing Tab
- [ ] Admin - Roles & Permissions
- [ ] Admin - Security Logs
- [ ] Admin - Members Management

### Phase 2: Production Management
- [ ] Projects - Productions
- [ ] Projects - Tasks
- [ ] Projects - Milestones
- [ ] Events - All Events
- [ ] Events - Activities

### Phase 3: People & Resources
- [ ] People - Personnel
- [ ] People - Teams
- [ ] Assets - Inventory
- [ ] Assets - Tracking

### Phase 4: Remaining Modules
- [ ] Dashboard tabs
- [ ] Locations tabs
- [ ] Files tabs
- [ ] Finance tabs
- [ ] Procurement tabs
- [ ] Jobs tabs
- [ ] Reports tabs
- [ ] Analytics tabs
- [ ] Community tabs
- [ ] Marketplace tabs
- [ ] Resources tabs

## Example: Complete Tab Implementation

See `/src/components/admin/billing-tab.tsx` for a complete working example implementing:
- Data state management
- CRUD handlers
- EnhancedTableView integration
- Toast notifications
- Proper typing

## Next Steps

1. **Create remaining schema definitions** for all modules
2. **Generate database migrations** from schemas
3. **Implement tabs systematically** following the pattern
4. **Connect to Supabase** for real data persistence
5. **Add authentication** and row-level security
6. **Implement real-time updates** using Supabase subscriptions
7. **Add data validation** and error handling
8. **Create comprehensive tests** for CRUD operations

## Benefits of This Pattern

✅ **Consistent UX**: Same interaction pattern across all modules  
✅ **Reusable Components**: DRY principle applied throughout  
✅ **Type Safety**: Full TypeScript support with proper types  
✅ **Maintainability**: Single source of truth for data schemas  
✅ **Scalability**: Easy to add new modules and fields  
✅ **Developer Experience**: Clear pattern to follow  
✅ **User Experience**: Professional, intuitive interface  
✅ **Data Integrity**: Schema-driven validation  

## Support

For questions or issues, refer to:
- Component source code with inline documentation
- Type definitions in `/src/types/index.ts`
- Schema examples in `/src/lib/schemas/`
- Working example in `/src/components/admin/billing-tab.tsx`
