"use client"

import { useAdminData } from "@/hooks/use-admin-data"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Globe, MapPin, Phone, Mail, Users } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface OrganizationProfile {
  name: string
  legal_name: string
  industry: string
  size: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  description: string
}

export function OrganizationTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<OrganizationProfile>({
    name: "Dragonfly Productions",
    legal_name: "Dragonfly Productions LLC",
    industry: "entertainment",
    size: "50-200",
    website: "https://dragonflyproductions.com",
    email: "info@dragonflyproductions.com",
    phone: "+1 (555) 123-4567",
    address: "123 Production Way",
    city: "Los Angeles",
    state: "CA",
    postal_code: "90001",
    country: "US",
    description: "Leading production company specializing in live events and entertainment",
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Save to Supabase organizations table
      toast({
        title: t('success.saved'),
        description: t('admin.organization.toast.profileUpdated'),
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('admin.organization.toast.profileFailed'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle>{t('admin.organization.basicInfo')}</CardTitle>
          </div>
          <CardDescription>
            {t('admin.organization.basicInfoDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.organization.name')}</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder={t('admin.organization.namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal_name">{t('admin.organization.legalName')}</Label>
              <Input
                id="legal_name"
                value={profile.legal_name}
                onChange={(e) => setProfile({ ...profile, legal_name: e.target.value })}
                placeholder={t('admin.organization.legalNamePlaceholder')}
              />
            </div>
          </div>

          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">{t('admin.organization.industry')}</Label>
              <Select value={profile.industry} onValueChange={(value) => setProfile({ ...profile, industry: value })}>
                <SelectTrigger id="industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entertainment">{t('admin.organization.industries.entertainment')}</SelectItem>
                  <SelectItem value="production">{t('admin.organization.industries.production')}</SelectItem>
                  <SelectItem value="events">{t('admin.organization.industries.events')}</SelectItem>
                  <SelectItem value="technology">{t('admin.organization.industries.technology')}</SelectItem>
                  <SelectItem value="other">{t('admin.organization.industries.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">{t('admin.organization.size')}</Label>
              <Select value={profile.size} onValueChange={(value) => setProfile({ ...profile, size: value })}>
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">{t('admin.organization.sizes.1-10')}</SelectItem>
                  <SelectItem value="11-50">{t('admin.organization.sizes.11-50')}</SelectItem>
                  <SelectItem value="50-200">{t('admin.organization.sizes.50-200')}</SelectItem>
                  <SelectItem value="200-1000">{t('admin.organization.sizes.200-1000')}</SelectItem>
                  <SelectItem value="1000+">{t('admin.organization.sizes.1000+')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.organization.description')}</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              placeholder={t('admin.organization.descriptionPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Mail aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('admin.organization.contactInfo')}</CardTitle>
          </div>
          <CardDescription>
            {t('admin.organization.contactInfoDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">{t('admin.organization.website')}</Label>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <Globe aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder={t('admin.organization.websitePlaceholder')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.organization.email')}</Label>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder={t('admin.organization.emailPlaceholder')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('admin.organization.phone')}</Label>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Phone aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder={t('admin.organization.phonePlaceholder')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <MapPin aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('admin.organization.address')}</CardTitle>
          </div>
          <CardDescription>
            {t('admin.organization.addressDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">{t('admin.organization.streetAddress')}</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder={t('admin.organization.streetAddressPlaceholder')}
            />
          </div>

          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">{t('admin.organization.city')}</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder={t('admin.organization.cityPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">{t('admin.organization.state')}</Label>
              <Input
                id="state"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                placeholder={t('admin.organization.statePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">{t('admin.organization.postalCode')}</Label>
              <Input
                id="postal_code"
                value={profile.postal_code}
                onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                placeholder={t('admin.organization.postalCodePlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">{t('admin.organization.country')}</Label>
            <Select value={profile.country} onValueChange={(value) => setProfile({ ...profile, country: value })}>
              <SelectTrigger id="country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">{t('admin.organization.countries.us')}</SelectItem>
                <SelectItem value="CA">{t('admin.organization.countries.ca')}</SelectItem>
                <SelectItem value="GB">{t('admin.organization.countries.gb')}</SelectItem>
                <SelectItem value="AU">{t('admin.organization.countries.au')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex flex-wrap justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </div>
  )
}
