"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Camera, Save, Loader2, Plus} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

export function BasicInfoTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile, uploadAvatar } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profileImage: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.date_of_birth || "",
        profileImage: profile.avatar_url || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zip_code || "",
        country: profile.country || "",
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        date_of_birth: profileData.dateOfBirth,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        country: profileData.country,
      })
      
      toast({
        title: t('profile.success.profileUpdated'),
        description: t('profile.success.basicInfoSaved'),
      })
    } catch (error: Error | unknown) {
      toast({
        title: t('profile.errors.error'),
        description: (error as any).message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('profile.errors.fileTooLarge'),
        description: t('profile.errors.fileTooLargeDescription'),
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const url = await uploadAvatar(file)
      setProfileData({ ...profileData, profileImage: url })
      toast({
        title: t('profile.success.photoUploaded'),
        description: t('profile.success.photoSaved'),
      })
    } catch (error: Error | unknown) {
      toast({
        title: t('profile.errors.uploadFailed'),
        description: (error as any).message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.basicInfo.profilePhoto')}</CardTitle>
          <CardDescription>{t('profile.basicInfo.uploadDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
            <Avatar aria-hidden="true" className="h-24 w-24">
              <AvatarImage src={profileData.profileImage} />
              <AvatarFallback aria-hidden="true" className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
                {profileData.firstName?.[0]}{profileData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden md:block"
               aria-label="file" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera aria-hidden="true" className="h-4 w-4 mr-2" />
                )}
                {t('profile.actions.uploadPhoto')}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {t('profile.basicInfo.uploadDescription')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.basicInfo.personalInfo')}</CardTitle>
          <CardDescription>{t('profile.basicInfo.personalDetails')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('profile.basicInfo.firstName')}</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                placeholder={t('profile.basicInfo.firstNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('profile.basicInfo.lastName')}</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                placeholder={t('profile.basicInfo.lastNamePlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.basicInfo.email')}</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder={t('profile.basicInfo.emailPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('profile.basicInfo.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder={t('profile.basicInfo.phonePlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t('profile.basicInfo.dateOfBirth')}</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.basicInfo.mailingAddress')}</CardTitle>
          <CardDescription>{t('profile.basicInfo.mailingAddressDescription')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">{t('profile.basicInfo.streetAddress')}</Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              placeholder={t('profile.basicInfo.streetAddressPlaceholder')}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t('profile.basicInfo.city')}</Label>
              <Input
                id="city"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                placeholder={t('profile.basicInfo.cityPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">{t('profile.basicInfo.state')}</Label>
              <Input
                id="state"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                placeholder={t('profile.basicInfo.statePlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">{t('profile.basicInfo.zipCode')}</Label>
              <Input
                id="zipCode"
                value={profileData.zipCode}
                onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                placeholder={t('profile.basicInfo.zipCodePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{t('profile.basicInfo.country')}</Label>
              <Input
                id="country"
                value={profileData.country}
                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                placeholder={t('profile.basicInfo.countryPlaceholder')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save aria-hidden="true" className="h-4 w-4 mr-2" />
          )}
          {t('profile.actions.saveChanges')}
        </Button>
      </div>
    </div>
  )
}
