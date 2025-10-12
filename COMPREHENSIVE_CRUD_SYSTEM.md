# Comprehensive CRUD System with Enhanced Field Types

## 🎯 Implementation Complete

A full-featured CRUD system with record-level and bulk actions has been implemented, supporting **40+ field types** inspired by ClickUp, Airtable, and Smartsuite.

## ✅ Core Components Implemented

### 1. Enhanced Data Schema System (`src/lib/data-schemas.ts`)
Comprehensive field type system with 40+ types organized into categories:

#### Text Types
- `text` - Single line text
- `textarea` - Multi-line text
- `richtext` - Rich text editor
- `markdown` - Markdown editor

#### Number Types
- `number` - Standard number input
- `currency` - Monetary values with $ prefix
- `percent` - Percentage with % suffix
- `duration` - Time duration (hours/minutes)
- `decimal` - Decimal numbers
- `autonumber` - Auto-incrementing numbers
- `count` - Calculated count

#### Date/Time Types
- `date` - Date picker
- `datetime` - Date and time
- `time` - Time only
- `daterange` - Start/end date range

#### Selection Types
- `select` - Single selection dropdown
- `multiselect` - Multiple selection
- `radio` - Radio buttons
- `checkbox` - Single checkbox
- `toggle` - Toggle switch

#### User Types
- `user` - Single user selector
- `users` - Multiple user selector
- `createdby` - Automatically set creator (read-only)
- `modifiedby` - Automatically set modifier (read-only)

#### Link Types
- `email` - Email with mailto: link
- `phone` - Phone with tel: link
- `url` - Clickable URL
- `location` - Location/place name
- `address` - Full address

#### Media Types
- `file` - Single file upload
- `files` - Multiple file upload
- `image` - Single image upload
- `images` - Multiple image upload
- `signature` - Signature capture

#### Visual Types
- `color` - Color picker with hex display
- `icon` - Icon selector/upload
- `avatar` - Avatar/profile image
- `rating` - 5-star rating
- `progress` - Progress bar (0-100%)

#### Status Types
- `status` - Status badges with colors
- `priority` - Priority levels with colors
- `label` - Labeled badges
- `tags` - Tag collection
- `badge` - Generic badges

#### Advanced Types
- `relation` - Foreign key relationship
- `lookup` - Lookup from related table
- `rollup` - Aggregate from related records
- `formula` - Calculated formula field
- `count` - Count of related records

#### Specialized Types
- `barcode` - Barcode value
- `qrcode` - QR code value
- `button` - Action button
- `json` - JSON data editor
- `coordinates` - Lat/Long coordinates
- `timezone` - Timezone selector
- `country` - Country selector

### 2. CRUD Drawer Component (`src/components/shared/crud-drawer.tsx`)
Full-featured right sidebar drawer with:

**Features:**
- ✅ Three modes: View, Create, Edit
- ✅ Dynamic form generation from schema
- ✅ All 40+ field types supported
- ✅ Real-time validation
- ✅ Activity feed panel
- ✅ Comments section
- ✅ Metadata display (created, updated)
- ✅ Duplicate functionality
- ✅ Delete with confirmation
- ✅ Responsive 800px width

**Field Rendering:**
Each field type has custom rendering logic:
- Currency shows $ prefix
- Percent shows % suffix
- Duration splits into hours/minutes
- Progress shows visual bar + percentage
- Date range has start/end inputs
- Color picker with hex input
- Rating displays 5 stars
- Files show upload interface
- JSON has syntax-aware editor
- Coordinates split lat/lng inputs

### 3. Enhanced Table View (`src/components/shared/enhanced-table-view.tsx`)
Advanced table with integrated CRUD:

**Features:**
- ✅ Dynamic columns from schema
- ✅ Checkbox selection
- ✅ Sortable columns
- ✅ Row actions menu (3-dot)
- ✅ Click row to view details
- ✅ "Add New" button
- ✅ Selection counter
- ✅ Integrated CRUD drawer
- ✅ Bulk actions toolbar

**Cell Rendering:**
Each field type displays appropriately in table cells:
- Status/Priority: Colored badges
- Currency: Formatted with $
- Percent: Shows %
- Duration: "2h 30m" format
- Progress: Mini progress bar
- Tags: Badges with "+X more"
- Users: User badges with "+X more"
- Color: Color swatch + hex
- Rating: Star display
- Files: File count badge
- Avatar: Circular image
- Email/Phone/URL: Clickable links
- Coordinates: Formatted lat/lng

### 4. Record Actions Menu (`src/components/shared/record-actions-menu.tsx`)
Three-dot menu for individual records:

**Actions:**
- View details
- Edit
- Duplicate
- Delete
- Custom actions support

### 5. Bulk Actions Toolbar (`src/components/shared/bulk-actions-toolbar.tsx`)
Fixed bottom toolbar when rows selected:

**Actions:**
- Delete multiple
- Duplicate multiple
- Archive multiple
- Bulk edit
- Clear selection

## 📋 Usage Pattern

### Step 1: Define Schema

