# Advances Module Refactoring Summary
**Date:** January 15, 2025  
**Type:** Schema & Implementation Refactor  
**Status:** Completed

## Overview
Refactored the Advances module from a financial/monetary advance system to a **procurement-style production advance system** for managing equipment, materials, and asset rentals in production environments.

## Changes Made

### 1. Database Schema (`supabase/migrations/034_refactor_production_advances.sql`)
**Complete redesign of `production_advances` table:**

#### New Fields Added:
- `production_id` - Link to production/project (optional)
- `company_id` - Associated company reference
- `department_team` - Department or team name
- `asset_category` - Required category (see Asset Categories below)
- `asset_id` - Optional link to catalog asset
- `asset_item` - Asset/item name (required)
- `accessories` - Array of accessory items
- `quantity` - Number of items (required, default: 1)
- `start_date` - Rental/usage start date (required)
- `end_date` - Rental/usage end date
- `site_location_id` - Reference to locations table
- `site_location_name` - Text location if not in locations table
- `operational_purpose` - Business justification (required)
- `special_considerations` - Special handling requirements
- `additional_information` - Extra notes
- `requestor_id` - User who requested (required)
- `assigned_user_ids` - Array of users approved to collect/use items
- `approver_id` - User who approves the advance

#### Status Changes:
New status workflow: `pending` → `approved` → `fulfilled` → `active` → `returned`/`partially_returned`/`overdue`/`cancelled`/`denied`

#### Removed Fields:
- Old financial fields (amount, currency, etc.)
- Old type field (replaced with asset_category)

### 2. Asset Categories (`supabase/migrations/035_update_asset_categories.sql`)
Updated asset catalog with new procurement-focused categories:

| Category | Examples |
|----------|----------|
| **Site Infrastructure** | Office Containers, Storage Containers, Fence, Barricade |
| **Site Services** | Generators/Power, Lighting, Plumbing, Internet |
| **Site Safety** | Fire Extinguishers, First Aid Kits, PPE, Emergency Exit Signs |
| **Site Vehicles** | Utility Carts, Golf Carts, Site Trucks, Box Trucks |
| **Heavy Equipment** | Forklifts, Scissor Lifts, Boom Lifts |
| **Consumables** | Gaffer Tape, Zip Ties, Spray Paint |
| **Event Rentals** | Tables, Chairs, Pipe & Drape, Stanchions |
| **Signage** | Various sizes (14"x22", 18"x12", 18"x18", 18"x24", 20"x30", 24"x24", 24"x36", 36"x36", 36"x48", 48"x48", 96"x20", 120"x30") with ULine sign holders |
| **Backline** | Drum Kits, Mic Kits, Guitar/Bass/Keys Amps, DJ Equipment |
| **Access** | Business Apps (Asana, Slack, etc.), Operations Software, System Access |
| **Credentials** | All-Access Badges, Crew Passes, Security Clearances |
| **Parking** | Staff Parking Passes, VIP Parking, Loading Zone Access |
| **Meals** | Catering Packages, Meal Vouchers, Production Crew Meals |
| **Flights** | Air Travel, Charter Flights, Touring Crew Transportation |
| **Lodging** | Hotel Rooms, Accommodation Blocks, Extended Stays |
| **Rental Cars** | Ground Transportation, Vehicle Rentals, Crew Transport |

### 3. TypeScript Types (`src/types/index.ts`)
Added comprehensive type definitions:

```typescript
export type AssetCategory =
  | 'site_infrastructure'
  | 'site_services'
  | 'site_safety'
  | 'site_vehicles'
  | 'heavy_equipment'
  | 'consumables'
  | 'event_rentals'
  | 'signage'
  | 'backline'

export type ProductionAdvanceStatus =
  | 'pending'
  | 'approved'
  | 'fulfilled'
  | 'active'
  | 'returned'
  | 'partially_returned'
  | 'overdue'
  | 'cancelled'
  | 'denied'

export interface ProductionAdvance {
  // Full interface with all new fields
}
```

