"use client"

import { useState, useEffect } from "react"
import { Bell, AlertTriangle, PackageX, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

interface Alert {
  id: string
  inventory_item_id: string
  item_name: string
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring' | 'damaged'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  acknowledged: boolean
  created_at: string
}

interface InventoryAlertsPanelProps {
  workspaceId: string
}

export function InventoryAlertsPanel({ workspaceId }: InventoryAlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAlerts()
    
    // Subscribe to real-time alerts
    const subscription = supabase
      .channel('inventory_alerts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inventory_alerts',
        filter: `workspace_id=eq.${workspaceId}`
      }, loadAlerts)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [workspaceId])

  const loadAlerts = async () => {
    const { data, error } = await supabase
      .from('inventory_alerts')
      .select(`
        *,
        inventory_items!inner(name)
      `)
      .eq('workspace_id', workspaceId)
      .eq('acknowledged', false)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      setAlerts(data.map(alert => ({
        ...alert,
        item_name: alert.inventory_items?.name || 'Unknown Item'
      })))
    }
    setLoading(false)
  }

  const acknowledgeAlert = async (alertId: string) => {
    await supabase
      .from('inventory_alerts')
      .update({ acknowledged: true })
      .eq('id', alertId)
    
    loadAlerts()
  }

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length

  const getAlertIcon = (type: Alert['alert_type']) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'out_of_stock':
        return <PackageX className="h-4 w-4 text-red-500" />
      case 'expiring':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unacknowledgedCount > 0 && (
            <Badge 
              className="absolute sm:relative sm:inset-auto -top-2 md:top-1 -right-2 md:right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unacknowledgedCount > 9 ? '9+' : unacknowledgedCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full md:w-96">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4">
          <h3 className="font-semibold">Inventory Alerts</h3>
          {unacknowledgedCount > 0 && (
            <Badge variant="secondary">{unacknowledgedCount} new</Badge>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="p-4 md:p-4 sm:p-6 md:p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-4 md:p-4 sm:p-6 md:p-8 text-center text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
              <p className="text-xs mt-1">All inventory levels look good!</p>
            </div>
          ) : (
            <div className="divide-y">
              {alerts.map(alert => (
                <div key={alert.id} className="p-4 hover:bg-accent transition-colors">
                  <div className="flex flex-wrap flex-col md:flex-row items-start gap-3">
                    <div className="mt-0.5">{getAlertIcon(alert.alert_type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        <p className="font-medium text-sm">{alert.item_name}</p>
                        <div className={`h-2 w-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-xs"
                    >
                      Acknowledge
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs">
                      View Item
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {alerts.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full max-w-full" size="sm">
                View All Alerts
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
