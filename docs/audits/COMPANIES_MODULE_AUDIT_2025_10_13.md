# Companies Module - Zero Tolerance Audit
**Date:** October 13, 2025  
**Status:** ✅ All Fixes Applied + Migration Required  
**Module:** Companies

## Executive Summary

Performed comprehensive tab-by-tab audit of the Companies module to resolve ALL "Error Loading Data" instances. Identified critical issues: non-existent table reference, missing workspace_id column, and incomplete relationship syntax.

## Issues Found & Fixed

### 1. **Deliverables Tab** ❌→✅
**Error:** `Could not find the table 'public.deliverables'`

**Root Cause:**
- Code referenced table `deliverables` which does NOT exist in database
- `deliverables` is a TEXT[] column in `scopes_of_work` table, not a separate table
- Deliverables should display scopes of work filtered/ordered by end date

**Fix Applied:**
```typescript
// BEFORE (WRONG - Table doesn't exist)
'deliverables': { 
  table: 'deliverables', 
  select: '*, company:companies!company_id(name)', 
  orderBy: 'due_date' 
}

// AFTER (CORRECT - Uses scopes_of_work table)
'deliverables': { 
  table: 'scopes_of_work', 
  select: '*, company:companies!company_id(name), production:productions!production_id(name)', 
  orderBy: 'end_date' 
}
```

**Files Modified:**
- `src/hooks/use-module-data.ts` line 92
- `src/components/workspace/tab-page-content.tsx` line 95

---

### 2. **Contacts Tab** ❌→✅
**Error:** `column company_contacts.workspace_id does not exist`

**Root Cause:**
- `company_contacts` table missing `workspace_id` column
- `use-module-data.ts` applies `.eq('workspace_id', workspaceId)` to ALL queries (line 220)
- Table has only `company_id`, not `workspace_id`

**Fix Applied:**

**Migration Created:** `025_add_workspace_id_to_company_contacts.sql`
```sql
-- Add workspace_id column
ALTER TABLE company_contacts 
ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- Populate from parent company
UPDATE company_contacts cc
SET workspace_id = c.workspace_id
FROM companies c
WHERE cc.company_id = c.id;

-- Make NOT NULL
ALTER TABLE company_contacts ALTER COLUMN workspace_id SET NOT NULL;

-- Add index
CREATE INDEX idx_company_contacts_workspace ON company_contacts(workspace_id);
```

**Status:** ⚠️ Migration created - **MUST BE APPLIED**

**Files Modified:**
- `supabase/migrations/025_add_workspace_id_to_company_contacts.sql` (created)
- No code changes needed (will work after migration)

---

### 3. **Scopes of Work Tab** ✅→✅
**Enhancement:** Added production relationship

**Fix Applied:**
```typescript
// BEFORE (Missing production relationship)
'scopes-of-work': { 
  table: 'scopes_of_work', 
  select: '*, company:companies!company_id(name)', 
  orderBy: 'created_at' 
}

// AFTER (With production relationship)
'scopes-of-work': { 
  table: 'scopes_of_work', 
  select: '*, company:companies!company_id(name), production:productions!production_id(name)', 
  orderBy: 'created_at' 
}
```

**Files Modified:**
- `src/hooks/use-module-data.ts` line 93

---

### 4. **Documents Tab** ✅→✅
**Enhancement:** Added file category relationship

**Fix Applied:**
```typescript
// BEFORE (Missing category relationship)
'documents': { 
  table: 'files', 
  select: '*, uploaded_by_user:profiles!uploaded_by(first_name, last_name)', 
  orderBy: 'created_at' 
}

// AFTER (With category relationship)
'documents': { 
  table: 'files', 
  select: '*, category:file_categories!category_id(name), uploaded_by_user:profiles!uploaded_by(first_name, last_name)', 
  orderBy: 'created_at' 
}
```

**Files Modified:**
- `src/hooks/use-module-data.ts` line 94

---

### 5. **Bids Tab** ✅→✅
**Enhancement:** Added production relationship

**Fix Applied:**
```typescript
// BEFORE (Missing production relationship)
'bids': { 
  table: 'bids', 
  select: '*, company:companies!company_id(name)', 
  orderBy: 'submitted_date' 
}

// AFTER (With production relationship)
'bids': { 
  table: 'bids', 
  select: '*, company:companies!company_id(name), production:productions!production_id(name)', 
  orderBy: 'submitted_date' 
}
```

**Files Modified:**
- `src/hooks/use-module-data.ts` line 95

---

## Database Schema Verification

