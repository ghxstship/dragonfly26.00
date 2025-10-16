"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import type { User, ItemWatcher } from "@/types"

interface WatchersManagerProps {
  watchers: ItemWatcher[]
  availableUsers: User[]
  currentUserId: string
  onWatchersChange: (watchers: ItemWatcher[]) => void
}

export function WatchersManager({
  watchers,
  availableUsers,
  currentUserId,
  onWatchersChange,
}: WatchersManagerProps) {
  const t = useTranslations()
  const watcherUserIds = new Set(watchers.map((w) => w.user_id))
  const isCurrentUserWatching = watcherUserIds.has(currentUserId)

  const toggleWatcher = (user: User) => {
    if (watcherUserIds.has(user.id)) {
      // Remove watcher
      onWatchersChange(watchers.filter((w: any) => w.user_id !== user.id))
    } else {
      // Add watcher
      const newWatcher: ItemWatcher = {
        id: `watcher-${Date.now()}`,
        item_id: "current-item",
        item_type: "task",
        user_id: user.id,
        watch_type: "all",
        added_at: new Date().toISOString(),
        user,
      }
      onWatchersChange([...watchers, newWatcher])
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Show watcher count */}
      {watchers.length > 0 && (
        <div className="flex -space-x-2">
          {watchers.slice(0, 3).map((watcher) => (
            <Avatar key={watcher.id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={watcher.user?.avatar_url} />
              <AvatarFallback className="text-xs">
                {getInitials(watcher.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
          ))}
          {watchers.length > 3 && (
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="text-xs">
                +{watchers.length - 3}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      {/* Watch/Unwatch button for current user */}
      <Button
        variant={isCurrentUserWatching ? "default" : "outline"}
        size="sm"
        className="gap-2"
        onClick={() => {
          const currentUser = availableUsers.find((u) => u.id === currentUserId)
          if (currentUser) {
            toggleWatcher(currentUser)
          }
        }}
      >
        {isCurrentUserWatching ? (
          <>
            <Eye className="h-4 w-4" />
            Watching
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            Watch
          </>
        )}
      </Button>

      {/* Manage all watchers dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            Manage ({watchers.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Watchers</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-y-auto">
            {availableUsers.map((user) => (
              <DropdownMenuCheckboxItem
                key={user.id}
                checked={watcherUserIds.has(user.id)}
                onCheckedChange={() => toggleWatcher(user)}
                className="gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
