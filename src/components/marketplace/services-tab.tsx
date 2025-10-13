"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Star, MapPin, Briefcase, Clock, MessageCircle, Search, Award } from "lucide-react"
import { generateMarketplaceMockData } from "@/lib/modules/marketplace-mock-data"
import { MarketplaceProductDetailDrawer, type MarketplaceProduct } from "./marketplace-product-detail-drawer"

export function ServicesTab() {
  const servicesData = generateMarketplaceMockData('services', 20)
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<MarketplaceProduct | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">Available</Badge>
      case "busy":
        return <Badge className="bg-red-600">Busy</Badge>
      case "limited-availability":
        return <Badge className="bg-yellow-600">Limited</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLevelBadge = (priority: string) => {
    switch (priority) {
      case "premium":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">Premium</Badge>
      case "standard":
        return <Badge variant="outline">Standard</Badge>
      case "basic":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600">Basic</Badge>
      default:
        return null
    }
  }

  const handleViewProfile = (service: any) => {
    setSelectedService(service as MarketplaceProduct)
    setDetailsDrawerOpen(true)
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="audio">Audio Engineering</SelectItem>
            <SelectItem value="lighting">Lighting Design</SelectItem>
            <SelectItem value="video">Video Production</SelectItem>
            <SelectItem value="stage">Stage Management</SelectItem>
            <SelectItem value="technical">Technical Direction</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-level">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Experience Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-level">All Levels</SelectItem>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
            <SelectItem value="master">Master</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="rating">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {servicesData.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {service.assignee_name?.split(' ').map((n: string) => n[0]).join('') || "SE"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{service.assignee_name}</CardTitle>
                      {getLevelBadge(service.priority)}
                    </div>
                    <CardDescription className="line-clamp-1">
                      {service.name}
                    </CardDescription>
                  </div>
                </div>
                {getAvailabilityBadge(service.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3" />
                    <span className="text-xs">Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{service.rating}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span className="text-xs">Experience</span>
                  </div>
                  <p className="font-semibold">{service.experience_years} years</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-xs">Reviews</span>
                  </div>
                  <p className="font-semibold">{service.comments_count}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {service.tags?.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-2xl font-bold">{service.price}</p>
                  <p className="text-xs text-muted-foreground">Rate per day</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(service)}>
                    View Profile
                  </Button>
                  <Button size="sm">
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Details Drawer */}
      <MarketplaceProductDetailDrawer
        product={selectedService}
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedService ? favorites.has(selectedService.id) : false}
      />
    </div>
  )
}