```typescript
// src/lib/schemas/module-schemas.ts
import { ModuleSchema, commonFields } from '../data-schemas'

export const mySchema: ModuleSchema = {
  moduleId: 'module',
  tabId: 'module-tab',
  tableName: 'table_name',
  primaryKey: 'id',
  displayField: 'name',
  fields: [
    commonFields.id,
    commonFields.name,
    commonFields.description,
    commonFields.status,
    commonFields.priority,
    commonFields.assignee,
    commonFields.dueDate,
    
    // Custom fields
    { 
      id: 'budget', 
      label: 'Budget', 
      type: 'currency', 
      showInList: true, 
      showInForm: true, 
      order: 7 
    },
    { 
      id: 'progress', 
      label: 'Progress', 
      type: 'progress', 
      showInList: true, 
      showInForm: true, 
      order: 8 
    },
    { 
      id: 'category', 
      label: 'Category', 
      type: 'select', 
      showInList: true, 
      showInForm: true,
      options: [
        { label: 'Production', value: 'production', color: '#2563eb' },
        { label: 'Event', value: 'event', color: '#16a34a' },
      ],
      order: 9 
    },
    
    commonFields.tags,
    commonFields.createdAt,
  ],
}
```

### Step 2: Implement Tab Component

```typescript
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/hooks/use-toast"
import { EnhancedTableView } from "@/components/shared/enhanced-table-view"
import { mySchema } from "@/lib/schemas/module-schemas"
import type { DataItem } from "@/types"

export function MyTab() {
  const { toast } = useToast()
  const [data, setData] = useState<DataItem[]>([])

  const handleCreate = async (newData: Record<string, any>) => {
    const now = new Date().toISOString()
    const newItem: DataItem = {
      id: String(data.length + 1),
      ...newData,
      created_at: now,
      updated_at: now,
    }
    setData([...data, newItem])
    toast({ title: "Created successfully" })
  }

  const handleUpdate = async (id: string, updates: Record<string, any>) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, ...updates, updated_at: new Date().toISOString() } 
        : item
    ))
    toast({ title: "Updated successfully" })
  }

  const handleDelete = async (id: string) => {
    setData(data.filter(item => item.id !== id))
    toast({ title: "Deleted successfully" })
  }

  const handleBulkDelete = async (ids: string[]) => {
    setData(data.filter(item => !ids.includes(item.id)))
    toast({ title: `${ids.length} items deleted` })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Data</CardTitle>
        <CardDescription>Manage your data with full CRUD</CardDescription>
      </CardHeader>
      <CardContent>
        <EnhancedTableView
          data={data}
          schema={mySchema.fields}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />
      </CardContent>
    </Card>
  )
}
```

## 🗄️ Database Schema Guide

