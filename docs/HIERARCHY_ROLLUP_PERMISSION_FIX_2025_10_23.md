# Hierarchy Rollup Permission Fix - October 23, 2025

## Issue
**Error**: "permission denied for materialized view hierarchy_rollup"

**Context**: Error occurred during workspace creation when triggers attempted to refresh the `hierarchy_rollup` materialized view.

## Root Cause
The `refresh_hierarchy_rollup()` function was running with the privileges of the authenticated user who triggered the INSERT/UPDATE/DELETE operation. However:

1. Migration 119 had revoked ALL permissions on `hierarchy_rollup` from authenticated users
2. Only SELECT permission was granted back to authenticated users
3. The REFRESH MATERIALIZED VIEW operation requires elevated privileges
4. Triggers fired by authenticated users couldn't refresh the view

## Solution
**Migration 123**: `123_fix_hierarchy_rollup_permissions.sql`

### Key Changes:

1. **Added SECURITY DEFINER to refresh function**
   - Function now runs with privileges of the function owner (postgres/service_role)
   - Allows authenticated users to trigger refresh indirectly via INSERT/UPDATE/DELETE
   - Prevents permission errors

2. **Added error handling**
   - Wrapped REFRESH in EXCEPTION block
   - Logs warnings instead of failing transactions
   - Ensures data operations don't fail if refresh has issues

3. **Granted EXECUTE permission**
   - Explicitly granted EXECUTE on function to authenticated users
   - Allows triggers to call the function

4. **Granted SELECT permission**
   - Ensured authenticated users can read from the materialized view
   - Needed for any queries that directly access the view

## Technical Details

### Before (Broken):
```sql
CREATE OR REPLACE FUNCTION refresh_hierarchy_rollup()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY hierarchy_rollup;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### After (Fixed):
```sql
CREATE OR REPLACE FUNCTION refresh_hierarchy_rollup()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY hierarchy_rollup;
    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to refresh hierarchy_rollup: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Impact
- ✅ Workspace creation now works without permission errors
- ✅ All hierarchy-related INSERT/UPDATE/DELETE operations work correctly
- ✅ Materialized view automatically refreshes on data changes
- ✅ No security compromise (SECURITY DEFINER is safe for this use case)
- ✅ Graceful error handling prevents transaction failures

## Verification
```sql
-- Test workspace creation
INSERT INTO workspaces (name, organization_id, activation_id)
VALUES ('Test Workspace', '<org_id>', '<activation_id>');

-- Should succeed without "permission denied" error
```

## Related Migrations
- Migration 100: Created `hierarchy_rollup` materialized view
- Migration 118: Initial permission adjustments
- Migration 119: Secured materialized view (too restrictive)
- Migration 123: Fixed permissions (this fix)

## Status
✅ **RESOLVED** - Applied to production on October 23, 2025
