# Layer 5: Realtime Configuration

## ✅ Already Configured in Migrations!

Your database migrations already include Realtime publication for all key tables. This layer is **mostly complete** from the migrations.

---

## 📡 Realtime Channels Configured

### Core Tables
- ✅ `organizations`
- ✅ `workspaces`
- ✅ `user_roles`
- ✅ `activities`
- ✅ `comments`
- ✅ `user_presence`
- ✅ `notifications`

### Module Tables
- ✅ `productions`
- ✅ `project_tasks`
- ✅ `project_milestones`
- ✅ `events`
- ✅ `run_of_show`
- ✅ `bookings`
- ✅ `incidents`
- ✅ `personnel`
- ✅ `teams`
- ✅ `time_entries`
- ✅ `assets`
- ✅ `asset_transactions`
- ✅ `locations`
- ✅ `files`
- ✅ `companies`
- ✅ `budgets`
- ✅ `financial_transactions`
- ✅ `invoices`
- ✅ `purchase_orders`
- ✅ `approval_requests`
- ✅ `community_posts`
- ✅ `connections`
- ✅ `marketplace_orders`

---

## 🎯 Client-Side Implementation

### 1. Subscribe to Production Updates

```typescript
// Real-time production updates
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const productionChannel = supabase
  .channel('production-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'productions',
      filter: `workspace_id=eq.${workspaceId}`
    },
    (payload) => {
      console.log('Production changed:', payload)
      // Update UI
    }
  )
  .subscribe()
```

### 2. Real-time Task Board

```typescript
// Subscribe to task changes for a Kanban board
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
      // Update Kanban board in real-time
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
// Track who's viewing/editing what
const presenceChannel = supabase
  .channel('user-presence')
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState()
    console.log('Online users:', state)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', leftPresences)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        user_id: currentUser.id,
        online_at: new Date().toISOString(),
        location: window.location.pathname
      })
    }
  })
```

### 4. Live Notifications

```typescript
// Real-time notifications
const notificationChannel = supabase
  .channel('notifications')
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
      showNotification(payload.new)
    }
  )
  .subscribe()
```

### 5. Collaborative Editing (Live Cursors)

```typescript
// Track cursor positions for collaborative editing
const collaborationChannel = supabase
  .channel(`document:${documentId}`)
  .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
    updateCursor(payload.userId, payload.position)
  })
  .subscribe()

// Send cursor position
function onCursorMove(position: { x: number; y: number }) {
  collaborationChannel.send({
    type: 'broadcast',
    event: 'cursor-move',
    payload: { userId: currentUser.id, position }
  })
}
```

### 6. Live Budget Updates

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
// Handle connection state
supabase.channel('system').subscribe((status) => {
  switch (status) {
    case 'SUBSCRIBED':
      console.log('✅ Connected to Realtime')
      setConnectionStatus('connected')
      break
    case 'CHANNEL_ERROR':
      console.log('❌ Channel error')
      setConnectionStatus('error')
      break
    case 'TIMED_OUT':
      console.log('⏱️ Connection timeout')
      setConnectionStatus('timeout')
      break
    case 'CLOSED':
      console.log('🔌 Disconnected')
      setConnectionStatus('disconnected')
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
  updateTaskInState(taskId, updates)
  
  // 2. Send to database
  const { error } = await supabase
    .from('project_tasks')
    .update(updates)
    .eq('id', taskId)
  
  // 3. Rollback if error
  if (error) {
    revertTaskInState(taskId)
    showError('Failed to update task')
  }
  // 4. Realtime subscription will sync actual value
}
```

---

## 🎨 Conflict Resolution Strategy

```typescript
// Last-write-wins with timestamp
async function handleConflict(local: any, remote: any) {
  if (new Date(remote.updated_at) > new Date(local.updated_at)) {
    // Remote is newer, accept remote changes
    return remote
  } else {
    // Local is newer, keep local changes
    return local
  }
}
```

---

## ⚡ Performance Tips

1. **Filter subscriptions** - Only subscribe to data you need
2. **Unsubscribe when unmounting** - Prevent memory leaks
3. **Batch updates** - Use debouncing for frequent changes
4. **Use presence for ephemeral data** - Don't store in database
5. **Limit channel count** - Reuse channels when possible

---

## 🧪 Testing Realtime

```typescript
// Test real-time subscription
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

---

**Layer 5 Complete!** ✅ 

Realtime is configured and ready. Move to Layer 6 for business logic implementation.
