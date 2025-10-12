"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function SocialMediaTab() {
  const [socialData, setSocialData] = useState({
    linkedin: "",
    linkedinPublic: true,
    twitter: "",
    twitterPublic: true,
    instagram: "",
    instagramPublic: true,
    facebook: "",
    facebookPublic: false,
    youtube: "",
    youtubePublic: true,
    tiktok: "",
    tiktokPublic: true,
    github: "",
    githubPublic: true,
    website: "",
    websitePublic: true,
    behance: "",
    behancePublic: true,
    dribbble: "",
    dribbblePublic: true,
  })

  const handleSave = () => {
    console.log("Saving social media data:", socialData)
    // TODO: Save to Supabase
  }

  const platforms = [
    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username" },
    { key: "twitter", label: "Twitter/X", placeholder: "@username" },
    { key: "instagram", label: "Instagram", placeholder: "@username" },
    { key: "facebook", label: "Facebook", placeholder: "facebook.com/username" },
    { key: "youtube", label: "YouTube", placeholder: "youtube.com/@channel" },
    { key: "tiktok", label: "TikTok", placeholder: "@username" },
    { key: "github", label: "GitHub", placeholder: "github.com/username" },
    { key: "website", label: "Personal Website", placeholder: "https://example.com" },
    { key: "behance", label: "Behance", placeholder: "behance.net/username" },
    { key: "dribbble", label: "Dribbble", placeholder: "dribbble.com/username" },
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
              <div className="flex items-center justify-between">
                <Label htmlFor={platform.key}>{platform.label}</Label>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`${platform.key}-public`}
                    className="text-sm text-muted-foreground font-normal"
                  >
                    Public
                  </Label>
                  <Switch
                    id={`${platform.key}-public`}
                    checked={socialData[`${platform.key}Public` as keyof typeof socialData] as boolean}
                    onCheckedChange={(checked) =>
                      setSocialData({ ...socialData, [`${platform.key}Public`]: checked })
                    }
                  />
                </div>
              </div>
              <Input
                id={platform.key}
                value={socialData[platform.key as keyof typeof socialData] as string}
                onChange={(e) =>
                  setSocialData({ ...socialData, [platform.key]: e.target.value })
                }
                placeholder={platform.placeholder}
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
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
