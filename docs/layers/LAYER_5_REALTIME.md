# Layer 5: Real-time Configuration

**Consolidated from**: LAYER_5_REALTIME_CONFIG.md  
**Status**: ✅ Complete - All tables configured  
**Last Updated**: October 13, 2025

---

## Overview

Supabase Real-time configuration for live collaboration, presence tracking, and instant updates across all modules.

---

## 📡 Realtime Publication

### Status
✅ **All 40+ key tables configured for real-time broadcasting**

### Core Tables
- ✅ `organizations`
- ✅ `workspaces`
- ✅ `organization_members`
- ✅ `activities`
- ✅ `comments`
- ✅ `user_presence`
- ✅ `notifications`

### Module Tables
- ✅ `productions` - Project updates
- ✅ `project_tasks` - Task changes
- ✅ `project_milestones` - Milestone progress
- ✅ `events` - Event scheduling
- ✅ `run_of_show` - Cue sheet updates
- ✅ `bookings` - Booking status
- ✅ `incidents` - Incident reports
- ✅ `personnel` - Staff changes
- ✅ `teams` - Team composition
- ✅ `time_entries` - Time tracking
- ✅ `assets` - Equipment status
- ✅ `asset_transactions` - Check-in/out
- ✅ `locations` - Location updates
- ✅ `files` - Document changes
- ✅ `companies` - Company data
- ✅ `budgets` - Budget updates
- ✅ `financial_transactions` - Financial activity
- ✅ `invoices` - Invoice status
- ✅ `purchase_orders` - PO changes
- ✅ `approval_requests` - Approval workflow
- ✅ `community_posts` - Community activity
- ✅ `connections` - User connections
- ✅ `marketplace_orders` - Order updates

---

## 🎯 Client-Side Implementation

### 1. Production Updates

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Subscribe to production changes
const productionChannel = supabase
  .channel('production-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'productions',
      filter: `workspace_id=eq.${workspaceId}`
    },
    (payload) => {
      console.log('Production changed:', payload)
      // Update UI based on payload.eventType
      if (payload.eventType === 'INSERT') {
        addProductionToList(payload.new)
      } else if (payload.eventType === 'UPDATE') {
        updateProductionInList(payload.new)
      } else if (payload.eventType === 'DELETE') {
        removeProductionFromList(payload.old.id)
      }
    }
  )
  .subscribe()
```

### 2. Task Board Real-time

```typescript
// Real-time Kanban board
const taskChannel = supabase
  .channel('task-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'project_tasks',
      filter: `production_id=eq.${productionId}`
    },
    (payload) => {
      // Update Kanban board
      if (payload.eventType === 'INSERT') {
        addTaskToBoard(payload.new)
      } else if (payload.eventType === 'UPDATE') {
        updateTaskOnBoard(payload.new)
      } else if (payload.eventType === 'DELETE') {
        removeTaskFromBoard(payload.old.id)
      }
    }
  )
  .subscribe()
```

### 3. User Presence Tracking

```typescript
// Track active users
const presenceChannel = supabase
  .channel('workspace-presence')
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState()
    console.log('Online users:', state)
    updateActiveUsersList(state)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', newPresences)
    showUserJoinedNotification(newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', leftPresences)
    showUserLeftNotification(leftPresences)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      // Broadcast current user's presence
      await presenceChannel.track({
        user_id: currentUser.id,
        user_name: currentUser.name,
        avatar_url: currentUser.avatar_url,
        online_at: new Date().toISOString(),
        location: window.location.pathname
      })
    }
  })
```

### 4. Live Notifications

```typescript
// Real-time notification delivery
const notificationChannel = supabase
  .channel('user-notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${currentUserId}`
    },
    (payload) => {
      // Show toast notification
      showNotification({
        title: payload.new.title,
        message: payload.new.message,
        type: payload.new.type
      })
      
      // Update notification count
      incrementUnreadCount()
    }
  )
  .subscribe()
```

### 5. Collaborative Editing

```typescript
// Live cursor positions for collaborative editing
const collaborationChannel = supabase
  .channel(`document:${documentId}`)
  .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
    updateCursor(payload.userId, payload.position)
  })
  .on('broadcast', { event: 'selection-change' }, ({ payload }) => {
    updateSelection(payload.userId, payload.selection)
  })
  .subscribe()

// Broadcast cursor movements
function onCursorMove(position: { x: number; y: number }) {
  collaborationChannel.send({
    type: 'broadcast',
    event: 'cursor-move',
    payload: { 
      userId: currentUser.id,
      userName: currentUser.name,
      position 
    }
  })
}
```

### 6. Budget Updates

```typescript
// Real-time budget tracking
const budgetChannel = supabase
  .channel('budget-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'budgets',
      filter: `production_id=eq.${productionId}`
    },
    (payload) => {
      updateBudgetDisplay(payload.new)
      checkBudgetAlerts(payload.new)
    }
  )
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'financial_transactions',
      filter: `production_id=eq.${productionId}`
    },
    (payload) => {
      addTransactionToList(payload.new)
      updateBudgetTotals()
    }
  )
  .subscribe()
