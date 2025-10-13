"use client"

import { useState } from "react"
import { Plus, Key, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { APITokensList } from "@/components/api-tokens/tokens-list"
import { CreateTokenDialog } from "@/components/api-tokens/create-token-dialog"
import type { APIToken } from "@/types"

const mockTokens: APIToken[] = [
  {
    id: "1",
    organization_id: "org-1",
    name: "Production API",
    description: "Main production integration",
    token_hash: "hashed_token_1",
    token_prefix: "tok_prod",
    scopes: ["read:projects", "write:tasks", "read:users"],
    rate_limit_per_hour: 1000,
    last_used_at: "2025-01-15T10:30:00Z",
    usage_count: 5234,
    is_active: true,
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    organization_id: "org-1",
    name: "Mobile App",
    description: "iOS and Android app access",
    token_hash: "hashed_token_2",
    token_prefix: "tok_mobi",
    scopes: ["read:projects", "read:tasks"],
    rate_limit_per_hour: 500,
    last_used_at: "2025-01-14T22:15:00Z",
    usage_count: 12456,
    is_active: true,
    created_by: "user-1",
    created_at: "2024-12-01T00:00:00Z",
  },
]

export function APITokensPageContent() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const activeTokens = mockTokens.filter((t) => t.is_active).length
  const totalRequests = mockTokens.reduce((sum, t) => sum + t.usage_count, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Tokens</h1>
            <p className="text-muted-foreground mt-2">
              Manage API access for external integrations
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Token
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                  <p className="text-2xl font-bold">{mockTokens.length}</p>
                </div>
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeTokens}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{totalRequests.toLocaleString()}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <APITokensList tokens={mockTokens} />
      </div>

      {/* Dialogs */}
      <CreateTokenDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  )
}
