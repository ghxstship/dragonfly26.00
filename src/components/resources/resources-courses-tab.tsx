"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  GraduationCap,
  Clock,
  Users,
  Star,
  Video,
  Search,
  Plus,
  Filter,
  BookOpen,
  Award
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ResourcesCoursesTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.courses')
  const tCommon = useTranslations('common')
  const { data: courses, loading } = useModuleData(workspaceId, 'resources', 'courses')
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

  const filteredCourses = courses.filter((course: any) =>
    course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'advanced': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'expert': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    }
    return colors[level] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">{t('available')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('enrolled')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">
              {courses.filter((c: any) => c.is_enrolled).length}
            </div>
            <p className="text-xs text-muted-foreground">Your courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">
              {courses.filter((c: any) => c.is_completed).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('finished')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {courses.reduce((total: number, c: any) => total + (c.duration_hours || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Learning content</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
        <Input
          placeholder={t('searchCourses')}
          value={searchQuery as any}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course: any) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <GraduationCap className="h-5 w-5 text-purple-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{course.name}</CardTitle>
                  {course.category && (
                    <CardDescription className="mt-1">{course.category}</CardDescription>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {course.level && (
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                )}
                {course.is_enrolled && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Enrolled
                  </Badge>
                )}
                {course.is_featured && (
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              )}

              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm text-muted-foreground">
                {course.duration_hours && (
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>{course.duration_hours}h</span>
                  </div>
                )}
                {course.module_count && (
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    <span>{course.module_count} modules</span>
                  </div>
                )}
                {course.video_count && (
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    <Video className="h-3 w-3"  aria-hidden="true" />
                    <span>{course.video_count} videos</span>
                  </div>
                )}
              </div>

              {course.instructor && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm">
                  <Users className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate text-muted-foreground">{course.instructor}</span>
                </div>
              )}

              {course.rating && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 pt-2 border-t">
                  <div className="flex flex-wrap items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(course.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {course.rating.toFixed(1)}
                  </span>
                  {course.students_count && (
                    <span className="text-xs text-muted-foreground">
                      ({course.students_count} students)
                    </span>
                  )}
                </div>
              )}

              {course.progress !== undefined && course.is_enrolled && (
                <div className="space-y-1">
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t('progress')}</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden md:block">
                    <div 
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <Button className="flex-1" size="sm">
                  {course.is_enrolled ? 'Continue Learning' : 'Enroll Now'}
                </Button>
                <Button variant="outline" size="sm">{tCommon('details')}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={GraduationCap}
              mainMessage={searchQuery ? "No courses found" : t('nothingToSeeYet')}
              description={searchQuery ? t('tryAdjustingSearch') : t('addCourses')}
              actionLabel={!searchQuery ? t('addCourse') : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
