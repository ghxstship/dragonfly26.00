"use client"

import { useTranslations } from "next-intl"
import { Copy, MoreHorizontal, Eye, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { APIToken } from "@/types"

interface APITokensListProps {
  tokens: APIToken[]
}

export function APITokensList({ tokens }: APITokensListProps) {
  const t = useTranslations()
  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4">
      {tokens.map((token: any) => (
        <Card key={token.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{token.name}</h3>
                  {token.is_active ? (
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{token.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {token.token_prefix}••••••••••••
                    </code>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy token</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{token.scopes.length} scopes</span>
                    <span>{token.rate_limit_per_hour.toLocaleString()} req/hr</span>
                    <span>{token.usage_count.toLocaleString()} requests</span>
                    {token.last_used_at && (
                      <span>Last: {new Date(token.last_used_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Token
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Scopes</DropdownMenuItem>
                  <DropdownMenuItem>
                    {token.is_active ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Revoke Token</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </TooltipProvider>
  )
}
