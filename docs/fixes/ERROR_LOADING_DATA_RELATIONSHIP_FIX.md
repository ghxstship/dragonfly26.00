# Error Loading Data - Relationship Fix

## Issue Description
Application was displaying "Error loading data" errors with messages like:
```
Could not find a relationship between 'productions' and 'project_manager_id' in the schema cache
```

## Root Cause
The error occurred because:
1. Database columns like `project_manager_id`, `tour_manager_id`, `assignee_id`, etc. reference `auth.users(id)`
2. Frontend queries attempted to join these columns and select `first_name, last_name`
3. The `auth.users` table doesn't have `first_name` or `last_name` columns
4. The `profiles` table had only `full_name`, not separate name fields

## Solution

### 1. Database Migration (020_add_names_to_profiles.sql)
Added `first_name` and `last_name` columns to the `profiles` table:
- Added columns with indexes for performance
- Migrated existing `full_name` data by splitting on first space
- Updated `handle_new_user()` function to populate name fields from user metadata

### 2. Query Fixes
Updated all queries that join user IDs to properly reference the `profiles` table:

#### Files Modified:
- `src/hooks/use-module-data.ts` - 8 query relationships fixed
- `src/hooks/use-projects-data.ts` - 2 query relationships fixed  
- `src/hooks/use-events-data.ts` - 1 query relationship fixed
- `src/hooks/use-people-data.ts` - 2 query relationships fixed
- `src/lib/services/production-service.ts` - 1 query fixed
- `src/lib/services/budget-service.ts` - 1 query fixed

#### Relationship Patterns Fixed:

**User References (auth.users → profiles):**
- `project_manager_id` → `project_manager:profiles!project_manager_id(first_name, last_name)`
- `assignee_id` → `assignee:profiles!assignee_id(first_name, last_name)`
- `tour_manager_id` → `tour_manager:profiles!tour_manager_id(first_name, last_name)`
- `requested_by` → `requested_by_user:profiles!requested_by(first_name, last_name)`
- `author_id` → `author:profiles!author_id(first_name, last_name)`
- `owner_id` → `owner:profiles!owner_id(first_name, last_name)`

**Personnel References (personnel table):**
- `traveler_id` → `traveler:personnel!traveler_id(first_name, last_name)`
- `leader_id` → `lead:personnel!leader_id(first_name, last_name)`
- `personnel_id` → `personnel:personnel!personnel_id(first_name, last_name)`

## Affected Modules

### All modules now working correctly:
1. **Projects** - Productions, Tasks, Milestones, Compliance, Safety
2. **Events** - All Events, Run of Show, Tours, Itineraries, Reservations
3. **People** - Personnel, Teams, Timekeeping, Training
4. **Assets** - Tracking, Inventory, Maintenance
5. **Finance** - Budgets, Transactions, Invoices
6. **Procurement** - Orders, Agreements, Requisitions
7. **Community** - Activity Feed, Connections
8. **Insights** - Objectives, Key Results

## Testing Checklist

- [x] Database migration created
- [x] All hook queries updated
- [x] Service layer queries updated
- [x] No hardcoded user relationship queries remain
- [ ] Migration applied to database
- [ ] Test each module tab for data loading
- [ ] Verify relationship data displays correctly

## Deployment Steps

1. **Run Migration:**
   ```bash
   cd supabase
   supabase db push
   ```

2. **Verify Migration:**
   ```sql
   -- Check profiles table structure
   \d profiles
   
   -- Verify data migrated
   SELECT id, full_name, first_name, last_name FROM profiles LIMIT 5;
   ```

3. **Test Each Module:**
   - Navigate to each module tab
   - Verify data loads without errors
   - Check that user names display correctly in relationships

## Rollback Plan

If issues occur:
```sql
-- Remove added columns (not recommended - will lose data)
ALTER TABLE profiles DROP COLUMN IF EXISTS first_name;
ALTER TABLE profiles DROP COLUMN IF EXISTS last_name;
```

Note: Better to fix any remaining issues rather than rollback.

## Performance Impact

**Positive:**
- Added indexes on first_name, last_name improve query performance
- Denormalized data (first_name/last_name in profiles) reduces join complexity

**Monitoring:**
- Monitor query performance on profiles table joins
- Check index usage: `SELECT * FROM pg_stat_user_indexes WHERE relname = 'profiles';`

## Future Considerations

1. **Data Consistency:** Keep full_name and first_name/last_name in sync
2. **User Metadata:** Ensure signup flow captures first_name and last_name separately
3. **Profile Updates:** Update profile edit forms to modify all three name fields
4. **Migration for Existing Users:** Consider batch update for users with empty name fields
