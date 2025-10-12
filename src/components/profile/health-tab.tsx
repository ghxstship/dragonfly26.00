"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HealthTab() {
  const [healthData, setHealthData] = useState({
    bloodType: "",
    allergies: [] as string[],
    medications: "",
    medicalConditions: "",
    dietaryRestrictions: [] as string[],
    specialAccommodations: "",
    doctorName: "",
    doctorPhone: "",
    insuranceProvider: "",
    policyNumber: "",
  })

  const [newAllergy, setNewAllergy] = useState("")
  const [newDietaryRestriction, setNewDietaryRestriction] = useState("")

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setHealthData({ ...healthData, allergies: [...healthData.allergies, newAllergy.trim()] })
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setHealthData({
      ...healthData,
      allergies: healthData.allergies.filter((_, i) => i !== index),
    })
  }

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

  const handleSave = () => {
    console.log("Saving health data:", healthData)
    // TODO: Save to Supabase
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
            <div className="flex gap-2">
              <Input
                id="allergies"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                placeholder="Add allergy and press Enter"
              />
              <Button type="button" size="icon" onClick={addAllergy}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {healthData.allergies.map((allergy, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {allergy}
                  <button
                    onClick={() => removeAllergy(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
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
                onKeyPress={(e) => e.key === "Enter" && addDietaryRestriction()}
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
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
