# Tab Configuration Implementation

## Overview
Implemented tab visibility toggling and reordering functionality for module tabs in the right sidebar drawer, matching the existing data field configuration feature.

## Implementation Summary

### 1. Created TabConfigPanel Component
**File**: `/src/components/shared/tab-config-panel.tsx`
- Mirrors the functionality of `FieldConfigPanel`
- Features:
  - Toggle visibility of individual tabs (first tab is locked as required)
  - Drag-and-drop reordering of tabs
  - Search/filter tabs by name
  - Show All / Hide All bulk actions
  - Visual indicators for tab icons and colors
  - Tab descriptions displayed
  - Preset options (Essential, Full, Minimal, Custom)

### 2. Updated UI Store
**File**: `/src/store/ui-store.ts`
- Added `tabConfigs` state to persist tab configurations per module
- Added `setTabConfig(moduleId, tabs)` method to save tab configuration
- Added `getTabConfig(moduleId)` method to retrieve saved configuration
- Configurations are persisted using Zustand's persist middleware

### 3. Updated Right Sidebar
**File**: `/src/components/layout/right-sidebar.tsx`
- Added new "Tabs" tab to the sidebar tabs list (with Layout icon)
- Integrated `TabConfigPanel` component
- Passes current module's tabs to the configuration panel
- Handles saving tab configuration changes to the UI store
- Shows appropriate message when no module tabs are available

### 4. Updated ModuleTabs Component
**File**: `/src/components/layout/module-tabs.tsx`
- Now reads tab configuration from UI store
- Filters out disabled tabs
- Sorts tabs by the configured order
- Falls back to registry tabs if no custom configuration exists

### 5. Added Quick Access Buttons
**Files**: 
- `/src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/page.tsx`
- `/src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx`

- Added "Tab Configuration" button next to "Field Configuration" button in module headers
- Uses Layout icon for consistency
- Opens right sidebar to the "tabs" panel when clicked

## User Experience

### How to Use:
1. Navigate to any module with tabs (e.g., Dashboard, Projects, Events)
2. Click the **Layout icon button** in the module header (or open the right sidebar and select "Tabs" tab)
3. In the Tab Configuration panel:
   - **Toggle visibility**: Click the eye icon to show/hide tabs
   - **Reorder tabs**: Drag tabs by the grip handle to reorder
   - **Search tabs**: Use the search box to filter tabs
   - **Bulk actions**: Use "Show All" or "Hide All" buttons
   - **Presets**: Select from preset configurations (Essential, Full, Minimal, Custom)

### Features:
- **First tab locked**: The first tab in each module cannot be hidden or reordered (serves as the default tab)
- **Persistent settings**: Tab configurations are saved per module and persist across sessions
- **Real-time updates**: Tab bar updates immediately when visibility or order changes
- **Visual feedback**: Tab icons and colors are displayed in the configuration panel

## Technical Details

### Data Flow:
1. User modifies tab configuration in `TabConfigPanel`
2. Changes are saved to UI store via `setTabConfig(moduleSlug, tabs)`
3. `ModuleTabs` component reads configuration via `getTabConfig(moduleSlug)`
4. Tabs are filtered (enabled only) and sorted by order
5. Tab bar renders with updated visibility and order

### State Persistence:
- Tab configurations are stored in Zustand store with persist middleware
- Storage key: `ui-storage`
- Data structure: `{ tabConfigs: { [moduleId: string]: ModuleTab[] } }`

## Files Modified/Created:
1. ✅ Created: `/src/components/shared/tab-config-panel.tsx`
2. ✅ Modified: `/src/store/ui-store.ts`
3. ✅ Modified: `/src/components/layout/right-sidebar.tsx`
4. ✅ Modified: `/src/components/layout/module-tabs.tsx`
5. ✅ Modified: `/src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/page.tsx`
6. ✅ Modified: `/src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx`

## Testing Recommendations:
1. Test tab visibility toggling on different modules
2. Test drag-and-drop reordering
3. Test persistence across page refreshes
4. Test search/filter functionality
5. Test bulk Show All / Hide All actions
6. Verify first tab cannot be hidden or reordered
7. Test with modules that have varying numbers of tabs
