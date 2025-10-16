# Notifications Counter Badge - Full Stack Implementation

## Overview

Implemented a full-stack notifications system with a real-time counter badge in the top navigation bar. The badge displays the number of unread notifications and updates automatically when notifications are created, read, or modified.

## Implementation Details

### 1. Custom Hook: `use-notifications.ts`

**Location:** `/src/hooks/use-notifications.ts`

**Features:**
- Fetches notifications from the `notifications` table
- Maintains real-time unread count
- Subscribes to Supabase real-time updates
- Provides methods to mark notifications as read
- Automatically updates count on notification changes

**Exports:**
```typescript
export function useNotifications() {
  return {
    notifications: NotificationData[],  // All notifications
    unreadCount: number,                 // Count of unread notifications
    isLoading: boolean,                  // Loading state
    markAsRead: (id: string) => Promise<void>,
    markAllAsRead: () => Promise<void>
  }
}
```

### 2. Top Bar Integration

**Location:** `/src/components/layout/top-bar.tsx`

**Changes:**
- Replaced hardcoded `unreadCount = 3` with real data from `useNotifications()` hook
- Added import: `import { useNotifications } from "@/hooks"`
- Now displays actual unread notification count with real-time updates

**Badge Behavior:**
- Shows red badge with count when unread notifications exist
- Displays "9+" when count exceeds 9
- Updates immediately when notifications change
- Includes small dot indicator alongside the badge

### 3. Notification Service

**Location:** `/src/lib/services/notification-service.ts`

**Purpose:** Centralized service for creating and managing notifications

**Methods:**
- `createNotification()` - Create a single notification
- `createBulkNotifications()` - Create multiple notifications at once
- `markAsRead()` - Mark a notification as read
- `markAllAsRead()` - Mark all user notifications as read
- `deleteNotification()` - Delete a notification
- `getUnreadCount()` - Get unread count for a user
- `createTestNotifications()` - Create test notifications for development

**Usage Example:**
```typescript
import { notificationService } from '@/lib/services/notification-service'

// Create a notification
await notificationService.createNotification({
  userId: 'user-uuid',
  type: 'mention',
  title: 'You were mentioned',
  message: 'Sarah mentioned you in a task',
  link: '/workspace/tasks/123'
})

// Create test notifications
await notificationService.createTestNotifications(userId)
```

### 4. Test Page

**Location:** `/src/app/[locale]/test-notifications/page.tsx`

**URL:** `/test-notifications`

**Features:**
- View real-time notification statistics (total, unread, read)
- Create test notifications with one click
- Mark individual or all notifications as read
- Live notification list with auto-updates
- Visual indicators for read/unread status
- Comprehensive testing instructions

**Purpose:** Development and QA testing tool

### 5. Test SQL Script

**Location:** `/scripts/test-notifications.sql`

**Purpose:** Create test notifications directly in the database

**Usage:**
```sql
-- Run this in your Supabase SQL editor
-- It will create 5 test notifications (3 unread, 2 read)
```

## Database Schema

The `notifications` table already exists in the foundation migration:

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_notifications_user` on `user_id`
- `idx_notifications_read` on `read`

**RLS Policies:**
- Users can view their own notifications
- Users can update their own notifications

**Real-time:** Enabled via Supabase publication

## Notification Types

The system supports the following notification types:

| Type | Description | Icon | Color |
|------|-------------|------|-------|
| `mention` | User was mentioned | AtSign | Blue |
| `comment` | New comment | MessageSquare | Green |
| `assignment` | Task/project assignment | UserPlus | Purple |
| `update` | Status/data update | Clock | Orange |
| `system` | System notification | CheckCircle2 | Default |

## How It Works

### Flow Diagram

```
User Action → Database Insert → Real-time Channel → Hook Update → UI Refresh
                                                   ↓
                                            unreadCount update
                                                   ↓
                                            Badge re-renders
