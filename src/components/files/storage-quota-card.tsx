"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HardDrive, TrendingUp, AlertTriangle } from "lucide-react"
import { useStorageQuota } from "@/hooks/use-file-enterprise"
import { Badge } from "@/components/ui/badge"

interface StorageQuotaCardProps {
  workspaceId: string
  className?: string
}

export function StorageQuotaCard({ workspaceId, className }: StorageQuotaCardProps) {
  const { quota, loading } = useStorageQuota(workspaceId)

  if (loading || !quota) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage & Bandwidth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const storagePercent = (quota.storage_used_bytes / quota.storage_limit_bytes) * 100
  const bandwidthPercent = (quota.bandwidth_used_bytes / quota.bandwidth_limit_bytes) * 100

  const isStorageWarning = storagePercent > 80
  const isBandwidthWarning = bandwidthPercent > 80

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage & Bandwidth
        </CardTitle>
        <CardDescription>
          Workspace usage and limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Storage</span>
            <span className={isStorageWarning ? "text-destructive font-medium" : ""}>
              {formatBytes(quota.storage_used_bytes)} / {formatBytes(quota.storage_limit_bytes)}
            </span>
          </div>
          <Progress 
            value={Math.min(storagePercent, 100)} 
            className={isStorageWarning ? "bg-destructive/20" : ""}
          />
          {isStorageWarning && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              Storage quota {storagePercent > 100 ? 'exceeded' : 'nearly full'}
            </div>
          )}
        </div>

        {/* Bandwidth */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Bandwidth (This Month)</span>
            <span className={isBandwidthWarning ? "text-destructive font-medium" : ""}>
              {formatBytes(quota.bandwidth_used_bytes)} / {formatBytes(quota.bandwidth_limit_bytes)}
            </span>
          </div>
          <Progress 
            value={Math.min(bandwidthPercent, 100)}
            className={isBandwidthWarning ? "bg-destructive/20" : ""}
          />
          {isBandwidthWarning && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              Bandwidth quota {bandwidthPercent > 100 ? 'exceeded' : 'nearly exhausted'}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Resets on {new Date(quota.bandwidth_reset_at).toLocaleDateString()}
          </div>
        </div>

        {/* File Count */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Files</span>
            <Badge variant="outline">
              {quota.current_file_count.toLocaleString()} / {quota.file_count_limit.toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* Settings */}
        <div className="pt-2 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Version retention:</span>
            <span>{quota.version_retention_days} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Trash retention:</span>
            <span>{quota.trash_retention_days} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