### Base Fields (Include in Every Table)
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
created_by UUID REFERENCES users(id),
organization_id UUID REFERENCES organizations(id) NOT NULL
```

### Field Type Mappings

| Field Type | PostgreSQL Type | Example |
|------------|----------------|---------|
| text, email, phone, url | VARCHAR(255) | VARCHAR(255) |
| textarea, richtext, markdown | TEXT | TEXT |
| number, count, autonumber | INTEGER | INTEGER |
| currency, decimal | DECIMAL(12,2) | DECIMAL(12,2) |
| percent, progress | INTEGER | INTEGER (0-100) |
| duration | INTEGER | INTEGER (minutes) |
| date | DATE | DATE |
| datetime | TIMESTAMP WITH TIME ZONE | TIMESTAMP WITH TIME ZONE |
| time | TIME | TIME |
| daterange | JSONB | JSONB {start, end} |
| select, status, priority | VARCHAR(50) | VARCHAR(50) |
| multiselect, tags, badge | TEXT[] | TEXT[] |
| checkbox, toggle | BOOLEAN | BOOLEAN |
| user, createdby, modifiedby | UUID | UUID REFERENCES users(id) |
| users | UUID[] | UUID[] |
| file, image, signature | JSONB | JSONB {url, name, size} |
| files, images | JSONB[] | JSONB[] |
| color | VARCHAR(7) | VARCHAR(7) (#HEXCODE) |
| rating | INTEGER | INTEGER (1-5) |
| relation, lookup | UUID | UUID REFERENCES table(id) |
| formula, rollup | JSONB | JSONB (calculated) |
| json | JSONB | JSONB |
| coordinates | JSONB | JSONB {lat, lng} |
| barcode, qrcode | VARCHAR(255) | VARCHAR(255) |

## 🚀 Implementation Status

### ✅ Completed
- [x] Core CRUD infrastructure
- [x] 40+ comprehensive field types
- [x] CRUD drawer with all field types
- [x] Enhanced table view with cell rendering
- [x] Record-level actions menu
- [x] Bulk actions toolbar
- [x] Data schema system
- [x] Example implementation (Admin - Billing)

### 🔄 Ready to Implement (Using Pattern)
All modules/tabs can now be implemented using the established pattern:

**Admin Module:**
- Billing (✅ Complete - reference implementation)
- Roles & Permissions
- Security Logs
- Members Management
- API Tokens
- Webhooks
- Templates
- Automations
- Integrations

**Projects Module:**
- Productions
- Activations
- Schedule
- Tasks
- Milestones
- Compliance
- Safety

**Events Module:**
- All Events
- Activities
- Run of Show
- Rehearsals
- Blocks
- Bookings
- Tours
- Itineraries
- Reservations
- Equipment
- Shipping & Receiving
- Trainings
- Incidents

**People Module:**
- Personnel
- Teams
- Assignments
- Timekeeping
- Scheduling
- Training
- Onboarding
- Openings
- Applicants

**Assets Module:**
- Tracking
- Inventory
- Maintenance
- Approvals
- Advances
- Catalog

**And 10+ more modules...**

## 💡 Key Features

### User Experience
- **Consistent Interface**: Same pattern across all modules
- **Quick Actions**: Right-click or 3-dot menu on any record
- **Bulk Operations**: Select multiple records for mass actions
- **Visual Feedback**: Toast notifications for all operations
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation

### Developer Experience
- **Type-Safe**: Full TypeScript support
- **Schema-Driven**: Single source of truth for data structure
- **Reusable**: DRY components used everywhere
- **Extensible**: Easy to add new field types
- **Documented**: Comprehensive inline documentation

### Data Integrity
- **Validation**: Built-in field validation
- **Required Fields**: Mark fields as required
- **Field Options**: Predefined options for selects
- **Relationships**: Proper foreign key handling
- **Audit Trail**: Created/updated timestamps and users

## 📊 Field Type Examples

### Progress Field
```typescript
{
  id: 'completion',
  label: 'Completion',
  type: 'progress',
  showInList: true,
  showInForm: true,
  defaultValue: 0
}
```

### Duration Field
```typescript
{
  id: 'estimated_time',
  label: 'Estimated Time',
  type: 'duration',
  showInList: true,
  showInForm: true,
  description: 'Time in hours and minutes'
}
```

### Status Field with Colors
```typescript
{
  id: 'status',
  label: 'Status',
  type: 'status',
  showInList: true,
  showInForm: true,
  options: [
    { label: 'Active', value: 'active', color: '#16a34a' },
    { label: 'On Hold', value: 'on_hold', color: '#f59e0b' },
    { label: 'Completed', value: 'completed', color: '#2563eb' },
    { label: 'Cancelled', value: 'cancelled', color: '#dc2626' },
  ]
}
```

### Coordinates Field
```typescript
{
  id: 'location',
  label: 'GPS Location',
  type: 'coordinates',
  showInList: true,
  showInForm: true,
  description: 'Latitude and longitude'
}
```

## 🎨 Styling & Theming

All components use your design system:
- Tailwind CSS classes
- shadcn/ui components
- Theme-aware colors
- Consistent spacing
- Proper animations

## 🔗 Integration Points

### Supabase
Ready to connect to Supabase:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

const handleCreate = async (data: Record<string, any>) => {
  const { data: newItem, error } = await supabase
    .from('table_name')
    .insert(data)
    .select()
    .single()
  
  if (error) throw error
  return newItem
}
```

### Real-time Updates
```typescript
useEffect(() => {
  const channel = supabase
    .channel('table_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'table_name' },
      (payload) => {
        // Update local state
      }
    )
    .subscribe()
  
  return () => { channel.unsubscribe() }
}, [])
```

## 📈 Next Steps

1. **Connect to Database**: Replace mock data with Supabase queries
2. **Add Authentication**: Implement user authentication
3. **Real-time Sync**: Add Supabase real-time subscriptions
4. **Advanced Validation**: Implement complex validation rules
5. **File Upload**: Connect file fields to storage service
6. **Search & Filter**: Add advanced search capabilities
7. **Export/Import**: Add data export and import features
8. **Permissions**: Implement row-level security
9. **Audit Logs**: Track all changes for compliance
10. **Performance**: Add pagination and virtual scrolling for large datasets

## 🎯 Benefits Summary

✅ **Comprehensive**: 40+ field types covering all use cases  
✅ **Consistent**: Same UX pattern across entire application  
✅ **Professional**: Matches industry leaders (ClickUp, Airtable, Smartsuite)  
✅ **Maintainable**: Clean, documented, reusable code  
✅ **Scalable**: Easy to add modules and field types  
✅ **Type-Safe**: Full TypeScript support  
✅ **Accessible**: WCAG compliant  
✅ **Responsive**: Works on all devices  
✅ **Fast**: Optimized performance  
✅ **Beautiful**: Modern, polished UI  

## 📚 Reference

- **Example Implementation**: `/src/components/admin/billing-tab.tsx`
- **Field Types**: `/src/lib/data-schemas.ts`
- **CRUD Drawer**: `/src/components/shared/crud-drawer.tsx`
- **Table View**: `/src/components/shared/enhanced-table-view.tsx`
- **Schemas**: `/src/lib/schemas/admin-schemas.ts`

---

**Status**: ✅ Core system complete and ready for module implementation  
**Last Updated**: October 12, 2025  
**Version**: 1.0.0
