"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useUIStore } from "@/store/ui-store"
import { useToast } from "@/lib/hooks/use-toast"

interface AgendaItem {
  id: string
  title: string
  type: 'event' | 'task' | 'meeting'
  start_time: string
  end_time: string | null
  completed: boolean
  priority: string | null
}

export function AgendaTabContent() {
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  const { currentWorkspace } = useUIStore()
  
  const [items, setItems] = useState<AgendaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch agenda items
  useEffect(() => {
    const fetchAgenda = async () => {
      if (!currentWorkspace?.id || !currentUser) return
      
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Fetch tasks due today
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('id, name, due_date, status, priority')
          .eq('workspace_id', currentWorkspace.id)
          .gte('due_date', today.toISOString())
          .lt('due_date', tomorrow.toISOString())
          .order('due_date', { ascending: true })
          .limit(20)

        if (tasksError) throw tasksError

        // Transform tasks to agenda items
        const agendaItems: AgendaItem[] = (tasks || []).map((task: any) => ({
          id: task.id,
          title: task.name,
          type: 'task' as const,
          start_time: task.due_date,
          end_time: null,
          completed: task.status === 'completed',
          priority: task.priority,
        }))

        setItems(agendaItems)
      } catch (error: any) {
        console.error('Error fetching agenda:', error)
        toast({
          title: "Error",
          description: "Failed to load agenda",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgenda()
  }, [supabase, currentWorkspace?.id, currentUser, toast])

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: completed ? 'in_progress' : 'completed' })
        .eq('id', id)

      if (error) throw error

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !completed } : item
        )
      )
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const groupItemsByTime = () => {
    const now = new Date()
    const currentHour = now.getHours()

    const morning = items.filter((item) => {
      const hour = new Date(item.start_time).getHours()
      return hour < 12
    })

    const afternoon = items.filter((item) => {
      const hour = new Date(item.start_time).getHours()
      return hour >= 12 && hour < 17
    })

    const evening = items.filter((item) => {
      const hour = new Date(item.start_time).getHours()
      return hour >= 17
    })

    return { morning, afternoon, evening }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const { morning, afternoon, evening } = groupItemsByTime()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">Today&apos;s Agenda</h3>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button size="sm" className="h-7 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground">
              {items.filter(i => i.completed).length} / {items.length} completed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium">Your day is clear!</p>
              <p className="text-xs text-muted-foreground mt-1">
                No events or tasks scheduled for today
              </p>
            </div>
          ) : (
            <>
              {morning.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                    Morning
                  </h4>
                  <div className="space-y-2">
                    {morning.map((item) => (
                      <AgendaItemCard
                        key={item.id}
                        item={item}
                        onToggleComplete={toggleComplete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {afternoon.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                    Afternoon
                  </h4>
                  <div className="space-y-2">
                    {afternoon.map((item) => (
                      <AgendaItemCard
                        key={item.id}
                        item={item}
                        onToggleComplete={toggleComplete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {evening.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                    Evening
                  </h4>
                  <div className="space-y-2">
                    {evening.map((item) => (
                      <AgendaItemCard
                        key={item.id}
                        item={item}
                        onToggleComplete={toggleComplete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function AgendaItemCard({ 
  item, 
  onToggleComplete 
}: { 
  item: AgendaItem
  onToggleComplete: (id: string, completed: boolean) => void
}) {
  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors",
        item.completed && "opacity-60"
      )}
      onClick={() => onToggleComplete(item.id, item.completed)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {item.completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className={cn(
              "font-medium text-sm",
              item.completed && "line-through text-muted-foreground"
            )}>
              {item.title}
            </div>
            {item.priority && (
              <Badge 
                variant={
                  item.priority === 'high' ? 'destructive' : 
                  item.priority === 'medium' ? 'default' : 
                  'secondary'
                }
                className="text-xs h-5"
              >
                {item.priority}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(item.start_time).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
            <Badge variant="outline" className="text-xs h-5">
              {item.type}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  )
}
