# Atomic Design System Architecture

**Status:** Implementation In Progress  
**Date:** October 17, 2025  
**Version:** 1.0.0

## Overview

This document defines the complete Atomic Design Methodology architecture for Dragonfly26.00, organizing all UI components into a hierarchical system that eliminates redundancy and maximizes reusability.

## Architecture Layers

### 1. **Design Tokens** (`/src/design-tokens/`)
Foundation-level design decisions that cascade through all components.

**Existing:**
- ✅ `colors.ts` - Complete color system (status, priority, type, category, condition)
- ✅ `spacing.ts` - Spacing scale
- ✅ `index.ts` - Central export

**Status:** Complete - 100%

---

### 2. **Atoms** (`/src/components/atoms/`)
Smallest, indivisible UI components. Cannot be broken down further.

**Existing Structure:**
```
atoms/
├── badges/          ✅ Complete (4 components)
│   ├── StatusBadge.tsx
│   ├── PriorityBadge.tsx
│   ├── TypeBadge.tsx
│   └── CategoryBadge.tsx
├── buttons/         ✅ Complete (2 components)
│   ├── IconButton.tsx
│   └── ActionButton.tsx
├── cards/           ✅ Complete (1 component)
│   └── StatCard.tsx
├── indicators/      ✅ Complete (3 components)
│   ├── LoadingSpinner.tsx
│   ├── ProgressBar.tsx
│   └── EmptyStateIcon.tsx
├── text/            ✅ Complete (2 components)
│   ├── SectionHeading.tsx
│   └── MetaText.tsx
├── icons/           🔨 To Build
└── inputs/          🔨 To Build
```

**Gaps to Fill:**
- Icon wrappers with consistent sizing
- Input primitives (text, number, date)
- Avatar component
- Checkbox/Radio primitives
- Toggle/Switch primitives

---

### 3. **Molecules** (`/src/components/molecules/`)
Simple combinations of atoms that form functional units.

**Existing Structure:**
```
molecules/
├── controls/        ✅ Complete (4 components)
│   ├── SearchBar.tsx
│   ├── FilterButton.tsx
│   ├── SortControl.tsx
│   └── ViewSwitcher.tsx
├── data-display/    ✅ Complete (2 components)
│   ├── StatsGrid.tsx
│   └── DataList.tsx
├── menus/           ✅ Complete (1 component)
│   └── ActionMenu.tsx
└── form-fields/     🔨 To Build
```

**Gaps to Fill from Views:**
- Form field groups (label + input + error)
- Search with filters
- Date range picker
- Assignee selector molecule
- Tag input group
- File upload molecule

---

### 4. **Organisms** (`/src/components/organisms/`)
Complex components built from molecules and atoms.

**Existing Structure:**
```
organisms/
└── data-views/      ⚠️ Partial (2 components)
    ├── DataTable.tsx
    └── CardGrid.tsx
```

**Gaps to Fill from Views:**
- Board column (from board-view)
- Board card (from board-view)
- Calendar grid
- Timeline track
- Chart containers
- Form sections
- Filter panels
- Bulk action toolbars
- CRUD drawers

---

### 5. **Templates** (`/src/components/templates/`)
Page-level layouts that define structure without content.

**Current Status:** 🔨 Does Not Exist - To Build

**Required Templates:**
- Data view template (table/board/list/calendar)
- Dashboard template (widgets + stats)
- Detail page template (header + tabs + content)
- Form template (sections + actions)
- Settings template (sidebar + content)
- Split view template (list + detail)

---

### 6. **Pages** (`/src/app/` and custom views)
Complete pages built from templates with real content.

**Current Status:** ⚠️ Exists but not using atomic system

**Required Pages:**
- Custom data views for each module
- Dashboard pages
- Settings pages
- Profile pages

---

## Component Inventory

### From `/src/components/ui/` (30 components)
These are shadcn/ui primitives - they serve as atoms:
- ✅ Alert, AlertDialog, Avatar, Badge, Button
- ✅ Calendar, Card, Checkbox, Command, Dialog
- ✅ DropdownMenu, Input, Label, Popover, Progress
- ✅ RadioGroup, ScrollArea, Select, Separator, Sheet
- ✅ Switch, Table, Tabs, Textarea, Toast, Tooltip
- ✅ AnimatedIcon, LoadingSpinner, PageTransition

**Action:** Map to atomic layer, no duplication needed

---

### From `/src/components/views/` (21 components)
These are complex organisms/templates that need decomposition:

**Data Views (Organisms):**
1. ✅ `enhanced-table-view.tsx` → Already an organism
2. ✅ `list-view.tsx` → Decompose into molecules
3. ✅ `board-view.tsx` → Decompose (uses board-card, board-column)
4. ✅ `calendar-view.tsx` → Decompose into calendar organism
5. ✅ `timeline-view.tsx` → Decompose into timeline organism
6. ✅ `box-view.tsx` → Decompose into box grid organism
7. ✅ `dashboard-view.tsx` → Template + organisms
8. ✅ `portfolio-view.tsx` → Decompose into portfolio grid
9. ✅ `workload-view.tsx` → Decompose into workload chart
10. ✅ `pivot-view.tsx` → Decompose into pivot table
11. ✅ `financial-view.tsx` → Decompose into financial widgets

**Specialized Views (Organisms):**
12. ✅ `activity-view.tsx` → Activity feed organism
13. ✅ `chat-view.tsx` → Chat organism
14. ✅ `doc-view.tsx` → Document editor organism
15. ✅ `embed-view.tsx` → Embed container organism
16. ✅ `form-view.tsx` → Form builder organism
17. ✅ `map-view.tsx` → Map organism
18. ✅ `mind-map-view.tsx` → Mind map organism

