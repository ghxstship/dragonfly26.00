# Atomic Design System - Usage Guide

**Version:** 1.0.0  
**Date:** October 17, 2025  
**Status:** Production Ready

## Quick Start

```typescript
// Import from atomic layers
import { StatusBadge, IconWrapper, UserAvatar } from '@/components/atoms'
import { StatCard, KeyValuePair, SearchWithFilters } from '@/components/molecules'
import { ListViewOrganism, FilterPanelOrganism } from '@/components/organisms'
import { DataViewTemplate, DashboardTemplate } from '@/components/templates'

// Import design tokens
import { statusColors, priorityColors } from '@/design-tokens/colors'
```

---

## Layer-by-Layer Guide

### 1. Atoms (Smallest Components)

#### Badges
```typescript
import { StatusBadge, PriorityBadge, TypeBadge, CategoryBadge } from '@/components/atoms'

// Status badge with auto-color
<StatusBadge status="active" />
<StatusBadge status="pending" showIcon />

// Priority badge
<PriorityBadge priority="high" />

// Type badge
<TypeBadge type="contract" />

// Category badge
<CategoryBadge category="equipment" />
```

#### Icons
```typescript
import { IconWrapper } from '@/components/atoms'
import { User, Settings } from 'lucide-react'

// Icon with background
<IconWrapper icon={User} size="md" background="blue" />

// Plain icon
<IconWrapper icon={Settings} size="lg" />
```

#### Inputs
```typescript
import { TextInput, NumberInput, DateInput } from '@/components/atoms'

// Text input with label and error
<TextInput 
  label="Email" 
  type="email" 
  required 
  error="Invalid email"
  helperText="We'll never share your email"
/>

// Number input with prefix
<NumberInput 
  label="Price" 
  prefix="$" 
  step={0.01}
  min={0}
/>

// Date picker
<DateInput 
  label="Start Date" 
  value={date} 
  onChange={setDate}
  required
/>
```

#### Avatars
```typescript
import { UserAvatar } from '@/components/atoms'

// Avatar with status
<UserAvatar 
  name="John Doe" 
  src="/avatar.jpg"
  status="online"
  size="md"
/>
```

#### Text Components
```typescript
import { Label, Value, SectionHeading, MetaText } from '@/components/atoms'

// Key-value display
<Label>Status</Label>
<Value emphasis>Active</Value>

// Section heading
<SectionHeading>Overview</SectionHeading>

// Meta text
<MetaText>Last updated 2 hours ago</MetaText>
```

---

### 2. Molecules (Simple Combinations)

#### Data Display
```typescript
import { StatCard, KeyValuePair, UserInfo } from '@/components/molecules'

// Stat card for dashboards
<StatCard
  icon={Users}
  label="Total Users"
  value="1,234"
  trend="+12%"
  iconColor="blue"
/>

// Key-value pair
<KeyValuePair 
  label="Status" 
  value="Active"
  emphasis
/>

// User info with avatar
<UserInfo
  name="Jane Smith"
  subtitle="Project Manager"
  avatarSrc="/avatar.jpg"
  status="online"
  size="md"
/>
```

#### Form Fields
```typescript
import { FormFieldGroup, DateRangePicker } from '@/components/molecules'

// Form field with any input
<FormFieldGroup 
  label="Email" 
  required 
  error="Invalid email"
  helperText="Enter your work email"
>
  <Input type="email" />
</FormFieldGroup>

// Date range picker
<DateRangePicker
  label="Date Range"
  value={dateRange}
  onChange={setDateRange}
/>
```

#### Controls
```typescript
import { SearchWithFilters, ViewSwitcher } from '@/components/molecules'

// Search with filter badges
<SearchWithFilters
  value={search}
  onChange={setSearch}
  onFilterClick={() => setShowFilters(true)}
  activeFilters={['Status: Active', 'Type: Project']}
  onRemoveFilter={handleRemoveFilter}
  onClearFilters={handleClearAll}
/>

// View switcher
<ViewSwitcher
  views={['table', 'board', 'list']}
  activeView={currentView}
  onChange={setCurrentView}
/>
```

