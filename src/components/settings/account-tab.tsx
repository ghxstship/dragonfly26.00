"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
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
  Download,
  Loader2,
  Plus
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { useProfileData } from "@/hooks/use-profile-data"

export function AccountTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const { profile, loading, updateProfile, uploadAvatar } = useProfileData()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [profilePicture, setProfilePicture] = useState("")

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zip_code || "",
        country: profile.country || "",
      })
      setProfilePicture(profile.avatar_url || "")
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
      })
      
      toast({
        title: t('settings.toast.accountUpdated'),
        description: t('settings.toast.accountUpdatedDesc'),
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: t('settings.toast.fileTooLarge'),
        description: t('settings.toast.fileTooLargeDesc'),
        variant: "destructive",
      })
      return
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('settings.toast.invalidFileType'),
        description: t('settings.toast.invalidFileTypeDesc'),
        variant: "destructive",
      })
      return
    }
    
    setUploading(true)
    try {
      const url = await uploadAvatar(file)
      setProfilePicture(url)
      toast({
        title: t('settings.toast.photoUploaded'),
        description: t('settings.toast.photoUploadedDesc'),
      })
    } catch (error: any) {
      toast({
        title: t('settings.toast.uploadFailed'),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleChangePassword = () => {
    toast({
      title: t('settings.toast.passwordChangeRequested'),
      description: t('settings.toast.passwordChangeRequestedDesc'),
    })
  }

  const handleExportData = () => {
    toast({
      title: t('settings.toast.dataExportStarted'),
      description: t('settings.toast.dataExportStartedDesc'),
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: t('settings.toast.accountDeletionRequested'),
      description: t('settings.toast.accountDeletionRequestedDesc'),
      variant: "destructive",
    })
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
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('settings.accountTab.description')}
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('common.create')}
        </Button>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" aria-hidden="true" />
            {t('settings.accountTab.profileInfo')}
          </CardTitle>
          <CardDescription>
            {t('settings.accountTab.updateInfo')}
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
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                )}
                {t('settings.accountTab.uploadPhoto')}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t('settings.accountTab.photoRequirements')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('settings.accountTab.firstName')}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('settings.accountTab.lastName')}</Label>
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
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t('settings.accountTab.emailAddress')}
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
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t('settings.accountTab.phoneNumber')}
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
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {t('settings.accountTab.address')}
            </Label>
            <div className="space-y-4">
              <Input
                placeholder={t('settings.account.streetAddress')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder={t('common.city')}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  placeholder={t('common.state')}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder={t('common.zipCode')}
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
                <Input
                  placeholder={t('common.country')}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {t('common.save')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            {t('settings.accountTab.security')}
          </CardTitle>
          <CardDescription>
            {t('settings.accountTab.managePassword')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="font-medium">{t('settings.accountTab.password')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('settings.accountTab.lastChanged')}
              </p>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              {t('settings.accountTab.changePassword')}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">{t('settings.accountTab.twoFactorAuth')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('settings.accountTab.notEnabled')}
              </p>
            </div>
            <Button variant="outline">
              {t('settings.accountTab.enable2FA')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.accountTab.dataPrivacy')}</CardTitle>
          <CardDescription>
            {t('settings.accountTab.exportDelete')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="font-medium">{t('settings.accountTab.exportData')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('settings.accountTab.downloadCopy')}
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              {t('settings.accountTab.exportData')}
            </Button>
          </div>

          <Separator />

          <div className="rounded-lg bg-destructive/10 p-4 space-y-4">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-destructive">{t('settings.accountTab.dangerZone')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('settings.accountTab.deleteWarning')}
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('settings.accountTab.deleteAccount')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.accountTab.confirmDelete')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.accountTab.deleteDescription')}
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
