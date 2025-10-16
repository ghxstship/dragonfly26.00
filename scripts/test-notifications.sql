-- Test Script for Notifications System
-- This script inserts test notifications for the authenticated user

-- Replace YOUR_USER_ID with your actual user ID from auth.users
-- You can find your user ID by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Insert test notifications
INSERT INTO notifications (user_id, type, title, message, link, read, created_at)
VALUES
  -- Unread notifications
  (
    (SELECT id FROM auth.users LIMIT 1), -- Gets the first user (for testing)
    'mention',
    'You were mentioned in a task',
    'Sarah mentioned you in "Review Q4 Budget Proposal"',
    '/workspace/tasks/123',
    false,
    NOW()
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'comment',
    'New comment on your task',
    'John commented: "I have reviewed the document and it looks good"',
    '/workspace/tasks/456',
    false,
    NOW() - INTERVAL '1 hour'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'assignment',
    'You were assigned to a project',
    'You have been assigned to "Marketing Campaign 2024"',
    '/workspace/projects/789',
    false,
    NOW() - INTERVAL '2 hours'
  ),
  
  -- Read notifications (for reference)
  (
    (SELECT id FROM auth.users LIMIT 1),
    'update',
    'Task updated',
    'The deadline for "Website Redesign" has been changed',
    '/workspace/tasks/321',
    true,
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    'system',
    'Welcome to Dragonfly',
    'Your account has been successfully created',
    null,
    true,
    NOW() - INTERVAL '7 days'
  );

-- Verify the notifications were created
SELECT 
  id,
  type,
  title,
  read,
  created_at
FROM notifications
WHERE user_id = (SELECT id FROM auth.users LIMIT 1)
ORDER BY created_at DESC;

-- Show unread count
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = (SELECT id FROM auth.users LIMIT 1)
  AND read = false;