```

---

## 🔧 Connection State Management

```typescript
// Handle connection state changes
supabase.channel('system').subscribe((status) => {
  switch (status) {
    case 'SUBSCRIBED':
      console.log('✅ Connected to Realtime')
      setConnectionStatus('connected')
      break
    case 'CHANNEL_ERROR':
      console.log('❌ Channel error')
      setConnectionStatus('error')
      showReconnectingToast()
      break
    case 'TIMED_OUT':
      console.log('⏱️ Connection timeout')
      setConnectionStatus('timeout')
      attemptReconnect()
      break
    case 'CLOSED':
      console.log('🔌 Disconnected')
      setConnectionStatus('disconnected')
      showOfflineMode()
      break
  }
})
```

---

## 📊 Optimistic UI Updates

```typescript
// Optimistic update pattern
async function updateTask(taskId: string, updates: Partial<Task>) {
  // 1. Update UI immediately (optimistic)
  const previousState = getTaskState(taskId)
  updateTaskInState(taskId, updates)
  
  try {
    // 2. Send to database
    const { error } = await supabase
      .from('project_tasks')
      .update(updates)
      .eq('id', taskId)
    
    if (error) throw error
    
    // 3. Real-time subscription will sync actual value from server
    // No need to fetch again - let real-time handle it
  } catch (error) {
    // 4. Rollback on error
    updateTaskInState(taskId, previousState)
    showError('Failed to update task')
  }
}
```

---

## 🎨 Conflict Resolution

```typescript
// Last-write-wins with timestamp
async function handleConflict(local: any, remote: any) {
  if (new Date(remote.updated_at) > new Date(local.updated_at)) {
    // Remote is newer, accept remote changes
    return remote
  } else {
    // Local is newer, keep local changes
    // Optionally: show merge UI for user decision
    return local
  }
}

// Alternative: Operational Transform for text editing
function applyOperationalTransform(localOps: Operation[], remoteOps: Operation[]) {
  // Transform operations against each other
  const transformedLocal = transform(localOps, remoteOps)
  const transformedRemote = transform(remoteOps, localOps)
  
  // Apply both sets of operations
  applyOperations(transformedLocal)
  applyOperations(transformedRemote)
}
```

---

## ⚡ Performance Tips

### Best Practices
1. **Filter subscriptions** - Only subscribe to data you need
   ```typescript
   filter: `workspace_id=eq.${workspaceId} AND status=eq.active`
   ```

2. **Unsubscribe when unmounting** - Prevent memory leaks
   ```typescript
   useEffect(() => {
     const channel = supabase.channel('my-channel')
     // ... setup subscription
     
     return () => {
       supabase.removeChannel(channel)
     }
   }, [])
   ```

3. **Batch updates** - Use debouncing for frequent changes
   ```typescript
   const debouncedUpdate = useDebouncedCallback((data) => {
     supabase.from('table').update(data)
   }, 500)
   ```

4. **Use presence for ephemeral data** - Don't store in database
   ```typescript
   // Cursor positions, typing indicators, etc.
   channel.track({ typing: true })
   ```

5. **Limit channel count** - Reuse channels when possible
   ```typescript
   // Instead of one channel per item, use one channel per module
   const moduleChannel = supabase
     .channel(`module:${moduleName}`)
     .on('postgres_changes', { 
       schema: 'public', 
       table: tableName,
       filter: `workspace_id=eq.${workspaceId}`
     }, handler)
   ```

### Performance Metrics
- **Latency**: < 100ms for local updates
- **Channel Limit**: 100 concurrent channels per client (recommended: < 20)
- **Message Size**: Keep broadcast messages < 250KB
- **Presence Updates**: Throttle to max 1 update per second

---

## 🧪 Testing Real-time

### Basic Test
```typescript
async function testRealtime() {
  const testChannel = supabase
    .channel('test')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'notifications' 
    }, (payload) => {
      console.log('✅ Received:', payload)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Insert test notification
        await supabase.from('notifications').insert({
          user_id: currentUser.id,
          type: 'test',
          title: 'Test',
          message: 'Testing realtime'
        })
      }
    })
}
```

### Multi-Tab Test
```typescript
// Open two browser tabs
// Tab 1: Subscribe to changes
// Tab 2: Make a change
// Tab 1 should receive update instantly
```

---

## 🔐 Security Considerations

### RLS Integration
- Real-time respects Row Level Security policies
- Users only receive updates for data they can access
- Policies evaluated on each broadcast

### Authentication
```typescript
// Always use authenticated client
const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
```

---

## 🚀 Advanced Patterns

### Presence with Metadata
```typescript
channel.track({
  user: {
    id: user.id,
    name: user.name,
    avatar: user.avatar
  },
  cursor: { x: 0, y: 0 },
  selection: null,
  editing: null,
  status: 'active'
})
```

### Broadcast Events
```typescript
// Custom events beyond database changes
channel.send({
  type: 'broadcast',
  event: 'user-action',
  payload: {
    action: 'highlighted_text',
    user_id: user.id,
    data: { start: 10, end: 20 }
  }
})
```

### Channel Multiplexing
```typescript
// Single channel for multiple tables
const workspaceChannel = supabase
  .channel(`workspace:${workspaceId}`)
  .on('postgres_changes', { table: 'tasks', filter: `workspace_id=eq.${workspaceId}` }, handleTasks)
  .on('postgres_changes', { table: 'events', filter: `workspace_id=eq.${workspaceId}` }, handleEvents)
  .on('postgres_changes', { table: 'comments', filter: `workspace_id=eq.${workspaceId}` }, handleComments)
  .subscribe()
```

---

## ✅ Status

**Layer 5 Complete!** ✅

- Real-time configured and ready
- All 40+ tables publishing changes
- Client patterns documented
- Performance optimized
- Security integrated

**Next**: Layer 6 for business logic implementation

