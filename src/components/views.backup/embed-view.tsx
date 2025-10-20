"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Frame, Plus, Maximize2, RefreshCw, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface EmbedViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

interface EmbedItem {
  id: string
  title: string
  url: string
  type: "iframe" | "video" | "document"
}

export function EmbedView({ data, schema, onItemClick }: EmbedViewProps) {
  const t = useTranslations()
  const [embeds, setEmbeds] = useState<EmbedItem[]>([
    {
      id: "1",
      title: "Website",
      url: "https://example.com",
      type: "iframe",
    },
  ])
  const [activeEmbed, setActiveEmbed] = useState<string | null>(embeds[0]?.id || null)
  const [isAddingEmbed, setIsAddingEmbed] = useState(false)
  const [newEmbedUrl, setNewEmbedUrl] = useState("")
  const [newEmbedTitle, setNewEmbedTitle] = useState("")

  const activeEmbedData = embeds.find((e: any) => e.id === activeEmbed)

  const handleAddEmbed = async () => {
    if (!newEmbedUrl || !newEmbedTitle) return

    const newEmbed: EmbedItem = {
      id: Date.now().toString(),
      title: newEmbedTitle,
      url: newEmbedUrl,
      type: "iframe",
    }

    setEmbeds([...embeds, newEmbed])
    setActiveEmbed(newEmbed.id)
    setIsAddingEmbed(false)
    setNewEmbedUrl("")
    setNewEmbedTitle("")
  }

  const handleRemoveEmbed = (id: string) => {
    setEmbeds((prev) => prev.filter((e: any) => (e as any).id !== id))
    if (activeEmbed === id) {
      setActiveEmbed(embeds[0]?.id || null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Frame className="h-5 w-5" />
          <h3 className="font-semibold">Embedded Content</h3>
        </div>
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-2">
            {activeEmbedData && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(activeEmbedData.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh content</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fullscreen</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          <Button onClick={() => setIsAddingEmbed(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Embed
          </Button>
          </div>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Embed Tabs */}
        {embeds.length > 0 && (
          <div className="w-48 border-r bg-muted/30 overflow-y-auto">
            <div className="p-2 space-y-1">
              {embeds.map((embed: any) => (
                <div key={embed.id} className="group relative">
                  <button
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors",
                      activeEmbed === embed.id && "bg-accent"
                    )}
                    onClick={() => setActiveEmbed(embed.id)}
                  >
                    <div className="font-medium truncate pr-6">{embed.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{embed.type}</div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveEmbed(embed.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Embed Content */}
        <div className="flex-1 overflow-hidden bg-muted/20">
          {activeEmbedData ? (
            <div className="w-full h-full p-4">
              <div className="w-full h-full border rounded-lg bg-background overflow-hidden">
                <iframe
                  src={activeEmbedData.url}
                  className="w-full h-full"
                  title={activeEmbedData.title}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Frame className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No Embeds</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Add external content like websites, videos, or documents
                  </p>
                  <Button className="mt-4" onClick={() => setIsAddingEmbed(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Embed
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Embed Dialog */}
      <Dialog open={isAddingEmbed} onOpenChange={setIsAddingEmbed}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Embedded Content</DialogTitle>
            <DialogDescription>
              Enter the URL of the content you want to embed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embed-title">Title</Label>
              <Input
                id="embed-title"
                placeholder={t('views.myWebsite')}
                value={newEmbedTitle as any}
                onChange={(e) => setNewEmbedTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="embed-url">URL</Label>
              <Input
                id="embed-url"
                placeholder="https://example.com"
                value={newEmbedUrl as any}
                onChange={(e) => setNewEmbedUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEmbed(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmbed}>Add Embed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
