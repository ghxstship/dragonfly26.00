"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Plus, Trash2, Upload, Download, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
  const [certifications, setCertifications] = useState<Certification[]>([])

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

  const handleSave = () => {
    console.log("Saving certifications:", certifications)
    // TODO: Save to Supabase
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Professional Certifications</CardTitle>
              <CardDescription>
                Licenses, certifications, and professional credentials
              </CardDescription>
            </div>
            <Button onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {certifications.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                No certifications added yet
              </p>
              <Button variant="outline" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Certification
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
                        {cert.name || "Untitled Certification"}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCertification(cert.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${cert.id}`}>Certification Name</Label>
                      <Input
                        id={`name-${cert.id}`}
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                        placeholder="e.g., OSHA Safety Certification"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`org-${cert.id}`}>Issuing Organization</Label>
                      <Input
                        id={`org-${cert.id}`}
                        value={cert.issuingOrganization}
                        onChange={(e) =>
                          updateCertification(cert.id, "issuingOrganization", e.target.value)
                        }
                        placeholder="Organization name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`issue-${cert.id}`}>Issue Date</Label>
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
                      <Label htmlFor={`expiry-${cert.id}`}>Expiry Date</Label>
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
                      <Label htmlFor={`status-${cert.id}`}>Status</Label>
                      <select
                        id={`status-${cert.id}`}
                        value={cert.status}
                        onChange={(e) => updateCertification(cert.id, "status", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`credId-${cert.id}`}>Credential ID</Label>
                      <Input
                        id={`credId-${cert.id}`}
                        value={cert.credentialId}
                        onChange={(e) =>
                          updateCertification(cert.id, "credentialId", e.target.value)
                        }
                        placeholder="Certificate number or ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`url-${cert.id}`}>Credential URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`url-${cert.id}`}
                          value={cert.credentialUrl}
                          onChange={(e) =>
                            updateCertification(cert.id, "credentialUrl", e.target.value)
                          }
                          placeholder="Verification URL"
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
                    <Label htmlFor={`doc-${cert.id}`}>Certificate Document</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`doc-${cert.id}`}
                        value={cert.documentFile}
                        placeholder="No file uploaded"
                        disabled
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      {cert.documentFile && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
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
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
