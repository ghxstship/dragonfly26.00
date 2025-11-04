"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, X, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getInitials } from "@/lib/utils"
import type { User, ItemAssignee } from "@/types"

interface AssigneeSelectorProps {
  assignees: ItemAssignee[]
  availableUsers: User[]
  maxAssignees?: number
  onAssigneesChange: (assignees: ItemAssignee[]) => void
}

export function AssigneeSelector({
  assignees,
  availableUsers,
  maxAssignees = 10,
  onAssigneesChange,
}: AssigneeSelectorProps) {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")

  const assignedUserIds = new Set(assignees.map((a) => a.user_id))
  
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addAssignee = (user: User) => {
    if (assignedUserIds.has(user.id) || assignees.length >= maxAssignees) return

    const newAssignee: ItemAssignee = {
      id: `assignee-${Date.now()}`,
      item_id: "current-item", // This would come from context
      item_type: "task",
      user_id: user.id,
      assigned_at: new Date().toISOString(),
      user,
    }

    onAssigneesChange([...assignees, newAssignee])
  }

  const removeAssignee = (userId: string) => {
    onAssigneesChange(assignees.filter((a: any) => a.user_id !== userId))
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
      {/* Display assigned users */}
      <div className="flex flex-wrap md:flex-nowrap -space-x-2">
        {assignees.slice(0, 3).map((assignee) => (
          <div key={assignee.id} className="relative group">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src={assignee.user?.avatar_url} />
              <AvatarFallback className="text-xs">
                {getInitials(assignee.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => removeAssignee(assignee.user_id)}
              className="absolute sm:relative sm:inset-auto -top-2 md:top-1 -right-2 md:right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {assignees.length > 3 && (
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback className="text-xs">
              +{assignees.length - 3}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Add assignee dropdown */}
      {assignees.length < maxAssignees && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <UserPlus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full sm:w-64 p-0">
            <div className="p-2 border-b sticky top-0 bg-background z-10">
              <DropdownMenuLabel className="px-2 py-1.5">Assign to</DropdownMenuLabel>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 mt-2"
              />
            </div>
            <div className="max-h-[280px] overflow-y-auto p-1">
              {filteredUsers.map((user) => {
                const isAssigned = assignedUserIds.has(user.id)
                
                return (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => !isAssigned && addAssignee(user)}
                    disabled={isAssigned}
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
                    {isAssigned && <Check className="h-4 w-4 flex-shrink-0" />}
                  </DropdownMenuItem>
                )
              })}
              
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
