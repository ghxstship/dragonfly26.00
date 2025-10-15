# Asset Catalog Implementation Guide
**Complete Integration Guide for the Global Asset Catalog**  
**Date:** January 15, 2025  
**Version:** 2.0 Final

---

## 🎯 Overview

This guide explains how to integrate and use the global asset catalog in your application, including all API functions, React hooks, and best practices.

---

## 📦 What's Included

### 23 Database Migrations
- **040-059:** Core catalog with 650+ items
- **060:** IT Equipment (20+ items)
- **061:** Communications Equipment (25+ items)
- **Total:** 695+ professional catalog items

### Frontend Integration
- **API Layer:** `src/lib/api/asset-catalog.ts`
- **React Hooks:** `src/hooks/use-asset-catalog.ts`
- **TypeScript Types:** Full type safety

---

## 🚀 Quick Start

### 1. Import the Hooks

```typescript
import {
  useCatalogSearch,
  useCatalogAutocomplete,
  useCatalogBrowse,
  useCatalogCategories,
  useAssetCategories,
  useIndustryTags
} from '@/hooks/use-asset-catalog'
```

### 2. Search the Catalog

```typescript
function AssetSearch() {
  const { query, setQuery, results, loading } = useCatalogSearch('', {
    categoryFilter: 'heavy_equipment',
    industryFilter: 'film-production',
    debounceMs: 300
  })

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search assets..."
      />
      {loading && <p>Searching...</p>}
      {results.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.manufacturer} {item.model_number}</p>
          <span>Relevance: {item.relevance}</span>
        </div>
      ))}
    </div>
  )
}
```

### 3. Autocomplete in Forms

```typescript
function AssetAutocomplete() {
  const { query, setQuery, suggestions, loading } = useCatalogAutocomplete('event_rentals')

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing asset name..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => selectItem(item)}>
              {item.name} - {item.category}
              {item.manufacturer && ` (${item.manufacturer})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### 4. Browse by Category

