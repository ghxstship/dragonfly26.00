# 🚨 Database Migration Required

**Status:** ⚠️ Action Required  
**Priority:** High  
**Affects:** Companies > Contacts tab  

---

## Quick Summary

One database migration is required to complete the zero-tolerance audit. The `company_contacts` table needs a `workspace_id` column for efficient filtering.

**Without this migration:** The Companies > Contacts tab will show "Error loading data"  
**With this migration:** All 65+ routes will work correctly ✅

---

## How to Apply Migration

### Option 1: Supabase Dashboard (Easiest)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

3. **Copy and paste this SQL:**

```sql
-- Add workspace_id to company_contacts
ALTER TABLE company_contacts 
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Populate from parent company
UPDATE company_contacts cc
SET workspace_id = c.workspace_id
FROM companies c
WHERE cc.company_id = c.id;

-- Make NOT NULL
ALTER TABLE company_contacts 
ALTER COLUMN workspace_id SET NOT NULL;

-- Add index for performance
CREATE INDEX idx_company_contacts_workspace 
ON company_contacts(workspace_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view company contacts in their workspaces" 
ON company_contacts;

DROP POLICY IF EXISTS "Users can manage company contacts in their workspaces" 
ON company_contacts;

CREATE POLICY "Users can view company contacts in their workspaces"
    ON company_contacts FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage company contacts in their workspaces"
    ON company_contacts FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    ));
```

4. **Click RUN** (or press Cmd/Ctrl + Enter)

5. **Verify success**
   - Check for "Success" message
   - Should show "ALTER TABLE", "UPDATE", etc. confirmations

---

### Option 2: From Migration File

The SQL is also saved in:
```
supabase/migrations/025_add_workspace_id_to_company_contacts.sql
```

You can copy from there instead.

---

## Verification

After running the migration, verify it worked:

```sql
-- 1. Check that workspace_id column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'company_contacts'
AND column_name = 'workspace_id';

-- Should return:
-- column_name  | data_type | is_nullable
-- workspace_id | uuid      | NO

-- 2. Check that data was migrated
SELECT COUNT(*) FROM company_contacts WHERE workspace_id IS NULL;

-- Should return: 0

-- 3. Check that index was created
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'company_contacts' 
AND indexname = 'idx_company_contacts_workspace';

-- Should return: idx_company_contacts_workspace
```

---

## What This Migration Does

### Adds workspace_id Column
```sql
ALTER TABLE company_contacts 
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
```
Adds the missing column that allows filtering by workspace.

### Migrates Existing Data
```sql
UPDATE company_contacts cc
SET workspace_id = c.workspace_id
FROM companies c
WHERE cc.company_id = c.id;
```
Copies workspace_id from the parent company to all existing contacts.

### Makes Column Required
```sql
ALTER TABLE company_contacts 
ALTER COLUMN workspace_id SET NOT NULL;
```
Ensures all future contacts must have a workspace_id.

### Adds Performance Index
```sql
CREATE INDEX idx_company_contacts_workspace 
ON company_contacts(workspace_id);
```
Speeds up queries that filter by workspace.

### Updates Security Policies
```sql
CREATE POLICY "Users can view company contacts in their workspaces"
    ON company_contacts FOR SELECT
    USING (workspace_id IN (...));
```
Ensures users can only see contacts in their authorized workspaces.

---

## Why This Migration Is Needed

The application's data layer (`use-module-data.ts`) applies this filter to ALL queries:

```typescript
.eq('workspace_id', workspaceId)
```

**Problem:** `company_contacts` table didn't have this column  
**Solution:** Add it and populate from parent `companies` table  
**Result:** Consistent filtering across all modules ✅

---

## Rollback (If Needed)

If you need to undo this migration:

```sql
-- Remove the column
ALTER TABLE company_contacts DROP COLUMN IF EXISTS workspace_id;
```

**Warning:** Only rollback if absolutely necessary. The Contacts tab won't work without this column.

---

## After Migration

Once the migration is complete:

1. **Test the Contacts tab:**
   - Go to `/workspace/{id}/companies/contacts`
   - Should load without errors
   - Should show company contacts

2. **Check for errors:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Should see no Supabase errors

3. **Verify data:**
   - Contacts should show correct company associations
   - Filtering by workspace should work

---

## Troubleshooting

### Error: "column workspace_id already exists"
**Cause:** Migration was already run  
**Solution:** Nothing to do, you're good! ✅

### Error: "relation company_contacts does not exist"
**Cause:** Table hasn't been created yet  
**Solution:** Run earlier migrations first (check `000_foundation.sql` through `006_files_companies_modules.sql`)

### Error: "foreign key constraint violation"
**Cause:** Data integrity issue  
**Solution:** Check that all companies have valid workspace_id values:
```sql
SELECT COUNT(*) FROM companies WHERE workspace_id IS NULL;
```

### No data after migration
**Cause:** Possible data loss  
**Solution:** Check the UPDATE statement worked:
```sql
SELECT 
    cc.id,
    cc.first_name,
    cc.last_name,
    cc.company_id,
    cc.workspace_id,
    c.workspace_id as company_workspace_id
FROM company_contacts cc
LEFT JOIN companies c ON cc.company_id = c.id
LIMIT 10;
```

---

## Support

If you encounter issues:

1. Check the error message in SQL Editor output
2. Verify all earlier migrations have been applied
3. Review `docs/fixes/COMPANIES_MODULE_AUDIT_2025_10_13.md` for details
4. Check Supabase logs in Dashboard > Logs

---

**Created:** October 13, 2025  
**Migration File:** `supabase/migrations/025_add_workspace_id_to_company_contacts.sql`  
**Estimated Time:** < 1 minute  
**Risk Level:** Low (safe, reversible)  
**Impact:** Fixes 1 broken tab, enables proper workspace filtering
