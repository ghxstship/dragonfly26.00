# Notifications System - Quick Start Guide

## ✅ Implementation Complete

The notifications counter badge is now fully implemented with real-time updates!

## 🚀 Quick Test

### Option 1: Test Page (Easiest)
1. Navigate to: `/test-notifications`
2. Click **"Create Test Notifications"**
3. Check the top bar - you'll see a red badge with "3"
4. Click on notifications to mark them read
5. Watch the count decrease in real-time!

### Option 2: SQL Script
1. Open Supabase SQL Editor
2. Copy and run: `/scripts/test-notifications.sql`
3. The badge will update immediately

### Option 3: Programmatically
```typescript
import { notificationService } from '@/lib/services/notification-service'

// Get current user ID
const { data: { user } } = await supabase.auth.getUser()

// Create test notifications
await notificationService.createTestNotifications(user.id)
```

## 📦 What Was Changed

### New Files Created:
- `src/hooks/use-notifications.ts` - React hook for notifications
- `src/lib/services/notification-service.ts` - Service layer
- `src/app/[locale]/test-notifications/page.tsx` - Test page
- `scripts/test-notifications.sql` - SQL test data

### Files Modified:
- `src/components/layout/top-bar.tsx` - Uses real count now
- `src/hooks/index.ts` - Exports new hook

## 🔧 How to Use in Your Code

### Get Notifications Data
```typescript
import { useNotifications } from '@/hooks'

function MyComponent() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()
  
  return <div>You have {unreadCount} unread notifications</div>
}
```

### Create a Notification
```typescript
import { notificationService } from '@/lib/services/notification-service'

await notificationService.createNotification({
  userId: 'user-uuid',
  type: 'mention',
  title: 'You were mentioned',
  message: 'Sarah mentioned you in "Project Alpha"',
  link: '/workspace/tasks/123'
})
```

### Notification Types
- `mention` - User was mentioned
- `comment` - New comment
- `assignment` - Task/project assignment
- `update` - Status update
- `system` - System message

## ✨ Key Features

✅ Real-time updates (no page refresh needed)  
✅ Cross-tab synchronization  
✅ Secure (RLS policies enforced)  
✅ Efficient (indexed queries)  
✅ Badge shows count with "9+" for 10 or more  
✅ Integrates with existing notification panel  

## 📊 Database

Table: `notifications`
- Already exists in foundation migration
- RLS policies: Users can only see their own
- Real-time: Enabled
- Indexes: user_id, read status

## 🎯 Next Steps

The system is production-ready! You can:

1. **Integrate with your features:**
   - When someone mentions a user → create notification
   - When task assigned → create notification
   - When comment added → create notification

2. **Customize:**
   - Add new notification types
   - Modify badge styling
   - Add notification sounds

3. **Enhance:**
   - Add email notifications
   - Add push notifications
   - Add notification preferences

## 📚 Full Documentation

See `/docs/features/NOTIFICATIONS_COUNTER_IMPLEMENTATION.md` for complete details.

## 🐛 Troubleshooting

**Badge shows 0 but I have notifications?**
- Check if notifications are marked as `read: false` in database
- Verify user_id matches authenticated user

**Not updating in real-time?**
- Ensure Supabase real-time is enabled
- Check browser console for subscription errors
- Verify RLS policies are correct

**Need help?**
- Check the full documentation
- Review test page implementation for examples
- Use notification service methods for consistency
