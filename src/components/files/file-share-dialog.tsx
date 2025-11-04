"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, X, Link2, Users, Calendar } from "lucide-react"
import { useFilePermissions } from "@/hooks/use-file-collaboration"
import { addFilePermission, generateFileShareLink } from "@/hooks/use-file-collaboration"
import { useTranslations } from "next-intl"

interface FileShareDialogProps {
  fileId: string
  fileName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileShareDialog({ fileId, fileName, open, onOpenChange }: FileShareDialogProps) {
  const t = useTranslations('files')
  const [shareEmail, setShareEmail] = useState("")
  const [permissionLevel, setPermissionLevel] = useState<"viewer" | "commenter" | "editor">("viewer")
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { permissions, loading: permissionsLoading } = useFilePermissions(fileId)

  const handleShare = async () => {
    if (!shareEmail) return
    
    setLoading(true)
    try {
      // In production, you'd lookup the user by email first
      // For now, this is a placeholder
      await addFilePermission(fileId, shareEmail, permissionLevel)
      setShareEmail("")
    } catch (error: any) {
      console.error("Error sharing file:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setLoading(true)
    try {
      const link = await generateFileShareLink(fileId)
      if (link) {
        setShareLink(`${window.location.origin}/files/shared/${link}`)
      }
    } catch (error: any) {
      console.error("Error generating share link:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPermissionBadge = (level: string) => {
    const badges = {
      owner: { label: "Owner", variant: "default" as const },
      editor: { label: "Can Edit", variant: "secondary" as const },
      commenter: { label: "Can Comment", variant: "outline" as const },
      viewer: { label: "View Only", variant: "outline" as const }
    }
    return badges[level as keyof typeof badges] || badges.viewer
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share &quot;{fileName}&quot;</DialogTitle>
          <DialogDescription>
            Share this file with others or generate a public link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 lg:space-y-6 py-4">
          {/* Add people */}
          <div className="space-y-3">
            <Label>Share with people</Label>
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder={t('files.share.emailPlaceholder')}
                value={shareEmail as any}
                onChange={(e) => setShareEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
              />
              <Select value={permissionLevel as any} onValueChange={(value: any) => setPermissionLevel(value)}>
                <SelectTrigger className="w-full max-w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">View Only</SelectItem>
                  <SelectItem value="commenter">Can Comment</SelectItem>
                  <SelectItem value="editor">Can Edit</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleShare} disabled={!shareEmail || loading}>
                Share
              </Button>
            </div>
          </div>

          {/* Current permissions */}
          {permissions.length > 0 && (
            <div className="space-y-3">
              <Label>People with access</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {permissions.map((perm: any) => (
                  <div key={perm.id} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-2 rounded-lg border">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={perm.user?.avatar_url} />
                        <AvatarFallback>
                          {perm.user?.first_name?.[0]}{perm.user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {perm.user?.first_name} {perm.user?.last_name}
                        </p>
                        {perm.expires_at && (
                          <p className="text-xs text-muted-foreground flex flex-wrap flex-col md:flex-row items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Expires {new Date(perm.expires_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <Badge variant={getPermissionBadge(perm.permission_level).variant}>
                        {getPermissionBadge(perm.permission_level).label}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate link */}
          <div className="space-y-3 pt-3 border-t">
            <Label>Share via link</Label>
            {!shareLink ? (
              <Button 
                variant="outline" 
                className="w-full max-w-full" 
                onClick={handleGenerateLink}
                disabled={loading}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Input value={shareLink as any} readOnly className="font-mono text-sm" />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4 flex-shrink-0" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Anyone with the link can view this file
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
