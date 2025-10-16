"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Shield, 
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Plus,
  Trash2,
  Globe,
  Clock
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function SecurityTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [ssoEnabled, setSsoEnabled] = useState(false)
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("24")

  const [ipWhitelist] = useState([
    { id: "1", ip: "192.168.1.0/24", description: t('admin.mockData.network1Desc'), addedAt: "2024-01-15" },
    { id: "2", ip: "203.0.113.0/24", description: t('admin.mockData.network2Desc'), addedAt: "2024-01-20" },
  ])

  const [auditLogs] = useState([
    { id: "1", event: "User login", user: "john.doe@example.com", ip: "192.168.1.100", timestamp: "2024-01-20 14:23:45", status: "success" },
    { id: "2", event: "Password changed", user: "jane.smith@example.com", ip: "192.168.1.101", timestamp: "2024-01-20 13:15:22", status: "success" },
    { id: "3", event: "Failed login attempt", user: "unknown@example.com", ip: "198.51.100.42", timestamp: "2024-01-20 12:04:18", status: "failed" },
    { id: "4", event: "Role changed", user: "admin@example.com", ip: "192.168.1.100", timestamp: "2024-01-20 10:45:33", status: "success" },
    { id: "5", event: "API token created", user: "mike.chen@example.com", ip: "192.168.1.105", timestamp: "2024-01-20 09:12:56", status: "success" },
  ])

  const handleSaveChanges = async () => {
    toast({
      title: t('admin.toast.securityUpdated'),
      description: t('admin.toast.securityUpdatedDesc'),
    })
  }

  const handleExportLogs = async () => {
    toast({
      title: t('admin.toast.exportStarted'),
      description: t('admin.toast.exportStartedDesc'),
    })
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('admin.configureAuth')}
        </p>
        <Button variant="outline" size="sm" onClick={handleSaveChanges}>
          <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('admin.securityTab.saveChanges')}
        </Button>
      </div>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-5 w-5" aria-hidden="true" />
            {t('admin.securityTab.authentication')}
          </CardTitle>
          <CardDescription>
            {t('admin.securityTab.authDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="h-4 w-4" />
                <span className="font-medium">{t('admin.securityTab.twoFactor')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('admin.securityTab.twoFactorDescription')}
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Key className="h-4 w-4" />
                <span className="font-medium">{t('admin.securityTab.sso')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('admin.securityTab.ssoDescription')}
              </p>
            </div>
            <Switch
              checked={ssoEnabled}
              onCheckedChange={setSsoEnabled}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('admin.securityTab.sessionTimeout')}</Label>
            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('admin.securityTab.sessionTimeoutDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Password Requirements</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Minimum 8 characters</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Uppercase & lowercase</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Numbers required</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Special characters</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Restrictions */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5" aria-hidden="true" />
                {t('admin.securityTab.ipRestrictions')}
              </CardTitle>
              <CardDescription className="mt-2">
                {t('admin.securityTab.restrictAccess')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('admin.securityTab.addIp')}
              </Button>
              <Switch
                checked={ipRestrictionEnabled}
                onCheckedChange={setIpRestrictionEnabled}
              />
            </div>
          </div>
        </CardHeader>
        {ipRestrictionEnabled && (
          <CardContent>
            <div className="space-y-3">
              {ipWhitelist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.ip}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description} • Added {item.addedAt}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-5 w-5" aria-hidden="true" />
                {t('admin.securityTab.auditLogs')}
              </CardTitle>
              <CardDescription className="mt-2">
                {t('admin.securityTab.securityEvents')}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('admin.securityTab.exportLogs')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {log.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.event}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.ip}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={log.status === "success" ? "default" : "destructive"}>
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            {t('admin.securityTab.securityAlerts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">3 failed login attempts detected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Multiple failed login attempts from IP 198.51.100.42 in the last hour
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>
          <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('admin.securityTab.saveSecuritySettings')}
        </Button>
      </div>
    </div>
  )
}
