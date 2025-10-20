'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface DashboardWidget {
  id: string
  name: string
  type: string
  position: number
  enabled: boolean
  settings?: Record<string, unknown>
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: '1', name: 'My Tasks', type: 'my-tasks', position: 0, enabled: true },
  { id: '2', name: 'My Agenda', type: 'my-agenda', position: 1, enabled: true },
  { id: '3', name: 'My Jobs', type: 'my-jobs', position: 2, enabled: false },
  { id: '4', name: 'My Assets', type: 'my-assets', position: 3, enabled: false },
  { id: '5', name: 'My Expenses', type: 'my-expenses', position: 4, enabled: false },
  { id: '6', name: 'My Reports', type: 'my-reports', position: 5, enabled: false },
]

export function useDashboardWidgets(workspaceId: string, userId: string) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!workspaceId || !userId) return

    loadWidgets()
  }, [workspaceId, userId])

  const loadWidgets = async () => {
    try {
      const { data, error } = await supabase
        .from('user_dashboard_widgets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .order('position')

      if (error) throw error

      if (data && data.length > 0) {
        setWidgets(data)
      } else {
        // Initialize with defaults
        await saveWidgets(DEFAULT_WIDGETS)
      }
    } catch (error: any) {
      console.error('Error loading widgets:', error)
      // Use defaults on error
      setWidgets(DEFAULT_WIDGETS)
    } finally {
      setLoading(false)
    }
  }

  const saveWidgets = async (newWidgets: DashboardWidget[]) => {
    try {
      // Delete existing widgets
      await supabase
        .from('user_dashboard_widgets')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)

      // Insert new widgets
      const { error } = await supabase
        .from('user_dashboard_widgets')
        .insert(
          newWidgets.map((w: any) => ({
            ...w,
            workspace_id: workspaceId,
            user_id: userId,
          }))
        )

      if (error) throw error
      setWidgets(newWidgets)
    } catch (error: any) {
      console.error('Error saving widgets:', error)
      throw error
    }
  }

  const toggleWidget = async (widgetId: string) => {
    const updatedWidgets = widgets.map((w: any) =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    )
    await saveWidgets(updatedWidgets)
  }

  const reorderWidgets = async (newOrder: DashboardWidget[]) => {
    const reordered = newOrder.map((w: any, index: number) => ({ ...w, position: index }))
    await saveWidgets(reordered)
  }

  const resetToDefaults = async () => {
    await saveWidgets(DEFAULT_WIDGETS)
  }

  return {
    widgets,
    loading,
    toggleWidget,
    reorderWidgets,
    resetToDefaults,
    enabledWidgets: widgets.filter((w: any) => w.enabled).sort((a: any, b: any) => a.position - b.position),
    availableWidgets: widgets.filter((w: any) => !w.enabled).sort((a: any, b: any) => a.position - b.position),
  }
}
