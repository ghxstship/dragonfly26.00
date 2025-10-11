# New/Create/Add Button Implementation

## Overview
Successfully implemented functionality for all New/Create/Add buttons across all submodule pages. The buttons now open appropriate creation dialogs based on the module context.

## Implementation Summary

### 1. Helper Utility Created
**File**: `src/lib/modules/item-type-mapper.ts`

Created a centralized mapping system that:
- Maps module slugs to appropriate item types (`task`, `project`, `doc`, `list`, `workspace`)
- Provides contextual labels for "New" buttons (e.g., "New Project", "New Event", "New Person")
- Ensures consistent item creation across all modules

### 2. Generic Module Pages Updated

#### Files Modified:
1. `src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/page.tsx`
2. `src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/page.tsx`

#### Changes Made:
- Added `CreateItemDialog` component integration
- Imported helper functions: `getItemTypeForModule()` and `getNewItemLabel()`
- Added state management for dialog open/close
- Connected "New" button to open the create dialog
- Button now displays contextual labels (e.g., "+ New Project", "+ New Event")

### 3. Specialized Pages (Already Working)

The following pages already had fully functional create dialogs:

| Page | Create Button | Dialog Component | Status |
|------|--------------|------------------|--------|
| **Goals** | "Create Goal" | `CreateGoalDialog` | ✓ Working |
| **Automations** | "Create Automation" | `AutomationBuilder` | ✓ Working |
| **Webhooks** | "Create Webhook" | `CreateWebhookDialog` | ✓ Working |
| **API Tokens** | "Create Token" | `CreateTokenDialog` | ✓ Working |
| **Reports** | "Create Report" | `CreateReportDialog` | ✓ Working |

## Module-to-Item Type Mapping

| Module | Item Type | New Button Label |
|--------|-----------|------------------|
| Projects | `project` | + New Project |
| Events | `task` | + New Event |
| People | `task` | + New Person |
| Assets | `task` | + New Asset |
| Locations | `task` | + New Location |
| Files | `doc` | + New Document |
| Companies | `task` | + New Company |
| Contacts | `task` | + New Contact |
| Finance | `task` | + New Transaction |
| Procurement | `task` | + New Purchase Order |
| Jobs | `task` | + New Job Posting |

## CreateItemDialog Features

The generic `CreateItemDialog` component supports:

### Item Types:
- **Task**: Name, description, assignee, priority, due date
- **Project**: Name, description, status, start date
- **Doc**: Name, description
- **List**: Name, description
- **Workspace**: Name, description, icon

### Common Features:
- Form validation (required fields)
- Loading states during submission
- Success callback for item creation
- Automatic form reset after creation
- Mock API simulation (ready for Supabase integration)

## Usage Example

```tsx
import { CreateItemDialog } from "@/components/shared/create-item-dialog"
import { getItemTypeForModule, getNewItemLabel } from "@/lib/modules/item-type-mapper"

// In component:
const [createDialogOpen, setCreateDialogOpen] = useState(false)

// Button:
<Button onClick={() => setCreateDialogOpen(true)}>
  + New {getNewItemLabel(moduleSlug, currentModule.name)}
</Button>

// Dialog:
<CreateItemDialog
  open={createDialogOpen}
  onOpenChange={setCreateDialogOpen}
  type={getItemTypeForModule(moduleSlug)}
  onSuccess={(item) => {
    console.log("Created item:", item)
    // TODO: Add to data store and refresh list
  }}
/>
```

## Next Steps (Backend Integration)

1. **Connect to Supabase**:
   - Update `onSuccess` callback to insert items into database
   - Implement real-time data refresh after creation
   - Add error handling and user notifications

2. **Enhance Item Types**:
   - Create specialized dialogs for complex item types (Events, Assets, etc.)
   - Add module-specific custom fields
   - Implement relationship linking (e.g., link events to projects)

3. **Permissions**:
   - Add permission checks before showing create buttons
   - Validate user access before allowing item creation
   - Implement organization/workspace-level restrictions

4. **Validation**:
   - Add server-side validation
   - Implement duplicate checking
   - Add business logic constraints

## Testing Checklist

- [x] Generic module pages show contextual "New" button labels
- [x] Clicking "New" button opens CreateItemDialog
- [x] Dialog displays correct fields based on item type
- [x] Form validation works (required fields)
- [x] Dialog closes and resets after creation
- [x] Console logs show created item data
- [ ] Integration with Supabase (pending backend work)
- [ ] Real-time list updates after creation (pending)

## Notes

- All buttons use consistent styling and placement (upper right of module header)
- Mock data generation is in place for demonstration
- Ready for Supabase integration with minimal changes
- Specialized modules maintain their custom creation dialogs
- Generic modules use the flexible CreateItemDialog component