```

### Real-time Updates

1. **New Notification Created:**
   - Inserted into `notifications` table
   - Supabase real-time triggers INSERT event
   - Hook receives event and adds notification to state
   - `unreadCount` increments if notification is unread
   - Top bar badge updates automatically

2. **Notification Marked as Read:**
   - Updated in `notifications` table (read = true)
   - Supabase real-time triggers UPDATE event
   - Hook receives event and updates notification in state
   - `unreadCount` decrements
   - Top bar badge updates automatically

3. **Cross-tab Synchronization:**
   - Real-time subscriptions work across all browser tabs
   - All open instances update simultaneously
   - No manual refresh required

## Testing Instructions

### Method 1: Using Test Page (Recommended)

1. Navigate to `/test-notifications`
2. Click "Create Test Notifications"
3. Observe the top bar badge update with count "3"
4. Click notifications to mark them as read
5. Watch the count decrease in real-time

### Method 2: Using SQL Script

1. Open Supabase SQL Editor
2. Run the script from `/scripts/test-notifications.sql`
3. Observe the top bar badge update immediately

### Method 3: Using Notification Service

```typescript
import { notificationService } from '@/lib/services/notification-service'

// In your component or page
const handleTest = async () => {
  const userId = 'your-user-id' // Get from auth
  await notificationService.createTestNotifications(userId)
}
```

## Integration with Existing System

The notifications counter integrates seamlessly with the existing notifications panel:

- **Top Bar Badge:** Shows unread count
- **Right Sidebar:** Opens when clicking the bell icon
- **Notifications Panel:** Shows full notification list with tabs (All, Unread, Mentions)
- **Both use the same hook:** Ensures data consistency

## Performance Considerations

- **Efficient Queries:** Indexed on user_id and read status
- **Real-time Subscriptions:** Single channel per user
- **Count Optimization:** Maintained in state, not recalculated each render
- **Limit:** Fetches max 50 notifications (adjustable)

## Future Enhancements

Potential improvements for the future:

1. **Push Notifications:** Browser push notifications for desktop
2. **Notification Preferences:** Allow users to customize notification types
3. **Notification Groups:** Group related notifications
4. **Mark as unread:** Add ability to mark notifications as unread
5. **Notification Archive:** Archive old notifications
6. **Email Digest:** Send daily/weekly email summaries
7. **Sound/Visual Effects:** Add notification sounds and animations
8. **Priority Levels:** Urgent/high/normal/low notification priorities
9. **Custom Actions:** Allow notifications to have custom action buttons
10. **Read Receipts:** Track when notifications were read

## Files Modified/Created

### Created Files:
- `/src/hooks/use-notifications.ts` - Custom React hook
- `/src/lib/services/notification-service.ts` - Service layer
- `/src/app/[locale]/test-notifications/page.tsx` - Test page
- `/scripts/test-notifications.sql` - SQL test script
- `/docs/features/NOTIFICATIONS_COUNTER_IMPLEMENTATION.md` - This documentation

### Modified Files:
- `/src/components/layout/top-bar.tsx` - Integrated real notification count
- `/src/hooks/index.ts` - Exported useNotifications hook

## Developer Notes

- The existing `NotificationsTabContent` component already had database integration
- The notifications table was already set up in the foundation migration
- No database migrations needed
- The implementation is production-ready
- RLS policies ensure users can only see their own notifications
- Real-time subscriptions are cleaned up on component unmount

## Troubleshooting

**Badge not updating:**
- Check if Supabase real-time is enabled
- Verify RLS policies allow reading notifications
- Ensure user is authenticated
- Check browser console for errors

**No notifications showing:**
- Run the test SQL script to create notifications
- Verify notifications table has data
- Check user_id matches authenticated user

**Count mismatch:**
- Clear browser cache and reload
- Check database for correct read status
- Verify no duplicate subscriptions are active

## Support

For issues or questions, refer to:
- Supabase Real-time Documentation
- React Query Documentation (if migrating to it later)
- Project architecture docs in `/docs/architecture/`
