/**
 * Inventory API - Sortly-competitive features
 * 
 * Enhanced inventory management with:
 * - Photo management (up to 8 photos)
 * - Barcode/QR code generation and scanning
 * - Folder organization
 * - Stock tracking and alerts
 * - Export capabilities
 */

import { createClient } from '@/lib/supabase/client'

// =============================================
// TYPES
// =============================================

export interface InventoryFolder {
  id: string
  workspace_id: string
  name: string
  description?: string
  parent_folder_id?: string
  folder_path?: string
  location_id?: string
  location_name?: string
  color?: string
  icon?: string
  item_count: number
  total_value: number
  tags?: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  workspace_id: string
  asset_id?: string
  folder_id?: string
  name: string
  description?: string
  item_number?: string
  barcode?: string
  qr_code?: string
  barcode_type?: 'upc' | 'ean' | 'code128' | 'qr' | 'custom'
  photos?: string[]
  primary_photo_index: number
  sku?: string
  stock_quantity: number
  unit_of_measure: string
  low_stock_threshold?: number
  reorder_quantity?: number
  reorder_point?: number
  location_id?: string
  location_name?: string
  zone?: string
  unit_cost?: number
  total_value: number
  category?: string
  subcategory?: string
  manufacturer?: string
  model_number?: string
  variant_of?: string
  variant_attributes?: Record<string, string | number>
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor' | 'damaged'
  condition_notes?: string
  last_inspected_at?: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order' | 'reserved' | 'discontinued'
  enable_low_stock_alert: boolean
  alert_contacts?: string[]
  custom_fields?: Record<string, unknown>
  tags?: string[]
  notes?: string
  last_counted_at?: string
  last_counted_by?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: string
  workspace_id: string
  inventory_item_id: string
  movement_type: 'receive' | 'issue' | 'transfer' | 'adjustment' | 'count' | 'return' | 'loss' | 'damage'
  quantity: number
  quantity_before: number
  quantity_after: number
  from_location_id?: string
  to_location_id?: string
  from_folder_id?: string
  to_folder_id?: string
  reference_type?: string
  reference_id?: string
  unit_cost?: number
  total_cost?: number
  reason?: string
  notes?: string
  performed_by: string
  performed_at: string
  created_at: string
}

export interface InventoryAlert {
  id: string
  workspace_id: string
  inventory_item_id: string
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring' | 'damaged'
  severity: 'info' | 'warning' | 'critical'
  message: string
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed'
  acknowledged_by?: string
  acknowledged_at?: string
  resolved_at?: string
  created_at: string
}

// =============================================
// INVENTORY ITEMS
// =============================================

/**
 * Get all inventory items in a workspace
 */
export async function getInventoryItems(workspaceId: string, options?: {
  folderId?: string
  status?: string
  category?: string
  search?: string
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('inventory_items')
    .select('*, inventory_folders(name, folder_path)')
    .eq('workspace_id', workspaceId)
  
  if (options?.folderId) {
    query = query.eq('folder_id', options.folderId)
  }
  
  if (options?.status) {
    query = query.eq('status', options.status)
  }
  
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  
  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,sku.ilike.%${options.search}%,barcode.ilike.%${options.search}%`)
  }
  
  const { data, error } = await query.order('name')
  
  return { data, error }
}

/**
 * Get single inventory item by ID
 */
export async function getInventoryItem(itemId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*, inventory_folders(name, folder_path)')
    .eq('id', itemId)
    .single()
  
  return { data, error }
}

/**
 * Search inventory by barcode or QR code
 */
export async function searchByBarcode(code: string, workspaceId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('search_inventory_by_code', {
      p_code: code,
      p_workspace_id: workspaceId
    })
  
  return { data, error }
}

/**
 * Create inventory item
 */
export async function createInventoryItem(item: Partial<InventoryItem>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_items')
    .insert(item)
    .select()
    .single()
  
  return { data, error }
}

/**
 * Update inventory item
 */
export async function updateInventoryItem(itemId: string, updates: Partial<InventoryItem>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()
  
  return { data, error }
}

/**
 * Delete inventory item
 */
export async function deleteInventoryItem(itemId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', itemId)
  
  return { error }
}

// =============================================
// PHOTO MANAGEMENT
// =============================================

/**
 * Upload photo to inventory item
 */
export async function uploadInventoryPhoto(
  workspaceId: string,
  itemId: string,
  file: File,
  photoIndex: number
) {
  const supabase = createClient()
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { data: null, error: new Error('File must be an image') }
  }
  
  // Validate file size (10MB max)
  if (file.size > 10485760) {
    return { data: null, error: new Error('File size must be less than 10MB') }
  }
  
  // Generate file path
  const fileExt = file.name.split('.').pop()
  const fileName = `photo-${photoIndex}.${fileExt}`
  const filePath = `${workspaceId}/${itemId}/${fileName}`
  
  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('inventory-photos')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    })
  
  if (uploadError) {
    return { data: null, error: uploadError }
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('inventory-photos')
    .getPublicUrl(filePath)
  
  return { data: { path: filePath, url: publicUrl }, error: null }
}

/**
 * Update inventory item photos
 */
export async function updateInventoryPhotos(
  itemId: string,
  photoUrls: string[],
  primaryPhotoIndex: number = 0
) {
  const supabase = createClient()
  
  // Validate photo count (max 8)
  if (photoUrls.length > 8) {
    return { data: null, error: new Error('Maximum 8 photos allowed per item') }
  }
  
  const { data, error } = await supabase
    .rpc('update_inventory_photos', {
      p_inventory_item_id: itemId,
      p_photo_urls: photoUrls,
      p_primary_photo_index: primaryPhotoIndex
    })
  
  return { data, error }
}

/**
 * Delete photo from inventory item
 */
export async function deleteInventoryPhoto(
  workspaceId: string,
  itemId: string,
  photoPath: string
) {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from('inventory-photos')
    .remove([photoPath])
  
  return { error }
}

// =============================================
// BARCODE/QR CODE GENERATION
// =============================================

/**
 * Generate QR code for inventory item
 */
export async function generateQRCode(itemId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('generate_item_qr_code', {
      p_inventory_item_id: itemId
    })
  
  return { data, error }
}

/**
 * Generate barcode image URL (using external service or library)
 */
export function generateBarcodeUrl(code: string, type: string = 'code128') {
  // This would integrate with a barcode generation service
  // For now, return placeholder URL structure
  return `https://api.qr-code-generator.com/v1/create?access-token=YOUR_TOKEN&qr_code_text=${encodeURIComponent(code)}`
}

// =============================================
// STOCK MANAGEMENT
// =============================================

/**
 * Adjust inventory stock
 */
export async function adjustStock(
  itemId: string,
  quantityChange: number,
  movementType: string,
  reason?: string,
  referenceType?: string,
  referenceId?: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('adjust_inventory_stock', {
      p_inventory_item_id: itemId,
      p_quantity_change: quantityChange,
      p_movement_type: movementType,
      p_reason: reason,
      p_reference_type: referenceType,
      p_reference_id: referenceId
    })
  
  return { data, error }
}

/**
 * Transfer stock between locations/folders
 */
export async function transferStock(
  itemId: string,
  quantity: number,
  fromLocationId?: string,
  toLocationId?: string,
  fromFolderId?: string,
  toFolderId?: string,
  notes?: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('transfer_inventory_stock', {
      p_inventory_item_id: itemId,
      p_quantity: quantity,
      p_from_location_id: fromLocationId,
      p_to_location_id: toLocationId,
      p_from_folder_id: fromFolderId,
      p_to_folder_id: toFolderId,
      p_notes: notes
    })
  
  return { data, error }
}

/**
 * Get stock movement history for item
 */
export async function getMovementHistory(itemId: string, limit: number = 50) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_item_movement_history', {
      p_inventory_item_id: itemId,
      p_limit: limit
    })
  
  return { data, error }
}

