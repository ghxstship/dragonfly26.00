"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  BookOpen,
  Book,
  GraduationCap,
  CircleDollarSign,
  FileText,
  Plus,
  Filter,
  Search,
  Star,
  Clock,
  Users,
  Download,
  Share2, Calendar} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import type { TabComponentProps } from "@/types"

export function ResourcesLibraryTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.library')

  const tCommon = useTranslations('common')
  const { data: resources, loading, error } = useModuleData(workspaceId, 'resources', 'library')
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return Book
      case 'course': return GraduationCap
      case 'grant': return CircleDollarSign
      case 'publication': return FileText
      default: return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'guide': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'course': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'grant': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'publication': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'glossary': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const filteredResources = resources.filter((resource: Record<string, any>) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Actions */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <p className="text-muted-foreground">
          {t('description')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Filter aria-hidden="true" className="h-4 w-4 mr-2" />{tCommon('filter')}</Button>
          <Button size="sm">
            <Plus aria-hidden="true" className="h-4 w-4 mr-2" />{t('addResource')}</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">{t('available')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('courses')}</CardTitle>
            <GraduationCap aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {resources.filter((r: Record<string, any>) => (r as any).type === 'course').length}
            </div>
            <p className="text-xs text-muted-foreground">Educational programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('guides')}</CardTitle>
            <Book aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {resources.filter((r: Record<string, any>) => (r as any).type === 'guide').length}
            </div>
            <p className="text-xs text-muted-foreground">How-to guides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('grants')}</CardTitle>
            <CircleDollarSign aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {resources.filter((r: Record<string, any>) => (r as any).type === 'grant').length}
            </div>
            <p className="text-xs text-muted-foreground">Funding opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
          <Input
            placeholder={t('searchResources')}
            value={searchQuery as any}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource: any) => {
          const TypeIcon = getTypeIcon(resource.type)

          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TypeIcon aria-hidden="true" className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle aria-hidden="true" className="text-lg line-clamp-2">{resource.name}</CardTitle>
                    {resource.category && (
                      <CardDescription aria-hidden="true" className="mt-1">{resource.category}</CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge aria-hidden="true" className={getTypeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                  {resource.is_featured && (
                    <Badge variant="secondary">
                      <Star aria-hidden="true" className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent aria-hidden="true" className="space-y-3">
                {/* Description */}
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm text-muted-foreground">
                  {resource.duration && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <Clock aria-hidden="true" className="h-3 w-3" />
                      <span>{resource.duration}</span>
                    </div>
                  )}
                  {resource.author && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <Users aria-hidden="true" className="h-3 w-3" />
                      <span className="truncate">{resource.author}</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {resource.rating && (
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 pt-2 border-t">
                    <div className="flex flex-wrap items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(resource.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {resource.rating.toFixed(1)}
                    </span>
                    {resource.reviews_count && (
                      <span className="text-xs text-muted-foreground">
                        ({resource.reviews_count})
                      </span>
                    )}
                  </div>
                )}

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button aria-hidden="true" className="flex-1" variant="outline" size="sm">
                    View Details
                  </Button>
                  {resource.downloadable && (
                    <Button variant="ghost" size="icon" aria-label={t('download')}>
                      <Download aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent aria-hidden="true" className="p-0">
            <EmptyState
              variant="inline"
              icon={BookOpen}
              mainMessage={searchQuery ? t('noResourcesFound') : t('nothingToSeeYet')}
              description={searchQuery ? t('tryAdjustingSearch') : t('addResources')}
              actionLabel={!searchQuery ? t('addResource') : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
