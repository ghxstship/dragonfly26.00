# Asset Catalog - Deployment Guide
**Production-Ready Comprehensive Catalog**  
**Version:** 1.0  
**Date:** January 15, 2025

## 🎯 Overview

This guide covers deployment of the comprehensive asset catalog system with 380+ professionally researched items across 9 production equipment categories, featuring fuzzy search with weighted relevance scoring.

---

## 📦 What's Included

### Migrations (10 files)
1. **040_add_related_names_field.sql** - Schema enhancement and search function
2. **041_comprehensive_site_infrastructure.sql** - Containers, fencing, tents (50+ items)
3. **042_comprehensive_site_services.sql** - Generators, power, HVAC, internet (40+ items)
4. **043_comprehensive_site_safety.sql** - Fire, first aid, PPE (40+ items)
5. **044_comprehensive_site_vehicles.sql** - Carts, trucks, trailers (30+ items)
6. **045_comprehensive_heavy_equipment.sql** - Forklifts, lifts, loaders (40+ items)
7. **047_comprehensive_event_rentals_part1.sql** - Tables and chairs (40+ items)
8. **048_comprehensive_event_rentals_part2.sql** - Linens, draping, staging (40+ items)
9. **049_comprehensive_backline.sql** - Audio equipment, instruments (40+ items)
10. **050_comprehensive_signage.sql** - Signs, holders, banners (50+ items)

### Total Catalog Items: ~380+

---

## 🚀 Deployment Steps

### Step 1: Pre-Deployment Verification

```bash
# Verify you're connected to the correct database
npx supabase status

# Check current migration status
npx supabase migration list

# Review migration files
ls -la supabase/migrations/ | grep -E "04[0-9]|05[0-9]"
```

### Step 2: Backup Database

```bash
# CRITICAL: Always backup before major migrations
npx supabase db dump -f backup_pre_catalog_$(date +%Y%m%d).sql

# Verify backup was created
ls -lh backup_pre_catalog_*.sql
```

### Step 3: Deploy to Staging/Development First

```bash
# Deploy schema enhancement first (REQUIRED)
npx supabase migration up 040_add_related_names_field

# Verify schema changes
npx supabase db execute "SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'assets' AND column_name = 'related_names';"

# Deploy catalog migrations
npx supabase migration up 041_comprehensive_site_infrastructure
npx supabase migration up 042_comprehensive_site_services
npx supabase migration up 043_comprehensive_site_safety
npx supabase migration up 044_comprehensive_site_vehicles
npx supabase migration up 045_comprehensive_heavy_equipment
npx supabase migration up 047_comprehensive_event_rentals_part1
npx supabase migration up 048_comprehensive_event_rentals_part2
npx supabase migration up 049_comprehensive_backline
npx supabase migration up 050_comprehensive_signage
```

### Step 4: Verify Data Loaded

```sql
-- Connect to your database
psql [connection_string]

-- Check total catalog items
SELECT COUNT(*) as total_items
FROM assets 
WHERE workspace_id = '00000000-0000-0000-0000-000000000001';
-- Expected: ~380+ items

-- Check items per category
SELECT asset_category, COUNT(*) as item_count
FROM assets 
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
GROUP BY asset_category
ORDER BY item_count DESC;

-- Expected results:
-- signage: ~50
-- site_infrastructure: ~50
-- site_services: ~40
-- site_safety: ~40
-- heavy_equipment: ~40
-- event_rentals: ~80
-- backline: ~40
-- site_vehicles: ~30

-- Verify related_names field populated
SELECT name, array_length(related_names, 1) as alt_name_count
FROM assets
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
AND related_names IS NOT NULL
LIMIT 10;

-- Should show 5-10+ alternative names per item
```

### Step 5: Test Search Function

