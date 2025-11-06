"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Star, ShieldCheck, Award, TrendingUp, Clock, Search, MessageCircle, Plus } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useMarketplaceData } from "@/hooks/use-marketplace-data"

interface Vendor {
  id: string
  name: string
  status?: string
  rating?: number
  products_count?: number
  response_time?: string
  [key: string]: any
}

interface VendorsTabProps {
  data?: Vendor[]
  loading?: boolean
}

export function VendorsTab({ data = [], loading: loadingProp = false }: VendorsTabProps) {
  const { vendors, loading: liveLoading } = useMarketplaceData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.vendors')
  const tCommon = useTranslations('common')
  const vendorsData: Vendor[] = data
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge aria-hidden="true" className="bg-green-600"><ShieldCheck aria-hidden="true" className="h-3 w-3 mr-1" />{t('verified')}</Badge>
      case "certified":
        return <Badge aria-hidden="true" className="bg-blue-600"><Award aria-hidden="true" className="h-3 w-3 mr-1" />{t('certified')}</Badge>
      case "featured":
        return <Badge aria-hidden="true" className="bg-purple-600"><Star aria-hidden="true" className="h-3 w-3 mr-1" />{t('featured')}</Badge>
      case "active":
        return <Badge variant="outline">{t('active')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Filters */}
      <div className="flex flex-wrap flex-col sm:flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
        <div className="flex-1 relative">
          <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
          <Input placeholder={t('searchVendors')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[200px]">
            <SelectValue placeholder={t('vendorType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="equipment">Equipment Rental</SelectItem>
            <SelectItem value="production">Production Services</SelectItem>
            <SelectItem value="av">Audio/Visual</SelectItem>
            <SelectItem value="staging">{t('staging')}</SelectItem>
            <SelectItem value="lighting">{t('lighting')}</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="verified">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
            <SelectValue placeholder={t('filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="certified">{t('certified')}</SelectItem>
            <SelectItem value="featured">{t('featured')}</SelectItem>
            <SelectItem value="all-vendors">All Vendors</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="rating">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="sales">Most Sales</SelectItem>
            <SelectItem value="response">Fastest Response</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
        {vendorsData.map((vendor: any) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-2 md:gap-3 lg:gap-4">
                <Avatar aria-hidden="true" className="h-16 w-16">
                  <AvatarFallback aria-hidden="true" className="bg-primary/10 text-primary text-base md:text-lg lg:text-xl">
                    {vendor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle aria-hidden="true" className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription aria-hidden="true" className="mt-1">
                        {vendor.assignee_name}
                      </CardDescription>
                    </div>
                    {getStatusBadge(vendor.status || 'active')}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent aria-hidden="true" className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {vendor.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-muted-foreground">
                    <Star aria-hidden="true" className="h-3 w-3" />
                    <span className="text-xs">{t('rating')}</span>
                  </div>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    <Star aria-hidden="true" className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{vendor.rating}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-muted-foreground">
                    <TrendingUp aria-hidden="true" className="h-3 w-3" />
                    <span className="text-xs">{t('sales')}</span>
                  </div>
                  <p className="font-semibold">{vendor.total_sales}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-muted-foreground">
                    <MessageCircle aria-hidden="true" className="h-3 w-3" />
                    <span className="text-xs">{t('reviews')}</span>
                  </div>
                  <p className="font-semibold">{vendor.comments_count}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-muted-foreground">
                    <Clock aria-hidden="true" className="h-3 w-3" />
                    <span className="text-xs">{t('response')}</span>
                  </div>
                  <p className="font-semibold text-xs">{vendor.response_time}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {vendor.tags?.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button aria-hidden="true" className="flex-1">
                  View Store
                </Button>
                <Button variant="outline">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
