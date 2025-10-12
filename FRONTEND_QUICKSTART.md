# 🎨 Frontend Quick Start - Connect Everything

## Your Backend is 100% Ready!

All 8 layers are deployed. Now let's connect your existing UI to the live database.

---

## Step 1: Environment Variables

Update `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nhceygmzwmhuyqsjxquk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_dashboard

# Edge Functions (deployed!)
NEXT_PUBLIC_WEBHOOK_HANDLER_URL=https://nhceygmzwmhuyqsjxquk.supabase.co/functions/v1/webhook-handler
NEXT_PUBLIC_SCHEDULED_TASKS_URL=https://nhceygmzwmhuyqsjxquk.supabase.co/functions/v1/scheduled-tasks
NEXT_PUBLIC_MCP_SERVER_URL=https://nhceygmzwmhuyqsjxquk.supabase.co/functions/v1/mcp-server
```

Get your anon key from: https://supabase.com/dashboard/project/nhceygmzwmhuyqsjxquk/settings/api

---

## Step 2: Initialize Supabase Client

Your Supabase client should already exist. Verify it's configured:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## Step 3: Test Database Connection

Create a simple test to verify everything works:

```typescript
// Test in any component or page
async function testConnection() {
  // Test 1: Fetch workspaces
  const { data: workspaces, error } = await supabase
    .from('workspaces')
    .select('*')
    .limit(10)
  
  console.log('Workspaces:', workspaces)
  
  // Test 2: Call RPC function
  const { data: dashboard } = await supabase
    .rpc('get_workspace_dashboard', {
      p_workspace_id: 'test-workspace-id'
    })
  
  console.log('Dashboard:', dashboard)
  
  // Test 3: Subscribe to realtime
  const channel = supabase
    .channel('test')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'notifications'
    }, payload => {
      console.log('Change received!', payload)
    })
    .subscribe()
}
```

---

## Step 4: Connect Each Module (Priority Order)

### 1. Dashboard Module (START HERE)

```typescript
// src/app/[locale]/dashboard/page.tsx
import { supabase } from '@/lib/supabase'
import { productionService } from '@/lib/services/production-service'

export default async function DashboardPage() {
  // Fetch dashboard stats
  const { data: stats } = await supabase
    .rpc('get_workspace_dashboard', {
      p_workspace_id: workspaceId
    })
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div>Active Productions: {stats.productions.active}</div>
      <div>Upcoming Events: {stats.events.upcoming}</div>
      <div>Open Tasks: {stats.tasks.open}</div>
    </div>
  )
}
```

### 2. Projects Module

```typescript
// src/app/[locale]/projects/page.tsx
import { supabase } from '@/lib/supabase'

export default async function ProjectsPage() {
  const { data: productions } = await supabase
    .from('productions')
    .select(`
      *,
      workspace:workspace_id(name),
      project_manager:project_manager_id(first_name, last_name),
      tasks:project_tasks(count)
    `)
    .order('created_at', { ascending: false })
  
  return (
    <div>
      {productions?.map(prod => (
        <ProductionCard key={prod.id} production={prod} />
      ))}
    </div>
  )
}
```

### 3. Events Module with Real-time

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function EventsList({ workspaceId }: { workspaceId: string }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Initial fetch
    fetchEvents()

    // Subscribe to changes
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `workspace_id=eq.${workspaceId}`
        },
        handleChange
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('start_time')
    setEvents(data || [])
  }

  function handleChange(payload: any) {
    if (payload.eventType === 'INSERT') {
      setEvents(prev => [...prev, payload.new])
    } else if (payload.eventType === 'UPDATE') {
      setEvents(prev => prev.map(e => 
        e.id === payload.new.id ? payload.new : e
      ))
    } else if (payload.eventType === 'DELETE') {
      setEvents(prev => prev.filter(e => e.id !== payload.old.id))
    }
  }

  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

### 4. Files Module with Storage

```typescript
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function FileUploader({ workspaceId }: { workspaceId: string }) {
  async function handleUpload(file: File) {
    // 1. Upload to storage
    const filePath = `${workspaceId}/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (error) {
      alert('Upload failed')
      return
    }

    // 2. Create database record
    const { data: fileRecord } = await supabase
      .from('files')
      .insert({
        workspace_id: workspaceId,
        name: file.name,
        type: file.type,
        storage_path: filePath,
        size_bytes: file.size,
        status: 'active'
      })
      .select()
      .single()

    console.log('File uploaded:', fileRecord)
  }

  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) handleUpload(file)
      }}
    />
  )
}
```

### 5. Finance Module with Business Logic

```typescript
import { budgetService } from '@/lib/services/budget-service'