```sql
-- Test basic search
SELECT id, name, asset_category, relevance 
FROM search_assets('generator', NULL) 
LIMIT 10;

-- Test category-filtered search
SELECT id, name, relevance
FROM search_assets('scissor lift', 'heavy_equipment')
LIMIT 5;

-- Test fuzzy matching (misspelling)
SELECT id, name, relevance
FROM search_assets('generater', 'site_services') -- Note misspelling
LIMIT 5;
-- Should still find generators

-- Test nickname/alternative name search
SELECT id, name, relevance
FROM search_assets('twin reverb', 'backline')
LIMIT 5;
-- Should find "Guitar Amp Fender Twin Reverb"

-- Test short form search
SELECT id, name, relevance  
FROM search_assets('sm58', NULL)
LIMIT 5;
-- Should find Shure SM58 microphone

-- Test common alternative terms
SELECT id, name, relevance
FROM search_assets('porta potty', NULL)
LIMIT 5;
-- Should find "Portable Restroom Standard"

SELECT id, name, relevance
FROM search_assets('chiavari chair', NULL)
LIMIT 5;
-- Should find all chiavari chairs
```

### Step 6: Performance Testing

```sql
-- Test search performance
EXPLAIN ANALYZE
SELECT * FROM search_assets('equipment', NULL) LIMIT 50;
-- Should be < 50ms

-- Verify indexes exist
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'assets'
AND indexname LIKE '%related%';

-- Expected indexes:
-- idx_assets_related_names_gin
-- idx_assets_related_names_trgm
```

### Step 7: Frontend Integration Test

Update your frontend code to use the new search function:

```typescript
// src/lib/api/asset-catalog.ts

export async function searchAssetCatalog(
  query: string,
  category?: AssetCategory
) {
  const { data, error } = await supabase.rpc('search_assets', {
    search_query: query,
    category_filter: category || null,
    workspace_filter: GLOBAL_CATALOG_WORKSPACE_ID
  });

  if (error) throw error;
  return data;
}

// Usage in autocomplete component
const handleSearch = async (searchTerm: string) => {
  if (searchTerm.length < 2) return;
  
  const results = await searchAssetCatalog(
    searchTerm,
    selectedCategory // from form field
  );
  
  setAutocompleteOptions(results);
};
```

### Step 8: User Acceptance Testing

Create test scenarios:

1. **Search for common items**
   - "generator" → Should find 3.5kW to 500kW options
   - "forklift" → Should find 3000lb to 15000lb options
   - "table" → Should find round and rectangle tables
   - "microphone" → Should find wired and wireless options

2. **Search using alternative names**
   - "porta john" → Find portable restrooms
   - "gator" → Find John Deere utility vehicle
   - "twin reverb" → Find Fender amp
   - "z-45" → Find boom lift

3. **Search with misspellings**
   - "gafr tape" → Find gaffer tape
   - "scizzor lift" → Find scissor lift
   - "chiavri chair" → Find chiavari chair

4. **Category filtering**
   - Search "chair" in event_rentals → Only event chairs
   - Search "chair" in site_safety → Should find nothing
   - Search "light" in site_services → Find light towers
   - Search "light" in signage → Find emergency exit lights

---

## ✅ Post-Deployment Checklist

- [ ] All 10 migrations applied successfully
- [ ] ~380+ items loaded into catalog
- [ ] Search function `search_assets()` exists
- [ ] All indexes created successfully
- [ ] Search returns relevant results
- [ ] Fuzzy matching works for misspellings
- [ ] Alternative names searchable
- [ ] Category filtering works
- [ ] Frontend autocomplete integrated
- [ ] Performance < 50ms for searches
- [ ] User acceptance testing passed
- [ ] Documentation updated
- [ ] Team trained on new catalog

---

## 🔧 Troubleshooting

### Issue: Migration fails

```bash
# Check error message
npx supabase migration repair

# Rollback if needed
npx supabase db reset

# Restore from backup
psql [connection] < backup_pre_catalog_YYYYMMDD.sql
```

### Issue: Search returns no results

```sql
-- Verify pg_trgm extension enabled
SELECT * FROM pg_extension WHERE extname = 'pg_trgm';

-- If not enabled:
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Rebuild indexes
REINDEX INDEX idx_assets_name_trgm;
REINDEX INDEX idx_assets_related_names_trgm;
```

### Issue: Slow search performance

