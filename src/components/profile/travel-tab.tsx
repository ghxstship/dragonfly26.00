"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Save, Loader2} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

export function TravelProfileTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [travelData, setTravelData] = useState({
    passportNumber: "",
    passportExpiry: "",
    passportCountry: "",
    visaInformation: "",
    tsaPreCheck: "",
    globalEntry: "",
    knownTravelerNumber: "",
    seatPreference: "no-preference",
    mealPreference: "",
    frequentFlyerPrograms: "",
    hotelPreferences: "",
    loyaltyPrograms: "",
    mobilityAssistance: false,
    wheelchairRequired: false,
    otherTravelNeeds: "",
  })

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setTravelData({
        passportNumber: profile.passport_number || "",
        passportExpiry: profile.passport_expiry || "",
        passportCountry: profile.passport_country || "",
        visaInformation: profile.visa_information || "",
        tsaPreCheck: profile.tsa_precheck || "",
        globalEntry: profile.global_entry || "",
        knownTravelerNumber: profile.known_traveler_number || "",
        seatPreference: profile.seat_preference || "no-preference",
        mealPreference: profile.meal_preference || "",
        frequentFlyerPrograms: profile.frequent_flyer_programs || "",
        hotelPreferences: profile.hotel_preferences || "",
        loyaltyPrograms: profile.loyalty_programs || "",
        mobilityAssistance: profile.mobility_assistance || false,
        wheelchairRequired: profile.wheelchair_required || false,
        otherTravelNeeds: profile.other_travel_needs || "",
      })
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        passport_number: travelData.passportNumber,
        passport_expiry: travelData.passportExpiry,
        passport_country: travelData.passportCountry,
        visa_information: travelData.visaInformation,
        tsa_precheck: travelData.tsaPreCheck,
        global_entry: travelData.globalEntry,
        known_traveler_number: travelData.knownTravelerNumber,
        seat_preference: travelData.seatPreference,
        meal_preference: travelData.mealPreference,
        frequent_flyer_programs: travelData.frequentFlyerPrograms,
        hotel_preferences: travelData.hotelPreferences,
        loyalty_programs: travelData.loyaltyPrograms,
        mobility_assistance: travelData.mobilityAssistance,
        wheelchair_required: travelData.wheelchairRequired,
        other_travel_needs: travelData.otherTravelNeeds,
      })
      
      toast({
        title: t('profile.success.travelUpdated'),
        description: t('profile.success.travelSaved'),
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
          <CardTitle>{t('profile.travel.passport')}</CardTitle>
          <CardDescription>{t('profile.travel.passportDescription')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">{t('profile.travel.passportNumber')}</Label>
              <Input
                id="passportNumber"
                value={travelData.passportNumber}
                onChange={(e) => setTravelData({ ...travelData, passportNumber: e.target.value })}
                placeholder={t('profile.travel.passportNumberPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportCountry">{t('profile.travel.issuingCountry')}</Label>
              <Input
                id="passportCountry"
                value={travelData.passportCountry}
                onChange={(e) => setTravelData({ ...travelData, passportCountry: e.target.value })}
                placeholder={t('profile.travel.issuingCountryPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportExpiry">{t('profile.travel.expiryDate')}</Label>
              <Input
                id="passportExpiry"
                type="date"
                value={travelData.passportExpiry}
                onChange={(e) => setTravelData({ ...travelData, passportExpiry: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visaInformation">{t('profile.travel.visaInformation')}</Label>
            <Textarea
              id="visaInformation"
              value={travelData.visaInformation}
              onChange={(e) => setTravelData({ ...travelData, visaInformation: e.target.value })}
              placeholder={t('profile.travel.visaPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.travel.trustedTraveler')}</CardTitle>
          <CardDescription>{t('profile.travel.trustedTravelerDescription')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="tsa">{t('profile.travel.tsaPrecheck')}</Label>
              <Input
                id="tsa"
                value={travelData.tsaPreCheck}
                onChange={(e) => setTravelData({ ...travelData, tsaPreCheck: e.target.value })}
                placeholder={t('profile.travel.tsaPrecheckPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="globalEntry">{t('profile.travel.globalEntry')}</Label>
              <Input
                id="globalEntry"
                value={travelData.globalEntry}
                onChange={(e) => setTravelData({ ...travelData, globalEntry: e.target.value })}
                placeholder={t('profile.travel.globalEntryPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="knownTraveler">{t('profile.travel.knownTraveler')}</Label>
            <Input
              id="knownTraveler"
              value={travelData.knownTravelerNumber}
              onChange={(e) =>
                setTravelData({ ...travelData, knownTravelerNumber: e.target.value })
              }
              placeholder={t('profile.travel.knownTravelerPlaceholder')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.travel.preferences')}</CardTitle>
          <CardDescription>{t('profile.travel.preferencesDescription')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label>{t('profile.travel.seatPreference')}</Label>
            <RadioGroup
              value={travelData.seatPreference}
              onValueChange={(value) => setTravelData({ ...travelData, seatPreference: value })}
            >
              <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                <RadioGroupItem value="window" id="window" />
                <Label htmlFor="window" className="font-normal">
                  {t('profile.travel.seatWindow')}
                </Label>
              </div>
              <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                <RadioGroupItem value="aisle" id="aisle" />
                <Label htmlFor="aisle" className="font-normal">
                  {t('profile.travel.seatAisle')}
                </Label>
              </div>
              <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                <RadioGroupItem value="middle" id="middle" />
                <Label htmlFor="middle" className="font-normal">
                  {t('profile.travel.seatMiddle')}
                </Label>
              </div>
              <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                <RadioGroupItem value="no-preference" id="no-preference" />
                <Label htmlFor="no-preference" className="font-normal">
                  {t('profile.travel.seatNoPreference')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealPreference">{t('profile.travel.mealPreference')}</Label>
            <Input
              id="mealPreference"
              value={travelData.mealPreference}
              onChange={(e) => setTravelData({ ...travelData, mealPreference: e.target.value })}
              placeholder={t('profile.travel.mealPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hotelPreferences">{t('profile.travel.hotelPreferences')}</Label>
            <Textarea
              id="hotelPreferences"
              value={travelData.hotelPreferences}
              onChange={(e) => setTravelData({ ...travelData, hotelPreferences: e.target.value })}
              placeholder={t('profile.travel.hotelPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.travel.loyaltyPrograms')}</CardTitle>
          <CardDescription>{t('profile.travel.loyaltyDescription')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequentFlyer">{t('profile.travel.frequentFlyer')}</Label>
            <Textarea
              id="frequentFlyer"
              value={travelData.frequentFlyerPrograms}
              onChange={(e) =>
                setTravelData({ ...travelData, frequentFlyerPrograms: e.target.value })
              }
              placeholder={t('profile.travel.frequentFlyerPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loyaltyPrograms">{t('profile.travel.hotelLoyalty')}</Label>
            <Textarea
              id="loyaltyPrograms"
              value={travelData.loyaltyPrograms}
              onChange={(e) => setTravelData({ ...travelData, loyaltyPrograms: e.target.value })}
              placeholder={t('profile.travel.hotelLoyaltyPlaceholder')}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.travel.specialNeeds')}</CardTitle>
          <CardDescription>{t('profile.travel.specialNeedsDescription')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
              <Checkbox
                id="mobilityAssistance"
                checked={travelData.mobilityAssistance}
                onCheckedChange={(checked) =>
                  setTravelData({ ...travelData, mobilityAssistance: checked as boolean })
                }
              />
              <Label htmlFor="mobilityAssistance" className="font-normal">
                {t('profile.travel.mobilityPlaceholder')}
              </Label>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
              <Checkbox
                id="wheelchairRequired"
                checked={travelData.wheelchairRequired}
                onCheckedChange={(checked) =>
                  setTravelData({ ...travelData, wheelchairRequired: checked as boolean })
                }
              />
              <Label htmlFor="wheelchairRequired" className="font-normal">
                {t('profile.travel.wheelchairRequired')}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherTravelNeeds">{t('profile.travel.otherNeeds')}</Label>
            <Textarea
              id="otherTravelNeeds"
              value={travelData.otherTravelNeeds}
              onChange={(e) => setTravelData({ ...travelData, otherTravelNeeds: e.target.value })}
              placeholder={t('profile.travel.otherNeedsPlaceholder')}
              rows={3}
            />
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
