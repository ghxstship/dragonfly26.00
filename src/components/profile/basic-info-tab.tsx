"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export function BasicInfoTab() {
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

  const handleSave = () => {
    console.log("Saving profile data:", profileData)
    // TODO: Save to Supabase
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.profileImage} />
              <AvatarFallback className="text-2xl">
                {profileData.firstName?.[0]}{profileData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
          <CardTitle>Mailing Address</CardTitle>
          <CardDescription>Your primary mailing address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              placeholder="Enter street address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={profileData.zipCode}
                onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                placeholder="Enter ZIP code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profileData.country}
                onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                placeholder="Enter country"
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
