"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useModuleData } from "@/hooks/use-module-data"
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
  ExternalLink, Calendar} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import type { TabComponentProps } from "@/types"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatNumber } from "@/lib/utils/locale-formatting"

export function CompaniesOrganizationsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('business.companies.organizations')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const { data: companies, loading, error } = useModuleData(workspaceId, 'companies', 'organizations')

  if (loading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-muted-foreground">
            {tCommon('loading', { resource: t('title') })}
          </p>
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
      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.totalCompanies')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.activeCount', { count: companies.filter((c: any) => (c as any).status === 'active').length })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.vendors')}</CardTitle>
            <Users aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {companies.filter((c: any) => (c as any).type === 'vendor').length}
            </div>
            <p className="text-xs text-muted-foreground">{t('stats.serviceProviders')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.clients')}</CardTitle>
            <Star aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {companies.filter((c: any) => (c as any).type === 'client').length}
            </div>
            <p className="text-xs text-muted-foreground">{t('stats.activeClients')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.partners')}</CardTitle>
            <DollarSign aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {companies.filter((c: any) => (c as any).type === 'partner').length}
            </div>
            <p className="text-xs text-muted-foreground">{t('stats.strategicPartners')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company: any) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-2 md:gap-3 lg:gap-4">
                <Avatar aria-hidden="true" className="h-12 w-12">
                  <AvatarImage 
                    src={company.logo} 
                    alt={tCommon('aria.avatar', { name: company.name })} 
                  />
                  <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle aria-hidden="true" className="text-lg line-clamp-1">{company.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge aria-hidden="true" className={getTypeColor(company.type)}>
                      {company.type}
                    </Badge>
                    <Badge aria-hidden="true" className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent aria-hidden="true" className="space-y-3">
              {/* Contact Information */}
              {company.location && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{company.location}</span>
                </div>
              )}

              {company.phone && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                  <Phone aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{company.phone}</span>
                </div>
              )}

              {company.email && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                  <Mail aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{company.email}</span>
                </div>
              )}

              {company.website && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                  <Globe aria-hidden="true" className="h-4 w-4 flex-shrink-0" />
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
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 pt-2 border-t">
                  <div 
                    className="flex items-center"
                    role="img"
                    aria-label={t('aria.rating', { rating: company.rating.toFixed(1), max: 5 })}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(company.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(company.rating, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-between pt-2 border-t text-sm">
                <div>
                  <div className="text-muted-foreground">{t('stats.contacts')}</div>
                  <div className="font-medium">{company.contacts_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('stats.projects')}</div>
                  <div className="font-medium">{company.projects_count || 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t('stats.orders')}</div>
                  <div className="font-medium">{company.orders_count || 0}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button aria-hidden="true" className="flex-1" 
                  variant="outline" 
                  size="sm"
                  aria-label={t('aria.viewDetails', { name: company.name })}
                >
                  {tCommon('buttons.details')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label={t('aria.visitWebsite', { name: company.name })}
                >
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent aria-hidden="true" className="p-0">
            <EmptyState
              variant="inline"
              icon={Building2}
              mainMessage={t('emptyState.title')}
              description={t('emptyState.description')}
              actionLabel={tCommon('buttons.create') + ' ' + t('title')}
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      )}

    </div>
  )
}
