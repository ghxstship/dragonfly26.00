"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Save, Loader2, Plus, X} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

export function HealthTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  
  const [healthData, setHealthData] = useState({
    bloodType: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    dietaryRestrictions: [] as string[],
    specialAccommodations: "",
    doctorName: "",
    doctorPhone: "",
    insuranceProvider: "",
    policyNumber: "",
  })

  const [newDietaryRestriction, setNewDietaryRestriction] = useState("")

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setHealthData({
        bloodType: profile.blood_type || "",
        allergies: profile.allergies || "",
        medications: profile.medications || "",
        medicalConditions: profile.medical_conditions || "",
        dietaryRestrictions: profile.dietary_restrictions || [],
        specialAccommodations: profile.special_accommodations || "",
        doctorName: profile.doctor_name || "",
        doctorPhone: profile.doctor_phone || "",
        insuranceProvider: profile.insurance_provider || "",
        policyNumber: profile.policy_number || "",
      })
    }
  }, [profile])

  const addDietaryRestriction = () => {
    if (newDietaryRestriction.trim()) {
      setHealthData({
        ...healthData,
        dietaryRestrictions: [...healthData.dietaryRestrictions, newDietaryRestriction.trim()],
      })
      setNewDietaryRestriction("")
    }
  }

  const removeDietaryRestriction = (index: number) => {
    setHealthData({
      ...healthData,
      dietaryRestrictions: healthData.dietaryRestrictions.filter((_, i) => i !== index),
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        blood_type: healthData.bloodType,
        allergies: healthData.allergies,
        medications: healthData.medications,
        medical_conditions: healthData.medicalConditions,
        dietary_restrictions: healthData.dietaryRestrictions,
        special_accommodations: healthData.specialAccommodations,
        doctor_name: healthData.doctorName,
        doctor_phone: healthData.doctorPhone,
        insurance_provider: healthData.insuranceProvider,
        policy_number: healthData.policyNumber,
      })
      
      toast({
        title: t('profile.success.healthUpdated'),
        description: t('profile.success.healthSaved'),
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.health.medical')}</CardTitle>
          <CardDescription>{t('profile.health.medicalDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">{t('profile.health.bloodType')}</Label>
              <Input
                id="bloodType"
                value={healthData.bloodType}
                onChange={(e) => setHealthData({ ...healthData, bloodType: e.target.value })}
                placeholder={t('profile.health.bloodTypePlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">{t('profile.health.allergies')}</Label>
            <Textarea
              id="allergies"
              value={healthData.allergies}
              onChange={(e) => setHealthData({ ...healthData, allergies: e.target.value })}
              placeholder={t('profile.health.allergiesPlaceholder')}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">{t('profile.health.medications')}</Label>
            <Textarea
              id="medications"
              value={healthData.medications}
              onChange={(e) => setHealthData({ ...healthData, medications: e.target.value })}
              placeholder={t('profile.health.medicationsPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">{t('profile.health.conditions')}</Label>
            <Textarea
              id="medicalConditions"
              value={healthData.medicalConditions}
              onChange={(e) => setHealthData({ ...healthData, medicalConditions: e.target.value })}
              placeholder={t('profile.health.conditionsPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.health.dietary')}</CardTitle>
          <CardDescription>{t('profile.health.dietaryDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">{t('profile.health.dietaryRestrictions')}</Label>
            <div className="flex gap-2">
              <Input
                id="dietaryRestrictions"
                value={newDietaryRestriction as any}
                onChange={(e) => setNewDietaryRestriction(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDietaryRestriction())}
                placeholder={t('profile.health.restrictionPlaceholder')}
              />
              <Button type="button" size="icon" onClick={addDietaryRestriction} aria-label={t('profile.health.addRestriction')}>
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {healthData.dietaryRestrictions.map((restriction: any, index: number) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {restriction}
                  <button
                    onClick={() => removeDietaryRestriction(index)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${restriction} dietary restriction`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.health.accommodations')}</CardTitle>
          <CardDescription>{t('profile.health.accommodationsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialAccommodations">{t('profile.health.specialAccommodations')}</Label>
            <Textarea
              id="specialAccommodations"
              value={healthData.specialAccommodations}
              onChange={(e) =>
                setHealthData({ ...healthData, specialAccommodations: e.target.value })
              }
              placeholder={t('profile.health.accommodationsPlaceholder')}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.health.provider')}</CardTitle>
          <CardDescription>{t('profile.health.providerDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">{t('profile.health.doctorName')}</Label>
              <Input
                id="doctorName"
                value={healthData.doctorName}
                onChange={(e) => setHealthData({ ...healthData, doctorName: e.target.value })}
                placeholder={t('profile.health.doctorNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctorPhone">{t('profile.health.doctorPhone')}</Label>
              <Input
                id="doctorPhone"
                type="tel"
                value={healthData.doctorPhone}
                onChange={(e) => setHealthData({ ...healthData, doctorPhone: e.target.value })}
                placeholder={t('profile.health.doctorPhonePlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">{t('profile.health.insuranceProvider')}</Label>
              <Input
                id="insuranceProvider"
                value={healthData.insuranceProvider}
                onChange={(e) =>
                  setHealthData({ ...healthData, insuranceProvider: e.target.value })
                }
                placeholder={t('profile.health.insurancePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber">{t('profile.health.policyNumber')}</Label>
              <Input
                id="policyNumber"
                value={healthData.policyNumber}
                onChange={(e) => setHealthData({ ...healthData, policyNumber: e.target.value })}
                placeholder={t('profile.health.policyPlaceholder')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
          )}
          {t('profile.actions.saveChanges')}
        </Button>
      </div>
    </div>
  )
}
