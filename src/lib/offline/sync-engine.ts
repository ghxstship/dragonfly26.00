/**
 * Offline Sync Engine
 * Handles bidirectional sync between client and server
 */

import type { SyncState, SyncLog, OfflineQueueItem, SyncConflict } from '@/types'

interface SyncOptions {
  organizationId: string
  deviceId: string
  batchSize?: number
  conflictResolution?: 'server_wins' | 'client_wins' | 'manual'
}

export class SyncEngine {
  private deviceId: string
  private organizationId: string
  private syncInterval: NodeJS.Timeout | null = null
  private isSyncing = false

  constructor(private options: SyncOptions) {
    this.deviceId = options.deviceId
    this.organizationId = options.organizationId
  }

  /**
   * Start automatic background sync
   */
  async startAutoSync(intervalMs: number = 30000) {
    if (this.syncInterval) {
      return
    }

    // Initial sync
    await this.sync()

    // Schedule periodic syncs
    this.syncInterval = setInterval(async () => {
      if (!this.isSyncing && navigator.onLine) {
        await this.sync()
      }
    }, intervalMs)
  }

  /**
   * Stop automatic background sync
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  /**
   * Perform bidirectional sync
   */
  async sync(): Promise<{ success: boolean; conflicts?: SyncConflict[] }> {
    if (this.isSyncing) {
      console.log('[Sync] Already syncing, skipping')
      return { success: false }
    }

    this.isSyncing = true

    try {
      console.log('[Sync] Starting sync...')

      // 1. Get current sync state
      const syncState = await this.getSyncState()

      // 2. Upload local changes
      await this.uploadLocalChanges()

      // 3. Download remote changes
      const { changes, conflicts } = await this.downloadRemoteChanges(
        syncState.last_sync_generation ?? 0
      )

      // 4. Apply remote changes locally
      await this.applyRemoteChanges(changes)

      // 5. Update sync state
      await this.updateSyncState(changes.length > 0 ? changes[changes.length - 1].sync_generation ?? 0 : syncState.last_sync_generation ?? 0)

      console.log(`[Sync] Completed: ${changes.length} changes applied, ${conflicts.length} conflicts`)

      return {
        success: true,
        conflicts: conflicts.length > 0 ? conflicts : undefined,
      }
    } catch (error) {
      console.error('[Sync] Error:', error)
      return { success: false }
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Get sync state for this device
   */
  private async getSyncState(): Promise<SyncState> {
    const response = await fetch('/api/sync/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: this.deviceId,
        organization_id: this.organizationId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get sync state')
    }

    const data = await response.json()
    return data.syncState || {
      last_sync_generation: 0,
      pending_changes_count: 0,
    }
  }

  /**
   * Upload local changes to server
   */
  private async uploadLocalChanges(): Promise<void> {
    // Get pending items from offline queue
    const pendingItems = await this.getPendingQueueItems()

    if (pendingItems.length === 0) {
      return
    }

    console.log(`[Sync] Uploading ${pendingItems.length} local changes`)

    // Process in batches
    const batchSize = this.options.batchSize || 20
    for (let i = 0; i < pendingItems.length; i += batchSize) {
      const batch = pendingItems.slice(i, i + batchSize)
      await this.uploadBatch(batch)
    }
  }

  /**
   * Upload a batch of changes
   */
  private async uploadBatch(items: OfflineQueueItem[]): Promise<void> {
    const response = await fetch('/api/sync/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: this.deviceId,
        organization_id: this.organizationId,
        changes: items,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to upload changes')
    }

    // Mark items as synced
    const { processed, failed } = await response.json()
    await this.markItemsProcessed(processed, failed)
  }

  /**
   * Download remote changes from server
   */
  private async downloadRemoteChanges(
    lastGeneration: number
  ): Promise<{ changes: SyncLog[]; conflicts: SyncConflict[] }> {
    const response = await fetch('/api/sync/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: this.deviceId,
        organization_id: this.organizationId,
        last_generation: lastGeneration,
        limit: this.options.batchSize || 100,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to download changes')
    }

    return response.json()
  }

  /**
   * Apply remote changes to local database
   */
  private async applyRemoteChanges(changes: SyncLog[]): Promise<void> {
    for (const change of changes) {
      try {
        await this.applyChange(change)
      } catch (error) {
        console.error('[Sync] Failed to apply change:', change, error)
      }
    }
  }

  /**
   * Apply a single change
   */
  private async applyChange(change: SyncLog): Promise<void> {
    const { table_name, record_id, operation, new_data } = change

    // Store in IndexedDB or local state
    // This is a simplified version - actual implementation would use IndexedDB
    console.log(`[Sync] Applying ${operation} on ${table_name}/${record_id}`)

    // Trigger UI updates
    window.dispatchEvent(
      new CustomEvent('sync:change', {
        detail: { table: table_name, id: record_id, operation, data: new_data },
      })
    )
  }

  /**
   * Update sync state after successful sync
   */
  private async updateSyncState(generation: number): Promise<void> {
    await fetch('/api/sync/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: this.deviceId,
        organization_id: this.organizationId,
        last_sync_generation: generation,
      }),
    })
  }

  /**
   * Get pending items from offline queue
   */
  private async getPendingQueueItems(): Promise<OfflineQueueItem[]> {
    // In production, this would query IndexedDB
    return []
  }

  /**
   * Mark items as processed
   */
  private async markItemsProcessed(
    processed: string[],
    failed: string[]
  ): Promise<void> {
    // Update IndexedDB offline queue
    console.log(`[Sync] Processed: ${processed.length}, Failed: ${failed.length}`)
  }

  /**
   * Queue an offline operation
   */
  async queueOperation(operation: Omit<OfflineQueueItem, 'id' | 'user_id' | 'device_id' | 'created_at' | 'scheduled_at'>): Promise<void> {
    // Add to IndexedDB queue
    console.log('[Sync] Queued operation:', operation.operation_type)

    // Trigger sync if online
    if (navigator.onLine) {
      await this.sync()
    }
  }

  /**
   * Resolve a conflict
   */
  async resolveConflict(
    conflictId: string,
    strategy: 'server_wins' | 'client_wins' | 'manual',
    resolvedValue?: any
  ): Promise<void> {
    await fetch('/api/sync/resolve-conflict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conflict_id: conflictId,
        strategy,
        resolved_value: resolvedValue,
      }),
    })

    // Trigger sync to apply resolution
    await this.sync()
  }
}

// Singleton instance
let syncEngineInstance: SyncEngine | null = null

export function initializeSyncEngine(options: SyncOptions): SyncEngine {
  if (!syncEngineInstance) {
    syncEngineInstance = new SyncEngine(options)
  }
  return syncEngineInstance
}

export function getSyncEngine(): SyncEngine | null {
  return syncEngineInstance
}
