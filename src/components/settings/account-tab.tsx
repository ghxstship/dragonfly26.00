"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Upload,
  Key,
  Shield,
  Trash2,
  AlertTriangle,
  Download
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function AccountTab() {
  const { toast } = useToast()
  const [profilePicture, setProfilePicture] = useState("https://github.com/shadcn.png")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
  })

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem('account-data', JSON.stringify({
      ...formData,
      profilePicture
    }))
    
    toast({
      title: "Account updated",
      description: "Your account information has been saved successfully.",
    })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 2MB.",
          variant: "destructive",
        })
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, or GIF).",
          variant: "destructive",
        })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setProfilePicture(dataUrl)
        toast({
          title: "Photo uploaded",
          description: "Your profile picture has been updated.",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangePassword = () => {
    toast({
      title: "Password change requested",
      description: "Check your email for password reset instructions.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "We'll email you when your data export is ready to download.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Your account will be deleted within 30 days. You can cancel this at any time.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePicture} />
              <AvatarFallback>{formData.firstName[0]}{formData.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <div className="space-y-4">
              <Input
                placeholder="Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
                <Input
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="font-medium">Password</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Two-Factor Authentication</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Not enabled
              </p>
            </div>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Export your data or delete your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="font-medium">Export Your Data</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your data
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>

          <Separator />

          <div className="rounded-lg bg-destructive/10 p-4 space-y-4">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