### Companies Table ✅
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),  -- ✅ Has workspace_id
    name TEXT NOT NULL,
    type TEXT,
    ...
)
```

**Status:** ✅ Correct

---

### Company Contacts Table ❌→✅
```sql
CREATE TABLE company_contacts (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id),
    workspace_id UUID,  -- ✅ ADDED via migration
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    ...
)
```

**Status:** ⚠️ **Requires migration to add workspace_id**

---

### Scopes of Work Table ✅
```sql
CREATE TABLE scopes_of_work (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),  -- ✅ Has workspace_id
    company_id UUID NOT NULL REFERENCES companies(id),
    production_id UUID REFERENCES productions(id),
    title TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',  -- ✅ deliverables is a column, not a table
    start_date DATE,
    end_date DATE,
    ...
)
```

**Status:** ✅ Correct

---

### Bids Table ✅
```sql
CREATE TABLE bids (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),  -- ✅ Has workspace_id
    company_id UUID NOT NULL REFERENCES companies(id),
    production_id UUID REFERENCES productions(id),
    title TEXT NOT NULL,
    bid_amount DECIMAL(12, 2) NOT NULL,
    submitted_date TIMESTAMPTZ,
    ...
)
```

**Status:** ✅ Correct

---

### Files Table ✅
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),  -- ✅ Has workspace_id
    name TEXT NOT NULL,
    category_id UUID REFERENCES file_categories(id),
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    ...
)
```

**Status:** ✅ Correct

---

## Tab-by-Tab Verification Checklist

### ✅ Organizations (organizations)
- **Table:** `companies`
- **Status:** ✅ Already correct
- **Query:** `*`
- **Order:** `name`
- **Workspace Column:** ✅ `workspace_id` exists

---

### ⚠️ Contacts (contacts)
- **Table:** `company_contacts`
- **Status:** ⚠️ **REQUIRES MIGRATION**
- **Query:** `*, company:companies!company_id(name)`
- **Order:** `last_name`
- **Workspace Column:** ❌→✅ `workspace_id` added via migration
- **Action Required:** Run migration `025_add_workspace_id_to_company_contacts.sql`

---

### ✅ Deliverables (deliverables)
- **Table:** `scopes_of_work` (was `deliverables`)
- **Status:** ✅ **FIXED**
- **Query:** `*, company:companies!company_id(name), production:productions!production_id(name)`
- **Order:** `end_date` (was `due_date`)
- **Fix:** Changed from non-existent `deliverables` table to `scopes_of_work`

---

### ✅ Scopes of Work (scopes-of-work)
- **Table:** `scopes_of_work`
- **Status:** ✅ **ENHANCED**
- **Query:** `*, company:companies!company_id(name), production:productions!production_id(name)`
- **Order:** `created_at`
- **Fix:** Added production relationship

---

### ✅ Documents (documents)
- **Table:** `files`
- **Status:** ✅ **ENHANCED**
- **Query:** `*, category:file_categories!category_id(name), uploaded_by_user:profiles!uploaded_by(first_name, last_name)`
- **Order:** `created_at`
- **Fix:** Added category relationship

---

### ✅ Bids (bids)
- **Table:** `bids`
- **Status:** ✅ **ENHANCED**
- **Query:** `*, company:companies!company_id(name), production:productions!production_id(name)`
- **Order:** `submitted_date`
- **Fix:** Added production relationship

---

## Summary Statistics

**Total Tabs Audited:** 6  
**Tabs with Errors:** 2 (Critical)  
**Tabs Enhanced:** 3  
**Tabs Already Correct:** 1  

### Fixes Applied
1. ✅ **Deliverables** - Changed to use scopes_of_work table, fixed column name
2. ⚠️ **Contacts** - Migration created to add workspace_id column
3. ✅ **Scopes of Work** - Added production relationship
4. ✅ **Documents** - Added category relationship
5. ✅ **Bids** - Added production relationship

### Files Modified
1. `src/hooks/use-module-data.ts` - 4 changes
2. `src/components/workspace/tab-page-content.tsx` - 1 change
3. `supabase/migrations/025_add_workspace_id_to_company_contacts.sql` - Migration created

---

## Critical Actions Required

### ⚠️ MUST RUN MIGRATION

Before testing, you **MUST** apply the database migration:

```bash
cd supabase
supabase db push
```

Or manually run:
```bash
psql -f migrations/025_add_workspace_id_to_company_contacts.sql
```

**Why:** The `company_contacts` table is missing the `workspace_id` column that the query engine requires. Without this migration, the Contacts tab will fail.

---

## Common Error Patterns Identified

### Pattern 1: Non-Existent Tables
**Issue:** Code references tables that don't exist
- `deliverables` table doesn't exist
- Should use `scopes_of_work` table (which has a `deliverables` column)

**Root Cause:** Confusion between table names and column names

### Pattern 2: Missing Denormalized Columns
**Issue:** Child tables missing workspace_id for efficient querying
- `company_contacts` only has `company_id`
- Need `workspace_id` for filtering without joins

**Root Cause:** Original schema didn't denormalize workspace_id to all tables

### Pattern 3: Incomplete Relationships
**Issue:** Queries missing useful foreign key joins
- Missing `production:productions!production_id` relationships
- Missing `category:file_categories!category_id` relationships

**Root Cause:** Initial implementation was minimal

---

## Testing Instructions

### ⚠️ Pre-Testing Requirements

**CRITICAL:** Run migration first!
```bash
cd supabase
supabase db push
```

### Manual Testing Checklist