---

### 3. Organisms (Complex Components)

#### Data Views
```typescript
import { ListViewOrganism, BoardViewOrganism } from '@/components/organisms'

// List view with grouping
<ListViewOrganism
  data={items}
  schema={fieldSchema}
  onItemClick={handleItemClick}
  onCreateAction={handleCreate}
/>

// Board view with drag-and-drop
<BoardViewOrganism
  data={items}
  schema={fieldSchema}
  columns={customColumns}
  onItemClick={handleItemClick}
/>
```

#### Panels
```typescript
import { FilterPanelOrganism } from '@/components/organisms'

// Filter panel as sheet (mobile)
<FilterPanelOrganism
  mode="sheet"
  filters={filterGroups}
  values={activeFilters}
  onChange={setActiveFilters}
  onClear={handleClearFilters}
/>

// Filter panel as sidebar (desktop)
<FilterPanelOrganism
  mode="sidebar"
  filters={filterGroups}
  values={activeFilters}
  onChange={setActiveFilters}
/>
```

---

### 4. Templates (Page Layouts)

#### Data View Template
```typescript
import { DataViewTemplate } from '@/components/templates'
import { Table, Kanban, List } from 'lucide-react'

<DataViewTemplate
  title="Projects"
  subtitle="Manage all your projects"
  views={[
    {
      id: 'table',
      label: 'Table',
      icon: <Table className="h-4 w-4" />,
      content: <EnhancedTableView data={projects} schema={schema} />
    },
    {
      id: 'board',
      label: 'Board',
      icon: <Kanban className="h-4 w-4" />,
      content: <BoardViewOrganism data={projects} schema={schema} />
    },
    {
      id: 'list',
      label: 'List',
      icon: <List className="h-4 w-4" />,
      content: <ListViewOrganism data={projects} schema={schema} />
    }
  ]}
  createLabel="New Project"
  onCreateClick={handleCreate}
  searchValue={search}
  onSearchChange={setSearch}
  onFilterClick={() => setShowFilters(true)}
  activeFilters={activeFilterLabels}
  onRemoveFilter={handleRemoveFilter}
  onClearFilters={handleClearFilters}
  selectedCount={selectedItems.length}
  bulkActions={
    <>
      <Button variant="outline" size="sm">Export</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </>
  }
/>
```

#### Dashboard Template
```typescript
import { DashboardTemplate } from '@/components/templates'

<DashboardTemplate
  title="Dashboard"
  subtitle="Overview of your workspace"
  widgets={[
    <StatCard key="1" icon={Users} label="Total Users" value="1,234" />,
    <StatCard key="2" icon={DollarSign} label="Revenue" value="$45,678" />,
    <ChartWidget key="3" title="Activity" data={chartData} />,
    <RecentActivity key="4" items={recentItems} />
  ]}
  columns={{ default: 1, md: 2, lg: 3 }}
  onRefresh={handleRefresh}
  onSettings={handleSettings}
/>
```

#### Form Template
```typescript
import { FormTemplate } from '@/components/templates'

<FormTemplate
  title="Create Project"
  subtitle="Set up a new project"
  sections={[
    {
      title: 'Basic Information',
      description: 'Enter the project details',
      content: (
        <div className="space-y-4">
          <TextInput label="Project Name" required />
          <TextInput label="Description" />
          <DateInput label="Start Date" />
        </div>
      )
    },
    {
      title: 'Settings',
      description: 'Configure project settings',
      content: (
        <div className="space-y-4">
          <Select label="Status" options={statusOptions} />
          <Select label="Priority" options={priorityOptions} />
        </div>
      )
    }
  ]}
  saveLabel="Create Project"
  onSave={handleSave}
  onCancel={handleCancel}
  loading={isSubmitting}
/>
```

