"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {Save, Loader2} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { useProfileData } from "@/hooks/use-profile-data"

export function EmergencyContactTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  
  const [contact, setContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  })

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setContact({
        name: profile.emergency_contact_name || "",
        relationship: profile.emergency_contact_relationship || "",
        phone: profile.emergency_contact_phone || "",
        email: profile.emergency_contact_email || "",
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        emergency_contact_name: contact.name,
        emergency_contact_relationship: contact.relationship,
        emergency_contact_phone: contact.phone,
        emergency_contact_email: contact.email,
      })
      
      toast({
        title: t('profile.success.emergencyUpdated'),
        description: t('profile.success.emergencySaved'),
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.emergency.primary')}</CardTitle>
          <CardDescription>
            {t('emergency.contactDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('emergency.name')}</Label>
              <Input
                id="name"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder={t('emergency.namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">{t('emergency.relationship')}</Label>
              <Input
                id="relationship"
                value={contact.relationship}
                onChange={(e) => setContact({ ...contact, relationship: e.target.value })}
                placeholder={t('emergency.relationshipPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('emergency.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder={t('emergency.phonePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('emergency.email')}</Label>
              <Input
                id="email"
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder={t('emergency.emailPlaceholder')}
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
