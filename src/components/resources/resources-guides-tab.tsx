"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Book,
  Clock,
  Users,
  Star,
  Download,
  Search,
  Plus,
  Filter,
  BookMarked
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ResourcesGuidesTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.guides')
  const tCommon = useTranslations('common')
  const { data: guides, loading } = useModuleData(workspaceId, 'resources', 'guides')
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
          {t('description')}
        </p>
        </div>
      </div>
    )
  }

  const filteredGuides = guides.filter((guide: any) =>
    guide.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guides</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guides.length}</div>
            <p className="text-xs text-muted-foreground">{t('available')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('beginner')}</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {guides.filter((g: any) => g.difficulty === 'beginner').length}
            </div>
            <p className="text-xs text-muted-foreground">Easy to follow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('intermediate')}</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {guides.filter((g: any) => g.difficulty === 'intermediate').length}
            </div>
            <p className="text-xs text-muted-foreground">Moderate complexity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('advanced')}</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {guides.filter((g: any) => g.difficulty === 'advanced').length}
            </div>
            <p className="text-xs text-muted-foreground">Expert level</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder={t('searchGuides')}
          value={searchQuery as any}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Guides Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide: any) => (
          <Card key={guide.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Book className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{guide.name}</CardTitle>
                  {guide.category && (
                    <CardDescription className="mt-1">{guide.category}</CardDescription>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {guide.difficulty && (
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                )}
                {guide.is_featured && (
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {guide.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {guide.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {guide.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>{guide.duration}</span>
                  </div>
                )}
                {guide.author && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" aria-hidden="true" />
                    <span className="truncate">{guide.author}</span>
                  </div>
                )}
              </div>

              {guide.rating && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(guide.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {guide.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {guide.tags && guide.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guide.tags.slice(0, 3).map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" size="sm">
                  View Guide
                </Button>
                {guide.downloadable && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={Book}
              mainMessage={searchQuery ? "No guides found" : t('nothingToSeeYet')}
              description={searchQuery ? t('tryAdjustingSearch') : t('addGuides')}
              actionLabel={!searchQuery ? t('addGuide') : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
