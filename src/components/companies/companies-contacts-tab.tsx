"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User,
  Mail,
  Phone,
  Briefcase,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Clock,
  MessageSquare,
  Building2,
  Calendar
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatDate as formatDateLocale } from "@/lib/utils/locale-formatting"

interface Contact {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  mobile?: string
  department?: string
  role?: string
  avatar?: string
  is_primary?: boolean
  last_contact?: string
  response_time?: string
  preferred_method?: string
  notes?: string
}

export function CompaniesContactsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('business.companies.contacts')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const { data: contacts, loading, error } = useModuleData(workspaceId, 'companies', 'contacts')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

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
            {tCommon('loading', { resource: tCommon('business.companies.tabs.contacts') })}
          </p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'primary': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'billing': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'technical': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'executive': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const filteredContacts = contacts.filter((contact: any) => {
    const c = contact as any
    return c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatDate = (date: string) => {
    return formatDateLocale(date, locale)
  }

  const primaryContacts = contacts.filter((c: any) => (c as Contact).is_primary).length
  const totalCompanies = new Set(contacts.map((c: any) => (c as Contact).company)).size

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
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.totalContacts')}</CardTitle>
            <User aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.acrossCompanies', { count: totalCompanies })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.primaryContacts')}</CardTitle>
            <Star aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{primaryContacts as any}</div>
            <p className="text-xs text-muted-foreground">{t('stats.keyRelationships')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.avgResponseTime')}</CardTitle>
            <Clock aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">4.2 hrs</div>
            <p className="text-xs text-muted-foreground">{t('stats.last30Days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.activeThreads')}</CardTitle>
            <MessageSquare aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {contacts.filter((c: any) => (c as any).active_threads > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('stats.ongoingConversations')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery as any}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label={tCommon('aria.searchInput', { type: 'contacts' })}
        />
      </div>

      <div className="grid gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Contacts List */}
        <div className="md:col-span-2">
          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2">
            {filteredContacts.map((contact: any) => {
              const c = contact as Contact
              return (
              <Card 
                key={c.id} 
                className={`cursor-pointer transition-shadow hover:shadow-lg ${
                  selectedContact?.id === c.id ? 'border-primary border-2' : ''
                }`}
                onClick={() => setSelectedContact(c)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar aria-hidden="true" className="h-12 w-12">
                      <AvatarImage 
                        src={c.avatar} 
                        alt={tCommon('aria.avatar', { name: c.name })} 
                      />
                      <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle aria-hidden="true" className="text-base line-clamp-1">{c.name}</CardTitle>
                      <CardDescription aria-hidden="true" className="line-clamp-1">{c.title}</CardDescription>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" aria-hidden="true" />
                        <span className="truncate">{c.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 flex-wrap">
                    {c.role && (
                      <Badge variant="secondary" className={getRoleColor(c.role)}>
                        {c.role}
                      </Badge>
                    )}
                    {c.is_primary && (
                      <Badge variant="outline">
                        <Star aria-hidden="true" className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {t('primaryBadge')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent aria-hidden="true" className="space-y-2">
                  {c.email && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm">
                      <Mail aria-hidden="true" className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm">
                      <Phone aria-hidden="true" className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                  {c.last_contact && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                      <Calendar aria-hidden="true" className="h-3 w-3 flex-shrink-0" />
                      <span>{t('lastContact', { date: formatDate(c.last_contact) })}</span>
                    </div>
                  )}
                  {(c as any).active_threads > 0 && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare aria-hidden="true" className="h-3 w-3 flex-shrink-0" />
                      <span>{t('activeThreadsCount', { count: (c as any).active_threads })}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )})}
          </div>

          {filteredContacts.length === 0 && (
            <Card>
              <CardContent aria-hidden="true" className="p-0">
                <EmptyState
                  variant="inline"
                  icon={User}
                  mainMessage={searchQuery ? tCommon('emptyState.title', { resource: 'contacts' }) : t('emptyState.noContacts')}
                  description={searchQuery ? t('emptyState.adjustSearch') : t('emptyState.addFirst')}
                  actionLabel={!searchQuery ? tCommon('emptyState.button', { resource: 'Contact' }) : undefined}
                  onAction={!searchQuery ? () => {} : undefined}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Detail Panel */}
        {selectedContact ? (
          <div className="md:col-span-1">
            <Card aria-hidden="true" className="sticky top-6">
              <CardHeader>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <Avatar aria-hidden="true" className="h-16 w-16">
                    <AvatarImage 
                      src={selectedContact.avatar} 
                      alt={tCommon('aria.avatar', { name: selectedContact.name })} 
                    />
                    <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedContact.name}</CardTitle>
                    <CardDescription>{selectedContact.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent aria-hidden="true" className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">{t('contactInformation')}</h4>
                  <div className="space-y-2 text-sm">
                    {selectedContact.email && (
                      <div>
                        <span className="text-muted-foreground">{t('email')}:</span>{' '}
                        <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                          {selectedContact.email}
                        </a>
                      </div>
                    )}
                    {selectedContact.phone && (
                      <div>
                        <span className="text-muted-foreground">{t('phone')}:</span>{' '}
                        <a href={`tel:${selectedContact.phone}`} className="text-primary hover:underline">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    {selectedContact.mobile && (
                      <div>
                        <span className="text-muted-foreground">{t('mobile')}:</span> {selectedContact.mobile}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">{t('company')}</h4>
                  <div className="text-sm">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.company}</span>
                    </div>
                    {selectedContact.department && (
                      <div className="text-muted-foreground mt-1">
                        {selectedContact.department}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">{t('communication')}</h4>
                  <div className="space-y-1 text-sm">
                    {selectedContact.last_contact && (
                      <div>
                        <span className="text-muted-foreground">{t('lastContactLabel')}:</span>{' '}
                        {formatDate(selectedContact.last_contact)}
                      </div>
                    )}
                    {selectedContact.response_time && (
                      <div>
                        <span className="text-muted-foreground">{t('avgResponse')}:</span>{' '}
                        {selectedContact.response_time}
                      </div>
                    )}
                    {selectedContact.preferred_method && (
                      <div>
                        <span className="text-muted-foreground">{t('preferred')}:</span>{' '}
                        {selectedContact.preferred_method}
                      </div>
                    )}
                  </div>
                </div>

                {selectedContact.notes && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">{t('notes')}</h4>
                    <p className="text-sm text-muted-foreground">{selectedContact.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap flex-col gap-2 pt-4 border-t">
                  <Button aria-hidden="true" className="w-full max-w-full"
                    aria-label={t('aria.sendEmail', { name: selectedContact.name })}
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 mr-2" />
                    {t('sendEmail')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full max-w-full"
                    aria-label={t('aria.scheduleMeeting', { name: selectedContact.name })}
                  >
                    <Calendar aria-hidden="true" className="h-4 w-4 mr-2" />
                    {t('scheduleMeeting')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full max-w-full"
                    aria-label={t('aria.viewHistory', { name: selectedContact.name })}
                  >
                    {t('viewHistory')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="md:col-span-1">
            <Card>
              <CardContent aria-hidden="true" className="p-0">
                <EmptyState
                  variant="compact"
                  icon={User}
                  mainMessage={t('selectContact')}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </div>
  )
}
