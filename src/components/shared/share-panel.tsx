"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Share2, Copy, Mail, Link as LinkIcon, CheckCircle2, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SharePanelProps {
  onShare?: (type: string, data: any) => void
}

export function SharePanel({ onShare }: SharePanelProps) {
  const t = useTranslations()
  const [shareType, setShareType] = useState<"link" | "email">("link")
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [permission, setPermission] = useState("view")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const shareUrl = "https://app.dragonfly.com/share/abc123xyz"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = () => {
    setSent(true)
    if (onShare) {
      onShare("email", { email, message, permission })
    }
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="space-y-4">
      {/* Share Type */}
      <Label>Share Method</Label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={shareType === "link" ? "default" : "outline"}
          onClick={() => setShareType("link")}
          className="justify-start"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
        <Button
          variant={shareType === "email" ? "default" : "outline"}
          onClick={() => setShareType("email")}
          className="justify-start"
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </Button>
      </div>

      {/* Permission Level */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Access Level</Label>
        <RadioGroup value={permission} onValueChange={setPermission}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="view" id="permission-view" />
            <Label htmlFor="permission-view" className="flex items-center gap-2 cursor-pointer font-normal">
              <Globe className="h-4 w-4" />
              <div>
                <div>View only</div>
                <div className="text-xs text-muted-foreground">Recipients can view but not edit</div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="edit" id="permission-edit" />
            <Label htmlFor="permission-edit" className="flex items-center gap-2 cursor-pointer font-normal">
              <Share2 className="h-4 w-4" />
              <div>
                <div>Can edit</div>
                <div className="text-xs text-muted-foreground">Recipients can view and edit</div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="permission-admin" />
            <Label htmlFor="permission-admin" className="flex items-center gap-2 cursor-pointer font-normal">
              <Lock className="h-4 w-4" />
              <div>
                <div>Full access</div>
                <div className="text-xs text-muted-foreground">Recipients can manage all settings</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Link Sharing */}
      {shareType === "link" && (
        <div className="space-y-3 pt-4 border-t">
          <Label>Shareable Link</Label>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-sm" />
            <Button onClick={handleCopyLink} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Link copied to clipboard!</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span>Allow link sharing</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Require password</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Set expiration date</span>
            </label>
          </div>
        </div>
      )}

      {/* Email Sharing */}
      {shareType === "email" && (
        <div className="space-y-3 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="email-to">Email Address</Label>
            <Input
              id="email-to"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-message">Message (Optional)</Label>
            <Textarea
              id="email-message"
              placeholder="Add a personal message..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {sent && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Invitation sent successfully!</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleSendEmail} disabled={!email} className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      )}

      {/* Active Shares */}
      <div className="space-y-3 pt-4 border-t">
        <Label>People with Access</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                JD
              </div>
              <div className="text-sm">
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground">john@example.com</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                JS
              </div>
              <div className="text-sm">
                <div className="font-medium">Jane Smith</div>
                <div className="text-xs text-muted-foreground">jane@example.com</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
