"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ListChecks, ShoppingCart, Heart, BarChart3, Users, Archive, Plus, Search, MoreHorizontal } from "lucide-react"
import { useCollections } from "@/hooks/use-marketplace-collections"
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ListItem {
  id: string
  name: string
  total_value?: string
  status?: string
  items_count?: number
  [key: string]: any
}

interface ListsTabProps {
  data?: ListItem[]
  loading?: boolean
}

export function ListsTab({ data = [], loading: loadingProp = false }: ListsTabProps) {
  const { collections, loading: liveLoading } = useCollections()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.lists')
  const tCommon = useTranslations('common')
  const listsData: ListItem[] = data
  
  const getListIcon = (name: string) => {
    if (name.includes("Shopping Cart")) return <ShoppingCart className="h-5 w-5 text-blue-500" aria-hidden="true" />
    if (name.includes("Wishlist")) return <Heart className="h-5 w-5 text-pink-500" aria-hidden="true" />
    if (name.includes("Project List")) return <ListChecks className="h-5 w-5 text-purple-500" aria-hidden="true" />
    if (name.includes("Comparison")) return <BarChart3 className="h-5 w-5 text-green-500" aria-hidden="true" />
    return <ListChecks className="h-5 w-5 text-gray-500" aria-hidden="true" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">{t('active')}</Badge>
      case "saved":
        return <Badge className="bg-blue-600">{t('saved')}</Badge>
      case "shared":
        return <Badge className="bg-purple-600"><Users className="h-3 w-3 mr-1" aria-hidden="true" />{t('shared')}</Badge>
      case "archived":
        return <Badge variant="outline"><Archive className="h-3 w-3 mr-1" aria-hidden="true" />{t('archived')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('totalLists')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{listsData.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('activeLists')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {listsData.filter(l => (l as any).status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('sharedLists')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {listsData.filter(l => (l as any).status === 'shared').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>{t('totalValue')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              ${Math.floor(listsData.reduce((sum: any, l: any) => sum + parseFloat(l.total_value?.replace(/[$,]/g, '') || '0'), 0) / 1000)}k
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
        <Input placeholder={t('searchLists')} className="pl-9" />
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
        {listsData.map((list: any) => (
          <Card key={list.id} className="hover:shadow-lg transition-shadow group">
            <CardHeader>
              <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-start gap-3">
                  {getListIcon(list.name)}
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-1">{list.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {list.description}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t('morehorizontal')}>
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>{t('edit')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('share')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('duplicate')}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">{t('delete')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{t('items')}</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{list.items_count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalValue')}</p>
                  <p className="text-lg font-bold">{list.total_value}</p>
                </div>
              </div>

              {/* Status and Date */}
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                {getStatusBadge(list.status || 'active')}
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(list.updated_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button className="flex-1" size="sm">
                  View Items
                </Button>
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
