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

export function CompaniesContactsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('business.companies.contacts')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const { data: contacts, loading } = useModuleData(workspaceId, 'companies', 'contacts')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<any>(null)

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

  const filteredContacts = contacts.filter((contact: any) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string) => {
    return formatDateLocale(date, locale)
  }

  const primaryContacts = contacts.filter((c: any) => c.is_primary).length
  const totalCompanies = new Set(contacts.map((c: any) => c.company)).size

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.totalContacts')}</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('stats.acrossCompanies', { count: totalCompanies })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.primaryContacts')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{primaryContacts}</div>
            <p className="text-xs text-muted-foreground">{t('stats.keyRelationships')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.avgResponseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 hrs</div>
            <p className="text-xs text-muted-foreground">{t('stats.last30Days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.activeThreads')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter((c: any) => c.active_threads > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('stats.ongoingConversations')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label={tCommon('aria.searchInput', { type: 'contacts' })}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Contacts List */}
        <div className="md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredContacts.map((contact: any) => (
              <Card 
                key={contact.id} 
                className={`cursor-pointer transition-shadow hover:shadow-lg ${
                  selectedContact?.id === contact.id ? 'border-primary border-2' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={contact.avatar} 
                        alt={tCommon('aria.avatar', { name: contact.name })} 
                      />
                      <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">{contact.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{contact.title}</CardDescription>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" aria-hidden="true" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {contact.role && (
                      <Badge variant="secondary" className={getRoleColor(contact.role)}>
                        {contact.role}
                      </Badge>
                    )}
                    {contact.is_primary && (
                      <Badge variant="outline">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        {t('primaryBadge')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.last_contact && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>{t('lastContact', { date: formatDate(contact.last_contact) })}</span>
                    </div>
                  )}
                  {contact.active_threads > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-3 w-3 flex-shrink-0" />
                      <span>{t('activeThreadsCount', { count: contact.active_threads })}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <Card>
              <CardContent className="p-0">
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
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
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
              <CardContent className="space-y-4">
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
                    <div className="flex items-center gap-2">
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

                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button 
                    className="w-full"
                    aria-label={t('aria.sendEmail', { name: selectedContact.name })}
                  >
                    <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('sendEmail')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    aria-label={t('aria.scheduleMeeting', { name: selectedContact.name })}
                  >
                    <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('scheduleMeeting')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
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
              <CardContent className="p-0">
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