```typescript
function CategoryBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>()
  
  const { items, loading } = useCatalogBrowse(selectedCategory, selectedSubcategory)
  const { categories } = useCatalogCategories()

  return (
    <div>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.category} value={cat.category}>
            {cat.category} ({cat.item_count})
          </option>
        ))}
      </select>
      
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

---

## 📚 Complete API Reference

### Core Functions

#### `searchAssetCatalog(searchQuery, options)`
Search the catalog with fuzzy matching.

```typescript
const { data, error } = await searchAssetCatalog('c stand', {
  categoryFilter: 'heavy_equipment',
  industryFilter: 'film-production',
  limit: 10
})
```

**Parameters:**
- `searchQuery: string` - Search term (minimum 2 characters)
- `options.categoryFilter?: string` - Filter by asset_category
- `options.industryFilter?: string` - Filter by industry tag
- `options.limit?: number` - Maximum results

**Returns:**
- `data: CatalogSearchResult[]` - Items with relevance scores
- `error: any` - Error if occurred

---

#### `browseCatalogByCategory(category, subcategory)`
Browse catalog hierarchically.

```typescript
const { data, error } = await browseCatalogByCategory(
  'Grip Equipment',
  'C-Stands'
)
```

---

#### `autocompleteAssetSearch(searchQuery, assetCategory, limit)`
Get autocomplete suggestions for forms.

```typescript
const { data, error } = await autocompleteAssetSearch(
  'table',
  'event_rentals',
  10
)
```

---

#### `getCatalogCategories()`
Get all categories with item counts.

```typescript
const { data, error } = await getCatalogCategories()
// Returns: { asset_category, category, subcategory, item_count }[]
```

---

#### `getCatalogStatistics()`
Get overall catalog statistics.

```typescript
const { data, error } = await getCatalogStatistics()
// Returns: { total_items, asset_categories, manufacturers, etc. }
```

---

#### `getItemsByAssetCategory(assetCategory)`
Get all items in a specific asset category.

```typescript
const { data, error } = await getItemsByAssetCategory('heavy_equipment')
```

---

#### `getAssetCategories()`
Get list of all asset categories.

```typescript
const { data, error } = await getAssetCategories()
// Returns: ['site_infrastructure', 'heavy_equipment', ...]
```

---

#### `getIndustryTags()`
Get all available industry tags.

```typescript
const { data, error } = await getIndustryTags()
// Returns: ['film-production', 'corporate-events', ...]
```

---

#### `copyCatalogItemToWorkspace(catalogItemId, workspaceId, userId, overrides)`
Copy a catalog item to user's workspace.

```typescript
const { data, error } = await copyCatalogItemToWorkspace(
  catalogItemId,
  userWorkspaceId,
  userId,
  {
    name: 'Custom Name Override',
    // other overrides...
  }
)
```

---

## 🪝 React Hooks Reference

### `useCatalogSearch(initialQuery, options)`
Debounced search hook with auto-loading.

```typescript
const {
  query,        // Current search query
  setQuery,     // Update query function
  results,      // Search results
  loading,      // Loading state
  error         // Error if any
} = useCatalogSearch('', {
  categoryFilter: 'event_rentals',
  industryFilter: 'film-production',
  debounceMs: 300
})
```

---

### `useCatalogAutocomplete(assetCategory, debounceMs)`
Autocomplete for form inputs.

```typescript
const {
  query,
  setQuery,
  suggestions,
  loading,
  clearSuggestions
} = useCatalogAutocomplete('heavy_equipment', 300)
```

---

### `useCatalogBrowse(category, subcategory)`
Browse items by category/subcategory.

```typescript
const { items, loading, error } = useCatalogBrowse(
  'Grip Equipment',
  'C-Stands'
)
```

---

### `useCatalogCategories()`
Get all categories with hierarchy.

```typescript
const { categories, loading, error } = useCatalogCategories()
```

---

### `useCatalogStatistics()`
Get catalog statistics.

```typescript
const { statistics, loading, error } = useCatalogStatistics()
```

---

### `useCatalogItemsByCategory(assetCategory)`
Get items for specific asset category.

```typescript
const { items, loading, error } = useCatalogItemsByCategory('event_rentals')
```

---

### `useAssetCategories()`
Get all asset category names.

```typescript
const { categories, loading, error } = useAssetCategories()
```

---

### `useIndustryTags()`
Get all industry tags.

```typescript
const { tags, loading, error } = useIndustryTags()
```

---

### `useCatalogFilters()`
Manage filter state.

```typescript
const {
  categoryFilter,
  setCategoryFilter,
  industryFilter,
  setIndustryFilter,
  subcategoryFilter,
  setSubcategoryFilter,
  clearFilters
} = useCatalogFilters()
```

---

## 🎨 UI Component Examples

### Complete Search Component

```typescript
'use client'

import { useCatalogSearch, useCatalogFilters } from '@/hooks/use-asset-catalog'
import { useState } from 'react'

