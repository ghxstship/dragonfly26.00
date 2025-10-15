# Global Asset Catalog Seed Documentation
**Date:** January 15, 2025  
**Type:** Database Seed Data  
**Status:** Ready for Implementation

## Overview
Pre-populated comprehensive multi-industry asset catalog covering all 16 asset categories. Designed to provide users with a standardized catalog they can reference when creating production advances, with fuzzy search support for alternative names and related items.

## Features

### 🔍 Fuzzy Search Support
- **PostgreSQL pg_trgm extension** enabled for trigram-based fuzzy matching
- **Full-text search indexes** on asset names and descriptions
- **Alternative names** included in descriptions (e.g., "Also: golf cart, utility cart, people mover")
- **Tag arrays** for related search terms
- **GIN indexes** for array and text search optimization

### 🌐 Global Workspace
- Catalog items stored in special global workspace (ID: `00000000-0000-0000-0000-000000000001`)
- Accessible to all users across organizations
- System-maintained, pre-seeded data

### 📦 Comprehensive Coverage
**Total Categories:** 16  
**Total Items Seeded:** 150+ items across all categories

## Migration Files

### Migration 036: Site Infrastructure, Services, Safety
**File:** `036_seed_global_asset_catalog.sql`

#### Site Infrastructure (11 items)
- Office Containers (20ft, 40ft)
- Storage Containers (20ft, 40ft)
- Chain Link Fence Panels
- Barricades (Water-Filled, Crowd Control)
- Tents & Structures (Frame Tents 20x20, 40x60)
- Pop-Up Canopies

#### Site Services (12 items)
- Generators (20kW, 100kW, 200kW Diesel)
- Power Distribution Boxes
- Light Towers (Diesel, Solar LED)
- Portable AC Units & Heaters
- Water Tanks & Portable Restrooms
- Internet (WiFi Hotspots, StarLink)

#### Site Safety (12 items)
- Fire Extinguishers (ABC, CO2, Fire Blankets)
- First Aid Kits (Basic, Industrial, AED)
- PPE (Hard Hats, Safety Vests, Glasses, Gloves)
- Emergency Exit Signs
- Assembly Point Signs

### Migration 037: Vehicles, Equipment, Consumables
**File:** `037_seed_catalog_part2.sql`

#### Site Vehicles (9 items)
- Golf Carts (Electric 4-passenger, Gas 6-passenger)
- UTVs (Polaris Ranger, John Deere Gator)
- Trucks (Pickup 1-Ton, Box Truck 26ft, Cargo Van)
- Trailers (Enclosed 7x14, Flatbed 20ft)

#### Heavy Equipment (9 items)
- Forklifts (5000lb Propane, 10000lb Diesel)
- Scissor Lifts (19ft Electric, 32ft Diesel)
- Boom Lifts (45ft Articulating, 60ft Telescopic)
- Personnel Lifts
- Telehandlers
- Skid Steer Loaders

#### Consumables (12 items)
- Tape (Gaffer Tape, Spike Tape, Duct Tape)
- Cable Management (Zip Ties, Velcro Wraps)
- Marking (Spray Paint, Chalk Lines)
- Fasteners (Screws, Nuts/Bolts)
- Batteries (AA, 9V bulk packs)
- Cleaning (Shop Rags, Trash Bags)

### Migration 038: Event Rentals, Signage, Backline
**File:** `038_seed_catalog_part3.sql`