**Utilities:**
19. ✅ `view-switcher.tsx` → Already a molecule
20. ✅ `board-card.tsx` → Molecule
21. ✅ `board-column.tsx` → Molecule

---

### From `/src/components/shared/` (33 components)
These are mixed - need categorization:

**Organisms:**
- crud-drawer.tsx
- create-item-dialog-enhanced.tsx
- item-detail-drawer.tsx
- filter-panel.tsx
- filters-panel.tsx
- sort-panel.tsx
- export-panel.tsx
- import-panel.tsx
- share-panel.tsx
- field-config-panel.tsx
- tab-config-panel.tsx
- time-tracker.tsx
- comments-section.tsx
- activity-feed.tsx
- checklist-manager.tsx
- dependencies-manager.tsx
- watchers-manager.tsx
- custom-field-editor.tsx
- recurrence-editor.tsx

**Molecules:**
- bulk-actions-toolbar.tsx
- record-actions-menu.tsx
- mobile-table-card.tsx
- assignee-selector.tsx
- asset-catalog-autocomplete.tsx

**Tab Content (Organisms):**
- agenda-tab-content.tsx
- files-tab-content.tsx
- notifications-tab-content.tsx
- photo-tab-content.tsx
- scan-tab-content.tsx
- tasks-tab-content.tsx

**Atoms:**
- empty-state.tsx
- error-display.tsx

---

## Naming Convention Standards

### Current Issues:
- ❌ Inconsistent casing (PascalCase vs kebab-case files)
- ❌ Generic names causing conflicts (Button, Card, etc.)
- ❌ No clear layer identification in names

### New Standards:

#### File Naming:
```
atoms/      → PascalCase.tsx (e.g., StatusBadge.tsx)
molecules/  → PascalCase.tsx (e.g., SearchBar.tsx)
organisms/  → PascalCase.tsx (e.g., DataTable.tsx)
templates/  → PascalCase.tsx (e.g., DataViewTemplate.tsx)
pages/      → kebab-case.tsx (e.g., dashboard-page.tsx)
```

#### Component Naming:
```typescript
// Atoms - Simple descriptive names
export function StatusBadge() {}
export function IconButton() {}

// Molecules - Compound names
export function SearchBarWithFilters() {}
export function FormFieldGroup() {}

// Organisms - Domain-specific names
export function DataTableOrganism() {}
export function BoardViewOrganism() {}

// Templates - Suffix with "Template"
export function DataViewTemplate() {}
export function DashboardTemplate() {}

// Pages - Suffix with "Page"
export function DashboardPage() {}
```

#### Folder Structure:
```
src/
├── design-tokens/           # Foundation
├── components/
│   ├── atoms/              # Layer 1
│   │   ├── badges/
│   │   ├── buttons/
│   │   ├── inputs/
│   │   ├── icons/
│   │   └── text/
│   ├── molecules/          # Layer 2
│   │   ├── controls/
│   │   ├── data-display/
│   │   ├── form-fields/
│   │   └── menus/
│   ├── organisms/          # Layer 3
│   │   ├── data-views/
│   │   ├── panels/
│   │   ├── feeds/
│   │   └── editors/
│   ├── templates/          # Layer 4
│   │   ├── data-views/
│   │   ├── dashboards/
│   │   └── forms/
│   └── ui/                 # shadcn/ui primitives (treated as atoms)
└── app/                    # Pages (Layer 5)
```

---

## Implementation Strategy

### Phase 1: Atom Completion ✅ (Current)
1. Audit existing atoms
2. Extract missing atoms from ui/ and views/
3. Create icon wrappers
4. Create input primitives
5. Update atom index exports

### Phase 2: Molecule Completion 🔨
1. Extract molecules from views/
2. Build form field molecules
3. Build data display molecules
4. Normalize naming
5. Update molecule index exports

### Phase 3: Organism Extraction 🔨
1. Decompose complex views into organisms
2. Extract shared organisms from /shared/
3. Build data view organisms
4. Build panel organisms
5. Update organism index exports

### Phase 4: Template Creation 🔨
1. Create template layer structure
2. Build data view templates
3. Build dashboard templates
4. Build form templates
5. Create template index exports

### Phase 5: Page Migration 🔨
1. Rebuild custom data views using templates
2. Migrate existing pages to atomic system
3. Remove redundant components
4. Update all imports

### Phase 6: Documentation & Testing 🔨
1. Create component documentation
2. Build Storybook stories
3. Write unit tests
4. Create usage examples
5. Final audit and cleanup

---

## Success Metrics

- ✅ Zero component duplication
- ✅ 100% atomic design compliance
- ✅ Consistent naming across all layers
- ✅ Complete type safety
- ✅ Full i18n support
- ✅ WCAG 2.1 AA accessibility
- ✅ Comprehensive documentation
- ✅ All custom views using atomic system

---

## Dependencies

### Required Packages:
- ✅ React 18+
- ✅ Next.js 14+
- ✅ TypeScript 5+
- ✅ Tailwind CSS 3+
- ✅ shadcn/ui
- ✅ next-intl
- ✅ @tanstack/react-table
- ✅ @dnd-kit/core
- ✅ lucide-react

### Design System:
- ✅ Design tokens (colors, spacing)
- ✅ Tailwind config
- ✅ CSS variables
- ✅ Dark mode support

---

## Notes

- All components must use design tokens
- All text must be internationalized (next-intl)
- All interactive elements must be accessible (ARIA)
- All components must support dark mode
- Prefer composition over inheritance
- Keep atoms pure and stateless when possible
- Use TypeScript for all components
- Export types alongside components

---

**Next Steps:** Begin Phase 2 - Molecule Completion