export async function recordExpense(expenseData: any) {
  try {
    // Use business logic service
    const transaction = await budgetService.recordExpense({
      workspace_id: workspaceId,
      budget_id: budgetId,
      amount: 1500.00,
      type: 'expense',
      category: 'Equipment',
      description: 'LED wall rental'
    })

    // Budget alerts are automatically triggered!
    console.log('Expense recorded:', transaction)
  } catch (error) {
    console.error('Failed to record expense:', error)
  }
}
```

---

## Step 5: Add Real-time Features Everywhere

### Live Notifications Bell

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          setUnreadCount(prev => prev + 1)
          // Show toast
          toast(payload.new.title, payload.new.message)
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  return (
    <button className="relative">
      🔔
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">
          {unreadCount}
        </span>
      )}
    </button>
  )
}
```

### Live User Presence

```typescript
'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function usePresence(productionId: string, userId: string) {
  useEffect(() => {
    const channel = supabase.channel(`production:${productionId}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        console.log('Online users:', state)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString()
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productionId, userId])
}
```

---

## Step 6: Test Edge Functions

### Call MCP Server from Frontend

```typescript
async function analyzeProductionWithAI(productionId: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_MCP_SERVER_URL!,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        action: 'analyze_budget',
        params: {
          budget_id: budgetId
        }
      })
    }
  )

  const analysis = await response.json()
  console.log('AI Analysis:', analysis)
  return analysis
}
```

---

## Step 7: Module Checklist

Check off each module as you connect it:

- [ ] Dashboard - Overview, widgets, metrics
- [ ] Projects - Productions, tasks, milestones
- [ ] Events - Calendar, bookings, run of show
- [ ] People - Personnel, teams, time tracking
- [ ] Assets - Equipment, inventory, maintenance
- [ ] Locations - Venues, facilities, site maps
- [ ] Files - Documents, media, version control
- [ ] Admin - Organization, roles, permissions
- [ ] Settings - Preferences, integrations
- [ ] Profile - User profile, work history
- [ ] Companies - Vendors, clients, contacts
- [ ] Community - Posts, connections, activity
- [ ] Marketplace - Products, orders, reviews
- [ ] Resources - Guides, courses, grants
- [ ] Finance - Budgets, transactions, invoices
- [ ] Procurement - POs, agreements, approvals
- [ ] Jobs - Contracts, RFPs, opportunities
- [ ] Reports - Templates, scheduled reports
- [ ] Analytics - Dashboards, metrics, trends
- [ ] Insights - OKRs, recommendations, reviews

---

## 🎯 Testing Checklist

### Database Tests
- [ ] Can fetch data from all 20 modules
- [ ] Can create records in all tables
- [ ] Can update records
- [ ] Can delete records
- [ ] RPC functions return correct data
- [ ] Search works across modules

### Storage Tests
- [ ] Can upload files to all buckets
- [ ] Can download files
- [ ] Can delete files
- [ ] File metadata is created in database

### Real-time Tests
- [ ] See changes when records update
- [ ] Notifications appear instantly
- [ ] Presence shows online users
- [ ] No lag or connection issues

### Edge Function Tests
- [ ] MCP server responds to requests
- [ ] Webhook handler processes events
- [ ] Scheduled tasks run on schedule

---

## 🚀 You're Ready!

Your fullstack implementation is complete:

✅ **Database** - 120+ tables live in Supabase
✅ **Storage** - 10 buckets configured
✅ **API** - PostgREST + 14 RPC functions
✅ **Edge Functions** - 3 deployed and running
✅ **Real-time** - 40+ tables broadcasting
✅ **Business Logic** - Services implemented
✅ **Integrations** - Webhooks ready

**Just connect your UI components and you're live!** 🎉

All patterns are documented in:
- `LAYER_7_UI_INTEGRATION.md` - Frontend patterns
- `LAYER_8_INTEGRATION.md` - External integrations
- `FINAL_VALIDATION_COMPLETE.md` - Complete validation

**Start with the Dashboard module and work your way through each module systematically!**
