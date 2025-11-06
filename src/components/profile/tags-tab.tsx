"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Plus, Info, Save, Loader2 } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock system tags - will be populated from backend later
const SYSTEM_TAGS = [
  { id: "1", name: "Stage Management", nameKey: "stage_management", category: "Role", color: "#3b82f6" },
  { id: "2", name: "Lighting Design", nameKey: "lighting_design", category: "Role", color: "#8b5cf6" },
  { id: "3", name: "Audio Engineering", nameKey: "audio_engineering", category: "Role", color: "#0891b2" },
  { id: "4", name: "Video Production", nameKey: "video_production", category: "Role", color: "#7c3aed" },
  { id: "5", name: "Production Management", nameKey: "production_management", category: "Role", color: "#2563eb" },
  { id: "6", name: "Corporate Events", nameKey: "corporate_events", category: "Type", color: "#059669" },
  { id: "7", name: "Music Festivals", nameKey: "music_festivals", category: "Type", color: "#dc2626" },
  { id: "8", name: "Conferences", nameKey: "conferences", category: "Type", color: "#ea580c" },
  { id: "9", name: "Theatre", nameKey: "theatre", category: "Type", color: "#7c3aed" },
  { id: "10", name: "Trade Shows", nameKey: "trade_shows", category: "Type", color: "#0891b2" },
  { id: "11", name: "ProTools Certified", nameKey: "protools_certified", category: "Certification", color: "#16a34a" },
  { id: "12", name: "ETCP Certified", nameKey: "etcp_certified", category: "Certification", color: "#10b981" },
  { id: "13", name: "Union Member", nameKey: "union_member", category: "Status", color: "#64748b" },
  { id: "14", name: "Travel Available", nameKey: "travel_available", category: "Availability", color: "#f59e0b" },
  { id: "15", name: "Remote Work", nameKey: "remote_work", category: "Availability", color: "#8b5cf6" },
]

export function TagsTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setSelectedTags(profile.tags || [])
    }
  }, [profile])

  const filteredTags = SYSTEM_TAGS.filter((tag: any) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t: any) => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        tags: selectedTags,
      })
      
      toast({
        title: t('profile.success.tagsUpdated'),
        description: t('profile.success.tagsSaved'),
      })
    } catch (error: Error | unknown) {
      toast({
        title: t('errors.error'),
        description: (error as any).message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  const groupedTags = SYSTEM_TAGS.reduce((acc: any, tag: any) => {
    if (!acc[tag.category]) {
      acc[tag.category] = []
    }
    acc[tag.category].push(tag)
    return acc
  }, {} as Record<string, typeof SYSTEM_TAGS>)

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <Info aria-hidden="true" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            {t('tags.systemTags')}
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            {t('tags.systemTagsDescription')}
          </p>
        </div>
      </div>

      {/* Selected Tags Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.tags.selected')}</CardTitle>
          <CardDescription>
            {selectedTags.length} {t('tags.tagSelected')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagName: any) => {
                const tag = SYSTEM_TAGS.find((t: any) => (t as any).name === tagName)
                return (
                  <Badge
                    key={tagName}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                    style={{ backgroundColor: `${tag?.color}20`, color: tag?.color, borderColor: tag?.color }}
                  >
                    {tagName}
                    <button
                      onClick={() => toggleTag(tagName)}
                      className="ml-2 hover:opacity-70"
                      aria-label={`Remove ${tagName} tag`}
                    >
                      <X aria-hidden="true" className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('tags.noTags')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tag Browser */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tags.browse')}</CardTitle>
          <CardDescription>
            {t('tags.clickToToggle')}
          </CardDescription>
          <div className="relative mt-4">
            <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
            <Input
              placeholder={t('tags.searchTags')}
              value={searchQuery as any}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea aria-hidden="true" className="h-[300px] md:h-[500px] pr-4">
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              {Object.entries(groupedTags).map(([category, tags]) => {
                const tagArray = tags as any[]
                const filteredCategoryTags = tagArray.filter((tag: any) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tag.category.toLowerCase().includes(searchQuery.toLowerCase())
                )

                if (filteredCategoryTags.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filteredCategoryTags.map((tag: any) => {
                        const isSelected = selectedTags.includes(tag.name)
                        return (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                toggleTag(tag.name)
                              }
                            }}
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md"
                            aria-pressed={isSelected}
                            aria-label={`${isSelected ? 'Remove' : 'Add'} ${t(tag.nameKey)} tag`}
                          >
                            <Badge
                              variant={isSelected ? "default" : "outline"}
                              className="px-3 py-1.5 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                              style={
                                isSelected
                                  ? { backgroundColor: tag.color, borderColor: tag.color }
                                  : { borderColor: tag.color, color: tag.color }
                              }
                            >
                              {t(tag.nameKey)}
                              {isSelected && (
                                <span className="ml-2">✓</span>
                              )}
                            </Badge>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Tag Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.tags.statistics')}</CardTitle>
          <CardDescription>
            {t('tags.statisticsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tags.category')}</TableHead>
                <TableHead aria-hidden="true" className="text-right">{t('tags.selected')}</TableHead>
                <TableHead aria-hidden="true" className="text-right">{t('tags.available')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedTags).map(([category, tags]) => {
                const tagArray = tags as any[]
                const selectedCount = tagArray.filter((tag: any) =>
                  selectedTags.includes(tag.name)
                ).length
                return (
                  <TableRow key={category}>
                    <TableCell aria-hidden="true" className="font-medium">{category}</TableCell>
                    <TableCell aria-hidden="true" className="text-right">{selectedCount}</TableCell>
                    <TableCell aria-hidden="true" className="text-right">{tagArray.length}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
