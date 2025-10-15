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
  Download
} from "lucide-react"
import { useState } from "react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ResourcesLibraryTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: resources, loading } = useModuleData(workspaceId, 'resources', 'library')
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
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

  const filteredResources = resources.filter((resource: any) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resource Library</h2>
          <p className="text-muted-foreground">
            Educational resources, guides, courses, and industry knowledge
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter((r: any) => r.type === 'course').length}
            </div>
            <p className="text-xs text-muted-foreground">Educational programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guides</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter((r: any) => r.type === 'guide').length}
            </div>
            <p className="text-xs text-muted-foreground">How-to guides</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grants</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter((r: any) => r.type === 'grant').length}
            </div>
            <p className="text-xs text-muted-foreground">Funding opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource: any) => {
          const TypeIcon = getTypeIcon(resource.type)

          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TypeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{resource.name}</CardTitle>
                    {resource.category && (
                      <CardDescription className="mt-1">{resource.category}</CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                  {resource.is_featured && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Description */}
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {resource.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{resource.duration}</span>
                    </div>
                  )}
                  {resource.author && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="truncate">{resource.author}</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                {resource.rating && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="flex items-center">
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
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" variant="outline" size="sm">
                    View Details
                  </Button>
                  {resource.downloadable && (
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No resources found' : 'No Resources Yet'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Start building your resource library'
              }
            </p>
            {!searchQuery && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
