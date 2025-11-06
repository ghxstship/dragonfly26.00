"use client"

import { useState, useEffect } from "react"
import { Plus, CheckCircle2, Circle, Loader2, Filter, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, formatDate } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useUIStore } from "@/store/ui-store"
import { useToast } from "@/lib/hooks/use-toast"

interface Task {
  id: string
  name: string
  status: string
  priority: string | null
  due_date: string | null
  created_at: string
}

export function TasksTabContent() {
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  const { currentWorkspace } = useUIStore()
  
  const [tasks, setTasks] = useState<Task[]>([])
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

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentWorkspace?.id || !currentUser) return
      
      try {
        const { data, error } = await supabase
          .from('project_tasks')
          .select('id, name, status, priority, due_date, created_at')
          .eq('workspace_id', currentWorkspace.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setTasks(data || [])
      } catch (error: any) {
        console.error('Error fetching tasks:', error)
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [supabase, currentWorkspace?.id, currentUser, toast])

  // Real-time subscription
  useEffect(() => {
    if (!currentWorkspace?.id) return

    const channel = supabase
      .channel(`tasks:${currentWorkspace.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `workspace_id=eq.${currentWorkspace.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new as Task, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new as Task : t))
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t: any) => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentWorkspace?.id])

  const toggleComplete = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'in_progress' : 'done'
    
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
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

  const activeTasks = tasks.filter(t => t.status !== 'done')
  const completedTasks = tasks.filter(t => t.status === 'done')
  const overdueTasks = activeTasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date()
  )

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center justify-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">My Tasks</h3>
            <p className="text-xs text-muted-foreground">
              {activeTasks.length} active, {completedTasks.length} completed
            </p>
          </div>
          <Button size="sm" className="h-7 gap-1.5">
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="active" className="flex-1 flex flex-wrap flex-col min-h-0">
        <TabsList aria-hidden="true" className="w-full grid grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-4 mt-3 max-w-full">
          <TabsTrigger value="active">
            Active
            {activeTasks.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                {activeTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue
            {overdueTasks.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                {overdueTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Done</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="flex-1 mt-3 m-0">
          <ScrollArea aria-hidden="true" className="h-full">
            <div className="px-4 pb-4 space-y-2">
              {activeTasks.length === 0 ? (
                <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 flex-shrink-0" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No active tasks
                  </p>
                </div>
              ) : (
                activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="overdue" className="flex-1 mt-3 m-0">
          <ScrollArea aria-hidden="true" className="h-full">
            <div className="px-4 pb-4 space-y-2">
              {overdueTasks.length === 0 ? (
                <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 flex-shrink-0" />
                  <p className="text-sm font-medium">Nothing overdue</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You&apos;re on track!
                  </p>
                </div>
              ) : (
                overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    showOverdue
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className="flex-1 mt-3 m-0">
          <ScrollArea aria-hidden="true" className="h-full">
            <div className="px-4 pb-4 space-y-2">
              {completedTasks.length === 0 ? (
                <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                  <Circle aria-hidden="true" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium">No completed tasks</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete tasks to see them here
                  </p>
                </div>
              ) : (
                completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TaskCard({ 
  task, 
  onToggleComplete,
  showOverdue = false
}: { 
  task: Task
  onToggleComplete: (id: string, status: string) => void
  showOverdue?: boolean
}) {
  const isCompleted = task.status === 'done'
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted

  return (
    <button
      className={cn(
        "w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors",
        isCompleted && "opacity-60"
      )}
      onClick={() => onToggleComplete(task.id, task.status)}
    >
      <div className="flex flex-wrap gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
          ) : (
            <Circle aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className={cn(
              "font-medium text-sm",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.name}
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
              {task.priority && (
                <Badge 
                  variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 
                    'secondary'
                  }
                  className="text-xs h-5"
                >
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-1">
            {task.due_date && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                <Clock aria-hidden="true" className="h-3 w-3" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}
            <Badge variant="outline" className="text-xs h-5">
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  )
}
