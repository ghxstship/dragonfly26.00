"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Receipt, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/lib/hooks/use-toast"

interface LogExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  userId: string
  onSuccess?: () => void
}

export function LogExpenseDialog({ open, onOpenChange, workspaceId, userId, onSuccess }: LogExpenseDialogProps) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'meals',
    merchant: '',
    notes: ''
  })

  const categories = [
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'travel', label: 'Travel' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'software', label: 'Software/Services' },
    { value: 'other', label: 'Other' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          workspace_id: workspaceId,
          type: 'expense',
          transaction_date: format(date, 'yyyy-MM-dd'),
          amount: parseFloat(formData.amount),
          description: formData.description,
          category: formData.category,
          payment_method: formData.merchant,
          notes: formData.notes,
          status: 'pending',
          created_by: userId
        })

      if (error) throw error

      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: 'meals',
        merchant: '',
        notes: ''
      })
      setDate(new Date())
      
      onOpenChange(false)
      onSuccess?.()
      
      // Show success notification
      toast({
        title: "Expense logged successfully",
        description: `$${formData.amount} expense has been submitted for approval.`,
      })
    } catch (error) {
      console.error('Error logging expense:', error)
      toast({
        title: "Failed to log expense",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>Log Expense</DialogTitle>
              <DialogDescription>
                Submit a new expense for approval
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="e.g. Client dinner at restaurant"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant/Vendor</Label>
            <Input
              id="merchant"
              placeholder="e.g. Hilton Hotel"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Receipt attachment coming soon</span>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
