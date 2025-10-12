"use client"

import { useState } from "react"
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
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      id: "1",
      type: "Venue Access",
      name: "Madison Square Garden - Backstage Pass",
      issueDate: "2024-01-15",
      expiryDate: "2024-12-31",
      status: "active",
      accessLevel: "Full Access",
    },
    {
      id: "2",
      type: "Equipment Authorization",
      name: "Forklift Operator License",
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

  const handleSave = () => {
    console.log("Saving access data:", { credentials, clearances })
    // TODO: Save to Supabase
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <div>
              <CardTitle>Active Credentials</CardTitle>
              <CardDescription>
                Current access credentials, badges, and authorizations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active credentials on file
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((cred) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium">{cred.type}</TableCell>
                    <TableCell>{cred.name}</TableCell>
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
            <Shield className="h-5 w-5" />
            <div>
              <CardTitle>Security Clearances</CardTitle>
              <CardDescription>
                Government and organization security clearances
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clearances.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No security clearances on file
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Issued By</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clearances.map((clearance) => (
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
            <Lock className="h-5 w-5" />
            <div>
              <CardTitle>Access Management</CardTitle>
              <CardDescription>
                Manage your credential requests and access permissions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Request New Credential</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Need access to a venue, equipment, or secure area? Submit a credential request to
              your organization administrator.
            </p>
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Request Credential
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Background Check Status</Label>
            <p className="text-sm text-muted-foreground mb-3">
              View the status of your background check and security screening.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="default">Completed</Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: January 15, 2024
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Credentials and clearances are managed by your organization
          administrators. Contact your admin team if you need to update or renew any access
          credentials. Some credentials may require periodic renewal or re-verification.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