export function CatalogSearchComponent() {
  const {
    categoryFilter,
    setCategoryFilter,
    industryFilter,
    setIndustryFilter,
    clearFilters
  } = useCatalogFilters()

  const { query, setQuery, results, loading } = useCatalogSearch('', {
    categoryFilter,
    industryFilter,
    debounceMs: 300
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={categoryFilter || ''}
          onChange={(e) => setCategoryFilter(e.target.value || undefined)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="heavy_equipment">Heavy Equipment</option>
          <option value="event_rentals">Event Rentals</option>
          <option value="site_services">Site Services</option>
        </select>

        <select
          value={industryFilter || ''}
          onChange={(e) => setIndustryFilter(e.target.value || undefined)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Industries</option>
          <option value="film-production">Film/TV Production</option>
          <option value="corporate-events">Corporate Events</option>
          <option value="construction">Construction</option>
        </select>

        <button onClick={clearFilters} className="text-blue-600">
          Clear Filters
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search assets (e.g., 'c stand', 'table', 'generator')"
        className="w-full border rounded px-4 py-2"
      />

      {/* Results */}
      {loading && <p>Searching...</p>}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <div key={item.id} className="border rounded p-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
            {item.manufacturer && (
              <p className="text-sm">
                {item.manufacturer} {item.model_number}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Relevance: {(item.relevance * 100).toFixed(0)}%
            </p>
            {item.industry_tags && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {item.industry_tags.map(tag => (
                  <span key={tag} className="text-xs bg-blue-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && query.length >= 2 && !loading && (
        <p className="text-gray-500">No items found. Try different search terms.</p>
      )}
    </div>
  )
}
```

### Autocomplete Component for Forms

```typescript
'use client'

import { useCatalogAutocomplete } from '@/hooks/use-asset-catalog'
import { useState, useRef, useEffect } from 'react'

interface AutocompleteProps {
  assetCategory?: string
  onSelect: (item: { id: string; name: string }) => void
  placeholder?: string
}

export function AssetAutocomplete({ assetCategory, onSelect, placeholder }: AutocompleteProps) {
  const { query, setQuery, suggestions, loading, clearSuggestions } = useCatalogAutocomplete(assetCategory)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item: any) => {
    setQuery(item.name)
    onSelect(item)
    setShowSuggestions(false)
    clearSuggestions()
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder || "Start typing asset name..."}
        className="w-full border rounded px-4 py-2"
      />

      {loading && query.length >= 2 && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-b shadow-lg max-h-60 overflow-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">
                {item.category}
                {item.manufacturer && ` • ${item.manufacturer}`}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 w-full bg-white border rounded-b shadow-lg px-4 py-3">
          <p className="text-gray-500 text-sm">No matching items found</p>
        </div>
      )}
    </div>
  )
}
```

---

## 🔍 Search Examples

### Common Searches

```typescript
// Film/TV Production
await searchAssetCatalog('c stand')           // Finds C-stands
await searchAssetCatalog('stinger')           // Finds extension cords
await searchAssetCatalog('basecamp')          // Finds office containers
await searchAssetCatalog('honey wagon')       // Finds portable restrooms
await searchAssetCatalog('apple box')         // Finds all apple box sizes

// Corporate Events
await searchAssetCatalog('chiavari chair')    // Finds all chiavari chairs
await searchAssetCatalog('projector')         // Finds projectors and screens
await searchAssetCatalog('lectern')           // Finds podiums
await searchAssetCatalog('registration table')// Finds registration tables

// Construction
await searchAssetCatalog('scissor lift')      // Finds all scissor lifts
await searchAssetCatalog('gennie')            // Finds generators (slang)
await searchAssetCatalog('porta john')        // Finds portable restrooms

// Hospitality
await searchAssetCatalog('steam table')       // Finds F&B equipment
await searchAssetCatalog('housekeeping cart') // Finds housekeeping supplies
await searchAssetCatalog('kegerator')         // Finds beer coolers

// IT/Communications
await searchAssetCatalog('wifi')              // Finds wireless access points
await searchAssetCatalog('walkie talkie')     // Finds two-way radios
await searchAssetCatalog('laptop')            // Finds computers
```

### Fuzzy Search (Handles Misspellings)

```typescript
await searchAssetCatalog('genarator')  // Still finds "Generator"
await searchAssetCatalog('scizzor')    // Still finds "Scissor Lift"
await searchAssetCatalog('chiavri')    // Still finds "Chiavari Chair"
```

---

## 🎯 Best Practices

### 1. Always Use Debouncing
```typescript
// ✅ Good: Uses built-in debouncing
const { query, setQuery, results } = useCatalogSearch('', { debounceMs: 300 })

// ❌ Bad: Direct API call on every keystroke
onChange={async (e) => {
  await searchAssetCatalog(e.target.value) // Too many requests!
}}
```

### 2. Provide User Feedback
```typescript
{loading && <Spinner />}
{error && <ErrorMessage error={error} />}
{results.length === 0 && <NoResultsMessage />}
```

### 3. Use Appropriate Filters
```typescript
// For advance forms - filter by asset category
useCatalogAutocomplete('heavy_equipment')

// For industry-specific apps - filter by industry
useCatalogSearch(query, { industryFilter: 'film-production' })
```

### 4. Handle Empty States
```typescript
if (query.length < 2) {
  return <p>Type at least 2 characters to search</p>
}
```

### 5. Show Relevant Information
```typescript
// Always show:
- Item name
- Category
- Manufacturer (if available)

// Optionally show:
- Model number
- Relevance score
- Industry tags
- Specifications
```

---

## 🔒 Security Considerations

### Read-Only Global Catalog
The global catalog (workspace ID: `00000000-0000-0000-0000-000000000001`) is **read-only** for all users.

### Copying Items
Use `copyCatalogItemToWorkspace()` to create user-owned assets based on catalog items:

```typescript
await copyCatalogItemToWorkspace(
  catalogItemId,
  userWorkspaceId,
  userId,
  {
    // User can override properties
    name: 'My Custom Name',
    // But specifications come from catalog
  }
)
```

---

## 📊 Performance Tips

### 1. Limit Results
```typescript
searchAssetCatalog(query, { limit: 10 }) // Default: 50
```

### 2. Use Specific Filters
```typescript
// Faster
searchAssetCatalog('table', { categoryFilter: 'event_rentals' })

// Slower
searchAssetCatalog('table') // Searches all 695+ items
```

### 3. Cache Categories
```typescript
// Load once, reuse
const { categories } = useCatalogCategories() // Cached by React
```

---

## 🧪 Testing

### Test Search Function
```typescript
describe('Asset Catalog Search', () => {
  it('should find items by name', async () => {
    const { data } = await searchAssetCatalog('generator')
    expect(data).toBeDefined()
    expect(data.length).toBeGreaterThan(0)
  })

  it('should handle misspellings', async () => {
    const { data } = await searchAssetCatalog('generater')
    expect(data).toBeDefined()
    expect(data.some(item => item.name.includes('Generator'))).toBe(true)
  })

  it('should filter by category', async () => {
    const { data } = await searchAssetCatalog('chair', {
      categoryFilter: 'event_rentals'
    })
    expect(data.every(item => item.asset_category === 'event_rentals')).toBe(true)
  })
})
```

---

## 📝 TypeScript Types

```typescript
interface CatalogAsset {
  id: string
  name: string
  description: string
  type: string
  asset_category: string
  category: string
  subcategory?: string
  manufacturer?: string
  model_number?: string
  related_names?: string[]
  tags?: string[]
  industry_tags?: string[]
  specifications?: Record<string, any>
  created_at: string
}

interface CatalogSearchResult extends CatalogAsset {
  relevance: number  // 0.0 - 1.0 score
}
```

---

## 🚀 Deployment Checklist

- [ ] Deploy all 23 migrations (040-061)
- [ ] Verify catalog statistics (695+ items)
- [ ] Test search function with common queries
- [ ] Test fuzzy matching with misspellings
- [ ] Test industry filtering
- [ ] Test category filtering
- [ ] Test autocomplete in forms
- [ ] Verify performance (< 50ms searches)
- [ ] Update UI components to use new hooks
- [ ] Train users on search functionality
- [ ] Monitor search queries for improvements

---

## 📞 Support

**Documentation:**
- This guide: `docs/ASSET_CATALOG_IMPLEMENTATION_GUIDE.md`
- Deployment: `docs/FINAL_DEPLOYMENT_GUIDE.md`
- Catalog overview: `docs/COMPLETE_CATALOG_STATUS.md`

**Code:**
- API: `src/lib/api/asset-catalog.ts`
- Hooks: `src/hooks/use-asset-catalog.ts`
- Migrations: `supabase/migrations/040-061_*.sql`

---

**Status:** ✅ Complete and Production-Ready  
**Version:** 2.0 Final  
**Total Items:** 695+  
**Last Updated:** January 15, 2025