Visit each Companies module tab and verify:

```bash
# Start dev server
npm run dev

# Navigate to workspace
http://localhost:3000/workspace/{WORKSPACE_ID}/companies/...
```

**Test Each Tab:**
- [ ] `/companies/organizations` - Table view loads
- [ ] `/companies/contacts` - Table view loads (requires migration)
- [ ] `/companies/deliverables` - Table view loads (FIXED)
- [ ] `/companies/scopes-of-work` - Table view loads
- [ ] `/companies/documents` - Table view loads
- [ ] `/companies/bids` - Table view loads

**Success Criteria:**
- ✅ No "Error loading data" messages
- ✅ No console errors
- ✅ Data loads or shows empty state
- ✅ Breadcrumbs display correctly
- ✅ Related data shows (company names, production names, etc.)

---

## Verification After Migration

After running the migration, verify:

```sql
-- Verify workspace_id column exists
\d company_contacts

-- Check data was migrated correctly
SELECT 
    cc.id,
    cc.first_name,
    cc.last_name,
    cc.company_id,
    cc.workspace_id,
    c.name as company_name,
    w.name as workspace_name
FROM company_contacts cc
JOIN companies c ON cc.company_id = c.id
JOIN workspaces w ON cc.workspace_id = w.id
LIMIT 5;

-- Verify index exists
SELECT indexname FROM pg_indexes 
WHERE tablename = 'company_contacts' 
AND indexname = 'idx_company_contacts_workspace';
```

---

## Prevention Measures

### For Future Development

**Before adding new tabs:**
1. ✅ Verify table exists in `supabase/migrations/`
2. ✅ Verify table has `workspace_id` column (required by use-module-data.ts)
3. ✅ Check column names match database schema
4. ✅ Don't confuse column names with table names
5. ✅ Add useful relationship joins for foreign keys

**Schema Design Checklist:**
- [ ] All user-scoped tables have `workspace_id` column
- [ ] Child tables denormalize `workspace_id` from parents
- [ ] Foreign key columns are properly indexed
- [ ] RLS policies check workspace access

---

## Database Schema Design Note

### Why Denormalize workspace_id?

The `company_contacts` table is a child of `companies`. Ideally, we could filter by workspace through the parent:

```sql
-- WITHOUT denormalization (slower)
SELECT cc.* 
FROM company_contacts cc
JOIN companies c ON cc.company_id = c.id
WHERE c.workspace_id = '{workspaceId}';
```

However, `use-module-data.ts` applies `.eq('workspace_id', workspaceId)` directly to ALL tables for:
1. **Performance:** Direct index lookup vs JOIN
2. **Simplicity:** Consistent query pattern
3. **RLS:** Row-level security policies work on the table itself

**Solution:** Denormalize `workspace_id` to child tables:

```sql
-- WITH denormalization (faster)
SELECT * FROM company_contacts
WHERE workspace_id = '{workspaceId}';
```

**Trade-off:** 
- ✅ Faster queries, simpler code
- ❌ Slightly more complex inserts (must set workspace_id)

---

## Related Documentation

- [Zero Tolerance Error Audit](./ZERO_TOLERANCE_ERROR_AUDIT_2025_10_13.md)
- [Events Module Audit](./EVENTS_MODULE_AUDIT_2025_10_13.md)
- [Database Column Fixes](./DATABASE_COLUMN_FIXES.md)

---

## Appendix: Complete Table Mappings

### Companies Module Table Reference

| Tab | Table | Workspace Column | Notes |
|-----|-------|------------------|-------|
| Organizations | `companies` | ✅ `workspace_id` | - |
| Contacts | `company_contacts` | ⚠️ Added via migration | Required migration 025 |
| Deliverables | `scopes_of_work` | ✅ `workspace_id` | Was referencing non-existent table |
| Scopes of Work | `scopes_of_work` | ✅ `workspace_id` | - |
| Documents | `files` | ✅ `workspace_id` | - |
| Bids | `bids` | ✅ `workspace_id` | - |

---

## Appendix: Scopes of Work Schema

The `scopes_of_work` table contains both scope details and deliverables:

```sql
CREATE TABLE scopes_of_work (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    company_id UUID NOT NULL,
    production_id UUID,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',  -- ✅ Array of deliverable descriptions
    
    start_date DATE,
    end_date DATE,
    
    value DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT CHECK (status IN (
        'draft', 'pending_approval', 'approved', 
        'in_progress', 'completed', 'cancelled'
    ))
);
```

**Key Points:**
- `deliverables` is a **column** (TEXT array), not a table
- Each scope of work can have multiple deliverables
- The Deliverables tab shows all scopes ordered by `end_date`
- The Scopes of Work tab shows all scopes ordered by `created_at`

---

**Audit Completed By:** AI Assistant (Cascade)  
**Audit Date:** October 13, 2025  
**Verification Status:** ✅ Fixes applied, ⚠️ Migration required  

**Next Actions:**
1. Run migration: `supabase db push`
2. Verify migration succeeded
3. Test all 6 Companies module tabs
