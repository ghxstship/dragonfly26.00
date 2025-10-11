"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useUIStore } from "@/store/ui-store"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  FileText,
  Search,
  Settings,
  Users,
  Calendar,
  Folder,
  Plus,
} from "lucide-react"
import { ItemType } from "@/components/shared/create-item-dialog"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateItem?: (type: ItemType) => void
}

export function CommandPalette({ open, onOpenChange, onCreateItem }: CommandPaletteProps) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const { currentWorkspace } = useUIStore()
  const [search, setSearch] = useState("")
  
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en'

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t('commandPalette.typeCommand')}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{t('commandPalette.noResults')}</CommandEmpty>
        
        <CommandGroup heading={t('commandPalette.quickActions')}>
          <CommandItem onSelect={() => runCommand(() => onCreateItem?.("task"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.createNewTask')}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onCreateItem?.("project"))}>
            <Folder className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.createNewProject')}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onCreateItem?.("doc"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.createNewDoc')}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onCreateItem?.("workspace"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.createNewWorkspace')}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('commandPalette.navigation')}>
          <CommandItem onSelect={() => runCommand(() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/projects`))}>
            <Folder className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.projects')}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/people`))}>
            <Users className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.people')}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/events`))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>{t('commandPalette.events')}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/admin`))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Workspace settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
