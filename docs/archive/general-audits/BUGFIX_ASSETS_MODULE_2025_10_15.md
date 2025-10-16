# Assets Module Bug Fixes - October 15, 2025

## Issues Resolved

### 1. Approvals Tab Error
**Error**: `column approval_chains_1.chain_name does not exist`

**Root Cause**: The query in `use-module-data.ts` was referencing incorrect column names from the `approval_chains` table schema.

**Fix**: Updated the query to use the correct column names:
- Changed `chain_name` → `name`
- Changed `target_type` → `triggers_on`

**Files Modified**:
- `src/hooks/use-module-data.ts` (line 115, 142)

### 2. Advances Tab Error
**Error**: `Could not find a relationship between 'production_advances' and 'profiles' in the schema cache`

**Root Cause**: The query was referencing `requested_by` column that doesn't exist in the `production_advances` table. The actual column name is `requestor_id`.

**Fix**: Updated the query to use the correct foreign key relationship:
- Changed `requested_by_user:profiles!requested_by` → `requestor:profiles!requestor_id`

**Files Modified**:
- `src/hooks/use-module-data.ts` (line 26, 74)

### 3. Missing Tab Components
**Issue**: The Approvals and Advances tabs had no UI components defined.

**Fix**: Created two new tab components:
- `src/components/assets/assets-approvals-tab.tsx` - Displays approval workflows for production advances
- `src/components/assets/assets-advances-tab.tsx` - Displays production advances for equipment and materials

**Features Implemented**:
- **Approvals Tab**: Shows approval chains, status, approvers, due dates, and responses
- **Advances Tab**: Shows asset items, categories, production info, requestor, rental periods, quantities, and status

### 4. Tab Component Registry
**Issue**: New tab components were not registered in the module's component loader.

**Fix**: Updated `src/lib/assets-tab-components.tsx` to register:
- `approvals` → `AssetsApprovalsTab`
- `advances` → `AssetsAdvancesTab`
- `maintenance` → `AssetsMaintenanceTab` (also added)

## Database Schema Verification

### approval_chains Table
```sql
- id (UUID)
- workspace_id (UUID)
- name (TEXT) ✓
- chain_type (TEXT)
- triggers_on (TEXT) ✓
- trigger_conditions (JSONB)
- approver_chain (JSONB)
```

### production_advances Table
```sql
- id (UUID)
- workspace_id (UUID)
- production_id (UUID)
- requestor_id (UUID) ✓
- asset_category (TEXT)
- asset_item (TEXT)
- quantity (INTEGER)
- start_date (DATE)
- end_date (DATE)
- status (TEXT)
```

## Testing Recommendations

1. **Approvals Tab**: Navigate to Assets → Approvals and verify:
   - Approval chains display correctly
   - Status badges render properly
   - Approver names are visible
   - Due dates format correctly

2. **Advances Tab**: Navigate to Assets → Advances and verify:
   - Production advances list loads
   - Category badges display
   - Production and requestor information populates
   - Status badges render with correct colors
   - Date ranges display properly

3. **Database Queries**: Verify that:
   - Foreign key relationships resolve correctly
   - No console errors appear
   - Real-time subscriptions work

## Related Files

### Modified
- `src/hooks/use-module-data.ts`
- `src/lib/assets-tab-components.tsx`

### Created
- `src/components/assets/assets-approvals-tab.tsx`
- `src/components/assets/assets-advances-tab.tsx`
- `BUGFIX_ASSETS_MODULE_2025_10_15.md`

## Migration References
- `supabase/migrations/20251015000000_finance_optimization_ramp_runway.sql` (approval_chains)
- `supabase/migrations/034_refactor_production_advances.sql` (production_advances)
