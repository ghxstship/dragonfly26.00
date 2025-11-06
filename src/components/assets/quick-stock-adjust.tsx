"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Plus, Minus, ArrowRightLeft, Edit3, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

interface QuickStockAdjustProps {
  item: any
  onAdjusted: () => void
}

export function QuickStockAdjust({ item, onAdjusted }: QuickStockAdjustProps) {
  const t = useTranslations('production.assets')
  const [open, setOpen] = useState(false)
  const [adjustType, setAdjustType] = useState<'receive' | 'issue' | 'transfer' | 'adjustment'>('receive')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleQuickAction = (type: typeof adjustType) => {
    setAdjustType(type)
    setOpen(true)
  }

  const handleAdjust = async () => {
    if (!quantity || parseInt(quantity) === 0) return

    setLoading(true)
    try {
      const quantityChange = adjustType === 'issue' ? -parseInt(quantity) : parseInt(quantity)
      
      const { error } = await supabase.rpc('adjust_inventory_stock', {
        p_inventory_item_id: item.id,
        p_quantity_change: quantityChange,
        p_movement_type: adjustType,
        p_reason: reason || undefined
      })

      if (error) throw error

      setOpen(false)
      setQuantity('')
      setReason('')
      onAdjusted()
    } catch (error: any) {
      console.error('Error adjusting stock:', error)
      alert('Failed to adjust stock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            ⚡ Quick Adjust
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleQuickAction('receive')}>
            <Plus aria-hidden="true" className="h-4 w-4 mr-2 text-green-600" />
            Receive Stock
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickAction('issue')}>
            <Minus aria-hidden="true" className="h-4 w-4 mr-2 text-red-600" />
            Issue Stock
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleQuickAction('transfer')}>
            <ArrowRightLeft aria-hidden="true" className="h-4 w-4 mr-2 text-blue-600" />
            Transfer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickAction('adjustment')}>
            <Edit3 className="h-4 w-4 mr-2 text-orange-600" />
            Manual Adjustment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustType === 'receive' && 'Receive Stock'}
              {adjustType === 'issue' && 'Issue Stock'}
              {adjustType === 'transfer' && 'Transfer Stock'}
              {adjustType === 'adjustment' && 'Manual Adjustment'}
            </DialogTitle>
            <DialogDescription>
              {item.name} • Current stock: {item.stock_quantity || 0}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder={t('assets.stock.enterQuantity')}
                value={quantity as any}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., PO #12345, Event checkout, Damaged items"
                value={reason as any}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">New stock level: </span>
                {adjustType === 'issue' 
                  ? (item.stock_quantity || 0) - parseInt(quantity || '0')
                  : (item.stock_quantity || 0) + parseInt(quantity || '0')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAdjust} disabled={!quantity || loading}>
              {loading ? 'Adjusting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
