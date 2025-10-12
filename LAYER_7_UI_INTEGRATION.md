# Layer 7: UI Integration Guide

## 🎨 Connecting Your Frontend to Supabase Backend

Your UI is already built! Now connect it to the live database.

---

## 🔧 Setup Supabase Client

### 1. Update Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nhceygmzwmhuyqsjxquk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Initialize Supabase Client

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## 📊 Example: Productions Module

### 1. Fetch Productions

```typescript
// src/app/[locale]/productions/page.tsx
import { supabase } from '@/lib/supabase'

export default async function ProductionsPage() {
  const { data: productions } = await supabase
    .from('productions')
    .select(`
      *,
      workspace:workspace_id(name),
      project_manager:project_manager_id(first_name, last_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      {productions?.map(production => (
        <ProductionCard key={production.id} production={production} />
      ))}
    </div>
  )
}
```

### 2. Create Production Form

```typescript
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { productionService } from '@/lib/services/production-service'

export function CreateProductionForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      workspace_id: formData.get('workspace_id'),
      name: formData.get('name'),
      type: formData.get('type'),
      description: formData.get('description'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      budget: parseFloat(formData.get('budget') as string),
      created_by: (await supabase.auth.getUser()).data.user?.id
    }

    try {
      const production = await productionService.createProduction(data)
      // Redirect to production detail
      window.location.href = `/productions/${production.id}`
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Production'}
      </button>
    </form>
  )
}
```

### 3. Real-time Updates

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function ProductionList({ workspaceId }: { workspaceId: string }) {
  const [productions, setProductions] = useState([])

  useEffect(() => {
    // Initial fetch
    fetchProductions()

    // Subscribe to changes
    const channel = supabase
      .channel('productions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productions',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProductions(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProductions(prev => 
              prev.map(p => p.id === payload.new.id ? payload.new : p)
            )
          } else if (payload.eventType === 'DELETE') {
            setProductions(prev => 
              prev.filter(p => p.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  async function fetchProductions() {
    const { data } = await supabase
      .from('productions')
      .select('*')
      .eq('workspace_id', workspaceId)
    setProductions(data || [])
  }

  return (
    <div>
      {productions.map(p => (
        <ProductionCard key={p.id} production={p} />
      ))}
    </div>
  )
}
```

---

## 📅 Example: Events Module

### 1. Calendar View with Events

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function EventCalendar({ workspaceId }: { workspaceId: string }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [workspaceId])

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
    
    setEvents(data || [])
  }

  return (
    <div className="calendar">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

### 2. Create Event with Conflict Check

```typescript
import { eventService } from '@/lib/services/event-service'

async function createEvent(data: any) {
  // Check for conflicts first
  const conflicts = await eventService.checkConflicts({
    start_time: data.start_time,
    end_time: data.end_time,
    location_id: data.location_id
  })

  if (conflicts.length > 0) {
    const proceed = confirm(
      `Warning: ${conflicts.length} scheduling conflicts found. Continue?`
    )
    if (!proceed) return
  }

  // Create event
  const event = await eventService.createEvent(data)
  return event
}
```

---

## 👥 Example: Personnel Module

### 1. Team Directory

```typescript
export async function TeamDirectory({ workspaceId }: { workspaceId: string }) {
  const { data: personnel } = await supabase
    .from('personnel')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('employment_status', 'active')
    .order('last_name', { ascending: true })

  return (
    <div className="grid grid-cols-3 gap-4">
      {personnel?.map(person => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  )
}
```

### 2. Time Tracking

```typescript
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function TimeTracker({ personnelId }: { personnelId: string }) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  async function startTimer() {
    const { data } = await supabase
      .from('time_entries')
      .insert({
        personnel_id: personnelId,
        workspace_id: workspaceId,
        start_time: new Date().toISOString(),
        type: 'regular'
      })
      .select()
      .single()

    setCurrentEntry(data)
    setIsTracking(true)
  }

  async function stopTimer() {
    const endTime = new Date()
    const duration = endTime.getTime() - new Date(currentEntry.start_time).getTime()

    await supabase
      .from('time_entries')
      .update({
        end_time: endTime.toISOString(),
        duration: `${Math.floor(duration / 1000)} seconds`
      })
      .eq('id', currentEntry.id)

    setIsTracking(false)
    setCurrentEntry(null)
  }

  return (
    <div>
      {isTracking ? (
        <button onClick={stopTimer}>Stop Timer</button>
      ) : (
        <button onClick={startTimer}>Start Timer</button>
      )}
    </div>
  )
}
```

---

## 💰 Example: Finance Module

### 1. Budget Dashboard

```typescript
export async function BudgetDashboard({ productionId }: { productionId: string }) {
  const { data: budget } = await supabase
    .from('budgets')
    .select('*, budget_line_items(*)')
    .eq('production_id', productionId)
    .single()

  const { data: variance } = await supabase
    .rpc('get_budget_variance', { p_budget_id: budget.id })

  const percentSpent = (budget.spent_amount / budget.total_amount) * 100

  return (
    <div>
      <h2>{budget.name}</h2>
      <div className="stats">
        <div>Budget: ${budget.total_amount.toLocaleString()}</div>
        <div>Spent: ${budget.spent_amount.toLocaleString()}</div>
        <div>Remaining: ${(budget.total_amount - budget.spent_amount).toLocaleString()}</div>
        <div>Progress: {percentSpent.toFixed(1)}%</div>
      </div>
      
      <h3>Variance by Category</h3>
      <table>
        {variance?.map(v => (
          <tr key={v.category}>
            <td>{v.category}</td>
            <td>${v.budgeted.toLocaleString()}</td>
            <td>${v.actual.toLocaleString()}</td>
            <td className={v.variance > 0 ? 'over-budget' : 'under-budget'}>
              ${v.variance.toLocaleString()} ({v.variance_percent.toFixed(1)}%)
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

---

## 🔔 Example: Notifications

### 1. Notification Bell

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()

    // Real-time subscription
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
          showToast(payload.new.title, payload.new.message)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function fetchNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    setNotifications(data || [])
    setUnreadCount(data?.filter(n => !n.read).length || 0)
  }

  async function markAsRead(notificationId: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    setUnreadCount(prev => prev - 1)
  }

  return (
    <div className="notification-bell">
      <button>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      <div className="dropdown">
        {notifications.map(n => (
          <div key={n.id} onClick={() => markAsRead(n.id)}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🔍 Example: Global Search

```typescript
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function GlobalSearch({ workspaceId }: { workspaceId: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    const { data } = await supabase
      .rpc('global_search', {
        p_workspace_id: workspaceId,
        p_query: query,
        p_limit: 50
      })

    setResults(data || [])
  }

  return (
    <form onSubmit={handleSearch}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search productions, events, people..."
      />
      
      <div className="results">
        {results.map(result => (
          <a key={result.id} href={result.url}>
            <div className="type-badge">{result.type}</div>
            <div className="title">{result.title}</div>
            <div className="subtitle">{result.subtitle}</div>
          </a>
        ))}
      </div>
    </form>
  )
}
```

---

## ✅ UI Integration Checklist

- [ ] Environment variables configured
- [ ] Supabase client initialized
- [ ] Auth flow connected
- [ ] CRUD operations working
- [ ] Real-time subscriptions active
- [ ] File uploads connected to Storage
- [ ] Notifications working
- [ ] Search functionality implemented
- [ ] Error handling in place
- [ ] Loading states added
- [ ] Optimistic UI updates implemented

---

**Layer 7 Complete!** Your UI is now connected to the live database. Move to Layer 8 for external integrations.
