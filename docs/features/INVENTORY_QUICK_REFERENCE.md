# Inventory Module - Quick Reference

## Schema Tables

| Table | Purpose | Key Features |
|-------|---------|-------------|
| `inventory_folders` | Hierarchical organization | Auto-computed paths, item counts, value aggregation |
| `inventory_items` | Item records | 8 photos, barcode/QR, stock tracking, custom fields |
| `stock_movements` | Movement history | Complete audit trail, location transfers |
| `inventory_counts` | Physical counts | Cycle counts, discrepancy tracking |
| `count_line_items` | Count details | Line-by-line variance |
| `inventory_alerts` | Automated alerts | Low stock, out of stock, damaged items |

## Key Functions (RPC)

```sql
-- Stock Management
SELECT adjust_inventory_stock(item_id, quantity_change, 'receive', 'reason')
SELECT transfer_inventory_stock(item_id, quantity, from_loc, to_loc)

-- Search & Lookup
SELECT * FROM search_inventory_by_code('barcode123', workspace_id)
SELECT generate_item_qr_code(item_id)

-- Photos
SELECT update_inventory_photos(item_id, photo_urls, primary_index)

-- Reporting
SELECT get_inventory_dashboard_metrics(workspace_id)
SELECT * FROM get_low_stock_report(workspace_id)
SELECT * FROM export_inventory_data(workspace_id, folder_id, category)
SELECT * FROM get_item_movement_history(item_id, limit)

-- Bulk Operations
SELECT bulk_create_inventory_items(workspace_id, items_json)
```

## API Quick Reference

```typescript
// ITEMS
getInventoryItems(workspaceId, { folderId, status, category, search })
getInventoryItem(itemId)
searchByBarcode(code, workspaceId)
createInventoryItem(item)
updateInventoryItem(itemId, updates)
deleteInventoryItem(itemId)

// PHOTOS (max 8 per item)
uploadInventoryPhoto(workspaceId, itemId, file, photoIndex)
updateInventoryPhotos(itemId, photoUrls, primaryPhotoIndex)
deleteInventoryPhoto(workspaceId, itemId, photoPath)

// BARCODE/QR
generateQRCode(itemId)
generateBarcodeUrl(code, type)

// STOCK
adjustStock(itemId, quantityChange, movementType, reason)
transferStock(itemId, quantity, fromLoc, toLoc, fromFolder, toFolder)
getMovementHistory(itemId, limit)

// FOLDERS
getInventoryFolders(workspaceId, parentFolderId)
createInventoryFolder(folder)
updateInventoryFolder(folderId, updates)
deleteInventoryFolder(folderId)

// ALERTS
getActiveAlerts(workspaceId)
acknowledgeAlert(alertId)
resolveAlert(alertId)

// REPORTING
getInventoryMetrics(workspaceId)
getLowStockReport(workspaceId)
exportInventory(workspaceId, folderId, category)
bulkImportItems(workspaceId, items)

// UTILITIES
generateInventoryCSV(items)
downloadCSV(csv, filename)
```

## Stock Movement Types

- `receive` - Receiving inventory
- `issue` - Issuing to production/event
- `transfer` - Moving between locations
- `adjustment` - Manual stock correction
- `count` - Physical count adjustment
- `return` - Returned to stock
- `loss` - Lost/missing items
- `damage` - Damaged items removed

## Item Status Codes

- `in_stock` - Available inventory
- `low_stock` - Below threshold
- `out_of_stock` - Zero quantity
- `on_order` - Pending receipt
- `reserved` - Reserved for event/production
- `discontinued` - No longer stocked

## Alert Types

- `low_stock` - Below threshold
- `out_of_stock` - Zero quantity
- `overstock` - Above max level
- `expiring` - Near expiration
- `damaged` - Condition issue

## Barcode Types Supported

- `upc` - Universal Product Code
- `ean` - European Article Number
- `code128` - Code 128
- `qr` - QR Code
- `custom` - Custom format

## Condition States

- `new` - Brand new
- `excellent` - Like new
- `good` - Normal wear
- `fair` - Significant wear
- `poor` - Heavy wear
- `damaged` - Needs repair

## Count Types

- `full` - Complete inventory count
- `cycle` - Regular rotation count
- `spot` - Random sample count
- `location` - Specific location
- `category` - Specific category

## Storage Bucket

**Bucket:** `inventory-photos`  
**Path:** `{workspace_id}/{item_id}/photo-{index}.{ext}`  
**Limit:** 8 photos per item, 10MB each  
**Types:** JPEG, PNG, WebP, HEIC

## Automated Triggers

1. **Folder Path** - Auto-computes hierarchical path
2. **Item Count** - Auto-updates folder item counts
3. **Status Update** - Auto-changes based on stock level
4. **Alert Creation** - Auto-generates low stock alerts
5. **Timestamps** - Auto-updates updated_at fields

## Reporting Views

```sql
-- Inventory value by folder
SELECT * FROM inventory_valuation_by_folder WHERE workspace_id = ?

-- Items needing attention
SELECT * FROM items_requiring_attention WHERE workspace_id = ?

-- Movement summary
SELECT * FROM stock_movement_summary WHERE workspace_id = ?

-- Active alerts
SELECT * FROM active_alerts_summary WHERE workspace_id = ?
```

## Common Workflows

### 1. Receive New Inventory
```typescript
// 1. Create or lookup item
const item = await createInventoryItem({ name, sku, ... })

// 2. Upload photos
for (const photo of photos) {
  await uploadInventoryPhoto(workspaceId, item.id, photo, index)
}

// 3. Adjust stock
await adjustStock(item.id, quantity, 'receive', 'PO #12345')
```

### 2. Issue to Production
```typescript
// 1. Scan barcode
const { data } = await searchByBarcode(code, workspaceId)

// 2. Adjust stock
await adjustStock(data[0].id, -quantity, 'issue', 'Event #67890')
```

### 3. Transfer Between Locations
```typescript
await transferStock(
  itemId, 
  quantity,
  fromLocationId,
  toLocationId,
  fromFolderId,
  toFolderId,
  'Moving to job site'
)
```

### 4. Perform Count
```typescript
// 1. Create count
const count = await createInventoryCount({ type: 'cycle', ... })

// 2. Record line items
for (const item of items) {
  await createCountLineItem({
    count_id: count.id,
    inventory_item_id: item.id,
    expected_quantity: item.stock_quantity,
    counted_quantity: actualCount
  })
}

// 3. Apply adjustments for variances
```

## Migration Files

1. `20251015010000_inventory_sortly_optimization.sql` - Schema
2. `20251015020000_inventory_functions.sql` - Functions
3. `20251015030000_inventory_storage_policies.sql` - Storage

## Integration Points

- **Assets Module:** Link to full asset records
- **Events:** Issue equipment to shows
- **Projects:** Production inventory requests
- **Procurement:** Reordering from low stock
- **Locations:** Multi-site tracking
- **Files:** Documentation and photos
- **Reports:** Analytics and insights

## Mobile Features

- Barcode/QR scanner (camera)
- Photo capture (up to 8)
- Quick stock adjustments
- Location transfers
- Count workflows
- Offline sync ready (realtime)

---

**Quick Start:** Create item → Upload photos → Generate QR → Scan to lookup → Track movements
