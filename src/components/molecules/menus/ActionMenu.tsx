"use client"

import { MoreHorizontal, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * ActionMenu - Molecular Component
 * 
 * Reusable action menu dropdown.
 * Replaces 100+ hardcoded action menu implementations.
 */

export interface ActionMenuItem {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
  separator?: boolean
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  label?: string
  triggerVariant?: 'ghost' | 'outline'
}

export function ActionMenu({
  items,
  label = "Actions",
  triggerVariant = 'ghost',
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={triggerVariant} size="icon" aria-label={label}>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, index) => (
          <div key={index}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              className={item.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
            >
              {item.icon && <item.icon className="h-4 w-4 mr-2" aria-hidden="true" />}
              {item.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
