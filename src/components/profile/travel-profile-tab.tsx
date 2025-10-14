"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

export function TravelProfileTab() {
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
        title: "Travel profile updated",
        description: "Your travel information has been saved successfully.",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Passport & Travel Documents</CardTitle>
          <CardDescription>Your passport and travel document information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                value={travelData.passportNumber}
                onChange={(e) => setTravelData({ ...travelData, passportNumber: e.target.value })}
                placeholder="Enter passport number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportCountry">Issuing Country</Label>
              <Input
                id="passportCountry"
                value={travelData.passportCountry}
                onChange={(e) => setTravelData({ ...travelData, passportCountry: e.target.value })}
                placeholder="Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportExpiry">Expiry Date</Label>
              <Input
                id="passportExpiry"
                type="date"
                value={travelData.passportExpiry}
                onChange={(e) => setTravelData({ ...travelData, passportExpiry: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visaInformation">Visa Information</Label>
            <Textarea
              id="visaInformation"
              value={travelData.visaInformation}
              onChange={(e) => setTravelData({ ...travelData, visaInformation: e.target.value })}
              placeholder="List any valid visas and their expiry dates"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trusted Traveler Programs</CardTitle>
          <CardDescription>TSA PreCheck, Global Entry, and other programs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tsa">TSA PreCheck Number</Label>
              <Input
                id="tsa"
                value={travelData.tsaPreCheck}
                onChange={(e) => setTravelData({ ...travelData, tsaPreCheck: e.target.value })}
                placeholder="TSA PreCheck #"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="globalEntry">Global Entry Number</Label>
              <Input
                id="globalEntry"
                value={travelData.globalEntry}
                onChange={(e) => setTravelData({ ...travelData, globalEntry: e.target.value })}
                placeholder="Global Entry #"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="knownTraveler">Known Traveler Number</Label>
            <Input
              id="knownTraveler"
              value={travelData.knownTravelerNumber}
              onChange={(e) =>
                setTravelData({ ...travelData, knownTravelerNumber: e.target.value })
              }
              placeholder="Known Traveler Number"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Travel Preferences</CardTitle>
          <CardDescription>Your travel and accommodation preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seat Preference</Label>
            <RadioGroup
              value={travelData.seatPreference}
              onValueChange={(value) => setTravelData({ ...travelData, seatPreference: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="window" id="window" />
                <Label htmlFor="window" className="font-normal">
                  Window
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aisle" id="aisle" />
                <Label htmlFor="aisle" className="font-normal">
                  Aisle
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="middle" id="middle" />
                <Label htmlFor="middle" className="font-normal">
                  Middle
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-preference" id="no-preference" />
                <Label htmlFor="no-preference" className="font-normal">
                  No Preference
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealPreference">Meal Preference</Label>
            <Input
              id="mealPreference"
              value={travelData.mealPreference}
              onChange={(e) => setTravelData({ ...travelData, mealPreference: e.target.value })}
              placeholder="e.g., Vegetarian, Kosher, Halal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hotelPreferences">Hotel Preferences</Label>
            <Textarea
              id="hotelPreferences"
              value={travelData.hotelPreferences}
              onChange={(e) => setTravelData({ ...travelData, hotelPreferences: e.target.value })}
              placeholder="Room type, floor level, amenities, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loyalty Programs</CardTitle>
          <CardDescription>Frequent flyer and hotel loyalty programs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequentFlyer">Frequent Flyer Programs</Label>
            <Textarea
              id="frequentFlyer"
              value={travelData.frequentFlyerPrograms}
              onChange={(e) =>
                setTravelData({ ...travelData, frequentFlyerPrograms: e.target.value })
              }
              placeholder="List airlines and membership numbers"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loyaltyPrograms">Hotel Loyalty Programs</Label>
            <Textarea
              id="loyaltyPrograms"
              value={travelData.loyaltyPrograms}
              onChange={(e) => setTravelData({ ...travelData, loyaltyPrograms: e.target.value })}
              placeholder="List hotel chains and membership numbers"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Travel Needs</CardTitle>
          <CardDescription>Mobility assistance and other special requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobilityAssistance"
                checked={travelData.mobilityAssistance}
                onCheckedChange={(checked) =>
                  setTravelData({ ...travelData, mobilityAssistance: checked as boolean })
                }
              />
              <Label htmlFor="mobilityAssistance" className="font-normal">
                Require mobility assistance at airports
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="wheelchairRequired"
                checked={travelData.wheelchairRequired}
                onCheckedChange={(checked) =>
                  setTravelData({ ...travelData, wheelchairRequired: checked as boolean })
                }
              />
              <Label htmlFor="wheelchairRequired" className="font-normal">
                Wheelchair required
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherTravelNeeds">Other Travel Needs</Label>
            <Textarea
              id="otherTravelNeeds"
              value={travelData.otherTravelNeeds}
              onChange={(e) => setTravelData({ ...travelData, otherTravelNeeds: e.target.value })}
              placeholder="Any other special requirements or accommodations"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

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
