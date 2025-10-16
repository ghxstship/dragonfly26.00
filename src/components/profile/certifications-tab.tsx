"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {Save, Plus, Trash2, Loader2, ExternalLink, Upload, Download} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useProfileData } from "@/hooks/use-profile-data"
import { useToast } from "@/lib/hooks/use-toast"

interface Certification {
  id: string
  name: string
  issuingOrganization: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
  documentFile: string
  status: "active" | "expired" | "pending"
}

export function CertificationsTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [certifications, setCertifications] = useState<Certification[]>([])

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setCertifications(profile.certifications || [])
    }
  }, [profile])

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      documentFile: "",
      status: "active",
    }
    setCertifications([...certifications, newCert])
  }

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((c) => c.id !== id))
  }

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(
      certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "expired":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        certifications: certifications,
      })
      
      toast({
        title: t('profile.success.certificationsUpdated'),
        description: t('profile.success.certificationsSaved'),
      })
    } catch (error: any) {
      toast({
        title: t('errors.error'),
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
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('profile.descriptions.certifications')}
        </p>
        <Button size="sm" onClick={addCertification}>
          <Plus className="h-4 w-4 mr-2" />
          {t('profile.certifications.addCertification')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('profile.certifications.title')}</CardTitle>
              <CardDescription>
                {t('profile.certifications.description')}
              </CardDescription>
            </div>
            <Button onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              {t('profile.certifications.addCertification')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {certifications.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                {t('profile.certifications.noCertifications')}
              </p>
              <Button variant="outline" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                {t('profile.certifications.addFirst')}
              </Button>
            </div>
          ) : (
            certifications.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(cert.status)}`} />
                      <h4 className="font-semibold">
                        {cert.name || t('profile.certifications.untitled')}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCertification(cert.id)}
                      aria-label="Remove certification"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${cert.id}`}>{t('profile.certifications.name')}</Label>
                      <Input
                        id={`name-${cert.id}`}
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                        placeholder={t('profile.certifications.namePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`org-${cert.id}`}>{t('profile.certifications.organization')}</Label>
                      <Input
                        id={`org-${cert.id}`}
                        value={cert.issuingOrganization}
                        onChange={(e) =>
                          updateCertification(cert.id, "issuingOrganization", e.target.value)
                        }
                        placeholder={t('profile.certifications.organizationPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`issue-${cert.id}`}>{t('profile.certifications.issueDate')}</Label>
                      <Input
                        id={`issue-${cert.id}`}
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) =>
                          updateCertification(cert.id, "issueDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`expiry-${cert.id}`}>{t('profile.certifications.expiryDate')}</Label>
                      <Input
                        id={`expiry-${cert.id}`}
                        type="date"
                        value={cert.expiryDate}
                        onChange={(e) =>
                          updateCertification(cert.id, "expiryDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`status-${cert.id}`}>{t('profile.certifications.status')}</Label>
                      <select
                        id={`status-${cert.id}`}
                        value={cert.status}
                        onChange={(e) => updateCertification(cert.id, "status", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="active">{t('profile.certifications.statusActive')}</option>
                        <option value="expired">{t('profile.certifications.statusExpired')}</option>
                        <option value="pending">{t('profile.certifications.statusPending')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`credId-${cert.id}`}>{t('profile.certifications.credentialId')}</Label>
                      <Input
                        id={`credId-${cert.id}`}
                        value={cert.credentialId}
                        onChange={(e) =>
                          updateCertification(cert.id, "credentialId", e.target.value)
                        }
                        placeholder={t('profile.certifications.credentialIdPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`url-${cert.id}`}>{t('profile.certifications.credentialUrl')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`url-${cert.id}`}
                          value={cert.credentialUrl}
                          onChange={(e) =>
                            updateCertification(cert.id, "credentialUrl", e.target.value)
                          }
                          placeholder={t('profile.certifications.credentialUrlPlaceholder')}
                        />
                        {cert.credentialUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`doc-${cert.id}`}>{t('profile.certifications.document')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`doc-${cert.id}`}
                        value={cert.documentFile}
                        placeholder={t('profile.certifications.noDocument')}
                        disabled
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('profile.certifications.uploadDocument')}
                      </Button>
                      {cert.documentFile && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                          {t('profile.certifications.downloadDocument')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {certifications.length > 0 && (
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
      )}
    </div>
  )
}
