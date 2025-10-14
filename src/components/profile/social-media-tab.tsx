"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

export function SocialMediaTab() {
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
        title: "Social media updated",
        description: "Your social media links have been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const platforms = [
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
    { key: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/username" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
    { key: "website", label: "Personal Website", placeholder: "https://example.com" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Profiles</CardTitle>
          <CardDescription>
            Link your social media accounts and control their visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {platforms.map((platform) => (
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
          <strong>Privacy Note:</strong> Public profiles will be visible to other users and can be
          included in your professional portfolio. Private profiles are only visible to you and
          organization administrators.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
