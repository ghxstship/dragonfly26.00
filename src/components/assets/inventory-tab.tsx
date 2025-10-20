"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import Image from "next/image"
import { Package, Camera, QrCode, FolderTree, AlertCircle, Grid3x3, List , Plus} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { DataTableOrganism, BoxViewOrganism } from "@/components/organisms"
import { useUIStore } from "@/store/ui-store"
import { createClient } from "@/lib/supabase/client"
import { InventoryFolderTree } from "./inventory-folder-tree"
import { InventoryItemDrawer } from "./inventory-item-drawer"
import { InventoryAlertsPanel } from "./inventory-alerts-panel"
import { BarcodeScannerOverlay } from "./barcode-scanner-overlay"
import { BulkActionsToolbar } from "./bulk-actions-toolbar"

interface InventoryTabProps {
  data: Record<string, unknown>[]
  loading: boolean
  workspaceId: string
}

export function InventoryTab({ data, loading, workspaceId }: InventoryTabProps) {
  const t = useTranslations('production.assets.inventory')
  const tCommon = useTranslations('common')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<unknown>(null)
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showFolderTree, setShowFolderTree] = useState(false)
  const { setRightSidebarOpen } = useUIStore()
  const supabase = createClient()

  // Calculate metrics
  const totalItems = data.length
  const lowStockItems = data.filter(item => (item as any).status === 'low_stock').length
  const outOfStockItems = data.filter(item => (item as any).status === 'out_of_stock').length
  const totalValue = data.reduce((sum: number, item: any) => sum + ((item.unit_cost || 0) * (item.stock_quantity || 0)), 0)

  // Filter by folder
  const filteredByFolder = selectedFolderId 
    ? data.filter(item => item.folder_id === selectedFolderId)
    : data

  // Schema for table view
  const inventorySchema: Record<string, unknown>[] = [
    { 
      id: 'photos',
      name: 'photos', 
      label: 'Photo', 
      type: 'text',
      render: (value: string[]) => {
        if (!value || value.length === 0) {
          return <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        }
        return <div className="w-12 h-12 bg-muted rounded overflow-hidden relative">
          <Image src={value[0]} alt="Item" fill className="object-cover" />
        </div>
      }
    },
    { id: 'name', name: 'name', label: 'Name', type: 'text' },
    { id: 'sku', name: 'sku', label: 'SKU', type: 'text' },
    { 
      id: 'barcode',
      name: 'barcode', 
      label: 'Barcode', 
      type: 'text',
      render: (value: string) => value ? (
        <div className="flex items-center gap-1 text-xs">
          <QrCode className="h-4 w-4" aria-hidden="true" />
          {value}
        </div>
      ) : '-'
    },
    { 
      id: 'stock_quantity',
      name: 'stock_quantity', 
      label: 'Stock', 
      type: 'number',
      render: (value: any, item: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value || 0}</span>
          {item.low_stock_threshold && value <= item.low_stock_threshold && (
            <AlertCircle className="h-4 w-4 text-orange-500" aria-hidden="true" />
          )}
        </div>
      )
    },
    { 
      id: 'status',
      name: 'status', 
      label: 'Status', 
      type: 'select',
      render: (value: string) => {
        const colors: Record<string, string> = {
          in_stock: 'bg-green-500/10 text-green-700 border-green-200',
          low_stock: 'bg-orange-500/10 text-orange-700 border-orange-200',
          out_of_stock: 'bg-red-500/10 text-red-700 border-red-200',
          on_order: 'bg-blue-500/10 text-blue-700 border-blue-200',
          reserved: 'bg-purple-500/10 text-purple-700 border-purple-200',
        }
        return (
          <Badge variant="outline" className={colors[value] || ''}>
            {value?.replace(/_/g, ' ')}
          </Badge>
        )
      }
    },
    { id: 'folder_name', name: 'folder_name', label: 'Location', type: 'text' },
    { id: 'category', name: 'category', label: 'Category', type: 'text' },
  ]

  const handleCreateItem = async (item: Record<string, unknown>) => {
    const { error } = await supabase
      .from('inventory_items')
      .insert({
        ...item,
        workspace_id: workspaceId,
      })
    
    if (error) {
      console.error('Error creating item:', error)
      throw error
    }
  }

  const handleUpdateItem = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }

  const handleItemClick = (item: Record<string, unknown>) => {
    setSelectedItem(item)
    setItemDrawerOpen(true)
  }

  const handleScanSuccess = (item: any) => {
    setSelectedItem(item)
    setItemDrawerOpen(true)
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Folder Tree */}
        {showFolderTree && (
          <div className="w-64 border-r">
            <InventoryFolderTree
              workspaceId={workspaceId}
              onFolderSelect={setSelectedFolderId}
              selectedFolderId={selectedFolderId}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col space-y-4 p-4">
          {/* Top Bar with Alerts */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFolderTree(!showFolderTree)}
            >
              <FolderTree className="h-4 w-4 mr-2" aria-hidden="true" />
              {showFolderTree ? 'Hide' : 'Show'} Folders
            </Button>
            <InventoryAlertsPanel workspaceId={workspaceId} />
          </div>

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedItems.size}
          onMoveToFolder={() => {}}
          onChangeCategory={() => {}}
          onBulkAdjust={() => {}}
          onPrintLabels={() => {}}
          onExport={() => {}}
          onDelete={() => {}}
          onClearSelection={() => setSelectedItems(new Set())}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t('totalItems')}</CardDescription>
              <CardTitle className="text-2xl">{totalItems}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t('totalValue')}</CardDescription>
              <CardTitle className="text-2xl">${totalValue.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Low Stock</CardDescription>
              <CardTitle className="text-2xl text-orange-600">{lowStockItems}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Out of Stock</CardDescription>
              <CardTitle className="text-2xl text-red-600">{outOfStockItems}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => setRightSidebarOpen(true, 'photo-upload')} variant="outline">
            <Camera className="h-4 w-4 mr-2" aria-hidden="true" />
            Upload Photos
          </Button>
          <Button onClick={() => setScannerOpen(true)} variant="outline">
            <QrCode className="h-4 w-4 mr-2" aria-hidden="true" />
            Scan Barcode
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 border rounded-md">
            <Button 
              variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <DataTableOrganism
            data={filteredByFolder}
            columns={inventorySchema as any}
            loading={loading}
          />
        ) : (
          <BoxViewOrganism 
            data={filteredByFolder as any} 
            schema={inventorySchema as any}
            onItemClick={handleItemClick}
            createActionLabel="New Item"
            onCreateAction={() => {}}
          />
        )}
        </div>
      </div>

      {/* Item Detail Drawer */}
      <InventoryItemDrawer
        item={selectedItem}
        open={itemDrawerOpen}
        onOpenChange={setItemDrawerOpen}
        onEdit={() => {}}
        onDelete={async () => {
          if (selectedItem) {
            await handleDeleteItem((selectedItem as any).id)
            setItemDrawerOpen(false)
          }
        }}
        onAdjustStock={() => {}}
      />

      {/* Barcode Scanner Overlay */}
      <BarcodeScannerOverlay
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScanSuccess={handleScanSuccess}
        workspaceId={workspaceId}
      />
    </div>
    </main>
  )
}
