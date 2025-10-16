"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Star, ShieldCheck, Award, TrendingUp, Clock, Search, MessageCircle, Plus } from "lucide-react"
import { useTranslations } from 'next-intl'

interface VendorsTabProps {
  data?: any[]
  loading?: boolean
}

export function VendorsTab({ data = [], loading = false }: VendorsTabProps) {
  const t = useTranslations('marketplace.vendors')
  const tCommon = useTranslations('common')
  const vendorsData = data
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600"><ShieldCheck className="h-3 w-3 mr-1" />Verified</Badge>
      case "certified":
        return <Badge className="bg-blue-600"><Award className="h-3 w-3 mr-1" aria-hidden="true" />Certified</Badge>
      case "featured":
        return <Badge className="bg-purple-600"><Star className="h-3 w-3 mr-1" aria-hidden="true" />Featured</Badge>
      case "active":
        return <Badge variant="outline">{t('active')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('description')}
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />{tCommon('create')}</Button>
      </div>


      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input placeholder={t('searchVendors')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="certified">Certified</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="all-vendors">All Vendors</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="rating">
          <SelectTrigger className="w-[180px]">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendorsData.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {vendor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {vendor.assignee_name}
                      </CardDescription>
                    </div>
                    {getStatusBadge(vendor.status)}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {vendor.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3" aria-hidden="true" />
                    <span className="text-xs">Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                    <span className="font-semibold">{vendor.rating}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    <span className="text-xs">Sales</span>
                  </div>
                  <p className="font-semibold">{vendor.total_sales}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="h-3 w-3" aria-hidden="true" />
                    <span className="text-xs">Reviews</span>
                  </div>
                  <p className="font-semibold">{vendor.comments_count}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span className="text-xs">Response</span>
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
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
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
