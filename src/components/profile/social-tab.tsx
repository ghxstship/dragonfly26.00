"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {Save, Loader2} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function SocialMediaTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  
  const [socialData, setSocialData] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    website: "",
  })

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setSocialData({
        linkedin: profile.linkedin_url || "",
        twitter: profile.twitter_url || "",
        instagram: profile.instagram_url || "",
        website: profile.website_url || "",
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        linkedin_url: socialData.linkedin,
        twitter_url: socialData.twitter,
        instagram_url: socialData.instagram,
        website_url: socialData.website,
      })
      
      toast({
        title: t('profile.success.socialUpdated'),
        description: t('profile.success.socialSaved'),
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

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  const platforms = [
    { key: "linkedin", label: t('profile.social.linkedin'), placeholder: t('profile.social.linkedinPlaceholder') },
    { key: "twitter", label: t('profile.social.twitter'), placeholder: t('profile.social.twitterPlaceholder') },
    { key: "instagram", label: t('profile.social.instagram'), placeholder: t('profile.social.instagramPlaceholder') },
    { key: "website", label: t('profile.social.website'), placeholder: t('profile.social.websitePlaceholder') },
  ]

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.social.profiles')}</CardTitle>
          <CardDescription>
            {t('profile.social.visibility')}
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-3 md:space-y-4 lg:space-y-6">
          {platforms.map((platform: any) => (
            <div key={platform.key} className="space-y-2">
              <Label htmlFor={platform.key}>{platform.label}</Label>
              <Input
                id={platform.key}
                value={socialData[platform.key as keyof typeof socialData] as string}
                onChange={(e) =>
                  setSocialData({ ...socialData, [platform.key]: e.target.value })
                }
                placeholder={platform.placeholder}
                type="url"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{t('social.privacyNote')}</strong> {t('social.privacyDescription')}
        </p>
      </div>

    </div>
  )
}