```sql
-- Check if indexes are being used
EXPLAIN ANALYZE
SELECT * FROM search_assets('test', NULL);

-- Rebuild statistics
ANALYZE assets;

-- Vacuum if needed
VACUUM ANALYZE assets;
```

### Issue: Duplicate items showing

```sql
-- Check for actual duplicates
SELECT name, COUNT(*) 
FROM assets
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
GROUP BY name
HAVING COUNT(*) > 1;

-- If duplicates found, contact development team
```

---

## 📊 Monitoring

### Track catalog usage

```sql
-- Most searched categories
SELECT asset_category, COUNT(*) as search_count
FROM (
  -- Add application logging here
) searches
GROUP BY asset_category
ORDER BY search_count DESC;

-- Most selected items from catalog
SELECT a.name, a.asset_category, COUNT(*) as usage_count
FROM production_advances pa
JOIN assets a ON pa.asset_item = a.name
WHERE pa.workspace_id != '00000000-0000-0000-0000-000000000001'
GROUP BY a.name, a.asset_category
ORDER BY usage_count DESC
LIMIT 20;

-- Search terms that return no results
-- (Track in application logs for future catalog expansion)
```

---

## 🔄 Rolling Back

If you need to rollback:

```bash
# Rollback all catalog migrations
npx supabase migration down 050_comprehensive_signage
npx supabase migration down 049_comprehensive_backline
npx supabase migration down 048_comprehensive_event_rentals_part2
npx supabase migration down 047_comprehensive_event_rentals_part1
npx supabase migration down 045_comprehensive_heavy_equipment
npx supabase migration down 044_comprehensive_site_vehicles
npx supabase migration down 043_comprehensive_site_safety
npx supabase migration down 042_comprehensive_site_services
npx supabase migration down 041_comprehensive_site_infrastructure
npx supabase migration down 040_add_related_names_field

# Or restore from backup
psql [connection] < backup_pre_catalog_YYYYMMDD.sql
```

---

## 📚 Additional Resources

- **Catalog Documentation:** `/docs/COMPREHENSIVE_CATALOG_EXPANSION.md`
- **Progress Status:** `/docs/CATALOG_COMPLETION_SUMMARY.md`
- **Migration Files:** `/supabase/migrations/040-050_*.sql`
- **Search Function:** `search_assets(query, category, workspace)`

---

## 🎓 Training Materials

### For End Users
- Catalog includes 380+ pre-populated equipment items
- Use autocomplete in "Asset/Item" field when creating advances
- Search by common names, nicknames, or alternative terms
- System handles misspellings automatically
- Filter by category for more relevant results

### For Administrators
- Global catalog workspace ID: `00000000-0000-0000-0000-000000000001`
- Items are read-only for users
- Can add custom items to organization workspaces
- Monitor usage to identify missing catalog items
- Request catalog additions through development team

### For Developers
- Search function: `search_assets(search_query TEXT, category_filter TEXT, workspace_filter UUID)`
- Returns top 50 results ordered by relevance
- Relevance scoring: name (3x) > related_names (2x) > tags (1.5x) > description (1x)
- Indexes optimized for fuzzy matching via pg_trgm
- Can extend with additional categories using same pattern

---

## ✅ Success Criteria

Deployment is successful when:

1. ✅ All migrations applied without errors
2. ✅ ~380+ catalog items loaded
3. ✅ Search function operational
4. ✅ Users can find items via autocomplete
5. ✅ Fuzzy matching works for common misspellings
6. ✅ Alternative names return correct results
7. ✅ Performance meets < 50ms target
8. ✅ No degradation of existing functionality
9. ✅ User feedback is positive
10. ✅ Team trained and documentation complete

---

## 📞 Support

For issues or questions:
- **Documentation:** Check `/docs/` folder
- **Logs:** Review migration logs and application logs
- **Database:** Query catalog directly for debugging
- **Development Team:** Contact for catalog additions or modifications

---

**Status:** Ready for Production Deployment ✅  
**Last Updated:** January 15, 2025  
**Version:** 1.0