// =============================================
// FOLDERS
// =============================================

/**
 * Get inventory folders
 */
export async function getInventoryFolders(workspaceId: string, parentFolderId?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('inventory_folders')
    .select('*')
    .eq('workspace_id', workspaceId)
  
  if (parentFolderId) {
    query = query.eq('parent_folder_id', parentFolderId)
  } else {
    query = query.is('parent_folder_id', null)
  }
  
  const { data, error } = await query.order('name')
  
  return { data, error }
}

/**
 * Create inventory folder
 */
export async function createInventoryFolder(folder: Partial<InventoryFolder>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_folders')
    .insert(folder)
    .select()
    .single()
  
  return { data, error }
}

/**
 * Update inventory folder
 */
export async function updateInventoryFolder(folderId: string, updates: Partial<InventoryFolder>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_folders')
    .update(updates)
    .eq('id', folderId)
    .select()
    .single()
  
  return { data, error }
}

/**
 * Delete inventory folder
 */
export async function deleteInventoryFolder(folderId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('inventory_folders')
    .delete()
    .eq('id', folderId)
  
  return { error }
}

// =============================================
// ALERTS
// =============================================

/**
 * Get active inventory alerts
 */
export async function getActiveAlerts(workspaceId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_alerts')
    .select('*, inventory_items(name, sku)')
    .eq('workspace_id', workspaceId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

/**
 * Acknowledge alert
 */
export async function acknowledgeAlert(alertId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_alerts')
    .update({
      status: 'acknowledged',
      acknowledged_at: new Date().toISOString()
    })
    .eq('id', alertId)
    .select()
    .single()
  
  return { data, error }
}

/**
 * Resolve alert
 */
export async function resolveAlert(alertId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('inventory_alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', alertId)
    .select()
    .single()
  
  return { data, error }
}

// =============================================
// REPORTING & ANALYTICS
// =============================================

/**
 * Get inventory dashboard metrics
 */
export async function getInventoryMetrics(workspaceId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_inventory_dashboard_metrics', {
      p_workspace_id: workspaceId
    })
  
  return { data, error }
}

/**
 * Get low stock report
 */
export async function getLowStockReport(workspaceId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_low_stock_report', {
      p_workspace_id: workspaceId
    })
  
  return { data, error }
}

/**
 * Export inventory data
 */
export async function exportInventory(
  workspaceId: string,
  folderId?: string,
  category?: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('export_inventory_data', {
      p_workspace_id: workspaceId,
      p_folder_id: folderId,
      p_category: category
    })
  
  return { data, error }
}

/**
 * Bulk import inventory items
 */
export async function bulkImportItems(
  workspaceId: string,
  items: Array<Partial<InventoryItem>>
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('bulk_create_inventory_items', {
      p_workspace_id: workspaceId,
      p_items: items
    })
  
  return { data, error }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Generate CSV from inventory data
 */
export function generateInventoryCSV(items: any[]): string {
  const headers = [
    'Item Number',
    'Name',
    'SKU',
    'Barcode',
    'Category',
    'Folder',
    'Location',
    'Stock Quantity',
    'Unit Cost',
    'Total Value',
    'Status',
    'Condition'
  ]
  
  const rows = items.map(item => [
    item.item_number || '',
    item.name || '',
    item.sku || '',
    item.barcode || '',
    item.category || '',
    item.folder_path || '',
    item.location_name || '',
    item.stock_quantity || 0,
    item.unit_cost || 0,
    item.total_value || 0,
    item.status || '',
    item.condition || ''
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  return csv
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}
