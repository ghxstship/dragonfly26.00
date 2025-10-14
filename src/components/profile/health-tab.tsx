"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

export function HealthTab() {
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
        title: "Health information updated",
        description: "Your health information has been saved successfully.",
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
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>Important medical details for emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Input
                id="bloodType"
                value={healthData.bloodType}
                onChange={(e) => setHealthData({ ...healthData, bloodType: e.target.value })}
                placeholder="e.g., A+, O-, AB+"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={healthData.allergies}
              onChange={(e) => setHealthData({ ...healthData, allergies: e.target.value })}
              placeholder="List any allergies (e.g., Peanuts, Penicillin, Latex)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={healthData.medications}
              onChange={(e) => setHealthData({ ...healthData, medications: e.target.value })}
              placeholder="List any medications you are currently taking"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={healthData.medicalConditions}
              onChange={(e) => setHealthData({ ...healthData, medicalConditions: e.target.value })}
              placeholder="List any chronic conditions or health concerns"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dietary Restrictions</CardTitle>
          <CardDescription>Food allergies and dietary preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
            <div className="flex gap-2">
              <Input
                id="dietaryRestrictions"
                value={newDietaryRestriction}
                onChange={(e) => setNewDietaryRestriction(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDietaryRestriction())}
                placeholder="e.g., Vegetarian, Gluten-free, etc."
              />
              <Button type="button" size="icon" onClick={addDietaryRestriction}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {healthData.dietaryRestrictions.map((restriction, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {restriction}
                  <button
                    onClick={() => removeDietaryRestriction(index)}
                    className="ml-1 hover:text-destructive"
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
          <CardTitle>Special Accommodations</CardTitle>
          <CardDescription>Any special needs or accommodations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialAccommodations">Special Accommodations</Label>
            <Textarea
              id="specialAccommodations"
              value={healthData.specialAccommodations}
              onChange={(e) =>
                setHealthData({ ...healthData, specialAccommodations: e.target.value })
              }
              placeholder="Describe any special accommodations needed (mobility, accessibility, etc.)"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Healthcare Provider</CardTitle>
          <CardDescription>Primary doctor and insurance information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                value={healthData.doctorName}
                onChange={(e) => setHealthData({ ...healthData, doctorName: e.target.value })}
                placeholder="Dr. John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctorPhone">Doctor Phone</Label>
              <Input
                id="doctorPhone"
                type="tel"
                value={healthData.doctorPhone}
                onChange={(e) => setHealthData({ ...healthData, doctorPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                value={healthData.insuranceProvider}
                onChange={(e) =>
                  setHealthData({ ...healthData, insuranceProvider: e.target.value })
                }
                placeholder="Insurance company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                id="policyNumber"
                value={healthData.policyNumber}
                onChange={(e) => setHealthData({ ...healthData, policyNumber: e.target.value })}
                placeholder="Policy/Member ID"
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
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
