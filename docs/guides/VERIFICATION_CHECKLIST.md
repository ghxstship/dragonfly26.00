# Post-Remediation Verification Checklist

## Quick Verification Steps

### 1. Database Tables
- [ ] Verify all tables exist in Supabase Dashboard
  - Go to: Dashboard → Database → Tables
  - Look for:
    - `location_bim_models`
    - `location_bim_clashes`
    - `location_features`
    - `file_folders`

### 2. Locations Module
- [ ] Navigate to **Locations** → **BIM Models** tab
  - Should show empty state or data (not error)
  
- [ ] Navigate to **Locations** → **Coordination** tab
  - Should show empty state or data (not error)
  
- [ ] Navigate to **Locations** → **Spatial Features** tab
  - Should show empty state or data (not error)

### 3. Files Module
- [ ] Navigate to **Files** → **All Documents** tab
  - Should show empty state or data (not error)
  - Should be able to create folders

### 4. Companies Module
- [ ] Navigate to **Companies** → **Compliance** tab
  - Should show empty state or data (not error)

## Detailed Testing

### BIM Models
1. [ ] Create a new location (if none exist)
2. [ ] Navigate to the location's BIM Models tab
3. [ ] Click "Upload BIM Model" button
4. [ ] Fill in model details and upload
5. [ ] Verify model appears in the table
6. [ ] Click on model to view details
7. [ ] Edit model information
8. [ ] Delete test model

### Coordination (BIM Clashes)
1. [ ] Navigate to location's Coordination tab
2. [ ] Click "Record Coordination Issue" button
3. [ ] Create a test clash record
4. [ ] Verify clash appears in the table
5. [ ] Update clash status
6. [ ] Assign to a user
7. [ ] Mark as resolved
8. [ ] Delete test clash

### Spatial Features
1. [ ] Navigate to location's Spatial Features tab
2. [ ] Click "Add Spatial Feature" button
3. [ ] Create a test feature (point, line, or polygon)
4. [ ] Verify feature appears on map
5. [ ] Edit feature properties
6. [ ] Change feature style (color, opacity)
7. [ ] Delete test feature

### File Folders
1. [ ] Navigate to Files module
2. [ ] Click "Create Folder" button
3. [ ] Create a root folder
4. [ ] Create a subfolder inside it
5. [ ] Verify folder hierarchy displays correctly
6. [ ] Upload a file to the folder
7. [ ] Move file between folders
8. [ ] Delete test folders

### Compliance Documents
1. [ ] Navigate to Companies module
2. [ ] Select or create a company
3. [ ] Go to Compliance tab
4. [ ] Click "Add Compliance Document"
5. [ ] Upload a test document
6. [ ] Set expiration date
7. [ ] Verify document appears in table
8. [ ] Update document status
9. [ ] Delete test document

## Database Integrity Checks

### Run These Queries in Supabase SQL Editor

```sql
-- 1. Check table existence
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'location_bim_models',
    'location_bim_clashes', 
    'location_features',
    'file_folders'
  )
ORDER BY tablename;

-- 2. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'location_bim_models',
    'location_bim_clashes',
    'location_features', 
    'file_folders'
  );

-- 3. Check indexes
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'location_bim_models',
    'location_bim_clashes',
    'location_features',
    'file_folders'
  )
ORDER BY tablename, indexname;

-- 4. Check foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN (
    'location_bim_models',
    'location_bim_clashes',
    'location_features',
    'file_folders'
  )
ORDER BY tc.table_name, kcu.column_name;

-- 5. Check triggers
SELECT 
    event_object_table as table_name,
    trigger_name,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN (
    'location_bim_models',
    'location_bim_clashes',
    'location_features',
    'file_folders'
  )
ORDER BY event_object_table, trigger_name;

-- 6. Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'location_bim_models',
    'location_bim_clashes',
    'location_features',
    'file_folders'
  )
ORDER BY tablename, policyname;
```

## API Testing

### Test PostgREST Endpoints

```bash
# Get your Supabase URL and anon key from .env
SUPABASE_URL="your-project-url"
ANON_KEY="your-anon-key"

# Test location_bim_models endpoint
curl "${SUPABASE_URL}/rest/v1/location_bim_models" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"

# Test location_bim_clashes endpoint
curl "${SUPABASE_URL}/rest/v1/location_bim_clashes" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"

# Test location_features endpoint
curl "${SUPABASE_URL}/rest/v1/location_features" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"

# Test file_folders endpoint
curl "${SUPABASE_URL}/rest/v1/file_folders" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

## Expected Results

### ✅ Success Indicators
- All UI tabs load without errors
- Empty states show proper messages
- Create/edit dialogs open successfully
- Records save to database
- Records appear in tables
- Updates reflect immediately
- Deletes remove records

### ❌ Failure Indicators
- "Error loading data" messages
- "Table not found" errors
- "Relationship not found" errors
- 404 errors in network tab
- Console errors related to tables
- RLS policy violations

## Troubleshooting

### If Tables Don't Exist
```bash
# Re-run migrations
cd /Users/julianclarkson/Documents/Dragonfly26.00
npx supabase db reset
```

### If RLS Issues Occur
- Check user is authenticated
- Verify user is member of organization
- Check workspace_id matches user's workspace
- Review RLS policies in Supabase Dashboard

### If API Errors Occur
- Check Supabase logs: `npx supabase logs`
- Verify API key is correct
- Check network tab for request details
- Review PostgREST error messages

## Sign-Off

Once all items are checked:

- [ ] All critical UI sections working
- [ ] Database tables verified
- [ ] Basic CRUD operations tested
- [ ] No console errors
- [ ] Documentation reviewed

**Tested By:** _________________  
**Date:** _________________  
**Notes:** _________________
