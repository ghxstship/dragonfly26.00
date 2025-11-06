"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CardGridOrganism } from '@/components/organisms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Award, DollarSign, Calendar, MapPin } from 'lucide-react'
import { useOpportunitiesData } from '@/hooks/use-opportunities-data'

/**
 * Opportunities Sponsorship Tab
 * 
 * Brand sponsorship opportunities (inspired by onbrand.com)
 * Part of new Opportunities module
 */

export interface OpportunitiesSponsorshipTabProps {
  workspaceId?: string
  userId?: string
}

export function OpportunitiesSponsorshipTab({ workspaceId = '', userId = '' }: OpportunitiesSponsorshipTabProps): JSX.Element {
  const t = useTranslations('opportunities.sponsorship')
  const { sponsorships, loading } = useOpportunitiesData(workspaceId)
  
  const renderCard = (sponsor: any) => (
    <Card aria-hidden="true" className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle aria-hidden="true" className="text-lg">{sponsor.brand || sponsor.name}</CardTitle>
          <Badge variant={sponsor.status === 'active' ? 'default' : 'secondary'}>
            {sponsor.status}
          </Badge>
        </div>
        <CardDescription>{sponsor.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {sponsor.value && (
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
              <DollarSign aria-hidden="true" className="h-4 w-4" />
              <span>{sponsor.value}</span>
            </div>
          )}
          {sponsor.deadline && (
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
              <Calendar aria-hidden="true" className="h-4 w-4" />
              <span>{sponsor.deadline}</span>
            </div>
          )}
          {sponsor.location && (
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              <span>{sponsor.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
  
  return (
    <div role="main" aria-label="Tab content" className="space-y-4">
      <h2 className="sr-only">{t("title")}</h2>
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Award aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Button aria-label={t('createSponsorship')}>
          <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
          {t('createSponsorship')}
        </Button>
      </div>
      
      <CardGridOrganism
        data={sponsorships}
        loading={loading}
        columns={3}
        renderCard={renderCard}
      />
    </div>
  )
}
