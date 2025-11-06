"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText,
  UserPlus,
  Edit,
  Upload,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  id: string
  type: "clock" | "pto" | "onboarding" | "document" | "edit" | "other"
  title: string
  description?: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

interface ActivityTimelineProps {
  events: TimelineEvent[]
  personnelName?: string
  showLoadMore?: boolean
  onLoadMore?: () => void
  className?: string
}

export function ActivityTimeline({
  events,
  personnelName,
  showLoadMore = true,
  onLoadMore,
  className
}: ActivityTimelineProps) {
  return (
    <Card aria-hidden="true" className={className}>
      <CardHeader aria-hidden="true" className="pb-3">
        <CardTitle aria-hidden="true" className="text-sm">
          {personnelName ? `Activity: ${personnelName}` : "Activity Timeline"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea aria-hidden="true" className="h-[400px] pr-4">
          <div className="space-y-4">
            {events.map((event, index) => (
              <TimelineEventItem 
                key={event.id} 
                event={event}
                isLast={index === events.length - 1}
              />
            ))}
          </div>

          {showLoadMore && onLoadMore && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4 max-w-full"
              onClick={onLoadMore}
            >
              Load More
            </Button>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function TimelineEventItem({ 
  event, 
  isLast 
}: { 
  event: TimelineEvent
  isLast: boolean 
}) {
  const config = getEventConfig(event.type)
  const timeAgo = formatTimeAgo(event.timestamp)
  const time = event.timestamp.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })

  return (
    <div className="flex flex-wrap gap-3 relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute sm:relative sm:inset-auto left-[15px] top-8 bottom-0 w-px bg-border sm:relative sm:inset-auto" />
      )}

      {/* Icon */}
      <div className={cn(
        "relative z-10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
        config.bgColor
      )}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium">{event.title}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
            {timeAgo}
          </span>
        </div>
        
        {event.description && (
          <p className="text-xs text-muted-foreground mb-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap">
          <Badge variant="outline" className="h-5 text-xs">
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{time}</span>
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            Object.entries(event.metadata).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="h-5 text-xs">
                {String(value)}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function getEventConfig(type: TimelineEvent['type']) {
  const configs = {
    clock: {
      icon: <Clock aria-hidden="true" className="h-4 w-4 text-blue-600" />,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      label: "Time Clock"
    },
    pto: {
      icon: <Calendar aria-hidden="true" className="h-4 w-4 text-purple-600" />,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      label: "PTO"
    },
    onboarding: {
      icon: <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />,
      bgColor: "bg-green-100 dark:bg-green-900",
      label: "Onboarding"
    },
    document: {
      icon: <FileText aria-hidden="true" className="h-4 w-4 text-orange-600" />,
      bgColor: "bg-orange-100 dark:bg-orange-900",
      label: "Document"
    },
    edit: {
      icon: <Edit aria-hidden="true" className="h-4 w-4 text-gray-600" />,
      bgColor: "bg-gray-100 dark:bg-gray-800",
      label: "Update"
    },
    other: {
      icon: <ArrowRight aria-hidden="true" className="h-4 w-4 text-gray-600" />,
      bgColor: "bg-gray-100 dark:bg-gray-800",
      label: "Activity"
    }
  }

  return configs[type] || configs.other
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Compact timeline for dashboard
export function ActivityTimelineCompact({
  events,
  maxItems = 5
}: {
  events: TimelineEvent[]
  maxItems?: number
}) {
  return (
    <div className="space-y-3">
      {events.slice(0, maxItems).map((event: any) => {
        const config = getEventConfig(event.type)
        return (
          <div key={event.id} className="flex items-start gap-2">
            <div className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
              config.bgColor
            )}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(event.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
