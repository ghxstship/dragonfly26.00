"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Key, 
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface ApiToken {
  id: string
  name: string
  token: string
  scope: string
  createdAt: string
  lastUsed?: string
  expiresAt?: string
  status: "active" | "expired" | "revoked"
}

export function ApiTokensTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTokenDialogOpen, setNewTokenDialogOpen] = useState(false)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set())

  const [tokens, setTokens] = useState<ApiToken[]>([
    {
      id: "1",
      name: t('admin.mockData.token1Name'),
      token: "dfsk_live_abc123def456ghi789jkl012mno345pqr678",
      scope: "read:write",
      createdAt: "2024-01-15",
      lastUsed: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      name: t('admin.mockData.token2Name'),
      token: "dfsk_live_xyz789abc123def456ghi789jkl012mno345",
      scope: "read",
      createdAt: "2024-01-10",
      lastUsed: "5 minutes ago",
      status: "active",
    },
    {
      id: "3",
      name: t('admin.mockData.token3Name'),
      token: "dfsk_live_def456ghi789jkl012mno345pqr678stu901",
      scope: "read:write",
      createdAt: "2023-11-20",
      lastUsed: "30 days ago",
      status: "active",
    },
  ])

  const handleCreateToken = async () => {
    const newToken = `dfsk_live_${Math.random().toString(36).substring(2, 40)}`
    setGeneratedToken(newToken)
    setDialogOpen(false)
    setNewTokenDialogOpen(true)
  }

  const handleRevokeToken = (tokenId: string) => {
    setTokens(tokens.map(t => 
      t.id === tokenId ? { ...t, status: "revoked" as const } : t
    ))
    toast({
      title: t('admin.toast.tokenRevoked'),
      description: t('admin.toast.tokenRevokedDesc'),
      variant: "destructive",
    })
  }

  const handleDeleteToken = (tokenId: string) => {
    setTokens(tokens.filter(t => (t as any).id !== tokenId))
    toast({
      title: t('admin.toast.tokenDeleted'),
      description: t('admin.toast.tokenDeletedDesc'),
      variant: "destructive",
    })
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast({
      title: t('admin.toast.tokenCopied'),
      description: t('admin.toast.tokenCopiedDesc'),
    })
  }

  const toggleTokenVisibility = (tokenId: string) => {
    setVisibleTokens(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId)
      } else {
        newSet.add(tokenId)
      }
      return newSet
    })
  }

  const maskToken = (token: string) => {
    return `${token.substring(0, 15)}${'•'.repeat(20)}${token.substring(token.length - 4)}`
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.apiTokensTab.totalTokens')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{tokens.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.apiTokensTab.activeTokens')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {tokens.filter(t => (t as any).status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.apiTokensTab.apiCallsMonth')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">12.4k</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tokens List */}
      <div className="space-y-3">
        {tokens.map((token: any) => {
          const isVisible = visibleTokens.has(token.id)
          return (
            <Card key={token.id}>
              <CardHeader>
                <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 mb-2">
                      <CardTitle className="text-base">{token.name}</CardTitle>
                      <Badge variant={
                        (token as any).status === "active" ? "default" :
                        (token as any).status === "expired" ? "secondary" :
                        "destructive"
                      }>
                        {(token as any).status === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{token.scope}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded text-xs font-mono">
                          {isVisible ? token.token : maskToken(token.token)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTokenVisibility(token.id)}
                          aria-label={isVisible ? t('admin.apiTokensTab.hideToken') : t('admin.apiTokensTab.showToken')}
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyToken(token.token)}
                          aria-label={t('admin.apiTokensTab.copyToken')}
                        >
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-xs text-muted-foreground">
                        <span>{t('admin.apiTokensTab.created')} {token.createdAt}</span>
                        {token.lastUsed && (
                          <>
                            <span>•</span>
                            <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {t('admin.apiTokensTab.lastUsed')} {token.lastUsed}
                            </div>
                          </>
                        )}
                        {token.expiresAt && (
                          <>
                            <span>•</span>
                            <span>{t('admin.apiTokensTab.expires')} {token.expiresAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-end gap-2">
                  {(token as any).status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeToken(token.id)}
                      aria-label={`${t('admin.apiTokensTab.revoke')} ${token.name}`}
                    >
                      {t('admin.apiTokensTab.revoke')}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteToken(token.id)}
                    aria-label={`${t('admin.apiTokensTab.delete')} ${token.name}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('admin.apiTokensTab.delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Security Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('admin.apiTokensTab.securityBestPractices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs text-amber-900 dark:text-amber-100">
                <p className="font-medium mb-1">{t('admin.apiTokensTab.warningTitle')}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('admin.apiTokensTab.warningItem1')}</li>
                  <li>{t('admin.apiTokensTab.warningItem2')}</li>
                  <li>{t('admin.apiTokensTab.warningItem3')}</li>
                  <li>{t('admin.apiTokensTab.warningItem4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Token Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.apiTokensTab.createToken')}</DialogTitle>
            <DialogDescription>
              {t('admin.apiTokensTab.createTokenDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('admin.apiTokensTab.tokenName')}</Label>
              <Input placeholder={t('admin.apiTokensTab.tokenNamePlaceholder')} aria-required="true" />
              <p className="text-xs text-muted-foreground">
                {t('admin.apiTokensTab.tokenNameDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.apiTokensTab.scope')}</Label>
              <Select defaultValue="read">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">{t('admin.apiTokensTab.scopeRead')}</SelectItem>
                  <SelectItem value="read:write">{t('admin.apiTokensTab.scopeReadWrite')}</SelectItem>
                  <SelectItem value="admin">{t('admin.apiTokensTab.scopeAdmin')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('admin.apiTokensTab.scopeDescription')}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.apiTokensTab.expiry')}</Label>
              <Select defaultValue="never">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">{t('admin.apiTokensTab.expiry7days')}</SelectItem>
                  <SelectItem value="30">{t('admin.apiTokensTab.expiry30days')}</SelectItem>
                  <SelectItem value="90">{t('admin.apiTokensTab.expiry90days')}</SelectItem>
                  <SelectItem value="365">{t('admin.apiTokensTab.expiry1year')}</SelectItem>
                  <SelectItem value="never">{t('admin.apiTokensTab.expiryNever')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreateToken}>
              <Key className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('admin.apiTokensTab.generateToken')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Token Display Dialog */}
      <Dialog open={newTokenDialogOpen} onOpenChange={setNewTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token Generated Successfully</DialogTitle>
            <DialogDescription>
              Make sure to copy your token now. You won&apos;t be able to see it again!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Your New API Token</Label>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-xs font-mono break-all">
                  {generatedToken}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => generatedToken && handleCopyToken(generatedToken)}
                  aria-label={t('admin.apiTokensTab.copyToken')}
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 dark:text-amber-100">
                Store this token securely. For security reasons, it won&apos;t be shown again.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setNewTokenDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
