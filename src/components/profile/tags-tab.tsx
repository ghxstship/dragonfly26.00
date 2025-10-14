"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Plus, Info, Save, Loader2 } from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
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
  { id: "1", name: "Stage Management", category: "Role", color: "#3b82f6" },
  { id: "2", name: "Lighting Design", category: "Role", color: "#8b5cf6" },
  { id: "3", name: "Audio Engineering", category: "Role", color: "#0891b2" },
  { id: "4", name: "Video Production", category: "Role", color: "#7c3aed" },
  { id: "5", name: "Production Management", category: "Role", color: "#2563eb" },
  { id: "6", name: "Corporate Events", category: "Type", color: "#059669" },
  { id: "7", name: "Music Festivals", category: "Type", color: "#dc2626" },
  { id: "8", name: "Conferences", category: "Type", color: "#ea580c" },
  { id: "9", name: "Theatre", category: "Type", color: "#7c3aed" },
  { id: "10", name: "Trade Shows", category: "Type", color: "#0891b2" },
  { id: "11", name: "ProTools Certified", category: "Certification", color: "#16a34a" },
  { id: "12", name: "ETCP Certified", category: "Certification", color: "#10b981" },
  { id: "13", name: "Union Member", category: "Status", color: "#64748b" },
  { id: "14", name: "Travel Available", category: "Availability", color: "#f59e0b" },
  { id: "15", name: "Remote Work", category: "Availability", color: "#8b5cf6" },
]

export function TagsTab() {
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

  const filteredTags = SYSTEM_TAGS.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName))
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
        title: "Tags updated",
        description: "Your profile tags have been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const groupedTags = SYSTEM_TAGS.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = []
    }
    acc[tag.category].push(tag)
    return acc
  }, {} as Record<string, typeof SYSTEM_TAGS>)

  return (
    <div className="space-y-6 p-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            System Tags for Opportunity Matching
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Select tags that represent your skills, experience, and preferences. These tags help match you with relevant opportunities across the platform.
          </p>
        </div>
      </div>

      {/* Selected Tags Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Selected Tags</CardTitle>
          <CardDescription>
            {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tagName) => {
                const tag = SYSTEM_TAGS.find((t) => t.name === tagName)
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
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No tags selected. Browse and select tags below to get matched with opportunities.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tag Browser */}
      <Card>
        <CardHeader>
          <CardTitle>Browse System Tags</CardTitle>
          <CardDescription>
            Click on tags to add or remove them from your profile
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedTags).map(([category, tags]) => {
                const filteredCategoryTags = tags.filter((tag) =>
                  tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tag.category.toLowerCase().includes(searchQuery.toLowerCase())
                )

                if (filteredCategoryTags.length === 0) return null

                return (
                  <div key={category}>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filteredCategoryTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.name)
                        return (
                          <Badge
                            key={tag.id}
                            variant={isSelected ? "default" : "outline"}
                            className="px-3 py-1.5 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                            style={
                              isSelected
                                ? { backgroundColor: tag.color, borderColor: tag.color }
                                : { borderColor: tag.color, color: tag.color }
                            }
                            onClick={() => toggleTag(tag.name)}
                          >
                            {tag.name}
                            {isSelected && (
                              <span className="ml-2">✓</span>
                            )}
                          </Badge>
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
          <CardTitle>Tag Statistics</CardTitle>
          <CardDescription>
            Overview of your selected tags by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Selected</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedTags).map(([category, tags]) => {
                const selectedCount = tags.filter((tag) =>
                  selectedTags.includes(tag.name)
                ).length
                return (
                  <TableRow key={category}>
                    <TableCell className="font-medium">{category}</TableCell>
                    <TableCell className="text-right">{selectedCount}</TableCell>
                    <TableCell className="text-right">{tags.length}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Tags
        </Button>
      </div>
    </div>
  )
}
