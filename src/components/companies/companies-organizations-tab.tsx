"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  DollarSign,
  Plus,
  Filter,
  Search,
  ExternalLink
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"
import { useState } from "react"
import type { TabComponentProps } from "@/types"

export function CompaniesOrganizationsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: companies, loading } = useModuleData(workspaceId, 'companies', 'organizations')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'vendor': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'client': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'partner': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'subcontractor': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'supplier': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage all companies, vendors, clients, and partners
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Organization
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">
              {companies.filter((c: any) => c.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter((c: any) => c.type === 'vendor').length}
            </div>
            <p className="text-xs text-muted-foreground">Service providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter((c: any) => c.type === 'client').length}
            </div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter((c: any) => c.type === 'partner').length}
            </div>
            <p className="text-xs text-muted-foreground">Strategic partners</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company: any) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={company.logo} alt={company.name} />
                  <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-1">{company.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getTypeColor(company.type)}>
                      {company.type}
                    </Badge>
                    <Badge className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Contact Information */}
              {company.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{company.location}</span>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{company.phone}</span>
                </div>
              )}

              {company.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{company.email}</span>
                </div>
              )}

              {company.website && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="truncate hover:text-primary"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {/* Rating */}
              {company.rating && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(company.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {company.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-between pt-2 border-t text-sm">
                <div>
                  <div className="text-muted-foreground">Contacts</div>
                  <div className="font-medium">{company.contacts_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Projects</div>
                  <div className="font-medium">{company.projects_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Orders</div>
                  <div className="font-medium">{company.orders_count || 0}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={Building2}
              mainMessage="NOTHING TO SEE HERE... (YET)"
              description="Start by adding your first company or organization"
              actionLabel="New Organization"
              onAction={() => setCreateDialogOpen(true)}
            />
          </CardContent>
        </Card>
      )}

      {/* Create Organization Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={moduleId}
        tabSlug={tabSlug}
        workspaceId={workspaceId}
        onSuccess={(item) => {
          // Refresh data or update local state
          window.location.reload()
        }}
      />
    </div>
  )
}
