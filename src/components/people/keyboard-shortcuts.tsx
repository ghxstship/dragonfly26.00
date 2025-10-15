"use client"

import { useEffect, useState } from "react"
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

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ["/"], description: "Focus search", category: "navigation" },
  { keys: ["Cmd", "K"], description: "Quick search", category: "navigation" },
  { keys: ["G", "then", "P"], description: "Go to People", category: "navigation" },
  { keys: ["G", "then", "S"], description: "Go to Schedule", category: "navigation" },
  { keys: ["G", "then", "A"], description: "Go to Approvals", category: "navigation" },
  
  // Actions
  { keys: ["N"], description: "New employee", category: "actions" },
  { keys: ["C"], description: "Clock in/out", category: "actions" },
  { keys: ["P"], description: "Request PTO", category: "actions" },
  { keys: ["S"], description: "View schedule", category: "actions" },
  { keys: ["A"], description: "Open approvals", category: "actions" },
  { keys: ["E"], description: "Export data", category: "actions" },
  
  // General
  { keys: ["?"], description: "Show shortcuts", category: "general" },
  { keys: ["Esc"], description: "Close dialog/Cancel", category: "general" },
  { keys: ["Cmd", "S"], description: "Save", category: "general" },
  { keys: ["Cmd", "Enter"], description: "Submit form", category: "general" },
]

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
  const categories = {
    navigation: "Navigation",
    actions: "Actions",
    general: "General"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            {Object.entries(categories).map(([key, title]) => {
              const categoryShortcuts = shortcuts.filter(s => s.category === key)
              
              return (
                <div key={key}>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    {title}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/50"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, j) => (
                            <span key={j} className="flex items-center gap-1">
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

        <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
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
        <span key={i} className="inline-flex items-center gap-0.5">
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