---

## Design Tokens

### Colors
```typescript
import { 
  statusColors, 
  priorityColors, 
  typeColors,
  categoryColors,
  conditionColors,
  iconBackgroundColors 
} from '@/design-tokens/colors'

// Use in className
<Badge className={statusColors.active}>Active</Badge>
<span className={priorityColors.high}>High Priority</span>

// Icon backgrounds
<IconWrapper icon={User} background="blue" />
```

### Spacing
```typescript
import { spacing } from '@/design-tokens/spacing'

// Consistent spacing scale
<div className={spacing.section}>...</div>
```

---

## Best Practices

### 1. **Always Use Design Tokens**
```typescript
// ✅ Good - Uses design token
<Badge className={statusColors.active}>Active</Badge>

// ❌ Bad - Hardcoded color
<Badge className="bg-green-100 text-green-800">Active</Badge>
```

### 2. **Compose from Lower Layers**
```typescript
// ✅ Good - Builds molecule from atoms
function CustomCard() {
  return (
    <Card>
      <IconWrapper icon={User} background="blue" />
      <Label>Name</Label>
      <Value>John Doe</Value>
    </Card>
  )
}

// ❌ Bad - Reimplements atom functionality
function CustomCard() {
  return (
    <Card>
      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <User className="h-5 w-5" />
      </div>
      <span className="text-sm text-muted-foreground">Name</span>
      <span className="text-sm">John Doe</span>
    </Card>
  )
}
```

### 3. **Use Templates for Pages**
```typescript
// ✅ Good - Uses template
export function ProjectsPage() {
  return (
    <DataViewTemplate
      title="Projects"
      views={views}
      onCreateClick={handleCreate}
    />
  )
}

// ❌ Bad - Rebuilds layout
export function ProjectsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-6">
        <h1>Projects</h1>
        <Button onClick={handleCreate}>Create</Button>
      </div>
      <div className="flex-1">
        {/* content */}
      </div>
    </div>
  )
}
```

### 4. **Maintain Accessibility**
All atomic components include:
- ARIA labels
- Keyboard navigation
- Screen reader support
- Semantic HTML

Always preserve these features when composing components.

### 5. **Internationalization**
All text must use `useTranslations`:
```typescript
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations()
  
  return (
    <Button>{t('common.save')}</Button>
  )
}
```

---

## Component Hierarchy

```
Design Tokens (Foundation)
    ↓
Atoms (Smallest)
    ↓
Molecules (Simple Combinations)
    ↓
Organisms (Complex Components)
    ↓
Templates (Page Layouts)
    ↓
Pages (Complete Views)
```

---

## Migration Guide

### Migrating Existing Components

1. **Identify the Layer**
   - Is it a simple element? → Atom
   - Combines 2-3 atoms? → Molecule
   - Complex with state? → Organism
   - Page layout? → Template

2. **Extract to Atomic Layer**
   ```typescript
   // Before: Inline implementation
   <div className="flex items-center gap-2">
     <div className="h-8 w-8 rounded-full bg-blue-100">
       <User className="h-4 w-4" />
     </div>
     <span>John Doe</span>
   </div>
   
   // After: Use atomic components
   <UserInfo name="John Doe" />
   ```

3. **Update Imports**
   ```typescript
   // Before
   import { Button } from '@/components/ui/button'
   
   // After (if using custom atomic button)
   import { ActionButton } from '@/components/atoms'
   ```

4. **Apply Design Tokens**
   ```typescript
   // Before
   className="bg-green-100 text-green-800"
   
   // After
   className={statusColors.active}
   ```

---

## Examples

See `/src/components/templates/` for complete page examples using the atomic design system.

---

## Support

For questions or issues with the atomic design system:
1. Check this guide
2. Review `/docs/ATOMIC_DESIGN_ARCHITECTURE.md`
3. Examine existing atomic components for patterns
4. Ensure all accessibility and i18n requirements are met
