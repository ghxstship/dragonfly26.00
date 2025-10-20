"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  CheckSquare,
  Calendar,
  Briefcase,
  Package,
  Receipt,
  FileBarChart,
  GripVertical,
  Settings2
} from "lucide-react"
import { toast } from "@/lib/hooks/use-toast"

interface Widget {
  id: string
  name: string
  type: string
  enabled: boolean
  position: number
}

interface WidgetCustomizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  widgets: Widget[]
  onToggle: (widgetId: string) => Promise<void>
  onReset?: () => Promise<void>
}

const widgetIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'my-tasks': CheckSquare,
  'my-agenda': Calendar,
  'my-jobs': Briefcase,
  'my-assets': Package,
  'my-expenses': Receipt,
  'my-reports': FileBarChart,
}

const widgetColors: Record<string, string> = {
  'my-tasks': 'bg-purple-500',
  'my-agenda': 'bg-red-500',
  'my-jobs': 'bg-blue-500',
  'my-assets': 'bg-orange-500',
  'my-expenses': 'bg-green-500',
  'my-reports': 'bg-cyan-500',
}

export function WidgetCustomizationDialog({ 
  open, 
  onOpenChange, 
  widgets, 
  onToggle,
  onReset 
}: WidgetCustomizationDialogProps) {
  const t = useTranslations()
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggle = async (widgetId: string) => {
    setLoading(widgetId)
    try {
      await onToggle(widgetId)
      toast({
        title: "Widget updated",
        description: t('dashboard.toast.customized'),
      })
    } catch (error: any) {
      console.error('Error toggling widget:', error)
      toast({
        title: "Failed to update widget",
        description: t('common.toast.tryAgain'),
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleReset = async () => {
    if (!onReset) return
    setLoading('reset')
    try {
      await onReset()
      toast({
        title: "Dashboard reset",
        description: t('dashboard.toast.resetToDefaults'),
      })
    } catch (error: any) {
      console.error('Error resetting widgets:', error)
      toast({
        title: "Failed to reset",
        description: t('common.toast.tryAgain'),
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const enabledCount = widgets.filter(w => w.enabled).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Customize Dashboard</DialogTitle>
              <DialogDescription>
                Enable or disable widgets to personalize your dashboard
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{enabledCount}</span> of {widgets.length} widgets enabled
            </div>
            {onReset && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={loading === 'reset'}
              >
                Reset to Defaults
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {widgets.map((widget: any) => {
              const Icon = widgetIcons[widget.type] || CheckSquare
              const color = widgetColors[widget.type] || 'bg-gray-500'
              
              return (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div className={`p-2 rounded ${color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`widget-${widget.id}`} className="font-medium cursor-pointer">
                          {widget.name}
                        </Label>
                        {widget.enabled && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Position: {widget.position + 1}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={`widget-${widget.id}`}
                    checked={widget.enabled}
                    onCheckedChange={() => handleToggle(widget.id)}
                    disabled={loading === widget.id}
                  />
                </div>
              )
            })}
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            💡 Tip: Drag widgets to reorder them (coming soon)
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
