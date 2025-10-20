"use client"

import { useState, useEffect } from "react"
import { useProfileData } from "@/hooks/use-profile-data"
import {Loader2} from "lucide-react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Shield, Key, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Credential {
  id: string
  type: string
  name: string
  issueDate: string
  expiryDate: string
  status: "active" | "expired" | "suspended"
  accessLevel: string

  nameKey?: string
}

interface Clearance {
  id: string
  type: string
  level: string
  issuedBy: string
  validUntil: string
  status: "active" | "expired" | "pending"
}

export function AccessTab() {
  const t = useTranslations('profile')
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      id: "1",
      type: "Venue Access",
      name: "Madison Square Garden - Backstage Pass",
      nameKey: "madison_square_garden__backstage_pass",
      issueDate: "2024-01-15",
      expiryDate: "2024-12-31",
      status: "active",
      accessLevel: "Full Access",
    },
    {
      id: "2",
      type: "Equipment Authorization",
      name: "Forklift Operator License",
      nameKey: "forklift_operator_license",
      issueDate: "2023-06-01",
      expiryDate: "2025-06-01",
      status: "active",
      accessLevel: "Operator",
    },
  ])

  const [clearances, setClearances] = useState<Clearance[]>([
    {
      id: "1",
      type: "Security Clearance",
      level: "Level 2",
      issuedBy: "Department of Homeland Security",
      validUntil: "2025-03-15",
      status: "active",
    },
  ])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      expired: "destructive",
      suspended: "secondary",
      pending: "outline",
    }
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleSave = async () => {
    console.log("Saving access data:", { credentials, clearances })
    // TODO: Save to Supabase
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" aria-hidden="true" />
            <div>
              <CardTitle>{t('access.credentials')}</CardTitle>
              <CardDescription>
                {t('access.credentialsDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('access.noCredentials')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('access.type')}</TableHead>
                  <TableHead>{t('access.name')}</TableHead>
                  <TableHead>{t('access.accessLevel')}</TableHead>
                  <TableHead>{t('access.issueDate')}</TableHead>
                  <TableHead>{t('access.expiryDate')}</TableHead>
                  <TableHead>{t('access.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((cred: any) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium">{cred.type}</TableCell>
                    <TableCell>{(cred.nameKey ? t(cred.nameKey) : cred.name)}</TableCell>
                    <TableCell>{cred.accessLevel}</TableCell>
                    <TableCell>{new Date(cred.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(cred.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(cred.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            <div>
              <CardTitle>{t('access.clearances')}</CardTitle>
              <CardDescription>
                {t('access.clearancesDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clearances.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('access.noClearances')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('access.type')}</TableHead>
                  <TableHead>{t('access.level')}</TableHead>
                  <TableHead>{t('access.issuedBy')}</TableHead>
                  <TableHead>{t('access.validUntil')}</TableHead>
                  <TableHead>{t('access.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clearances.map((clearance: any) => (
                  <TableRow key={clearance.id}>
                    <TableCell className="font-medium">{clearance.type}</TableCell>
                    <TableCell>{clearance.level}</TableCell>
                    <TableCell>{clearance.issuedBy}</TableCell>
                    <TableCell>{new Date(clearance.validUntil).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(clearance.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" aria-hidden="true" />
            <div>
              <CardTitle>{t('access.management')}</CardTitle>
              <CardDescription>
                {t('access.managementDescription')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('access.requestCredential')}</Label>
            <p className="text-sm text-muted-foreground mb-3">
              {t('access.requestDescription')}
            </p>
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('access.requestButton')}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>{t('access.backgroundCheck')}</Label>
            <p className="text-sm text-muted-foreground mb-3">
              {t('access.backgroundCheckDescription')}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="default">{t('profile.access.completed')}</Badge>
              <span className="text-sm text-muted-foreground">
                {t('profile.access.lastUpdated')} January 15, 2024
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{t('access.note')}</strong> {t('access.noteDescription')}
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {t('actions.saveChanges')}
        </Button>
      </div>
    </div>
  )
}
