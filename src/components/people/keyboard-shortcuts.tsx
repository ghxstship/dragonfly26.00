"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Keyboard } from "lucide-react"

interface Shortcut {
  keys: string[]
  description: string
  category: "navigation" | "actions" | "general"
}

function useKeyboardShortcuts() {
  const t = useTranslations()
  
  return [
    // Navigation
    { keys: ["/"], description: t('people.shortcuts.focusSearch'), category: "navigation" as const },
    { keys: ["Cmd", "K"], description: t('people.shortcuts.quickSearch'), category: "navigation" as const },
    { keys: ["G", "then", "P"], description: t('people.shortcuts.goToPeople'), category: "navigation" as const },
    { keys: ["G", "then", "S"], description: t('people.shortcuts.goToSchedule'), category: "navigation" as const },
    { keys: ["G", "then", "A"], description: t('people.shortcuts.goToApprovals'), category: "navigation" as const },
    
    // Actions
    { keys: ["N"], description: t('people.shortcuts.newEmployee'), category: "actions" as const },
    { keys: ["C"], description: t('people.shortcuts.clockInOut'), category: "actions" as const },
    { keys: ["P"], description: t('people.shortcuts.requestPTO'), category: "actions" as const },
    { keys: ["S"], description: t('people.shortcuts.viewSchedule'), category: "actions" as const },
    { keys: ["A"], description: t('people.shortcuts.openApprovals'), category: "actions" as const },
    { keys: ["E"], description: t('people.shortcuts.exportData'), category: "actions" as const },
    
    // General
    { keys: ["?"], description: t('people.shortcuts.showShortcuts'), category: "general" as const },
    { keys: ["Esc"], description: t('people.shortcuts.closeDialog'), category: "general" as const },
    { keys: ["Cmd", "S"], description: t('people.shortcuts.save'), category: "general" as const },
    { keys: ["Cmd", "Enter"], description: t('people.shortcuts.submitForm'), category: "general" as const },
  ]
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {children}
      <KeyboardShortcutsDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

function KeyboardShortcutsDialog({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const shortcuts = useKeyboardShortcuts()
  
  const categories = {
    navigation: "Navigation",
    actions: "Actions",
    general: "General"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl px-4 sm:px-6 lg:px-8">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] md:h-[500px] pr-4">
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {Object.entries(categories).map(([key, title]) => {
              const categoryShortcuts = shortcuts.filter((s: Shortcut) => s.category === key)
              
              return (
                <div key={key}>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    {title}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between py-2 px-3 rounded hover:bg-muted/50"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          {shortcut.keys.map((key, j) => (
                            <span key={j} className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                              <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
                                {key}
                              </kbd>
                              {j < shortcut.keys.length - 1 && key !== "then" && (
                                <span className="text-xs text-muted-foreground">+</span>
                              )}
                              {key === "then" && (
                                <span className="text-xs text-muted-foreground mx-1">→</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between pt-4 border-t text-xs text-muted-foreground">
          <span>Press <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">?</kbd> anytime to see shortcuts</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Esc</kbd> to close</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Shortcut hint component (shows inline)
export function ShortcutHint({ 
  keys, 
  className 
}: { 
  keys: string[]
  className?: string 
}) {
  return (
    <div className={className}>
      {keys.map((key, i) => (
        <span key={i} className="inline-flex flex-col md:flex-row items-center gap-0.5">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted border border-border rounded">
            {key}
          </kbd>
          {i < keys.length - 1 && (
            <span className="text-xs text-muted-foreground">+</span>
          )}
        </span>
      ))}
    </div>
  )
}
