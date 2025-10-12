"use client"

import { useState } from "react"
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
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTokenDialogOpen, setNewTokenDialogOpen] = useState(false)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set())

  const [tokens, setTokens] = useState<ApiToken[]>([
    {
      id: "1",
      name: "Production API",
      token: "dfsk_live_abc123def456ghi789jkl012mno345pqr678",
      scope: "read:write",
      createdAt: "2024-01-15",
      lastUsed: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      name: "Analytics Integration",
      token: "dfsk_live_xyz789abc123def456ghi789jkl012mno345",
      scope: "read",
      createdAt: "2024-01-10",
      lastUsed: "5 minutes ago",
      status: "active",
    },
    {
      id: "3",
      name: "Mobile App (Legacy)",
      token: "dfsk_live_def456ghi789jkl012mno345pqr678stu901",
      scope: "read:write",
      createdAt: "2023-11-20",
      lastUsed: "30 days ago",
      status: "active",
    },
  ])

  const handleCreateToken = () => {
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
      title: "Token revoked",
      description: "The API token has been revoked and can no longer be used.",
      variant: "destructive",
    })
  }

  const handleDeleteToken = (tokenId: string) => {
    setTokens(tokens.filter(t => t.id !== tokenId))
    toast({
      title: "Token deleted",
      description: "The API token has been permanently deleted.",
      variant: "destructive",
    })
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast({
      title: "Token copied",
      description: "API token has been copied to clipboard.",
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Token
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tokens</CardDescription>
            <CardTitle className="text-3xl">{tokens.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Tokens</CardDescription>
            <CardTitle className="text-3xl">
              {tokens.filter(t => t.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>API Calls (30 days)</CardDescription>
            <CardTitle className="text-3xl">12.4k</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tokens List */}
      <div className="space-y-3">
        {tokens.map((token) => {
          const isVisible = visibleTokens.has(token.id)
          return (
            <Card key={token.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-base">{token.name}</CardTitle>
                      <Badge variant={
                        token.status === "active" ? "default" :
                        token.status === "expired" ? "secondary" :
                        "destructive"
                      }>
                        {token.status === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">{token.scope}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded text-xs font-mono">
                          {isVisible ? token.token : maskToken(token.token)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTokenVisibility(token.id)}
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyToken(token.token)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created {token.createdAt}</span>
                        {token.lastUsed && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last used {token.lastUsed}
                            </div>
                          </>
                        )}
                        {token.expiresAt && (
                          <>
                            <span>•</span>
                            <span>Expires {token.expiresAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  {token.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeToken(token.id)}
                    >
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteToken(token.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
          <CardTitle className="text-base">Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-100">
                <p className="font-medium mb-1">Keep your tokens secure</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Never commit tokens to version control</li>
                  <li>Rotate tokens regularly</li>
                  <li>Use read-only scopes when possible</li>
                  <li>Revoke tokens immediately if compromised</li>
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
            <DialogTitle>Generate New API Token</DialogTitle>
            <DialogDescription>
              Create a new token for API access
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Token Name</Label>
              <Input placeholder="e.g., Production API" />
              <p className="text-xs text-muted-foreground">
                A descriptive name to identify this token
              </p>
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select defaultValue="read">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="read:write">Read & Write</SelectItem>
                  <SelectItem value="admin">Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Define what this token can access
              </p>
            </div>

            <div className="space-y-2">
              <Label>Expiration (Optional)</Label>
              <Select defaultValue="never">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateToken}>
              <Key className="h-4 w-4 mr-2" />
              Generate Token
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
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-xs font-mono break-all">
                  {generatedToken}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => generatedToken && handleCopyToken(generatedToken)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
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
