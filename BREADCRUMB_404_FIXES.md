# Breadcrumb Navigation 404 Fixes

## Summary
Resolved 404 errors in the top header breadcrumb navigation system and other navigation components by updating invalid route URLs to include proper tab slugs.

## Root Cause
The application uses a routing structure of `/{locale}/workspace/{workspaceId}/{module}/{tab}`, but many navigation links were pointing to incomplete routes like:
- `/{locale}/workspace/{workspaceId}` (no module or tab)
- `/{locale}/workspace/{workspaceId}/{module}` (no tab)

These incomplete routes don't have corresponding page files and result in 404 errors.

## Files Modified

### 1. **Breadcrumb Navigation** (`src/components/layout/breadcrumb-nav.tsx`)
- **Workspace link**: Changed from `/{locale}/workspace/{workspaceId}` to `/{locale}/workspace/{workspaceId}/dashboard/overview`
- **Module link**: Now dynamically fetches the first tab slug from the module's tab registry
- **Added import**: `getModuleTabs` from tabs-registry

### 2. **Sidebar Navigation** (`src/components/layout/sidebar.tsx`)
- **Favorites section**: Updated module links to include first tab slug
- **Module categories**: Updated all module links to include first tab slug
- **Admin link**: Changed from `/{locale}/workspace/{workspaceId}/admin` to `/{locale}/workspace/{workspaceId}/admin/overview`
- **Added import**: `getModuleTabs` from tabs-registry

### 3. **Command Palette** (`src/components/layout/command-palette.tsx`)
- **Projects navigation**: Changed to `/projects/overview`
- **People navigation**: Changed to `/people/personnel`
- **Events navigation**: Changed to `/events/all-events`
- **Admin navigation**: Changed to `/admin/overview`
- **Fixed TypeScript error**: Changed `"doc"` to `"file"` for create item type

### 4. **Quick Actions** (`src/components/layout/quick-actions.tsx`)
- **My Agenda**: Changed from `/events/show-calendar` to `/dashboard/my-agenda`
- **My Tasks**: Changed from `/projects/my-tasks` to `/dashboard/my-tasks`
- **My Files**: Changed from `/files/all-files` to `/dashboard/my-files`

### 5. **Error Pages**
- **Module Error** (`src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/error.tsx`):
  - Back to Workspace button now points to `/dashboard/overview`
  
- **Tab Error** (`src/app/[locale]/(dashboard)/workspace/[workspaceId]/[module]/[tab]/error.tsx`):
  - Back to Module button now dynamically includes the first tab slug
  - **Added import**: `getModuleTabs` from tabs-registry

## Implementation Pattern

For dynamic module links, the following pattern is now used:

```typescript
import { getModuleTabs } from '@/lib/modules/tabs-registry'

const moduleTabs = getModuleTabs(moduleSlug)
const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'
const href = `/${locale}/workspace/${workspaceId}/${moduleSlug}/${firstTabSlug}`
```

## Valid Route Structure

All navigation links now follow the proper routing structure:
- ✅ `/{locale}/workspace/{workspaceId}/{module}/{tab}`
- ✅ Examples:
  - `/en/workspace/123/dashboard/overview`
  - `/en/workspace/123/projects/productions`
  - `/en/workspace/123/admin/members`

## Additional Fixes

While resolving the 404 errors, also fixed a pre-existing TypeScript error in `command-palette.tsx`:
- Changed `"doc"` item type to `"file"` to match the valid ItemType union definition

## Testing Recommendations

1. Navigate through all modules using the sidebar
2. Click breadcrumb links to ensure proper navigation
3. Test command palette navigation shortcuts
4. Test quick action buttons in the top bar
5. Trigger error pages and test the "Back" buttons
6. Verify favorites in sidebar navigate correctly

## Impact

All navigation components now route to valid pages, eliminating 404 errors when:
- Clicking workspace name in breadcrumbs
- Clicking module names in breadcrumbs
- Using sidebar navigation
- Using command palette shortcuts
- Using quick action buttons
- Recovering from error pages
