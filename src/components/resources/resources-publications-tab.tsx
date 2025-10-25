"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText,
  Calendar,
  Users,
  Download,
  ExternalLink,
  Search,
  Plus,
  Filter,
  BookMarked,
  Star
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ResourcesPublicationsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.publications')
  const tCommon = useTranslations('common')
  const { data: publications, loading } = useModuleData(workspaceId, 'resources', 'publications')
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
          {t('description')}
        </p>
        </div>
      </div>
    )
  }

  const filteredPublications = publications.filter((pub: any) =>
    pub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pub.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pub.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pub.author?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'whitepaper': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'research': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'article': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'case_study': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'report': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{publications.length}</div>
            <p className="text-xs text-muted-foreground">{t('available')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Papers</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-purple-600">
              {publications.filter((p: any) => (p as any).type === 'research').length}
            </div>
            <p className="text-xs text-muted-foreground">Academic research</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('whitepapers')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">
              {publications.filter((p: any) => (p as any).type === 'whitepaper').length}
            </div>
            <p className="text-xs text-muted-foreground">Industry reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-orange-600">
              {publications.filter((p: any) => (p as any).type === 'case_study').length}
            </div>
            <p className="text-xs text-muted-foreground">Real-world examples</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
        <Input
          placeholder={t('searchPublications')}
          value={searchQuery as any}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {filteredPublications.map((publication: any) => (
          <Card key={publication.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-wrap flex-col md:flex-row items-start justify-between gap-2 md:gap-3 lg:gap-4">
                <div className="flex flex-wrap flex-col md:flex-row items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                    <FileText className="h-5 w-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{publication.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {publication.author && (
                        <CardDescription className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          <Users className="h-3 w-3" aria-hidden="true" />
                          {publication.author}
                        </CardDescription>
                      )}
                      {publication.publisher && (
                        <CardDescription>• {publication.publisher}</CardDescription>
                      )}
                      {publication.published_date && (
                        <CardDescription className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          • <Calendar className="h-3 w-3" aria-hidden="true" />
                          {new Date(publication.published_date).toLocaleDateString()}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col gap-2">
                  {publication.type && (
                    <Badge className={getTypeColor(publication.type)}>
                      {publication.type.replace('_', ' ')}
                    </Badge>
                  )}
                  {publication.is_featured && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {publication.description && (
                <p className="text-sm text-muted-foreground">
                  {publication.description}
                </p>
              )}

              {publication.abstract && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Abstract:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {publication.abstract}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {publication.pages && (
                  <span>{publication.pages} pages</span>
                )}
                {publication.citations && (
                  <span>• {publication.citations} citations</span>
                )}
                {publication.doi && (
                  <span>• DOI: {publication.doi}</span>
                )}
              </div>

              {publication.tags && publication.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {publication.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button className="flex-1" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                  View Publication
                </Button>
                {publication.downloadable && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={FileText}
              mainMessage={searchQuery ? t('searchNoResults') : t('nothingToSeeYet')}
              description={searchQuery ? t('tryAdjustingSearch') : t('addPublications')}
              actionLabel={!searchQuery ? t('addPublication') : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