#### Event Rentals (20 items)
- Tables (Round 60"/72", Rectangle 6ft/8ft, Cocktail 30")
- Chairs (Chiavari Gold/Silver, Folding White/Black, Bar Stools)
- Linens (Tablecloths, Spandex Covers)
- Pipe & Drape (8ft systems, Velour Panels)
- Stanchions (Chrome with Rope, Black with Belt)
- Dance Floors & Stage Platforms

#### Signage (12 items)
- Sign Holders (11x17, 18x24, 24x36 - Acrylic, Floor Stand, Easel)
- A-Frame Sidewalk Signs
- Directional Arrow Signs
- Parking Signs
- Retractable Banner Stands
- Step & Repeat Backdrops
- Yard Signs with Stakes

#### Backline (11 items)
- Drums (5-Piece Acoustic Kit, Electronic Kit)
- Guitar Amps (Fender Twin Reverb, Marshall JCM800)
- Bass Amps (Ampeg SVT, Combo 450W)
- Keyboard Amps (Roland 200W)
- DJ Equipment (Controller, Mixer, Turntable Pair)
- Microphone Systems (Wired Kit, Wireless Dual)

### Migration 039: Administrative & Logistics
**File:** `039_seed_catalog_part4.sql`

#### Access (7 items)
- Project Management (Asana, Monday.com, Trello)
- Communication (Slack, Microsoft Teams, Zoom)
- Design Software (Adobe Creative Cloud)
- Productivity (Google Workspace)

#### Credentials (4 items)
- All-Access Crew Badge
- Production Staff Badge
- VIP Guest Pass
- Festival Wristband 3-Day

#### Parking (2 items)
- VIP Parking Pass - Lot A
- Staff Parking Pass - Lot B

#### Meals (2 items)
- Catering Package - Production Crew (25 people)
- Craft Services - Full Day (50 people)

#### Flights (2 items)
- Flight Ticket - Domestic Coach Round Trip
- Flight Ticket - International Coach Round Trip

#### Lodging (2 items)
- Hotel Room - Standard Queen (1 Night)
- Hotel Block - 10 Rooms (1 Night)

#### Rental Cars (3 items)
- Rental Car - Economy Sedan (Daily)
- Rental Car - SUV Full-Size (Daily)
- Rental Van - 12 Passenger (Daily)

## Data Structure

### Asset Fields
Each catalog item includes:

```sql
{
  id: UUID,
  workspace_id: UUID (global workspace),
  name: TEXT,
  description: TEXT (with alternative names),
  type: TEXT,
  asset_category: TEXT (16 categories),
  category: TEXT (subcategory),
  manufacturer: TEXT,
  model_number: TEXT,
  tags: TEXT[] (searchable keywords),
  specifications: JSONB (detailed specs and accessories),
  created_by: UUID,
  created_at: TIMESTAMPTZ,
  updated_at: TIMESTAMPTZ
}
```

### Alternative Names Pattern
```
"Also: alternative name 1, alternative name 2, related term"
"Alt: short form, nickname, industry term"
```

### Accessories in Specifications
```json
{
  "accessories": [
    "item 1",
    "item 2", 
    "item 3"
  ]
}
```

## Search Capabilities

### Fuzzy Matching Examples
Users can search for items using:
- **Exact names:** "Forklift"
- **Alternative names:** "Lift truck" → finds Forklift
- **Misspellings:** "Gafr tape" → finds Gaffer Tape
- **Partial matches:** "Golf" → finds Golf Carts, Golf Cart accessories
- **Industry terms:** "Aaa pass" → finds All-Access Badge
- **Related terms:** "Crew transport" → finds Passenger Vans, Rental Cars

### Search Indexes
```sql
-- Trigram indexes for fuzzy matching
idx_assets_name_trgm (GIN index on name)
idx_assets_description_trgm (GIN index on description)

-- Tag array search
idx_assets_tags_gin (GIN index on tags array)

-- Category filtering
idx_assets_category_search (B-tree on asset_category, category)

-- Full-text search
idx_assets_search (GIN on tsvector)
```

## Implementation Guide

### Running Migrations
```bash
# Run migrations in sequence
npx supabase migration up 036_seed_global_asset_catalog
npx supabase migration up 037_seed_catalog_part2
npx supabase migration up 038_seed_catalog_part3
npx supabase migration up 039_seed_catalog_part4
```

### Verifying Catalog
```sql
-- Check total items
SELECT asset_category, COUNT(*) 
FROM assets 
WHERE workspace_id = '00000000-0000-0000-0000-000000000001'
GROUP BY asset_category;

-- Test fuzzy search
SELECT name, description 
FROM assets 
WHERE name % 'golf cart'  -- Fuzzy match
ORDER BY similarity(name, 'golf cart') DESC
LIMIT 10;

-- Test tag search
SELECT name, tags 
FROM assets 
WHERE tags @> ARRAY['microphone'];
```

### Frontend Integration

#### Autocomplete Search Query
```typescript
// Search with fuzzy matching
const searchAssets = async (query: string, category?: string) => {
  let queryBuilder = supabase
    .from('assets')
    .select('id, name, description, asset_category, manufacturer, specifications')
    .eq('workspace_id', '00000000-0000-0000-0000-000000000001')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .order('name')
    .limit(20);
  
  if (category) {
    queryBuilder = queryBuilder.eq('asset_category', category);
  }
  
  return await queryBuilder;
}
```

#### Category Filter
```typescript
const filterByCategory = async (category: AssetCategory) => {
  return await supabase
    .from('assets')
    .select('*')
    .eq('workspace_id', '00000000-0000-0000-0000-000000000001')
    .eq('asset_category', category)
    .order('name');
}
```

## Expansion Guidelines

### Adding New Items
```sql
INSERT INTO assets (
  workspace_id, 
  name, 
  description, 
  type, 
  asset_category, 
  category, 
  manufacturer, 
  model_number, 
  tags, 
  specifications, 
  created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Item Name',
  'Description with alternative names. Also: alt1, alt2, alt3',
  'equipment',
  'category_name',
  'Subcategory',
  'Manufacturer',
  'MODEL-123',
  ARRAY['tag1', 'tag2', 'tag3'],
  '{"key": "value", "accessories": ["acc1", "acc2"]}'::jsonb,
  '00000000-0000-0000-0000-000000000001'
);
```

### Best Practices
1. **Always include alternative names** in description
2. **Use industry-standard terminology** in tags
3. **Include common misspellings** in tags
4. **List all accessories** in specifications JSONB
5. **Keep manufacturer/model accurate** for real-world reference
6. **Use consistent naming patterns** within categories

## Benefits

### For Users
- ✅ Quick item lookup without manual entry
- ✅ Discover related items and accessories
- ✅ Consistent naming across organization
- ✅ Industry-standard terminology
- ✅ Comprehensive item specifications

### For System
- ✅ Standardized data structure
- ✅ Reduced data entry errors
- ✅ Improved search performance
- ✅ Better reporting and analytics
- ✅ Easier integration with external systems

## Future Enhancements
1. **Pricing Integration** - Add standard rental rates
2. **Vendor Links** - Connect to preferred suppliers
3. **Images** - Add product images for visual reference
4. **Datasheets** - Link to manufacturer specs
5. **Availability Tracking** - Real-time inventory status
6. **User Favorites** - Save frequently used items
7. **Custom Categories** - Organization-specific additions
8. **Multi-language** - Translated names and descriptions

## Notes
- Catalog is **read-only for users** (managed by system)
- Organizations can **reference but not modify** global items
- Organizations can **create custom items** in their own workspaces
- Global workspace ID is reserved and should not be used for other purposes
- All fuzzy search requires **pg_trgm extension** to be enabled