### 4. Form Field Configurations (`src/lib/modules/form-fields-registry.ts`)
Updated form configurations for:
- **Dashboard → My Advances** - User request form
- **Assets → Advances** - Admin advance creation form
- **Assets → Inventory** - Updated with new categories
- **Assets → Catalog** - Updated with new categories

#### Key Form Fields:
1. Project (required)
2. Company
3. Department/Team
4. Asset Category (required, dropdown)
5. Asset/Item (required, searchable from catalog)
6. Accessories (tags input)
7. Quantity (required, number)
8. Start Date (required)
9. End Date
10. Site Location (required)
11. Operational Purpose (required, textarea)
12. Special Considerations (textarea)
13. Additional Information (textarea)
14. Assigned Users (multi-user selector)

### 5. Dashboard Component (`src/components/dashboard/dashboard-my-advances-tab.tsx`)
**UI Updates:**
- Display asset category with color-coded badges
- Show quantity instead of generic "items"
- Display site location
- Show assigned users count
- Updated date fields (start/end dates instead of needed/return)
- Category-specific icons and colors
- Progress tracking for returned items

**Helper Functions Added:**
- `getCategoryColor()` - Returns color class for each category
- `getCategoryIcon()` - Returns appropriate icon for category
- `getCategoryLabel()` - Returns human-readable category name

### 6. Data Hooks (`src/hooks/use-dashboard-data.ts`)
Updated `useMyAdvances` hook:
- Changed query field from `requested_by` to `requestor_id`
- Added relations: production, company, asset, requestor, approver
- Updated Supabase realtime subscriptions

### 7. Mock Data (`src/lib/modules/assets-mock-data.ts`)
Complete rewrite of `generateAdvancesData()`:
- Generates realistic production advance data
- Includes all new fields (categories, locations, purposes, etc.)
- Proper date calculations
- Accessory arrays
- Assigned user arrays
- Status progression

Updated `generateCatalogData()`:
- New asset categories
- Realistic items for each category
- Manufacturer information
- Pricing (unit cost, daily rental rate)

## Migration Instructions

### Running Migrations
```bash
# Run migrations in order
npx supabase migration up 034_refactor_production_advances
npx supabase migration up 035_update_asset_categories
```

### Data Migration Considerations
⚠️ **BREAKING CHANGE**: This is a destructive migration that drops the existing `production_advances` table.

**Before running in production:**
1. Back up existing production_advances data
2. Export any critical advance records
3. Plan data migration strategy if needed
4. Notify users of the schema change

## Testing Checklist
- [ ] Test advance request creation from dashboard
- [ ] Test advance creation from Assets module
- [ ] Verify category filtering works
- [ ] Test assigned users functionality
- [ ] Verify status transitions
- [ ] Test date range validations
- [ ] Check location assignment
- [ ] Verify catalog integration
- [ ] Test mock data generation
- [ ] Validate form field validations

## Future Enhancements
1. **Asset Catalog Integration** - Auto-populate from catalog
2. **Inventory Tracking** - Real-time availability checking
3. **Return Management** - Partial return workflows
4. **QR Code Check-in/out** - Mobile scanning
5. **Notification System** - Advance approvals and due dates
6. **Analytics** - Usage reports by category
7. **Cost Tracking** - Rental rate calculations
8. **Vendor Integration** - External rental companies

## Related Files
- `supabase/migrations/034_refactor_production_advances.sql`
- `supabase/migrations/035_update_asset_categories.sql`
- `src/types/index.ts`
- `src/lib/modules/form-fields-registry.ts`
- `src/components/dashboard/dashboard-my-advances-tab.tsx`
- `src/hooks/use-dashboard-data.ts`
- `src/lib/modules/assets-mock-data.ts`

## Notes
- Approver is NOT included in the creation form (assigned by system/admin)
- Asset categories are consistent across inventory, catalog, and advances
- Accessories field allows tracking items that come with main asset
- Assigned users represent people approved to collect/use items (not just requestor)
- Site location can be either a location_id reference OR a text field
- Special considerations field for handling requirements (forklift access, etc.)
